/**
 require:
 ```
 var md5s = document.createElement("script");
 md5s.src = "http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js"
 document.body.appendChild(md5s);
 ```

 https://code.google.com/p/crypto-js/#MD5

 */

(function ($) {

    function md5Hex(str) {
        return CryptoJS.MD5(str).toString(CryptoJS.enc.Hex);
    }

    $.md5 = md5Hex;

}(jQuery));