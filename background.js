/**
 * Webpage Banner - Background Service Worker (Manifest V3)
 */

const DEFAULT_SELECTOR = "body";
const DEFAULT_TEXT = "Production Environment";
const DEFAULT_BG_COLOR = "#E53935";

// Initialize default storage on installation
chrome.runtime.onInstalled.addListener(async () => {
  try {
    const data = await chrome.storage.sync.get("bannerConfigs");
    if (!data.bannerConfigs || !Array.isArray(data.bannerConfigs) || data.bannerConfigs.length === 0) {
      await chrome.storage.sync.set({
        bannerConfigs: [
          {
            url: "",
            locationSelector: DEFAULT_SELECTOR,
            bannerText: DEFAULT_TEXT,
            bgColor: DEFAULT_BG_COLOR,
          },
        ],
      });
    }
  } catch (error) {
    console.error("[Webpage Banner] Initialization error:", error);
  }
});

/**
 * Calculates high-contrast text color (#111111 or #FFFFFF) for a given hex background color.
 *
 * @param {string} hexColor Hex color string (e.g. "#E53935").
 * @returns {string} Text color hex.
 */
function getContrastColor(hexColor) {
  if (!hexColor || typeof hexColor !== "string") return "#FFFFFF";
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#111111" : "#FFFFFF";
}

/**
 * Top-level listener for navigation completion.
 * In MV3, listeners must be registered synchronously at the top level
 * so the service worker responds properly when awakened by browser events.
 */
chrome.webNavigation.onCompleted.addListener(async (details) => {
  // Only inject in the top-level main frame
  if (details.frameId !== 0 || !details.url) {
    return;
  }

  // Ignore internal/browser URLs
  if (
    details.url.startsWith("chrome://") ||
    details.url.startsWith("chrome-extension://") ||
    details.url.startsWith("edge://") ||
    details.url.startsWith("about:")
  ) {
    return;
  }

  try {
    const data = await chrome.storage.sync.get("bannerConfigs");
    const bannerConfigs = data.bannerConfigs || [];

    // Find any configurations matching the current URL
    const matchingConfigs = bannerConfigs.filter(
      (config) => config.url && config.url.trim().length > 0 && details.url.includes(config.url.trim())
    );

    if (matchingConfigs.length === 0) {
      return;
    }

    // Most specific rule wins: sort by longest matching URL string descending
    matchingConfigs.sort((a, b) => b.url.trim().length - a.url.trim().length);
    const bestConfig = matchingConfigs[0];
    const bgColor = bestConfig.bgColor || DEFAULT_BG_COLOR;
    const textColor = bestConfig.textColor || getContrastColor(bgColor);

    await chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      func: injectBanner,
      args: [
        {
          selector: bestConfig.locationSelector || DEFAULT_SELECTOR,
          text: bestConfig.bannerText || DEFAULT_TEXT,
          bgColor: bgColor,
          textColor: textColor,
        },
      ],
    });
  } catch (error) {
    console.error("[Webpage Banner] Failed to inject banner:", error);
  }
});

/**
 * Injected banner function executed in the context of the webpage.
 *
 * NOTE: This function is serialized and executed in the webpage context via
 * chrome.scripting.executeScript. Serialized functions lose their closure scope
 * and CANNOT access module-level constants (e.g. DEFAULT_BG_COLOR). Any fallbacks
 * must be either passed in via the options argument or defined inline here.
 *
 * @param {Object} options Configuration options for the banner.
 */
function injectBanner(options) {
  const BANNER_ID = "__webpage_banner_extension__";

  // Prevent duplicate banners on the same page
  if (document.getElementById(BANNER_ID)) {
    return;
  }

  const banner = document.createElement("div");
  banner.id = BANNER_ID;
  banner.style.position = "sticky";
  banner.style.top = "0px";
  banner.style.left = "0px";
  banner.style.zIndex = "2147483647";
  banner.style.width = "100%";
  banner.style.boxSizing = "border-box";
  banner.style.padding = "8px 16px";
  banner.style.fontSize = "16px";
  banner.style.fontWeight = "bold";
  banner.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  banner.style.textAlign = "center";
  banner.style.backgroundColor = options.bgColor || "#E53935";
  banner.style.color = options.textColor || "#FFFFFF";
  banner.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.25)";
  banner.style.display = "flex";
  banner.style.justifyContent = "center";
  banner.style.alignItems = "center";
  banner.style.lineHeight = "1.4";
  banner.textContent = options.text || "Production Environment";

  // Find target parent container based on selector
  let parentElement = null;
  const selector = (options.selector || "").trim();

  if (selector) {
    try {
      parentElement = document.querySelector(selector);
    } catch {
      console.warn("[Webpage Banner] Invalid CSS selector:", selector);
    }
  }

  // Fallback to body or documentElement if target element not found
  if (!parentElement) {
    parentElement = document.body || document.documentElement;
  }

  if (parentElement) {
    parentElement.insertBefore(banner, parentElement.firstChild);
  }
}
