import json
import requests
import os
import datatier

from configparser import ConfigParser

def lambda_handler(event, context):
    try:
        print("**STARTING**")
        print("**lambda: home**")
        
        #
        # setup AWS based on config file:
        #
        config_file = 'carbontracker-config.ini'
        os.environ['AWS_SHARED_CREDENTIALS_FILE'] = config_file
        
        configur = ConfigParser()
        configur.read(config_file)
        
        #
        # get the authentication token from the request headers:
        #
        print("**Accessing request headers to get authenticated user info**")
        if "headers" not in event:
          msg = "no headers in request"
          print("**ERROR:", msg)
          return {
            'statusCode': 400,
            'body': json.dumps(msg)
          }
        headers = event["headers"]
        if "Authentication" not in headers:
          msg = "no security credentials"
          print("**ERROR:", msg)
          return {
            'statusCode': 401,
            'body': json.dumps(msg)
          }
        token = headers['Authentication']
        
        #
        # is the token valid? Ask authentication service...
        #
        auth_url = configur.get('auth', 'webservice')
        data = {"token": token}
        api = '/auth'
        url = auth_url + api
        response = requests.post(url, json=data)
        
        if response.status_code != 200:
          return {
            'statusCode': 401,
            'body': 'authentication failure'
          }
        #
        # configure for RDS access
        #
        rds_endpoint = configur.get('rds', 'endpoint')
        rds_portnum = int(configur.get('rds', 'port_number'))
        rds_username = configur.get('rds', 'user_name')
        rds_pwd = configur.get('rds', 'user_pwd')
        rds_dbname = configur.get('rds', 'db_name')
    
        #
        # get state and kWh from event
        #
        inputs = json.loads(event['body'])
        if "state" in inputs:
            state = inputs["state"]
        else:
            raise Exception("requires state parameter in event")
        if "kWh" in inputs:
            kWh = inputs["kWh"]
        else:
            raise Exception("requires kWh parameter in event")
        if "startdate" in inputs and "enddate" in inputs:
            startdate = inputs["startdate"]
            enddate = inputs["enddate"]
        else:
            raise Exception("requires start and end date parameters in event")
        
        
        #
        # use climateq estimate api for travel co2e estimates 
        #
        url = 'https://api.climatiq.io/data/v1/estimate'
        
        data = {
            "emission_factor": {
        		"activity_id": "electricity-supply_grid-source_supplier_mix",
        		"source": "EPA",
        		"region": "US-" + state,
        		"year": 2022,
        		"source_lca_activity": "electricity_generation",
        		"data_version": "^0"
            },
            "parameters": {
              "energy": kWh,
              "energy_unit": "kWh"
            }
        }
        
        req_headers = {"Authorization": "Bearer 0BC8SVEW7KMR80PRD8GXFYV6ASFB"} # this is Lev's climateq authorization token, it's free
        
        #
        res = requests.post(url, json=data, headers = req_headers)
        
        if res.status_code != 200:
            return {
                'statusCode': 400,
                'body': json.dumps('failed to make estimation using climateq API')
            }
        
        body = res.json()
        footprint = body['co2e']
        
        #
        # open connection to the database:
        #
        print("**Opening connection**")
        
        dbConn = datatier.get_dbConn(rds_endpoint, rds_portnum, rds_username, rds_pwd, rds_dbname)
        
        #
        # get user from token 
        #
        sql = "SELECT userid FROM tokens WHERE token = %s";
  
        row = datatier.retrieve_one_row(dbConn, sql, [token])
        
        userid = row[0]

        #
        # add footprint datapoint to utilities DB!
        #
        sql = """
            INSERT INTO utilityFootprints(userid, footprint, startdate, enddate)
                VALUES (%s, %s, %s, %s);
        """

        datatier.perform_action(dbConn, sql, [userid, footprint, startdate, enddate])
        
        return {
            'statusCode': 200,
            'body': json.dumps(footprint)
        }

    except Exception as err:
        print("**ERROR**")
        print(str(err))
        
        return {
          'statusCode': 400,
          'body': json.dumps(str(err))
        }
