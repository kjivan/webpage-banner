# Webpage Banner (Chrome Extension)

A lightweight Google Chrome Extension (Manifest V3) that injects customizable warning or identification banners onto designated web pages (e.g. Production vs Staging environments).

## Features

- **Manifest V3 Compliant**: Built on modern Chrome extension standards using background Service Workers and the `chrome.scripting` API.
- **Custom URL Targeting**: Add banner rules matching specific domain names or URL keywords.
- **Target Container Selection**: Choose where the banner attaches using standard CSS selectors (defaults to `body`).
- **Customizable Appearance**: Configure custom banner text and background colors with automatic contrast-adjusted text color.
- **Auto-Sync & Save**: Configuration automatically synchronizes across Chrome instances using `chrome.storage.sync`.
- **Light & Dark Mode Support**: Responsive popup interface with automatic dark mode support.

## Installation

1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** in the top-right toggle.
4. Click **Load unpacked** in the top-left corner.
5. Select the `webpage-banner` directory.

## Usage

1. Click the **Webpage Banner** icon in the Chrome toolbar.
2. Click **+ Add Banner Rule** to create a new rule.
3. Configure your settings:
   - **URL Contains**: The substring or domain of the URL to match (e.g. `prod.mycompany.com` or `github.com`).
   - **CSS Selector**: Target element where the banner will be inserted as the first child (defaults to `body`).
   - **Banner Text**: The warning/identifier label (e.g. `PRODUCTION - DO NOT TOUCH`).
   - **Color**: Select your banner background color.
4. Changes are automatically saved.
5. Navigate to a matching webpage to see your sticky banner displayed at the top.

