#!/bin/sh
dbname=FootCal_$1
createcommand="\"CREATE DATABASE $dbname;\""
date >> /app/nodeprojects/github/logs/newClubAccount.log 2>&1
echo $createcommand >> /app/nodeprojects/github/logs/newClubAccount.log 2>&1 
/app/nodeprojects/github/footcalMaster/mysql -h localhost -uroot -pHoegaarden -Bse $createcommand
#>> /app/nodeprojects/github/logs/newClubAccount.log 2>&1


