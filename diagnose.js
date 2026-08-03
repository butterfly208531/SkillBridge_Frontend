const fs = require('fs');
const path = 'app/[locale]/courses/[slug]/ApplicationForm/page.tsx';
const c = fs.readFileSync(path, 'utf8');
const lines = c.split('\n');

// Print lines 360-383 to see exact current state
console.log('=== Lines 360-383 ===');
for (let i = 359; i <= 382; i++) {
  console.log((i+1) + ': ' + JSON.stringify(lines[i]));
}
