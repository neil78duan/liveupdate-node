readme.txt

用nodejs 实现的一个程序数据更新服务器

自动部署 ./publish

访问后台管理
http://hostname:8080/
后台功能：
Upload Version Data		-> 上传数据
View Upload logs		-> 查看上传日志
Server Version Info		-> 查看服务器信息

版本服务器功能


http://hostname/loaddata -> 下载版本数据
用法：
http://localhost/loaddata?dataver=1.1.1&name=data.zip
版本1.1.1 上传的文件名是data.zip

获取每个版本对应的文件名列表 （下载txt文件）
http://hostname/getlist

获得服务器列表
http://hostname/getserverlist

所有地址使用get 方法


http://localhost:8080/ 进入后台管理
上传即可版本文件和其他的后台管理功能


生成md5和版本信息

创建目录 a.b.c //a b c 为版本号
把文件放到 目录 a.b.c 里面
./create_md5.sh  a.b.c



在远程机器上部署：
	1 把liveupdate（redhat版本）拷贝到 /etc/init.d/ 目录下
	2 在home目录下建liveupdate 目录，设置相应的权限
	3 把run_insrv.sh拷贝到远程机器的liveupdate目录
	4 修改 publish.sh 倒数第二行 	update_hostFile $AWS_APO_HOST "-i $AWS_APO_PEM" 运行即可

duan

good luck
2015