let urlContainer = document.getElementById("url-container");
let addBtn = document.getElementById("add-url");

const urlClass = "url";
const locationSelectorClass = "locationSelector";
const defaultSelector = "body";

chrome.storage.sync.get("bannerConfigs", function (data) {
  data.bannerConfigs.forEach(addInputs);
});

window.onblur = () => {
  saveBannerConfigs();
};

addBtn.onclick = () => {
  addInputs({ url: "", locationSelector: defaultSelector });
};

function saveBannerConfigs() {
  let children = urlContainer.children;
  let bannerConfigs = [];
  for (let i = 0; i < children.length; i++) {
    bannerConfigs.push({
      url: children[i].querySelector("." + urlClass).value,
      locationSelector: children[i].querySelector("." + locationSelectorClass).value,
    });
  }
  chrome.storage.sync.set({ bannerConfigs: bannerConfigs }, () => {});
}

function addInputs({ url, locationSelector }) {
  let newUrl = document.createElement("input");
  newUrl.placeholder = "Banner URL";
  newUrl.classList.add(urlClass);
  newUrl.value = url;

  let newLocationSelector = document.createElement("input");
  newLocationSelector.placeholder = "Location CSS Selector";
  newLocationSelector.classList.add(locationSelectorClass);
  newLocationSelector.value = locationSelector;

  let removeBtn = document.createElement("button");
  removeBtn.append(document.createTextNode("X"));
  removeBtn.onclick = (event) => {
    event.target.parentElement.remove();
    saveBannerConfigs();
  };

  let div = document.createElement("div");
  div.append(newUrl);
  div.append(newLocationSelector);
  div.append(removeBtn);

  urlContainer.append(div);
}
