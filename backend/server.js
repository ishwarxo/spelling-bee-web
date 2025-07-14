const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
app.use(cors());
app.use(express.json());

async function loadDictionary() {
  try {
    const data = await fs.readFile('words.json', 'utf8');
    const words = JSON.parse(data);
    return new Set(words.filter(word => word.length >= 4 && !/^[A-Z]/.test(word)).map(word => word.toLowerCase()));
  } catch (error) {
    console.error('Error loading dictionary:', error);
    return new Set(['able', 'bale', 'lane', 'lone', 'noble', 'notable', 'table', 'tale']);
  }
}

function validateInput(letters, centralLetter) {
  if (!/^[a-zA-Z]{7}$/.test(letters)) {
    return { valid: false, message: 'Please enter exactly 7 alphabetic letters.' };
  }
  if (new Set(letters.toLowerCase()).size !== 7) {
    return { valid: false, message: 'Letters must be unique (no duplicates).' };
  }
  if (!/^[a-zA-Z]$/.test(centralLetter)) {
    return { valid: false, message: 'Central letter must be a single alphabetic character.' };
  }
  if (!letters.toLowerCase().includes(centralLetter.toLowerCase())) {
    return { valid: false, message: 'Central letter must be one of the 7 letters.' };
  }
  return { valid: true, message: '' };
}

function isValidWord(word, letters, centralLetter) {
  if (word.length < 4 || !word.includes(centralLetter)) return false;
  return [...word].every(char => letters.includes(char));
}

function isPangram(word, letters) {
  return letters.split('').every(letter => word.includes(letter));
}

function calculateScore(word, isPangram) {
  const score = word.length === 4 ? 1 : word.length - 3;
  return isPangram ? score + 7 : score;
}

function getRank(score, maxScore) {
  if (maxScore === 0) return 'Beginner';
  const percentage = (score / maxScore) * 100;
  if (percentage >= 100) return 'Queen Bee';
  if (percentage >= 70) return 'Genius';
  if (percentage >= 50) return 'Amazing';
  if (percentage >= 40) return 'Great';
  if (percentage >= 25) return 'Nice';
  if (percentage >= 15) return 'Solid';
  if (percentage >= 8) return 'Good';
  if (percentage >= 5) return 'Moving Up';
  if (percentage >= 2) return 'Good Start';
  return 'Beginner';
}

app.get('/', (req, res) => {
  res.send('API is running. Use POST /solve to solve words.');
});

app.post('/solve', async (req, res) => {
  const { letters, centralLetter } = req.body;
  const validation = validateInput(letters, centralLetter);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  const dictionary = await loadDictionary();
  const lettersLower = letters.toLowerCase();
  const centralLower = centralLetter.toLowerCase();

  const validWords = [];
  const pangrams = [];
  for (const word of dictionary) {
    if (isValidWord(word, lettersLower, centralLower)) {
      validWords.push(word);
      if (isPangram(word, lettersLower)) {
        pangrams.push(word);
      }
    }
  }

  const wordsByLength = {};
  for (const word of validWords) {
    const length = word.length;
    if (!wordsByLength[length]) wordsByLength[length] = [];
    wordsByLength[length].push(word);
  }

  let totalScore = 0;
  let maxScore = 0;
  for (const word of validWords) {
    const score = calculateScore(word, pangrams.includes(word));
    totalScore += score;
    maxScore += score;
  }

  res.json({
    validWords,
    pangrams,
    wordsByLength,
    totalScore,
    maxScore,
    rank: getRank(totalScore, maxScore),
    wordCount: validWords.length,
    pangramCount: pangrams.length,
    percentage: maxScore ? (totalScore / maxScore * 100).toFixed(1) : 0
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));