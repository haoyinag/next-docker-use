const path = require('path');
const eslintCmd = (files) =>
  `eslint --max-warnings=0 --fix ${files.map(f => `"${path.relative(process.cwd(), f)}"`).join(' ')}`;

module.exports = {
  'src/**/*.{ts,tsx,js,jsx}': [eslintCmd],
  '*.{json,md,css,scss}': ['prettier -w'],
};
