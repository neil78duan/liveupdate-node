/* file serverListMgr.js
 *
 * manager of server list 
 *
 * create by duan 
 * 2020-7-13
 */


var http = require("http");
var path = require("path");
var fs = require("fs");
var crypto = require('crypto');
var sheldon = require("./index");
var config_info = sheldon.config_info;
var sheldonLog = require('./sheldonLog');

var __srv_list = "/serverlist.json";



exports.handleAddNewServer = function (response, request, dataJson) {
    try {
        sheldonLog.debug("addNewServer() ", JSON.stringify(dataJson));
        var serverList = require(config_info.liveUpdateDir + __srv_list);
        

        if (!serverList || !serverList["infos"]) {
            var lists = [];
            lists.push(dataJson);
            serverList["infos"] = lists;

        }
        else {
            serverList["infos"].push(dataJson);
        }

        let outString = JSON.stringify(serverList, null, "\t");

        fs.writeFileSync(config_info.liveUpdateDir + __srv_list, outString);

    }

    catch (e) {
        sheldonLog.log("getVersionData() catch exception ", e);
        sheldon.ResponeError(response, 404, "Not found");
    }

    return 200;
}


exports.requestAddNewServer = function (response) {

    //console.log("Request handler 'start' was called.");

    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" ' +
        'content="text/html; charset=UTF-8" />' +
        '</head>' +
        '<body>' +

        '<a href="/">Home</a><br />' +

        '<br />' +
        '<br />' +

        '<form action="/addNewServer" method="post" enctype="multipart/form-data"> ' +



        'serverID: <input type="text" name="serverID" /><br />' +

        'serverName: <input type="text" name="serverName" /><br />' +

        'hostName: <input type="text" name="Addr" /><br />' +

        'Port: <input type="text" name="Port" /><br />' +

        'State: <input type="text" name="State" /><br />' 

        '<input type="submit" value="Add new" />' +
        '</form>' +
        '</body>' +
        '</html>';

    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(body);
    response.end();
}
