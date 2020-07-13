#! /bin/sh
#
# install liveupdate-node to aim host
#

workDir=`pwd`
cd ..
parentDir=`pwd`

myuploadPath=upload

[ -d $myuploadPath ] || mkdir $myuploadPath

cd $workDir

sed "s;my_liveupdate_working_path;$workDir;g" ./liveupdate > /etc/init.d/liveupdate
chmod u+x /etc/init.d/liveupdate

sed "s;../upload;$parentDir/$myuploadPath;g" ./configuration_base.json | sed "s;../log/liveupdate.log;/var/log/liveupdate.log;g"  > ./config.json


#npm install b64url
#npm install formidable
#npm install lodash
#npm install log4js

echo "Install success!"

