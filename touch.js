const fs = require('fs');
const path = 'app/[locale]/courses/[slug]/ApplicationForm/page.tsx';
const c = fs.readFileSync(path, 'utf8');
// Add and remove a trailing newline to bump mtime
fs.writeFileSync(path, c.trimEnd() + '\n', 'utf8');
console.log('touched', path);
