/* file downloadFile.js
 *
 * download file jscript
 *
 * create by duan 
 * 2015-3-16
 */

var url = require("url");
var fs=require("fs");
var sheldon = require("./index");
var sheldonLog = require('./sheldonLog') ;

var resumable = require('./resumable');
var path = require('path');

var config_info = sheldon.config_info;

var upload = require('./upload');


function writeBuffer2client(res,buf, fileExt,md5text,filename)
{

	var opts = {
		"Content-Type":fileExt,
        "Content-Length": Buffer.byteLength(buf, 'binary'),
        "content-disposition": "attachment;filename=" + filename,
        "Server": "NodeJs(" + process.version + ")"
	}
	if(md5text && md5text.length > 0) {
		opts.MD5 = md5text ;
	}
    res.writeHead(200, opts);
    res.write(buf,"binary");
    res.end();
    
}


function downTextFile(filePath, response)
{

	try {
		fs.readFile(filePath,'binary',function(err,file){
			if(err) {
				sheldon.ResponeError(response,404, "404 not found ");
				sheldonLog.error("downloadFile::downTextFile() open file error ", filePath, "error =", err) ;
			}
            else {

                var filename = path.basename(filePath);

                writeBuffer2client(response, file, "text/plain",null, filename) ;
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
    sheldonLog.debug("getVersionData() begin");
    try {
        var dataJson = url.parse(request.url, true).query;
        sheldonLog.debug("getVersionData() ", JSON.stringify(dataJson));

        var dataID = dataJson.dataver;
        var name = dataJson.name;

        var verIdIsOk = dataID.indexOf('/');
        if (verIdIsOk != -1) {
            sheldon.ResponeError(response, 200, "Bad request!");
            return 200;
        }

        var filePath = config_info.liveUpdateDir + '/' + dataID + '/' + name;

        var Md5Text = fs.readFileSync(filePath + '.md5.txt', "ascii");

        if (typeof Md5Text == 'undefined') {
            Md5Text = ' ';
        }
        resumable.resumableDownload(filePath, response, request, Md5Text);

    }

    catch (e) {
        sheldonLog.log("getVersionData() catch exception ", e);
        sheldon.ResponeError(response, 404, "Not found");
    }

    return 200;
	
}

exports.getDataFileMd5 = function (response, request) {
    sheldonLog.debug("getDataFileMd5() begin");
    try {
        var dataJson = url.parse(request.url, true).query;
        sheldonLog.debug("getDataFileMd5() ", JSON.stringify(dataJson));

        var dataID = dataJson.dataver;
        var name = dataJson.name;

        var filePath = config_info.liveUpdateDir + '/' + dataID + '/' + name;
        var md5File = filePath + '.md5.txt';

        var Md5Text = '';

        if (fs.existsSync(md5File)) {
            Md5Text = fs.readFileSync(md5File, "ascii");
        }
        else {
            Md5Text = upload.getMd5FromFile(filePath);
        }

        if (typeof Md5Text == 'undefined') {
            sheldon.ResponeError(response, 404, "Not found");
        }
        else {
            sheldon.ResponeError(response, 200, Md5Text);
        }
    }

    catch (e) {
        sheldonLog.log("getDataFileMd5() catch exception ", e);
        sheldon.ResponeError(response, 404, "File not found");
    }

    return 200;

}

/*
exports.DownLoadList = function (response , request)
{
	sheldonLog.debug("call DownLoadList() "  ) ;	
    return downTextFile(config_info.liveUpdateDir +  __dataList, response);
	
}
*/

exports.getTextFile = function (response, request) {
    sheldonLog.debug("getTextFile() begin");
    try {
        var dataJson = url.parse(request.url, true).query;
        sheldonLog.debug("getVersionData() ", JSON.stringify(dataJson));

        var dataID = dataJson.dataver;
        var name = dataJson.name;

        var filePath = config_info.liveUpdateDir;

        if (dataID) {
            var verIdIsOk = dataID.indexOf('/');
            if (verIdIsOk != -1) {
                sheldon.ResponeError(response, 200, "Bad request!");
                return 200;
            }
            filePath += '/' + dataID;
        }
        
        filePath += '/' + name;

        return downTextFile(filePath, response);
    }

    catch (e) {
        sheldonLog.log("getVersionData() catch exception ", e);
        sheldon.ResponeError(response, 404, "Not found");
    }

    return 200;

}


exports.downTextFile = downTextFile;



