let urlContainer = document.getElementById("url-container");
let addBtn = document.getElementById("add-url");

const urlIndex = 0;
const removeBtnIndex = 1;

chrome.storage.sync.get("urls", function (data) {
  data.urls.forEach(addUrlInput);
});

window.onblur = () => {
  saveUrls();
};

addBtn.onclick = (element) => {
  addUrlInput("");
};

function saveUrls() {
  let children = urlContainer.children;
  let urls = [];
  for (let i = 0; i < children.length; i++) {
    urls.push(children[i].children[urlIndex].value);
  }
  chrome.storage.sync.set({ urls: urls }, () => {
  });
}

function addUrlInput(url) {
  let newUrl = document.createElement("input");
  newUrl.placeholder = "Enter Banner URL";
  newUrl.value = url;

  let removeBtn = document.createElement("button");
  removeBtn.append(document.createTextNode("X"));
  removeBtn.onclick = (event) => {
    event.target.parentElement.remove();
    saveUrls();
  };

  let div = document.createElement("div");
  div.append(newUrl);
  div.append(removeBtn);

  urlContainer.append(div);
}
