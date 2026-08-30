/**
 * Webpage Banner - Popup Script (Manifest V3)
 */

const urlContainer = document.getElementById("url-container");
const addBtn = document.getElementById("add-url");
const statusIndicator = document.getElementById("save-status");

const DEFAULT_CONFIG = {
  url: "",
  locationSelector: "body",
  bannerText: "Production Environment",
  bgColor: "#E53935",
};

let saveTimeout = null;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await chrome.storage.sync.get("bannerConfigs");
    const bannerConfigs = data.bannerConfigs || [];

    if (bannerConfigs.length === 0) {
      addBannerRule(DEFAULT_CONFIG);
    } else {
      bannerConfigs.forEach((config) => addBannerRule(config));
    }
  } catch (error) {
    console.error("[Webpage Banner] Error loading settings:", error);
    addBannerRule(DEFAULT_CONFIG);
  }

  renderEmptyStateIfNeeded();
});

addBtn.addEventListener("click", () => {
  addBannerRule(DEFAULT_CONFIG);
  triggerAutoSave();
});

// Auto-save when user modifies any input in the form
urlContainer.addEventListener("input", () => {
  triggerAutoSave();
});

urlContainer.addEventListener("change", () => {
  triggerAutoSave();
});

window.addEventListener("blur", async () => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }
  await saveBannerConfigs();
  showStatus("Saved ✓");
  setTimeout(() => showStatus(""), 2000);
});

function triggerAutoSave() {
  showStatus("Saving...");
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    await saveBannerConfigs();
    saveTimeout = null;
    showStatus("Saved ✓");
    setTimeout(() => showStatus(""), 2000);
  }, 600);
}

function showStatus(text) {
  if (statusIndicator) {
    statusIndicator.textContent = text;
  }
}

async function saveBannerConfigs() {
  const cards = urlContainer.querySelectorAll(".rule-card");
  const bannerConfigs = [];

  cards.forEach((card) => {
    const urlInput = card.querySelector(".input-url");
    const selectorInput = card.querySelector(".input-selector");
    const textInput = card.querySelector(".input-text");
    const colorInput = card.querySelector(".input-color");

    const url = urlInput ? urlInput.value.trim() : "";
    const locationSelector = selectorInput && selectorInput.value.trim() ? selectorInput.value.trim() : "body";
    const bannerText = textInput && textInput.value.trim() ? textInput.value.trim() : "Production Environment";
    const bgColor = colorInput ? colorInput.value : "#E53935";

    bannerConfigs.push({
      url,
      locationSelector,
      bannerText,
      bgColor,
    });
  });

  try {
    await chrome.storage.sync.set({ bannerConfigs });
  } catch (error) {
    console.error("[Webpage Banner] Error saving configuration:", error);
  }
}

function renderEmptyStateIfNeeded() {
  const existingCards = urlContainer.querySelectorAll(".rule-card");
  let emptyState = document.getElementById("empty-state");

  if (existingCards.length === 0) {
    if (!emptyState) {
      emptyState = document.createElement("div");
      emptyState.id = "empty-state";
      emptyState.className = "empty-state";
      emptyState.textContent = "No banner rules yet. Click '+ Add Banner Rule' to create one.";
      urlContainer.appendChild(emptyState);
    }
  } else if (emptyState) {
    emptyState.remove();
  }
}

function addBannerRule(config) {
  const emptyState = document.getElementById("empty-state");
  if (emptyState) emptyState.remove();

  const card = document.createElement("div");
  card.className = "rule-card";

  // Top row: URL and Target CSS Selector
  const topRow = document.createElement("div");
  topRow.className = "rule-row";

  const urlGroup = document.createElement("div");
  urlGroup.className = "field-group";
  urlGroup.style.flex = "2";
  const urlLabel = document.createElement("label");
  urlLabel.textContent = "URL Contains";
  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.className = "input-url";
  urlInput.placeholder = "e.g. prod.mycompany.com";
  urlInput.value = config.url || "";
  urlGroup.append(urlLabel, urlInput);

  const selectorGroup = document.createElement("div");
  selectorGroup.className = "field-group";
  selectorGroup.style.flex = "1";
  const selectorLabel = document.createElement("label");
  selectorLabel.textContent = "CSS Selector";
  const selectorInput = document.createElement("input");
  selectorInput.type = "text";
  selectorInput.className = "input-selector";
  selectorInput.placeholder = "body";
  selectorInput.value = config.locationSelector || "body";
  selectorGroup.append(selectorLabel, selectorInput);

  topRow.append(urlGroup, selectorGroup);

  // Bottom row: Banner text, color picker, and delete button
  const bottomRow = document.createElement("div");
  bottomRow.className = "rule-row";

  const textGroup = document.createElement("div");
  textGroup.className = "field-group";
  textGroup.style.flex = "2";
  const textLabel = document.createElement("label");
  textLabel.textContent = "Banner Text";
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.className = "input-text";
  textInput.placeholder = "Production Environment";
  textInput.value = config.bannerText || "Production Environment";
  textGroup.append(textLabel, textInput);

  const colorGroup = document.createElement("div");
  colorGroup.className = "field-group";
  colorGroup.style.flex = "0 0 auto";
  const colorLabel = document.createElement("label");
  colorLabel.textContent = "Color";
  const colorInputWrapper = document.createElement("div");
  colorInputWrapper.className = "color-input-wrapper";
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.className = "input-color";
  colorInput.value = config.bgColor || "#E53935";
  colorInputWrapper.append(colorInput);
  colorGroup.append(colorLabel, colorInputWrapper);

  const removeBtn = document.createElement("button");
  removeBtn.className = "btn btn-danger";
  removeBtn.type = "button";
  removeBtn.title = "Delete rule";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => {
    card.remove();
    renderEmptyStateIfNeeded();
    triggerAutoSave();
  });

  bottomRow.append(textGroup, colorGroup, removeBtn);

  card.append(topRow, bottomRow);
  urlContainer.append(card);
}
