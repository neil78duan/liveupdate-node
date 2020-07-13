/* file downloadFile.js
 *
 * download file jscript
 *
 * create by duan 
 * 2015-3-16
 */


//var http = require("http");
//var path=require("path");
var url = require("url");
//var qs = require("querystring");

var fs=require("fs");
//var crypto = require('crypto') ;
var sheldon = require("./index");
var config_info = sheldon.config_info;
var sheldonLog = require('./sheldonLog') ;

var resumable = require('./resumable') ;

var verFileGlobal = "/version.txt" ;
//var dataFileGlobal = "/data.zip" ;
//var __uploadLog = "/upload.log";
var __dataList = "/datalist.txt";
var __dataListFileName = "datalist.txt";



function writeBuffer2client(res,buf, displayFileName,fileExt,verID,md5text)
{

	var opts = {
		"Content-Type":fileExt,
		"Content-Length":Buffer.byteLength(buf,'binary'),
        "Server": "NodeJs(" + process.version + ")",
        //"attachment;filename": '\"' + displayFileName + '\"',
		'packageversion' : verID
	}
	if(md5text && md5text.length > 0) {
		opts.MD5 = md5text ;
	}
    res.writeHead(200, opts);
    res.write(buf,"binary");
    res.end();
    
}


function downTextFile(fileName,filePath, response, dataID)
{

	try {
		fs.readFile(filePath,'binary',function(err,file){
			if(err) {
				sheldon.ResponeError(response,404, "404 not found ");
				sheldonLog.error("downloadFile::downTextFile() open file error ", filePath, "error =", err) ;
			}
			else {
                writeBuffer2client(response, file, fileName, resumable.getFileType(verFileGlobal),dataID,null) ;
			}
		});
	}
	
    catch (e) {
        sheldonLog.log("downTextFile() catch exception ", e) ;
        sheldon.ResponeError(response,404, "Not found");
    }
	return 200 ;

}

exports.DownLoadData = function (response , request)
{
        sheldonLog.debug("getVersionData() begin") ;
	try
	{
		var dataJson = url.parse(request.url, true).query;
        sheldonLog.debug("getVersionData() ", JSON.stringify(dataJson) ) ;
		
        var dataID = dataJson.dataver ;
		var name = dataJson.name ;
		
		var filePath = config_info.liveUpdateDir + '/' + dataID + '/' + name;
		resumable.resumableDownload(name,filePath,response , request ) ;
		
    }
	
    catch (e) {
        sheldonLog.log("getVersionData() catch exception ", e) ;
        sheldon.ResponeError(response,404, "Not found");
    }
	
    return 200 ;
	
}

exports.DownLoadList = function (response , request)
{
	sheldonLog.debug("call DownLoadList() "  ) ;
	
    return downTextFile(__dataListFileName,config_info.liveUpdateDir +  __dataList, response, '0');
	
	
}

exports.downTextFile = downTextFile;



