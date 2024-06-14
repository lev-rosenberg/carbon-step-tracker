import json
import requests
import os
import datatier

from configparser import ConfigParser

def lambda_handler(event, context):
    try:
        print("**STARTING**")
        print("**lambda: travel**")
        
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
        # get distance and vehicle_type from event
        #
        inputs = json.loads(event['body'])
        if "distance" in inputs:
            distance = inputs["distance"]
        else:
            raise Exception("requires distance parameter in event")
        if "vehicle_type" in inputs:
            vehicle_type = inputs["vehicle_type"]
        else:
            raise Exception("requires vehicle_type parameter in event")
        if "traveldate" in inputs:
            traveldate = inputs["traveldate"]
        else:
            raise Exception("requires date parameter in event")
        #
        # use climateq estimate api for travel co2e estimates 
        #
        url = 'https://api.climatiq.io/data/v1/estimate'
        
        data = {
            "emission_factor": {
                "source": "EPA",
                "region": "US",
                "year": 2024,
                "source_lca_activity": "use_phase",
                "data_version": "^0"
            },
            "parameters": {
                "distance": distance,
                "distance_unit": "mi"
            }
        }
        
        #
        # choose activity_id (part of the climateq API params) based on vehicle type input
        #
        if vehicle_type == "car":
            data["emission_factor"]["activity_id"] = "passenger_vehicle-vehicle_type_car-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na"
        elif vehicle_type == "bus":
            data["emission_factor"]["activity_id"] = "passenger_vehicle-vehicle_type_bus-fuel_source_na-distance_na-engine_size_na"
        elif vehicle_type == "train":
            data["emission_factor"]["activity_id"] = "passenger_train-route_type_commuter_rail-fuel_source_na"
        else:
            raise Exception("vehicle_type currently only supports car, bus, train")
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
        # TODO: add row to home DB!
        #
        sql = """
            INSERT INTO travelFootprints(userid, footprint, traveldate)
                VALUES (%s, %s, %s);
        """

        datatier.perform_action(dbConn, sql, [userid, footprint, traveldate])
        
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