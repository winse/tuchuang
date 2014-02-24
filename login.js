$(document).ready(function () {
    $("#login").click(function () {
        $.flickr().loginClient();
    });

    $("#home").click(function () {
        $.flickr().getToken(function () {
            window.location.href = "popup.html";
        });
    })
});