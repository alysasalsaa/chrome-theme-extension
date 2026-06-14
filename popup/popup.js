const PRESETS = [
  { name: 'Dark', emoji: '🌑', bg: '#0f172a', text: '#f8fafc', link: '#6366f1', accent: '#22c55e' },
  { name: 'Ocean', emoji: '🌊', bg: '#0c1445', text: '#e0f2fe', link: '#38bdf8', accent: '#06b6d4' },
  { name: 'Forest', emoji: '🌿', bg: '#0a1f0a', text: '#dcfce7', link: '#22c55e', accent: '#86efac' },
  { name: 'Sunset', emoji: '🌅', bg: '#1a0a00', text: '#fff7ed', link: '#f97316', accent: '#fbbf24' },
  { name: 'Purple', emoji: '💜', bg: '#1a0033', text: '#f5f3ff', link: '#a78bfa', accent: '#e879f9' },
  { name: 'Light', emoji: '☀️', bg: '#f8fafc', text: '#0f172a', link: '#6366f1', accent: '#22c55e' },
]

/* ── Load saved settings ── */
chrome.storage.sync.get(['theme','nightMode','nightOpacity','nightColor','filter'], (data) => {
  if (data.theme) {
    document.getElementById('c-bg').value     = data.theme.bg     || '#1a1a2e'
    document.getElementById('c-text').value   = data.theme.text   || '#ffffff'
    document.getElementById('c-link').value   = data.theme.link   || '#6366f1'
    document.getElementById('c-accent').value = data.theme.accent || '#22c55e'
  }
  if (data.nightMode) {
    document.getElementById('night-toggle').checked = true
    document.getElementById('night-controls').classList.add('visible')
  }
  if (data.nightOpacity) {
    document.getElementById('night-opacity').value = data.nightOpacity
    document.getElementById('opacity-val').textContent = data.nightOpacity + '%'
  }
  if (data.nightColor) {
    document.getElementById('night-color').value = data.nightColor
  }
  if (data.filter) {
    document.querySelectorAll('.access-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === data.filter)
    })
  }
})

/* ── Render presets ── */
const presetsEl = document.getElementById('presets')
PRESETS.forEach(p => {
  const btn = document.createElement('button')
  btn.className = 'preset-btn'
  btn.style.background = p.bg
  btn.style.color = p.text
  btn.innerHTML = `${p.emoji}<br>${p.name}`
  btn.addEventListener('click', () => {
    document.getElementById('c-bg').value     = p.bg
    document.getElementById('c-text').value   = p.text
    document.getElementById('c-link').value   = p.link
    document.getElementById('c-accent').value = p.accent
    applyTheme(p)
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
  })
  presetsEl.appendChild(btn)
})

/* ── Night mode toggle ── */
document.getElementById('night-toggle').addEventListener('change', (e) => {
  const on = e.target.checked
  document.getElementById('night-controls').classList.toggle('visible', on)
  chrome.storage.sync.set({ nightMode: on })
  sendToTabs({ type: 'NIGHT_MODE', enabled: on, opacity: getNightOpacity(), color: getNightColor() })
})

document.getElementById('night-opacity').addEventListener('input', (e) => {
  document.getElementById('opacity-val').textContent = e.target.value + '%'
  chrome.storage.sync.set({ nightOpacity: e.target.value })
  if (document.getElementById('night-toggle').checked) {
    sendToTabs({ type: 'NIGHT_MODE', enabled: true, opacity: e.target.value, color: getNightColor() })
  }
})

document.getElementById('night-color').addEventListener('input', (e) => {
  chrome.storage.sync.set({ nightColor: e.target.value })
  if (document.getElementById('night-toggle').checked) {
    sendToTabs({ type: 'NIGHT_MODE', enabled: true, opacity: getNightOpacity(), color: e.target.value })
  }
})

/* ── Apply custom theme ── */
document.getElementById('btn-apply').addEventListener('click', () => {
  const theme = {
    bg:     document.getElementById('c-bg').value,
    text:   document.getElementById('c-text').value,
    link:   document.getElementById('c-link').value,
    accent: document.getElementById('c-accent').value,
  }
  applyTheme(theme)
})

function applyTheme(theme) {
  chrome.storage.sync.set({ theme })
  sendToTabs({ type: 'APPLY_THEME', theme })
}

/* ── Accessibility filters ── */
document.querySelectorAll('.access-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter
    document.querySelectorAll('.access-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    chrome.storage.sync.set({ filter })
    sendToTabs({ type: 'APPLY_FILTER', filter })
  })
})

/* ── Reset ── */
document.getElementById('btn-reset').addEventListener('click', () => {
  chrome.storage.sync.clear()
  sendToTabs({ type: 'RESET' })
  document.getElementById('night-toggle').checked = false
  document.getElementById('night-controls').classList.remove('visible')
  document.querySelectorAll('.access-btn').forEach(b => b.classList.remove('active'))
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'))
})

/* ── Helpers ── */
function getNightOpacity() { return document.getElementById('night-opacity').value }
function getNightColor()   { return document.getElementById('night-color').value }

function sendToTabs(msg) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, msg)
  })
}