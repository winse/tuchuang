(function ($) {

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