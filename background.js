/*
function copy(str) {
    var sandbox = $('#sandbox').val(str).select();
    document.execCommand('copy');
    sandbox.val('');
}

function paste() {
    var result = '',
        sandbox = $('#sandbox').val('').select();
    if (document.execCommand('paste')) {
        result = sandbox.val();
    }
    sandbox.val('');
    return result;
}
*/

chrome.browserAction.onClicked.addListener(function() {
    chrome.windows.create({
        url: 'popup.html',
        width: 660,
        height: 500,
        focused: true,
        type: 'popup'
    });
});