let urlContainer = document.getElementById("url-container");
let addBtn = document.getElementById("add-url");

chrome.storage.sync.get("urls", function (data) {
  data.urls.forEach(addUrlInput);
});

urlContainer.onkeyup = (element) => {
  let children = urlContainer.children;
  let urls = [];
  for (let i = 0; i < children.length; i++) {
    urls.push(children[i].value);
  }
  chrome.storage.sync.set({ urls: urls }, () => {
    console.log("urls are " + urls);
  });
};

addBtn.onclick = (element) => {
  addUrlInput("");
};

function addUrlInput(url) {
  let newUrl = document.createElement("input");
  newUrl.placeholder = "Enter Banner URL";
  newUrl.value = url;
  urlContainer.append(newUrl);
}
