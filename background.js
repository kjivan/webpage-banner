let host = "";

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get("url", (data) => {
    if (data.url) {
      host = data.url;
      console.log("onInstalled" + host);
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
  host = value.url.newValue;
  console.log("onchange" + host);
});

chrome.webNavigation.onCompleted.addListener(
  (details) => {
    console.log("onCompleted" + host);
    chrome.tabs.executeScript(details.tabId, {
      file: "banner.js",
    });
  },
  {
    url: [
      {
        hostContains: host,
      },
    ],
  }
);
