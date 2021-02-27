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
  chrome.storage.sync.get("bannerConfigs", (data) => {
    let querySelector = data.bannerConfigs.filter((config) =>
      details.url.includes(config.url)
    )[0].locationSelector;
    console.log(querySelector);
    console.log(typeof querySelector);
    console.log(bannerJs(querySelector));
    chrome.tabs.executeScript(details.tabId, {
      // file: "banner.js",
      code: bannerJs(querySelector),
    });
  });
}

function bannerJs(querySelector) {
  return `
var d = document.createElement("div");
d.style.position = "sticky";
d.style.top = "0px";
d.style.zIndex = "2147483647";
d.style.width = "100%";
d.style.height = "30px";
d.style.padding = "2px";
d.style.fontSize = "20px";
d.style.textAlign = "left";
d.style.backgroundColor = "#E53935";
d.style.color = "#333333";
d.append(document.createTextNode("Production Environment"));
let bannerParent = document.querySelector("${querySelector}");
console.log(bannerParent);
bannerParent.insertBefore(d, bannerParent.firstChild);
 `;
}
