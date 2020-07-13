#! /bin/sh
#
# install liveupdate-node to aim host
#

workDir=`pwd`
cd ..
parentDir=`pwd`

myuploadPath=upload

mkdir $myuploadPath


cd $workDir

sed "s;my_liveupdate_working_path;$workDir;g" ./liveupdate > /etc/init.d/liveupdate


sed "s;myupdate_path;$parentDir/$myuploadPath;g" ./configuration_base.json > ./config.json


#npm install b64url
#npm install formidable
#npm install lodash
#npm install log4js

echo "Install success!"

