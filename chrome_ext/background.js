chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    if(changeInfo.status === 'complete')
    {
        chrome.tabs.executeScript(tabId, {code:"alert(1111);"});
    }
});