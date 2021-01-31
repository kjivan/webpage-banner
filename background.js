chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get("color", (data) => {
    if (data.color) return;
    chrome.storage.sync.set({ color: "#3aa757" }, function () {
      console.log("The color is green.");
    });
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.webNavigation.onCompleted.addListener(
  function (details) {
    chrome.tabs.executeScript(details.tabId, {
      file: "banner.js",
    });
  },
  {
    url: [
      {
        // Runs on example.com, example.net, but also example.foo.com
        hostContains: "jivan.cc",
      },
    ],
  }
);
