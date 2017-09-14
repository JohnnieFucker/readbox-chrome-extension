chrome.runtime.onConnect.addListener(function (port) {
    if (port.name === "readBox") {
        console.log('readBox init');
        port.onMessage.addListener(function (msg) {
            if (msg && msg.action && msg.action === "getDom") {
                port.postMessage({dom: $("body").html()});
            }
        });
    }

});