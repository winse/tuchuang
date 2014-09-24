var flickr = $.flickr();

$(document).ready(function () {

    var $more = $("#more");

    flickr.list($more, 1, 10);
    $more.click(function(){
        flickr.list($more, parseInt($more.attr("page")) + 1, 10);
    });
});