const fs = require('fs');
const path = require('path');

const publicPhotosDir = path.resolve(__dirname, '..', 'public', 'photos');
const manifestPath = path.join(publicPhotosDir, 'manifest.json');

function readManifest() {
  if (!fs.existsSync(manifestPath)) {
    console.error('No manifest.json found at', manifestPath);
    process.exit(2);
  }
  try {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read/parse manifest.json:', e.message);
    process.exit(2);
  }
}

function readFiles() {
  if (!fs.existsSync(publicPhotosDir)) {
    console.error('No public/photos directory at', publicPhotosDir);
    process.exit(2);
  }
  return fs.readdirSync(publicPhotosDir).filter(f => f !== 'manifest.json');
}

const manifest = readManifest();
const files = readFiles();

const filesLower = files.map(f => f.toLowerCase());
const manifestLower = manifest.map(f => f.toLowerCase());

const missing = manifest.filter(f => !files.includes(f));
const missingByCase = manifest.filter(f => !files.includes(f) && filesLower.includes(f.toLowerCase()));
const extra = files.filter(f => !manifest.includes(f) && !manifestLower.includes(f.toLowerCase()));

console.log('public/photos files:', files);
console.log('manifest entries:', manifest);

if (missing.length === 0 && extra.length === 0) {
  console.log('\nOK: manifest and files match exactly.');
  process.exit(0);
}

if (missing.length > 0) {
  console.log('\nMissing entries (exact match not found):');
  missing.forEach(m => console.log('  -', m));
}

if (missingByCase.length > 0) {
  console.log('\nFiles exist but with different casing:');
  missingByCase.forEach(m => {
    const found = files.find(f => f.toLowerCase() === m.toLowerCase());
    console.log('  - manifest:', m, ' file:', found);
  });
}

if (extra.length > 0) {
  console.log('\nExtra files in public/photos not listed in manifest:');
  extra.forEach(e => console.log('  -', e));
}

process.exit(1);
