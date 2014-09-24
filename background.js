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


chrome.browserAction.onClicked.addListener(function() {
    chrome.windows.create({
        url: 'popup.html',
        width: 660,
        height: 500,
        focused: true,
        type: 'popup'
    });
});*/

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.system.display.getInfo(function(info) {
    var width = info[0].workArea.width;
    var height = info[0].workArea.height;    

    chrome.app.window.create('popup.html', {
      "id": "图床",
      "bounds": {
        width: width,
        height: height
      }
    }, function(win) {
      win.onClosed.addListener(function() {
        console.log("On closing the window");
      });
    });
  });  
});