/* file serverListMgr.js
 *
 * manager of server list 
 *
 * create by duan 
 * 2020-7-13
 */

var fs = require("fs");
var url = require("url");
var sheldon = require("./index");
var sheldonLog = require('./sheldonLog');
var downloader = require('./downloadFile');

var config_info = sheldon.config_info;

var _srvlist_file = config_info.liveUpdateDir + "/serverlist.json";


exports.getServerList = function (response, request) {

    return downloader.downTextFile(_srvlist_file, response);

}

exports.handleAddNewServer = function (response, request, dataJson) {
    try {
        var serverList = {};
        if (fs.existsSync(_srvlist_file)) {
            serverList = require(_srvlist_file);

            serverList["infos"].push(dataJson);
        }
        else {
            var lists = [];
            lists.push(dataJson);
            serverList["infos"] = lists;
        }

        var outString = JSON.stringify(serverList, null, "\t");

        fs.writeFileSync(_srvlist_file, outString);

        sheldon.ResponeError(response, 200, 'Add ' + JSON.stringify(dataJson.serverName)+ ' to server list success.<a href="/">Home</a><br />');
    }

    catch (e) {

        sheldonLog.log("liveUpdate::handleAddNewServer() catch exception ", e);
        sheldon.ResponeError(response, 200, 'Add server to list error, back to <a href=\"/\">Home</a><br />.');
    }

    return 200;
}


exports.handleDelServer = function (response, request) {
    try {
        var reqDataJson = url.parse(request.url, true).query;

        var dataID = reqDataJson.serverid;

        var serverList = require(_srvlist_file);

        var isDelOk = 0;
        for (var i = 0; i < serverList["infos"].length; i++) {
            if (serverList["infos"][i]["serverID"] == dataID)  {
                serverList["infos"].splice(i, 1); 
                isDelOk = 1;
                break;
            }
        }

        if (isDelOk == 1) {
            var outString = JSON.stringify(serverList, null, "\t");
            fs.writeFileSync(_srvlist_file, outString);
        }
       
        requestViewServerList(response);
        //sheldon.ResponeError(response, 200, 'Del server from list success.<a href="/">Home</a><br />');
    }

    catch (e) {

        sheldonLog.log("liveUpdate::handleDelServer() catch exception ", e);
        sheldon.ResponeError(response, 200, 'Not found server from list, back to <a href=\"/\">Home</a><br />.');
    }

    return 200;
}

function requestViewServerList(response) {

    try {
        var body = '<html>' +
            '<head>' +
            '<meta http-equiv="Content-Type" ' +
            'content="text/html; charset=UTF-8" />' +
            '</head>' +
            '<body>' +
            '<a href="/">Home</a><br />' +
            '<br />' +
            '<br />';

        var serverList = require(_srvlist_file);
        
        serverList["infos"].forEach(function (v, index, a) {
            body += v["serverID"] + '&nbsp&nbsp' + v["serverName"] + '&nbsp&nbsp&nbsp(ip=' + v["Addr"] + ':' + v["Port"] +')&nbsp&nbsp';

            //body += JSON.stringify(v);

            body += '<a href="/delserverfromlist?serverid=';
            body += v.serverID;
            body += '">DEL</a><br/>';
        });

        body += '</body></html>';

        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(body);
        response.end();
    }

    catch (e) {

        sheldonLog.log("liveUpdate::requestViewServerList() catch exception ", e);
        sheldon.ResponeError(response, 200,  'Not found server host list, back to <a href=\"/\">Home</a><br />.');
    }

}

exports.requestViewServerList = requestViewServerList;

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

        '<form action="/addnewserver" method="post" enctype = "application/x-www-form-urlencoded"> ' +



        'serverID: <input type="text" name="serverID" /><br />' +

        'Name: <input type="text" name="serverName" /><br />' +

        'Address: <input type="text" name="Addr" /><br />' +

        'Port: <input type="text" name="Port" /><br />' +

        'State: <input type="text" name="State" /><br />' +

        '<input type="submit" value="AddNew" />' +
        '</form>' +
        '</body>' +
        '</html>';

    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(body);
    response.end();
}
