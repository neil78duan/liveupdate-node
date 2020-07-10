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

sed 's;/home/liveupdate/liveupdate-node;$workDir;g' ./liveupdate > /etc/init.d/liveupdate


sed 's;/home/liveupdate/upload;$parentDir/$myuploadPath;g' ./release_cfg.json > ./.rel_cfg.tmp

rm ./release_cfg.json
mv ./.rel_cfg.tmp ./release_cfg.json

echo "Install success!"

