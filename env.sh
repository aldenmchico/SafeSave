#!/bin/bash

# Define the root directory of your project (current directory)
project_root="."

# Define the credentials to replace in the .env file
new_dbpassphrase="zxob8b@T8!yF"
new_host="classmysql.engr.oregonstate.edu"
new_database="capstone_2023_securepass1"
new_dbuser="capstone_2023_securepass1"

# Function to replace a key-value pair in a .env file
replace_env() {
  local file="$1"
  local key="$2"
  local value="$3"
  awk -F= -v key="$key" -v value="$value" 'BEGIN{OFS="="} $1 == key { $2 = value } 1' "$file" > temp_file && mv temp_file "$file"
}

# Find all '.env' files in the project root and its subdirectories
find "$project_root" -type f -name '.env' | while read -r file; do
  # Check if the file is an .env file and update its contents
  echo "Updating $file"
  replace_env "$file" "dbpassphrase" "$new_dbpassphrase"
  replace_env "$file" "host" "$new_host"
  replace_env "$file" "database" "$new_database"
  replace_env "$file" "dbuser" "$new_dbuser"
done

