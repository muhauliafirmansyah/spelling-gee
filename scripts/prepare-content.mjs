import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      currentCell = '';
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentCell += char;
    }
  }
  
  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
      rows.push(currentRow);
    }
  }
  
  return rows;
}

function safeJsonParse(str, fallback = []) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn('JSON parse error on:', str);
    return fallback;
  }
}

console.log('Preparing content and copying assets...');

// 1. Process school-words.csv
const wordsCsvPath = path.join(rootDir, 'content', 'school-words.csv');
const wordsRaw = fs.readFileSync(wordsCsvPath, 'utf8');
const wordsRows = parseCSV(wordsRaw);
const [wordsHeader, ...wordsData] = wordsRows;

const words = wordsData.map(row => {
  const [
    word,
    context_sentence,
    indonesian_distractors,
    english_distractors,
    indonesian_translation,
    arrange_chunks,
    arrange_chunks_indonesian_distractors,
    arrange_chunks_english_distractors,
    arrange_letters_indonesian_distractors,
    arrange_letters_english_distractors,
    image_path,
    image_alt,
    image_requires_context
  ] = row;

  return {
    word: word.trim(),
    context_sentence: context_sentence.trim(),
    indonesian_distractors: safeJsonParse(indonesian_distractors),
    english_distractors: safeJsonParse(english_distractors),
    indonesian_translation: indonesian_translation.trim(),
    arrange_chunks: safeJsonParse(arrange_chunks),
    arrange_chunks_indonesian_distractors: safeJsonParse(arrange_chunks_indonesian_distractors),
    arrange_chunks_english_distractors: safeJsonParse(arrange_chunks_english_distractors),
    arrange_letters_indonesian_distractors: safeJsonParse(arrange_letters_indonesian_distractors),
    arrange_letters_english_distractors: safeJsonParse(arrange_letters_english_distractors),
    image_path: image_path ? image_path.trim() : `assets/words/${word.trim().toLowerCase()}.svg`,
    image_alt: image_alt ? image_alt.trim() : word.trim(),
    image_requires_context: image_requires_context === 'true'
  };
});

console.log(`Parsed ${words.length} school words.`);

// 2. Process tricky-parts.csv
const trickyCsvPath = path.join(rootDir, 'content', 'tricky-parts.csv');
const trickyRaw = fs.readFileSync(trickyCsvPath, 'utf8');
const trickyRows = parseCSV(trickyRaw);
const [trickyHeader, ...trickyData] = trickyRows;

const trickyParts = trickyData.map(row => {
  const [
    trick_id,
    word,
    set_id,
    pattern_id,
    template,
    answer,
    indonesian_distractors,
    english_distractors,
    context_required,
    explanation
  ] = row;

  return {
    trick_id: trick_id.trim(),
    word: word.trim(),
    set_id: set_id.trim(),
    pattern_id: pattern_id.trim(),
    template: template.trim(),
    answer: answer !== undefined ? answer : '',
    indonesian_distractors: safeJsonParse(indonesian_distractors),
    english_distractors: safeJsonParse(english_distractors),
    context_required: context_required === 'true',
    explanation: explanation ? explanation.trim() : ''
  };
});

console.log(`Parsed ${trickyParts.length} tricky parts.`);

// 3. Process course.json
const coursePath = path.join(rootDir, 'content', 'course.json');
const course = JSON.parse(fs.readFileSync(coursePath, 'utf8'));

// 4. Process audio-manifest.json if exists
let audioManifest = null;
const audioManifestPath = path.join(rootDir, 'content', 'audio-manifest.json');
if (fs.existsSync(audioManifestPath)) {
  audioManifest = JSON.parse(fs.readFileSync(audioManifestPath, 'utf8'));
  console.log('Loaded audio manifest.');
}

// 5. Ensure output directory
const srcDataDir = path.join(rootDir, 'src', 'data');
fs.mkdirSync(srcDataDir, { recursive: true });

const contentOutput = {
  words,
  trickyParts,
  course,
  audioManifest
};

fs.writeFileSync(
  path.join(srcDataDir, 'content.json'),
  JSON.stringify(contentOutput, null, 2),
  'utf8'
);
console.log('Wrote src/data/content.json');

// 6. Copy assets/words to public/assets/words
const publicWordsDir = path.join(rootDir, 'public', 'assets', 'words');
fs.mkdirSync(publicWordsDir, { recursive: true });

const assetsWordsDir = path.join(rootDir, 'assets', 'words');
if (fs.existsSync(assetsWordsDir)) {
  const files = fs.readdirSync(assetsWordsDir);
  let copied = 0;
  for (const file of files) {
    if (file.endsWith('.svg')) {
      fs.copyFileSync(
        path.join(assetsWordsDir, file),
        path.join(publicWordsDir, file)
      );
      copied++;
    }
  }
  console.log(`Copied ${copied} SVGs to public/assets/words/`);
}

console.log('Content preparation complete!');

