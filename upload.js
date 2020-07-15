/* file upload.js
 * upload file to server
 *
 * create by duan 
 *
 * 2015-3-16
 * duan
 */


var fs=require("fs");
var crypto = require('crypto') ;
var sheldon = require("./index");
var config_info = sheldon.config_info;
var sheldonLog = require('./sheldonLog') ;
var __uploadLog = "/upload.log";
var __dataList = "/datalist.txt";


function getMd5FromFile(filePath)
{

    var buffer = fs.readFileSync(filePath);
    var fsHash = crypto.createHash('md5');

    fsHash.update(buffer);
    return fsHash.digest('hex');

}

exports.getMd5FromFile = getMd5FromFile

function trim_verID(strInput) { //过滤字符中的全部空格
	
	var result = "";
 
	for (var i=0; i < strInput.length; i++) {
		var test = strInput[i];
 		if(test > ' '){
			result += test ;
		}
	};
	return result;
}


function saveFiles(response,verID, FileData, desc, fileMd5Text) {
	
	sheldonLog.log("enter saveFile() ") ;
	try {

        var dataFile = FileData.path;

        var mymd5 = getMd5FromFile(dataFile);

        if (fileMd5Text && mymd5 != fileMd5Text) {
            sheldonLog.error("Upload ", datafile.name, " error md5 calc-md5=", mymd5, " input-md5=", fileMd5Text);
            sheldon.ResponeError(response, 200, '<a href="/">Home</a><br /><br />Upload file ERROR MD5 check error ');
            return true;
        }
		
		
		verID = trim_verID(verID) ;
		
		var aimDir = config_info.liveUpdateDir + '/' + verID;
        var dataPath = aimDir + "/" + FileData.name;
        
        if (!fs.existsSync(aimDir)) {
            fs.mkdirSync(aimDir);
            sheldonLog.log("create path : ", aimDir);
        }
        else if (fs.existsSync(dataPath)) {
            sheldon.ResponeError(response, 200, '<a href="/">Home</a><br /><br />Upload data file already exist ' + verID + "/" + FileData.name);
            return false;
        }

		fs.renameSync(dataFile, dataPath ) ;		
		
		if(fs.existsSync(dataPath) ) {
			
			sheldonLog.info("upload version file success version-id = ", verID);
			
			var downUrl =config_info.my_domain_name +':' +
				config_info.port.toString() + '/loaddata?dataver=' + verID +'&name=' + FileData.name;
			
			var backTip = '<a href="/">Home</a><br /><br />Upload version success ! ' +
				'<br />  url is : ' + downUrl ;
			
			sheldon.ResponeError(response,200,  backTip) ;
			
			//write log
			fs.appendFileSync(config_info.liveUpdateDir  + __uploadLog,
				'\n<br />' + verID + ' ' + desc + ' : ' + downUrl) ;
			
			// write file list
			fs.appendFileSync(config_info.liveUpdateDir +  __dataList,
                verID +  ' : ' + FileData.name + '\n') ;
			
            //output md5 file 
            fs.writeFileSync(dataPath + ".md5.txt", mymd5);
			return true ;
		}
		else {
			sheldon.ResponeError(response,500, '<a href="/">Home</a><br /><br />Upload version error  ') ;
			return true ;
		}
		
	}
	catch (e) {
		
		sheldonLog.log("liveUpdate::saveFiles() catch exception ", e) ;
	}
	return false ;
}


exports.UploadVersionHandle = function (response, request) {
	
	sheldonLog.debug("Request handler 'UploadVersionHandle' was called ");
	
	try
	{
		var bsuccess = false ;
		//var querystring = require("querystring"),
		fs = require("fs"),
		formidable = require("formidable");
		
		
		var form = new formidable.IncomingForm();
		var uploadPathTmp = config_info.liveUpdateDir + '/.tmp' ;
		
		if(!fs.existsSync(uploadPathTmp)) {
			fs.mkdirSync(uploadPathTmp);
		}
		form.uploadDir= uploadPathTmp ;
		
		//console.log("about to parse");
		form.parse(request, function(error, formData, files) {

            //console.log("parse notice data done", files);
		   if(error ) {
				sheldonLog.error("add UploadVersionHandle error", error) ;
				
		   }

		   else if(files &&  files.DataFile && files.DataFile.size > 0) {
		   
               bsuccess = saveFiles(response, formData.VerID, files.DataFile,  formData.VerDesc, formData.md5Val);
		   }
		   if( bsuccess == false) {
		   		sheldon.ResponeError(response, 400, "parse data error");
		   }

		});
	}
	catch (e) {
		
		sheldonLog.log("UploadVersionHandle() catch exception ", e) ;
		sheldon.ResponeError(response,500, "Internal error");
	}
	return 200 ;
}


exports.getUploadLog =function( callback )
{
	sheldonLog.debug("Request getUploadLog() ");
	
	//try {
		var logfile = config_info.liveUpdateDir + __uploadLog ;
		if(fs.existsSync(logfile)) {
			fs.readFile(logfile, "utf8", function(err, file) {
				if(!err && file) {
					callback(file.toString()) ;
				}
			}) ;
		}
		else {
			callback("log file not found") ;
			
			sheldonLog.debug(logfile, "file not found ");
		}

}

exports.requestUploadVersion = function (response)
{
	
	//console.log("Request handler 'start' was called.");
	
	var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" '+
	'content="text/html; charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	
	'<a href="/">Home</a><br />' +
	
	'<br />' +
	'<br />' +
	
	'<form action="/uploadversion" method="post" enctype="multipart/form-data"> '+
	
	
	'Data File :' +
	'<input type="file" name="DataFile" multiple="multiple">'+
	'<br />' +

     'Version: <input type="text" name="VerID" /><br />' +

     'MD5: <input type="text" name="md5Val" /><br />' +
	
	'Description: <input type="text" name="VerDesc" /><br />' +
	
	'<input type="submit" value="Submit" />' +
	'</form>'+
	'</body>'+
	'</html>';
	
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}
