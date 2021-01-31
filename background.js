chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get("url", (data) => {
    if (data.url) {
      updateListener(data.url);
      console.log("onInstalled" + data.url);
      return;
    }
    chrome.storage.sync.set({ url: "jivan.cc" }, function () {
      console.log("Defaulting url to jivan.cc");
    });
  });

  applyToAllPages();
});

function applyToAllPages() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
}

chrome.storage.onChanged.addListener((value) => {
  updateListener(value.url.newValue);
  console.log("onchange" + value.url.newValue);
});

function updateListener(url) {
  chrome.webNavigation.onCompleted.removeListener(addBanner);
  chrome.webNavigation.onCompleted.addListener(addBanner, {
    url: [
      {
        hostContains: url,
      },
    ],
  });
}

function addBanner(details) {
  chrome.tabs.executeScript(details.tabId, {
    file: "banner.js",
  });
}
