var OS = ['iphone', 'ipad', 'windows', 'mac', 'linux'];
var errCount = 0;

function SendError(err, optionals) {
    try {
        var VID = readCookie('VisitorID');
        if (VID == undefined)
            VID = 'NF'

        var objErr = {
            'Error': err.toString(),
            'VisitorID': VID,
            'References': optionals,
            'URL': location.host
        };

        networkCall('POST', 'https://clients.searchberg.com/VisitorTrackingAPI/api/Error/LogError', JSON.stringify(objErr));
        //networkCall('POST', 'http://localhost:21977/api/Error/LogError', JSON.stringify(objErr));
        
    }
    catch (err) {
        if (errCount == 3)
            return;

        errCount++;
    }
}

networkCall = function (methodType, url, params, callback) // How can I use this callback?
{
    var request = new XMLHttpRequest();
    request.open(methodType, url, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            callback(JSON.parse(request.responseText)); // Another callback here
        }
    };

    request.send(params);
}

var pageLoad = function () {
    try {
        navigator.getBrowserName = (function () {
            var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
            return M.join(' ');
        })();
    }
    catch (err) {
        navigator.getBrowserName = 'Error';
        //SendError(err);
    }
    
    try {
        navigator.getDeviceName = (function () {
            if (navigator.userAgent.match(/Android/i))
                return "Android";
            else if (navigator.userAgent.match(/BlackBerry/i))
                return "BlackBerry";
            else if (navigator.userAgent.match(/iPhone|iPad|iPod/i))
                return "iPhone/iPad";
            else if (navigator.userAgent.match(/Opera Mini/i))
                return "Opera";
            else if (navigator.userAgent.match(/IEMobile/i))
                return "Windows";
            else if (navigator.userAgent.match(/DL-AXIS/i))
                return "Datalogic";
            else if (navigator.userAgent.match(/EF500/i))
                return "Bluebird";
            else if (navigator.userAgent.match(/CT50/i))
                return "Honeywell";
            else if (navigator.userAgent.match(/TC70|TC55/i))
                return "Zebra";
        })();
    }
    catch (err) {
        navigator.getDeviceName = 'Error';
        //SendError(err, 'getDeviceName');
    }
    
    checkVisitor();
};

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    pageLoad();
} else {
    document.addEventListener("DOMContentLoaded", pageLoad);
}

function readCookie(key) {
    try {
        //if (key == 'VisitorID')
        //    return document.cookie.replace(/(?:(?:^|.*;\s*)VisitorID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        //else if (key == 'VisitID')
        //    return document.cookie.replace(/(?:(?:^|.*;\s*)VisitID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        //else if (key == 'Checker')
        //    return document.cookie.replace(/(?:(?:^|.*;\s*)Checker\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        var nameEQ = key + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }

            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
    }
    catch (err) {
        SendError(err, 'readCookie() Key: ' + key);
    }
}

function createCookie(key, value) {
    var domain, domainParts;
    var host = location.host;

    try {
        
        if (host.split('.').length === 1) {
            document.cookie = key + "=" + value + "; expires=Fri, 31 Dec 9999 02:59:59 GMT; path=/";
        }
        else {
            domainParts = host.split('.');
            domainParts.shift();
            domain = '.' + domainParts.join('.');

            document.cookie = key + "=" + value + "; expires=Fri, 31 Dec 9999 02:59:59 GMT; path=/; domain=" + domain;
        }

        if (readCookie(key) == undefined || readCookie(key) != value) {
            domain = '.' + host;
            document.cookie = key + "=" + value + "; expires=Fri, 31 Dec 9999 02:59:59 GMT; path=/; domain=" + domain;
        }
        //document.cookie = key + "=" + value + ";permanent=true;domain=." + getDomainName(window.location.hostname) + ";path=/";
    }
    catch (err) {
        SendError(err, 'createCookie() ' + key + '-' + value + ', ' + domain.toString() + '-' + domainParts.toString() + '-' + host);
    }
}

function checkIsEurope() {
    try {
        if (Intl.DateTimeFormat().resolvedOptions().timeZone != undefined) {
            if (Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase().indexOf("europe") > -1)
                return true;
        }
        else
            return true;
    }
    catch (err) {
        //SendError(err, 'checkIsEurope()');
    }
    finally {
        return true;
    }
}

function checkVisitor() {
    try {
        var vID = readCookie("VisitorID");
        if (vID != undefined && vID != "") {
            SaveVisit();
        } else {
            //if (checkIsEurope()) {
            //    document.getElementById("div-cookie-message").style.display = "block";
            //}
            //else {
            //    document.getElementById("div-cookie-message").style.display = "none";
            //}
            SaveVisitor();
        }
    }
    catch (err) {
        //SendError(err, 'checkVisitor()');
    }
}

function getDate() {
    return new Date().toString();
    //try {
    //    var d = new Date();
    //    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    //}
    //catch (err) {
    //    SendError(err, 'getDate()');
    //}
    //finally {
    //    return new Date().toString();
    //}
}

function SaveVisit() {
    try {
        var vID = readCookie("VisitID");
        var d = new Date();
        if ((vID != undefined && vID != "") && readCookie("Checker") == (d.getDate() + '-' + d.getMonth())) {

            var objNav = {
                'VisitorID': readCookie("VisitorID"),
                'VisitID': vID,
                'PageURL': window.location.pathname,
                'Parameters': window.location.search,
                //'VisitedOn': getDate(),
            }

            networkCall('POST', 'https://clients.searchberg.com/VisitorTrackingAPI/api/visitDetail/SaveVisitDetail', JSON.stringify(objNav));
            //networkCall('POST', 'http://localhost:21977/api/visitDetail/SaveVisitDetail', JSON.stringify(objNav));
        } else {
            networkCall('GET', 'https://ipinfo.io/json', undefined, function (data) {
                //networkCall('POST', 'http://localhost:21977/api/Visit/SaveVisit', JSON.stringify(getVisitObject(data)),
                networkCall('POST', 'https://clients.searchberg.com/VisitorTrackingAPI/api/Visit/SaveVisit', JSON.stringify(getVisitObject(data)),
                    function (data) {
                        if (data != null && data != "-") {
                            createCookie("VisitID", data);
                            createCookie("Checker", (d.getDate() + '-' + d.getMonth()));
                        }
                    });
            });
        }
    }
    catch (err) {
        SendError(err, 'SaveVisit()');
    }
}

//function getDomainName(hostName) {
//    try {
//        //return hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
//        return hostName.replace('http://', '').replace('https://', '').replace('www.', '');
//    }
//    catch (err) {
//        SendError(err, 'getDomainName(), ' + hostName);
//    }
//    finally {
//        return hostName;
//    }

//}

function clearAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var equals = cookies[i].indexOf("=");
        var name = equals > -1 ? cookies[i].substr(0, equals) : cookies[i];
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function SaveVisitor() {
    try {
        networkCall('GET', 'https://ipinfo.io/json', undefined, function (data) {
            var objVisitor = {
                'VisitorName': '',
                'Email': '',
                'PhoneNo': '',
                'IPAddress': data.ip,
                'Country': data.country,
                'City': data.city,
                'Company': data.hostname,
                'Visit': getVisitObject(data),
                //'CreatedOn': getDate()
            }

            //networkCall('POST', 'http://localhost:21977/api/Visitor/Register', JSON.stringify(objVisitor),
            networkCall('POST', 'https://clients.searchberg.com/VisitorTrackingAPI/api/Visitor/Register', JSON.stringify(objVisitor),
                function (data) {
                    if (data != "" && data != null) {
                        createCookie("VisitorID", data.split("-")[0]);
                        createCookie("VisitID", data.split("-")[1]);
                        var d = new Date();
                        createCookie("Checker", (d.getDate() + '-' + d.getMonth()));
                    }
                });
        });
    }
    catch (err) {
        SendError(err, 'SaveVisitor()');
    }
}

function getOSName() {
    try {
        return navigator.userAgent.toLowerCase().match(new RegExp(OS.join('|')));
    }
    catch (err) {
        //SendError(err, 'getOSName()');
        return 'Error';
    }
}

function getVisitObject(data) {

    try {
        var osName = getOSName();

        var objVisit = {
            'VisitorID': readCookie("VisitorID"),
            'Campaign': '',
            'AdGroup': '',
            'DeviceName': navigator.getDeviceName,
            'BrowserName': navigator.getBrowserName,
            'OSName': '',
            'VisitorSite': window.location.hostname,
            'HostName': data.hostname,
            'TimeZone': '',
            'Language': navigator.language,
            'Location': data.loc,
            'Region': data.region,
            'LastVisitReferror': document.referrer,
            'ScreenResolution': screen.width + 'x' + screen.height,
            'UsedKeyword': '',
            'Query': '',
            'PageURL': window.location.pathname,
            'Parameters': window.location.search,
            //'VisitedOn': getDate()
        }

		try {
            objVisit.OSName = (osName.constructor === Array && osName.length > 0 ? osName[0] : osName);
        }
        catch (err) {
            objVisit.OSName = '';
        }

        try {
            objVisit.TimeZone = (typeof (Intl) == "undefined" ? 'Error' : Intl.DateTimeFormat().resolvedOptions().timeZone);
        }
        catch (err) {
            objVisit.TimeZone = '';
        }
        return objVisit;
    }
    catch (err) {
        //SendError(err, 'getVisitObject()');
    }
}