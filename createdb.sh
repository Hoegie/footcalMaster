dbname=FootCal_$1
createcommand="\"CREATE DATABASE $dbname;\""
date >> /app/nodeprojects/github/logs/newClubAccount.log 2>&1
echo $createcommand >> /app/nodeprojects/github/logs/newClubAccount.log 2>&1 
#mysql -uroot -pHoegaarden -e $createcommand >> /app/nodeprojects/github/logs/newClubAccount.log 2>&1
command="mysql -uroot -pHoegaarden -e $createcommand >> /app/nodeprojects/github/logs/newClubAccount.log 2>&1"
echo $command >> /app/nodeprojects/github/logs/newClubAccount.log 2>&1

