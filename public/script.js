const fileInput = document.getElementById('file');
const suggestionsDiv = document.getElementById('suggestions');
let fileId = null;
let selected = null;

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  if (!file) return;
  const form = new FormData();
  form.append('file', file);
  const uploadRes = await fetch('/api/upload', { method: 'POST', body: form });
  const uploadData = await uploadRes.json();
  fileId = uploadData.fileId;

  const analyzeRes = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId })
  });
  const analyzeData = await analyzeRes.json();
  document.getElementById('summary').innerText = analyzeData.summary;
  suggestionsDiv.innerHTML = '';
  analyzeData.suggestions.forEach(s => {
    const btn = document.createElement('button');
    btn.textContent = `${s.name} ($${s.cost})`;
    btn.className = 'bg-gray-200 px-2 py-1 rounded';
    btn.addEventListener('click', () => {
      selected = s.name;
      Array.from(suggestionsDiv.children).forEach(c => c.classList.remove('bg-blue-500', 'text-white'));
      btn.classList.add('bg-blue-500', 'text-white');
    });
    suggestionsDiv.appendChild(btn);
  });
});

const generateBtn = document.getElementById('generate');
generateBtn.addEventListener('click', async () => {
  if (!fileId || !selected) return;
  const notes = document.getElementById('notes').value;
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId, task: selected, notes })
  });
  const data = await res.json();
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = data.result + `\n\nCost: $${data.cost}`;
  const blob = new Blob([data.result], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${selected}.txt`;
  link.textContent = 'Download result';
  resultDiv.appendChild(document.createElement('br'));
  resultDiv.appendChild(link);
});
