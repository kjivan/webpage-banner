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

  urls = urls
    .filter((url) => url.trim().length !== 0)
    .map((url) => {
      return { urlContains: url };
    });

  if (urls.length === 0) {
    return;
  }

  chrome.webNavigation.onCompleted.addListener(addBanner, {
    url: urls,
  });
}

function addBanner(details) {
  chrome.tabs.executeScript(details.tabId, {
    file: "banner.js",
  });
}
