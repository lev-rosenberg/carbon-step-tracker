#
# POST /signup
#
# Lambda function to handle signup. The caller can 
# post a username/password, and the function checks if it already exists in the database, 
# and if not, hashes it, and stores it in the database. Valid message formats:
#
# { "body": { "username": "...", "password": "..." } }
#
# If a username/pwd is passed, the function returns 200
# if the user doesn't already exist. Otherwise
# 401 is returned.
#

import json
import os
import datetime
import uuid
import datatier
import auth
import api_utils

from configparser import ConfigParser

def lambda_handler(event, context):
  try:
    print("**STARTING**")
    print("**lambda: proj04_auth**")

    #
    # setup AWS based on config file
    #
    config_file = 'benfordapp-config.ini'
    os.environ['AWS_SHARED_CREDENTIALS_FILE'] = config_file
    
    configur = ConfigParser()
    configur.read(config_file)
    
    #
    # configure for RDS access
    #
    rds_endpoint = configur.get('rds', 'endpoint')
    rds_portnum = int(configur.get('rds', 'port_number'))
    rds_username = configur.get('rds', 'user_name')
    rds_pwd = configur.get('rds', 'user_pwd')
    rds_dbname = configur.get('rds', 'db_name')
    
    #
    # open connection to the database
    #
    print("**Opening connection**")
    
    dbConn = datatier.get_dbConn(rds_endpoint, rds_portnum, rds_username, rds_pwd, rds_dbname)

    #
    # We are expecting either a token, or username/password:
    #
    print("**Accessing request body**")
    
    username = ""
    password = ""

    if "body" not in event:
      return api_utils.error(400, "no body in request")
      
    body = json.loads(event["body"])
    
    if "username" in body and "password" in body:
      username = body["username"]
      password = body["password"]
    else:
      return api_utils.error(400, "missing credentials in body")
    
    #
    # we were passed username/password, authenticate
    # and return if user exists:
    #
    print("**We were passed username/password**")
    print("username:", username)
    print("password:", password)
      
    print("**Looking up user**")
      
    sql = "SELECT userid, pwdhash FROM users WHERE username = %s;"

    row = datatier.retrieve_one_row(dbConn, sql, [username])

    #
    # return if username already exists
    #
    if row != ():
      print("**User already exists, returning...**")
      return api_utils.error(401, "existing username")
    
    #
    # add new user to the database
    #
    pwdhash = auth.hash_password(password)
    
    sql = """
      INSERT INTO users(username, pwdhash)
        values(%s, %s);
    """
    
    user_created = datatier.perform_action(dbConn, sql, [username, pwdhash])

    if user_created != 1:
      print("**INTERNAL ERROR: insert into database failed...**")
      return api_utils.error(400, "INTERNAL ERROR: insert failed to modify database")
    
    #
    # success, done!
    #
    print("**DONE, returning token**")

    return api_utils.success(200, "new user added successfully")
    
  except Exception as err:
    print("**ERROR**")
    print(str(err))

    return api_utils.error(400, str(err))
