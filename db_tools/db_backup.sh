#!/bin/bash

echo "name of backup file?"
read backupfile

mysqldump -u root  -pDemoDatabasePassword!!123 capstone_2023_securepass1 >$backupfile

