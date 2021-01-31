let url = document.getElementById("url");

chrome.storage.sync.get("url", function (data) {
  url.value = data.url;
});

url.onblur = (element) => {
  let url = element.target.value;
  chrome.storage.sync.set({ url: url }, () => {
    console.log("url is " + url);
  });
};
