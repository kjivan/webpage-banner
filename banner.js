chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ bannerColor: "#3aa757" }, function () {
    console.log("The color is green.");
  });
});
