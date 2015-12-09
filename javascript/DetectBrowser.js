/**
 * Detect the user browser based on the UserAgent string.
 * See: http://www.javascriptkit.com/javatutors/navigator.shtml
 *
 * Reject:
 *   IE 9 or lower
 *   Safari 7 or lower
 *   Opera 27 or lower
 *   Chrome 36 or lower
 *   Firefox 24 or lower
 *
 * Also see info no object detection for more granular browser rejection and workarounds:
 * http://www.quirksmode.org/js/support.html
 **/

var DetectBrowser = function () {
    //    this.browserVersion = null;
    this.versionToAccept = {
        'ie': 10,
        'safari': 8,
        'opera': 28,
        'chrome': 37,
        'firefox': 25
    };

    //    console.log(this.isValidBrowser());
    this.isValidBrowser();
}; // end DetectBrowser()


/**
 * Detect browser type and version, and return bool for valid browsers.
 * See: http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
 **/
DetectBrowser.prototype.isValidBrowser = function () {


    // Opera and Chrome detection
    if (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
        // test and capture Opera 15+ version
        var opera15PlusVersion = /OPR\/(\d+\.\d+)/i.test(navigator.userAgent);
        var thisVersion = 0;

        if (opera15PlusVersion) {
            // contains exact Opera15+ version, such as 25 for Opera 25.0
            var operaVersion = new Number(RegExp.$1)
            thisVersion = parseInt(operaVersion);
        }

        if (thisVersion >= this.versionToAccept['opera']) {
            return true;
        } else {
            return false;
        }
    } else if (!!window.chrome) {
        // Chrome 1+
        return this.validateVersionNumber('Chrome/', this.versionToAccept['chrome']);
    } // end Opera and Chrome


    // Firefox 1.0+
    if (typeof InstallTrigger !== 'undefined') {
        var ffversion = new Number(new RegExp(/Firefox[\/\s](\d+\.\d+)/)); // capture x.x portion and store as a number
        if (ffversion >= this.versionToAccept['firefox']) {
            return true;
        } else {
            return false;
        }
    } // end Firefox


    // At least Safari 3+: "[object HTMLElementConstructor]"
    if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
        return this.validateVersionNumber(') Version/', this.versionToAccept['safari']);
    } // end Safari


    // At least IE6
    if ( /*@cc_on!@*/ false || !!document.documentMode) {
        // userAgent in IE7 WinXP returns: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727)
        // userAgent in IE11 Win7 returns: Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko
        var detectIEregexp = '';
        if (navigator.userAgent.indexOf('MSIE') != -1) {
            // test for MSIE x.x
            detectIEregexp = /MSIE (\d+\.\d+);/;
        } else {
            // if no "MSIE" string in userAgent
            detectIEregexp = /Trident.*rv[ :]*(\d+\.\d+)/; //test for rv:x.x or rv x.x where Trident string exists
        }

        if (detectIEregexp.test(navigator.userAgent)) {
            var ieversion = new Number(RegExp.$1); // capture x.x portion and store as a number
            if (ieversion >= this.versionToAccept['ie']) {
                return true;
            } else {
                return false;
            }
        }
    } // end IE6+


    // Edge - for now, support unconditionally
    if (navigator.userAgent.indexOf(' Edge/') >= 0) {
        return true;
    } // end Edge
}; // end isValidBrowser()


DetectBrowser.prototype.validateVersionNumber = function(stringToSearch, versionToAccept) {
    var numberOfVersionDigits = (versionToAccept.toString()).length;
    var versionLocation = window.navigator.userAgent.search(stringToSearch);
    versionLocation += stringToSearch.length;

    var thisVersion = parseInt(window.navigator.userAgent.substr(versionLocation, numberOfVersionDigits));

    if (thisVersion >= versionToAccept) {
        return true;
    } else {
        return false;
    }
}; // end validateVersionNumber(stringToSearch)