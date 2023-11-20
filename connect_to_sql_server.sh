#!/bin/bash

# Define SQL Server connection information
server_name="classmysql.engr.oregonstate.edu"
username="capstone_2023_securepass1"
password="zxob8b@T8!yF"
database="capstone_2023_securepass1"

# Connect to SQL Server using sqlcmd
sqlcmd -S "$server_name" -U "$username" -P "$password" -d "$database"

# Check the exit code to determine if the connection was successful
if [ $? -eq 0 ]; then
  echo "Connected to SQL Server successfully."
else
  echo "Failed to connect to SQL Server."
fi

