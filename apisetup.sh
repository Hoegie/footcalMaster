#!/bin/sh
date >> /app/nodeprojects/github/logs/apisetup.log 2>&1
clubid=$1
clubname=$2
clubbasenr=$3
dbname=FootCal_$4
serverdir=$5
apiport=$6

mkdir /app/nodeprojects/github/$serverdir
cp -r /app/nodeprojects/github/templates/FootCalTemplate/. /app/nodeprojects/github/$serverdir
rm -R /app/nodeprojects/github/$serverdir/.git
mv /app/nodeprojects/github/$serverdir/footcaltemplate.js  /app/nodeprojects/github/$serverdir/footcal$serverdir.js
chmod 646 /app/nodeprojects/github/$serverdir/footcalini.js
#construct the ini file
sed -i -e "s/CIstring/$clubid/g" /app/nodeprojects/github/$serverdir/footcalini.js
sed -i -e "s/CNstring/$clubname/g" /app/nodeprojects/github/$serverdir/footcalini.js
sed -i -e "s/CBNstring/$clubbasenr/g" /app/nodeprojects/github/$serverdir/footcalini.js
sed -i -e "s/DNstring/$dbname/g" /app/nodeprojects/github/$serverdir/footcalini.js
sed -i -e "s/SDstring/$serverdir/g" /app/nodeprojects/github/$serverdir/footcalini.js
sed -i -e "s/APIstring/$apiport/g" /app/nodeprojects/github/$serverdir/footcalini.js
#copy footcalini.js to ini backup dir
cp /app/nodeprojects/github/$serverdir/footcalini.js /app/nodeprojects/github/templates/inibackup/footcalini_$serverdir.js
#adapt master webhook script
sed -i "\$a cp /app/nodeprojects/github/templates/FootCalTemplate/footcal.js /app/nodeprojects/github/$serverdir >> /app/nodeprojects/github/logs/master_webhook.log 2>&1" /app/nodeprojects/github/masterWebHook/master_wh_script.sh
#create php directories for gamereports & images
mkdir /var/www/footcal.be/public_html/$serverdir
mkdir /var/www/footcal.be/public_html/$serverdir/gamereports
mkdir /var/www/footcal.be/public_html/$serverdir/images
mkdir /var/www/footcal.be/public_html/$serverdir/images/players
mkdir /var/www/footcal.be/public_html/$serverdir/images/staff
#update backupscript to take backup of the new database
sed -i "\$a dump_database \"FootCal_$4\" \"$4\" \"mysqldump --user=\$mysql_user -p --host=localhost --databases FootCal_$4 > /home/sven/dumps/\"" /home/sven/backupscript/sqldump.exp
#activate the API with PM2
#sleep 10
#pm2 start /app/nodeprojects/github/$serverdir/footcal$serverdir.js --watch