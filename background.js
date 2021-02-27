chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get("bannerConfigs", (data) => {
    if (data.bannerConfigs) {
      updateListener(data.bannerConfigs);
      return;
    }
    chrome.storage.sync.set(
      { bannerConfigs: [{ url: "", querySelector: "" }] },
      () => {}
    );
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
  updateListener(value.bannerConfigs.newValue);
});

function updateListener(bannerConfigs) {
  chrome.webNavigation.onCompleted.removeListener(addBanner);

  let urls = bannerConfigs.map((config) => config.url);

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
