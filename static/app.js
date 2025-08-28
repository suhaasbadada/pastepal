// Local cache key
const KEY = 'snippets_cache_v1';

function loadCache() {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

function saveCache(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

async function fetchSnippets() {
  // first render local cache
  let cached = loadCache();
  if (cached.length) render(cached);

  // then sync with backend
  const res = await fetch('/snippets');
  const data = await res.json();
  saveCache(data);
  render(data);
}

async function addSnippet() {
  let text = document.getElementById('newText').value.trim();
  if (!text) return;
  const res = await fetch('/snippets', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  document.getElementById('newText').value = '';
  saveCache(data);
  render(data);
}

async function deleteSnippet(id) {
  const res = await fetch('/snippets/' + id, { method: 'DELETE' });
  const data = await res.json();
  saveCache(data);
  render(data);
}

function copyText(txt) {
  navigator.clipboard.writeText(txt);
  alert('Copied: ' + txt);
}

function render(list) {
  let container = document.getElementById('list');
  container.innerHTML = '';
  list.forEach(item => {
    let div = document.createElement('div');
    div.className = 'snippet';
    div.innerHTML = `<pre>${item.text}</pre>` +
                    `<button onclick="copyText(\\\"${item.text.replace(/\"/g,'\\\\\\\"')}\\\")">Copy</button>` +
                    `<button onclick="deleteSnippet('${item.id}')">Delete</button>`;
    container.appendChild(div);
  });
}

fetchSnippets();
