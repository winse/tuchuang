(function ($) {

    /*
     var storage = chrome.storage.local;
     storage.set({'css': cssCode}, function(){ })
     storage.get('css', function(items){if(items.css){ } });
     storage.remove('css', function(items){ } );
     */

    var storage = window.localStorage;

    function show() {
        for (var i = 0; i < storage.length; i++) {
            //key(i)获得相应的键，再用getItem()方法获得对应的值
            document.write(storage.key(i) + " : " + storage.getItem(storage.key(i)) + "<br>");
        }
    };

    function get(key) {
        return storage.getItem(key);
    };

    function set(key, value) {
        storage.setItem(key, value);
    }

    $.store = {
        "get": get,
        "set": set
    }

}(jQuery));