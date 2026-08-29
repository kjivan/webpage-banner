/**
 * Webpage Banner - Content script injection template / standalone fallback
 */
(() => {
  const BANNER_ID = "__webpage_banner_extension__";
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
  banner.style.backgroundColor = "#E53935";
  banner.style.color = "#FFFFFF";
  banner.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.25)";
  banner.style.display = "flex";
  banner.style.justifyContent = "center";
  banner.style.alignItems = "center";
  banner.style.lineHeight = "1.4";
  banner.textContent = "Production Environment";

  const target = document.body || document.documentElement;
  if (target) {
    target.insertBefore(banner, target.firstChild);
  }
})();

