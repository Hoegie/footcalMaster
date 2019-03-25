#!/bin/sh
date >> /app/nodeprojects/github/logs/apisetup.log 2>&1
clubid=$1
clubname=$2
clubbasenr=$3
dbname=FootCal_$4
serverdir=$5
apiport=$6

mkdir /app/nodeprojects/github/$5
cp /app/nodeprojects/github/templates/FootCalTemplate /app/nodeprojects/github/$5
mv /app/nodeprojects/github/$5/footcaltemplate.js  /app/nodeprojects/github/$5/footcal$5.js
chmod 646 /app/nodeprojects/github/$5/footcalini.js
#construct the ini file
sed -i -e "s/CIstring/$clubid/g" /app/nodeprojects/github/$5/footcalini.js
sed -i -e "s/CNstring/$clubname/g" /app/nodeprojects/github/$5/footcalini.js
sed -i -e "s/CBNstring/$clubbasenr/g" /app/nodeprojects/github/$5/footcalini.js
sed -i -e "s/DNstring/$dbname/g" /app/nodeprojects/github/$5/footcalini.js
sed -i -e "s/SDstring/$serverdir/g" /app/nodeprojects/github/$5/footcalini.js
sed -i -e "s/APIstring/$apiport/g" /app/nodeprojects/github/$5/footcalini.js
#copy footcalini.js to ini backup dir
cp /app/nodeprojects/github/$5/footcalini.js /app/nodeprojects/github/templates/inibackup/footcalini_$5.js
#adapt master webhook script
sed -i "\$a cp /app/nodeprojects/github/templates/FootCalTemplate/footcal.js /app/nodeprojects/github/$5 >> /app/nodeprojects/github/logs/master_webhook.log 2>&1" /app/nodeprojects/github/masterWebHook/master_wh_script.sh
#create php directories for gamereports & images
mkdir /var/www/footcal.be/public_html/$5
mkdir /var/www/footcal.be/public_html/$5/gamereports
mkdir /var/www/footcal.be/public_html/$5/images
mkdir /var/www/footcal.be/public_html/$5/images/players
mkdir /var/www/footcal.be/public_html/$5/images/staff
#update backupscript to take backup of the new database
sed -i "\$a dump_database \"FootCal_$dbname\" \"$dbname\" \"mysqldump --user=\$mysql_user -p --host=localhost --databases FootCal_$dbname > /home/sven/dumps/\"" /home/sven/backupscript/sqldump.exp
#activate the API with PM2
pm2 start  /app/nodeprojects/github/$5/footcal$5.js --watch


