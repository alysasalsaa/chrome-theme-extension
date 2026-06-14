# ChromaTheme — Chrome Extension

A customizable Chrome theme extension with night mode and accessibility filters for color blindness support.

## Features

- 🎨 **Custom Theme Colors** — Set your own background, text, link, and accent colors
- ✨ **Theme Presets** — 6 built-in presets (Dark, Ocean, Forest, Sunset, Purple, Light)
- 🌙 **Night Mode** — Auto-enables between 8PM–6AM with adjustable opacity and color
- ♿ **Accessibility Filters** — Support for color blindness (Protanopia, Deuteranopia, Tritanopia), Grayscale, and High Contrast
- 💾 **Persistent Settings** — All settings saved with Chrome Storage API
- ⏰ **Auto Night Mode** — Background service worker checks time every minute

## Tech Stack

- HTML + CSS + JavaScript
- Chrome Extension APIs (`chrome.storage`, `chrome.tabs`, `chrome.alarms`)
- Manifest V3
- Background Service Worker
- Content Scripts

## Installation

1. Clone this repo
   ```bash
   git clone https://github.com/alysasalsaa/chrome-theme-extension.git
   ```
2. Open Chrome → go to `chrome://extensions`
3. Enable **Developer Mode** (top right toggle)
4. Click **Load unpacked**
5. Select the `chrome-theme-extension` folder
6. Pin the extension from the puzzle icon 🧩 in the toolbar

## How to Use

### Theme Presets
Click any preset button to instantly apply a color theme to all pages.

### Custom Colors
Pick your own colors for background, text, links, and accent — then click **Apply Theme**.

### Night Mode
Toggle night mode manually or let it auto-enable between **8PM – 6AM**.
Adjust the overlay opacity and color to your preference.

### Accessibility Filters
Choose a color blindness filter:
| Filter | Description |
|--------|-------------|
| Normal | No filter applied |
| Protanopia | Red-green color blindness (red deficiency) |
| Deuteranopia | Red-green color blindness (green deficiency) |
| Tritanopia | Blue-yellow color blindness |
| Grayscale | Full grayscale mode |
| High Contrast | Increased contrast and brightness |

## Project Structure

```
chrome-theme-extension/
├── manifest.json          # Extension config (Manifest V3)
├── popup/
│   ├── popup.html         # Extension popup UI
│   ├── popup.js           # Popup logic & Chrome API calls
│   └── popup.css          # Popup styles
├── background/
│   └── service-worker.js  # Auto night mode scheduler
└── content/
    └── content.js         # Injects theme & filters into pages
```

## How It Works

1. **popup.js** sends messages to `content.js` via `chrome.tabs.sendMessage`
2. **content.js** injects CSS into every page to apply themes and filters
3. **service-worker.js** uses `chrome.alarms` to check the time every minute for auto night mode
4. All settings are persisted using `chrome.storage.sync`
