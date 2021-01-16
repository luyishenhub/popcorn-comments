/*chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
        console.log("The color is green.");
    });
});*/

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it
  // like send the new url to contentscripts.js
  if (changeInfo.url) {
    //alert('updated from background ' + changeInfo.url);
    chrome.tabs.executeScript(tab.ib, {
		file: 'inject.js'
	});
    /*chrome.tabs.sendMessage(tabId, {
      message: "hello!",
      url: changeInfo.url,
    });*/
  }
});
