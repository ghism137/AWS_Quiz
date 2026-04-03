const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/questions.js');
let rawData = fs.readFileSync(filePath, 'utf8');
// Use regex to locate exactly the ALL_Q array
const match = rawData.match(/const\s+ALL_Q\s*=\s*(\[\s*\{[\s\S]*?\}\s*\])\s*;/);
if (!match) {
  console.error("Could not find ALL_Q array in questions.js");
  process.exit(1);
}
const arrayString = match[1];

let questions = [];
try {
  questions = JSON.parse(arrayString);
} catch (error) {
  console.error("Error parsing JSON:", error);
  process.exit(1);
}

// Normalize AWS Dataset
questions = questions.map((q, idx) => {
  // 1. Fix answer to be an array
  if (typeof q.answer === 'string') {
    // some answer can be "A, B" or "A B"
    let ans = q.answer.toUpperCase().replace(/[^A-Z]/g, '');
    q.answer = ans.split('');
  }

  // 2. Fix topics to topic
  if (q.topics && Array.isArray(q.topics)) {
    q.topic = q.topics[0] || "General";
    delete q.topics;
  } else if (!q.topic) {
    q.topic = "General";
  }

  // 3. Fix missing options
  if (!q.options || Object.keys(q.options).length === 0) {
    q.options = {};
    // Try to extract from question text if it has A. B. C. D. 
    // Usually missing options implies a parse bug. Let's look for "A.", "B.", "C.", "D."
    const regex = /A\.\s*(.*?)\s+B\.\s*(.*?)\s+C\.\s*(.*?)\s+D\.\s*(.*)/i;
    const match = q.question.match(regex);
    if (match) {
      q.options["A"] = match[1];
      q.options["B"] = match[2];
      q.options["C"] = match[3];
      q.options["D"] = match[4];
      q.question = q.question.replace(regex, '').trim();
    } else {
      // Fallback: Just mark as missing
      q.options = { "A": "Missing Option", "B": "Missing Option" };
    }
  }

  // 4. Ensure explanation exists
  if (!q.explanation) {
    q.explanation = "Bản thân đây là dữ liệu import thô, chưa có giải thích chi tiết.";
  }

  // 5. Ensure level exists
  if (!q.level) {
    q.level = "NB";
  }

  return q;
});

// Re-write to the file
const finalOutput = `// AWS Quiz Questions Data\n// Normalized Structure\nconst ALL_Q = ${JSON.stringify(questions, null, 2)};\n`;

fs.writeFileSync(filePath, finalOutput, 'utf8');
console.log("normalization complete.");
