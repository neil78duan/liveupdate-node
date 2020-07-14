readme.txt

用nodejs 实现的一个程序数据更新服务器

1 下载最新版本的nodejs 程序
  安装： sudo tar --strip-components 1 -xzvf node-v* -C /usr/local

  下载liveupdate-node 
  运行命令 ./install.sh
  修改config.json配置文件

  启动 ： /etc/init.d/liveupdate start

访问后台管理
http://hostname:8080/
后台功能：
Upload Version Data		-> 上传数据
View Upload logs		-> 查看上传日志
View Server List		->查看服务器列表
AddNewServer			-> 增加服务器列表
Server Version Info		-> 查看服务器信息

版本服务器功能


程序开发中使用的功能

http://hostname/loaddata -> 下载版本数据
用法：
http://localhost/loaddata?dataver=1.1.1&name=data.zip
版本1.1.1 上传的文件名是data.zip

获取每个版本对应的文件名列表 （下载txt文件）
http://hostname/getlist

获得服务器列表
http://hostname/getserverlist

所有地址使用get 方法

duan

good luck

last modified 2020 -7 
all rights reserved by duan @2020
