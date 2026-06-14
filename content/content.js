let overlay = null
let styleEl = null

// Load saved settings on page load
chrome.storage.sync.get(['theme', 'nightMode', 'nightOpacity', 'nightColor', 'filter'], (data) => {
  if (data.theme)     applyTheme(data.theme)
  if (data.nightMode) applyNightMode(true, data.nightOpacity || 40, data.nightColor || '#ff6b00')
  if (data.filter)    applyFilter(data.filter)
})

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.type) {
    case 'APPLY_THEME':  applyTheme(msg.theme); break
    case 'NIGHT_MODE':   applyNightMode(msg.enabled, msg.opacity, msg.color); break
    case 'APPLY_FILTER': applyFilter(msg.filter); break
    case 'RESET':        reset(); break
  }
})

function applyTheme(theme) {
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'chroma-theme'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = `
    html, body { background-color: ${theme.bg} !important; color: ${theme.text} !important; }
    a { color: ${theme.link} !important; }
    button, input[type="submit"] { background-color: ${theme.accent} !important; }
  `
}

function applyNightMode(enabled, opacity, color) {
  if (!overlay) {
    overlay = document.createElement('div')
    overlay.id = 'chroma-night-overlay'
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none;
      z-index: 2147483647;
      mix-blend-mode: multiply;
      transition: opacity 0.5s;
    `
    document.body.appendChild(overlay)
  }
  if (enabled) {
    overlay.style.backgroundColor = color || '#ff6b00'
    overlay.style.opacity = (opacity || 40) / 100
  } else {
    overlay.style.opacity = '0'
  }
}

function applyFilter(filter) {
  const filters = {
    none:          'none',
    protanopia:    'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0\'/></filter></svg>#f")',
    deuteranopia:  'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0\'/></filter></svg>#f")',
    tritanopia:    'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0\'/></filter></svg>#f")',
    grayscale:     'grayscale(100%)',
    'high-contrast': 'contrast(150%) brightness(110%)',
  }
  document.documentElement.style.filter = filters[filter] || 'none'
}

function reset() {
  if (styleEl) { styleEl.remove(); styleEl = null }
  if (overlay)  { overlay.remove(); overlay = null }
  document.documentElement.style.filter = 'none'
}