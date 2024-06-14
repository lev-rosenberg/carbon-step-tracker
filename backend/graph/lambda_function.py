import json
import requests
import os
import datatier
from decimal import Decimal
from datetime import datetime, timedelta

from configparser import ConfigParser

def lambda_handler(event, context):
    try:
        print("**STARTING**")
        print("**lambda: graph**")
        
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
        # get start and end dates from event
        #
        inputs = event['queryStringParameters']
        if "startdate" in inputs and "enddate" in inputs:
            graphstartdate = inputs["startdate"]
            graphenddate = inputs["enddate"]
        else:
            raise Exception("requires start and end date parameters in event")
        
        #
        # open connection to the database:
        #
        print("**Opening connection**")
        print("you got to -1")
        dbConn = datatier.get_dbConn(rds_endpoint, rds_portnum, rds_username, rds_pwd, rds_dbname)
        print("you got to 0")
        #
        # get user from token 
        #
        sql = "SELECT userid FROM tokens WHERE token = %s";
  
        row = datatier.retrieve_one_row(dbConn, sql, [token])
        
        userid = row[0]

        #
        # Get footprint data from utilities DB
        #
        sql = """
            SELECT footprint, startdate, enddate FROM utilityFootprints
                WHERE userid = %s
                AND startdate <= %s
                AND enddate >= %s
        """

        utilities = datatier.retrieve_all_rows(dbConn, sql, [userid, graphenddate, graphstartdate])
        
        #
        # Get footprint data from travel DB
        #
        sql = """
            SELECT footprint, traveldate FROM travelFootprints
                WHERE userid = %s
                AND traveldate >= %s
                AND traveldate <= %s
        """
        
        travel = datatier.retrieve_all_rows(dbConn, sql, [userid, graphstartdate, graphenddate])
        
        utilities = [
        {
            'footprint': float(row[0]) if isinstance(row[0], Decimal) else row[0],
            'startdate': str(row[1]),
            'enddate': str(row[2])
        }
        for row in utilities
        ]
    
        travel = [
            {
                'footprint': float(row[0]) if isinstance(row[0], Decimal) else row[0],
                'traveldate': str(row[1])
            }
            for row in travel
        ]
        print("you got to 1")
        #
        # Utility data transformation over the timescale
        #
        combined_data = {}
        utility_sum = 0
        for row in utilities:
            start_date = datetime.strptime(row['startdate'], '%Y-%m-%d').date()
            end_date = datetime.strptime(row['enddate'], '%Y-%m-%d').date()
            days_in_timescale = (end_date - start_date).days + 1
            daily_footprint = row['footprint'] / days_in_timescale
            utility_sum += row['footprint']
            for day in range((end_date - start_date).days + 1):
                date = (start_date + timedelta(days=day)).isoformat()
                combined_data[date] = combined_data.get(date, 0) + daily_footprint
        
        print("you got to 2")
        # Combine utility and travel data
        travel_sum = 0
        for row in travel:
            travel_date = datetime.strptime(row['traveldate'], '%Y-%m-%d').date().isoformat()
            travel_footprint = row['footprint']
            travel_sum += row['footprint']
            if travel_date in combined_data:
                combined_data[travel_date] += travel_footprint
            else: 
                combined_data[travel_date] = travel_footprint
        
        print("you got to 3")
        # Fill in missing dates between graphstartdate and graphenddate
        start_date = datetime.strptime(graphstartdate, '%Y-%m-%d').date()
        end_date = datetime.strptime(graphenddate, '%Y-%m-%d').date()
        for day in range((end_date - start_date).days + 1):
            date = (start_date + timedelta(days=day)).isoformat()
            if date not in combined_data:
                combined_data[date] = 0
        
        print("you got to 4")
        # Convert combined_data to a list of dictionaries
        combined_data_list = [{'date': date, 'footprint': footprint} for date, footprint in sorted(combined_data.items())]

        return {
            'statusCode': 200,
            'body': json.dumps({'combined_data': combined_data, 'travel_sum': travel_sum, 'utility_sum': utility_sum})
        }

    except Exception as err:
        print("**ERROR**")
        print(str(err))
        
        return {
          'statusCode': 400,
          'body': json.dumps(str(err))
        }
