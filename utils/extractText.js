const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
let xlsx;
try {
  xlsx = require('xlsx');
} catch (e) {
  xlsx = null;
}

// Read a file and return plain text regardless of extension
async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }
  if (ext === '.docx') {
    const data = await mammoth.extractRawText({ path: filePath });
    return data.value;
  }
  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf8');
  }
  if (ext === '.xlsx') {
    if (!xlsx) return '';
    const workbook = xlsx.readFile(filePath);
    let text = '';
    workbook.SheetNames.forEach(name => {
      text += xlsx.utils.sheet_to_csv(workbook.Sheets[name]);
    });
    return text;
  }
  return '';
}

module.exports = { extractText };
