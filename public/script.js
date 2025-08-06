const uploadForm = document.getElementById('uploadForm');
const actions = document.getElementById('actions');
const analyzeBtn = document.getElementById('analyzeBtn');
const generateBtn = document.getElementById('generateBtn');
const goalInput = document.getElementById('goalInput');
const result = document.getElementById('result');
let fileId = null;

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('fileInput');
  if (!fileInput.files.length) return;
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  result.textContent = 'Uploading...';
  try {
    const resp = await fetch('/upload', { method: 'POST', body: formData });
    const data = await resp.json();
    if (resp.ok) {
      fileId = data.fileId;
      result.textContent = 'File uploaded. Ready for analysis or generation.';
      actions.classList.remove('d-none');
    } else {
      result.textContent = data.error || 'Upload failed';
    }
  } catch (err) {
    result.textContent = 'Upload error';
  }
});

analyzeBtn.addEventListener('click', async () => {
  if (!fileId) return;
  result.textContent = 'Analyzing...';
  try {
    const resp = await fetch('/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId }),
    });
    const data = await resp.json();
    if (resp.ok) {
      result.textContent = data.analysis;
    } else {
      result.textContent = data.error || 'Analysis failed';
    }
  } catch (err) {
    result.textContent = 'Analysis error';
  }
});

generateBtn.addEventListener('click', async () => {
  if (!fileId) return;
  const goal = goalInput.value.trim();
  if (!goal) return;
  result.textContent = 'Generating...';
  try {
    const resp = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, goal }),
    });
    const data = await resp.json();
    if (resp.ok) {
      result.textContent = data.result;
    } else {
      result.textContent = data.error || 'Generation failed';
    }
  } catch (err) {
    result.textContent = 'Generation error';
  }
});
