chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({ 'url': chrome.extension.getURL('home.html'), 'selected': true });
});