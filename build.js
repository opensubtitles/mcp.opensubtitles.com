#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make the main entry point executable
const mainFile = path.join(__dirname, 'dist', 'index.js');
if (fs.existsSync(mainFile)) {
  const content = fs.readFileSync(mainFile, 'utf8');
  if (!content.startsWith('#!/usr/bin/env node')) {
    fs.writeFileSync(mainFile, '#!/usr/bin/env node\n' + content);
  }
  
  // Make executable on Unix systems
  try {
    fs.chmodSync(mainFile, '755');
  } catch (err) {
    // Ignore chmod errors on Windows
  }
  
  console.log('Build post-processing completed successfully');
} else {
  console.error('Main file not found:', mainFile);
  process.exit(1);
}