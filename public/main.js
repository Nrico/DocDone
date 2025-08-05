let fileId;

const uploadForm = document.getElementById('uploadForm');
const analyzeBtn = document.getElementById('analyzeBtn');
const generateBtn = document.getElementById('generateBtn');

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('fileInput');
  if (!fileInput.files.length) return;
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  const res = await fetch('/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (data.fileId) {
    fileId = data.fileId;
    document.getElementById('analysisSection').classList.remove('hidden');
    document.getElementById('generateSection').classList.remove('hidden');
  }
});

analyzeBtn.addEventListener('click', async () => {
  if (!fileId) return;
  const res = await fetch('/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId }),
  });
  const data = await res.json();
  document.getElementById('analysisResult').textContent = data.analysis || data.error;
});

generateBtn.addEventListener('click', async () => {
  if (!fileId) return;
  const goal = document.getElementById('goalInput').value;
  const res = await fetch('/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId, goal }),
  });
  const data = await res.json();
  document.getElementById('generateResult').textContent = data.result || data.error;
});
