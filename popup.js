let url = document.getElementById("url");

chrome.storage.sync.get("urls", function (data) {
  url.value = data.urls[0];
});

url.onblur = (element) => {
  let url = element.target.value;
  chrome.storage.sync.set({ urls: [url] }, () => {
    console.log("url is " + url);
  });
};
