chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get("urls", (data) => {
    if (data.urls) {
      updateListener(data.urls);
      console.log("onInstalled: " + data.urls);
      return;
    }
    chrome.storage.sync.set({ urls: ["jivan.cc"] }, function () {
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
  updateListener(value.urls.newValue);
  console.log("onchange" + value.urls.newValue);
});

function updateListener(urls) {
  chrome.webNavigation.onCompleted.removeListener(addBanner);

  chrome.webNavigation.onCompleted.addListener(addBanner, {
    url: urls.map((url) => Object.assign({}, { hostContains: url })),
  });
}

function addBanner(details) {
  chrome.tabs.executeScript(details.tabId, {
    file: "banner.js",
  });
}
