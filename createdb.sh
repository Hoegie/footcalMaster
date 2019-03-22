#!/bin/sh
dbname=FootCal_$1
createcommand="CREATE DATABASE $dbname;"
date >> /app/nodeprojects/github/logs/newClubAccount.log 2>&1
echo $createcommand >> /app/nodeprojects/github/logs/newClubAccount.log 2>&1 
#mysql -h localhost -u root -pHoegaarden -Bse $createcommand
#>> /app/nodeprojects/github/logs/newClubAccount.log 2>&1
mysql -h localhost -u root -pHoegaarden << EOF
use mysql;
$createcommand
use $dbname;
source /app/nodeprojects/github/templates/FootCal_template.sql;
EOF



