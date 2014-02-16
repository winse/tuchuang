$(document).ready(function () {
    $("#login").click(function(){
        $.flickr().loginClient();
    });

    $("#home").click(function(){
        if($.flickr().getToken()){
            window.location.href = "popup.html";
        };
    })
});