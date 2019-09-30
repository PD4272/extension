/* $Id$ */

chrome.browserAction.onClicked.addListener( function (tab) {
	chrome.tabs.create({'url': chrome.extension.getURL("html/zwplugin.html")}, function(tab) {
    // Tab opened.
		
  })
 
});