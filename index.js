#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createReadStream } = require('fs');
const { pipeline } = require('stream');
const { Transform } = require('stream');
const { Command } = require('commander');
const packageJson = require('./package.json');

const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', 'coverage', '.next', '.cache', 'vendor', 'bower_components'];
const CODE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.c', '.cpp', '.h', '.hpp', '.cs', '.rb', '.go', '.rs', '.swift', '.kt', '.php', '.html', '.css', '.scss', '.sass', '.less', '.vue', '.svelte', '.md', '.txt', '.json', '.xml', '.yaml', '.yml'];
let userExcludes = [];
// MAX_FILE_SIZE is now set dynamically from command line options
const CHUNK_SIZE = 64 * 1024; // 64KB chunks for streaming
let MAX_FILE_SIZE = 10 * 1024 * 1024; // Default 10MB, will be overridden by CLI

const EM_DASH = '—';
const EN_DASH = '–';
const HYPHEN = '-';

let stats = {
  emDash: 0,
  enDash: 0,
  hyphen: 0,
  filesProcessed: 0,
  filesSkipped: 0,
  errors: 0
};

let lastProgressUpdate = Date.now();
const PROGRESS_UPDATE_INTERVAL = 1000; // Update every second

function isCodeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return CODE_EXTENSIONS.includes(ext);
}

function shouldIgnoreDir(dirName, fullPath) {
  if (IGNORE_DIRS.includes(dirName) || dirName.startsWith('.')) {
    return true;
  }
  
  // Check user-provided exclude patterns
  for (const pattern of userExcludes) {
    if (dirName === pattern || fullPath.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

function isBinaryFile(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(512);
    const bytesRead = fs.readSync(fd, buffer, 0, 512, 0);
    fs.closeSync(fd);
    
    if (bytesRead === 0) return false;
    
    // Check for null bytes (common in binary files)
    for (let i = 0; i < bytesRead; i++) {
      if (buffer[i] === 0) return true;
    }
    
    // Check for high percentage of non-text characters
    let nonTextChars = 0;
    for (let i = 0; i < bytesRead; i++) {
      const byte = buffer[i];
      // Allow all UTF-8 continuation bytes (0x80-0xBF)
      if (byte < 0x20 && byte !== 0x09 && byte !== 0x0A && byte !== 0x0D) {
        nonTextChars++;
      } else if (byte > 0x7E && byte < 0x80) {
        // Non-UTF8 high ASCII
        nonTextChars++;
      }
    }
    
    return nonTextChars / bytesRead > 0.3;
  } catch (error) {
    return true; // Assume binary if we can't read
  }
}

function createDashCounter() {
  return new Transform({
    decodeStrings: false,
    transform(chunk, encoding, callback) {
      try {
        // chunk is already a string when encoding is set to utf8 in createReadStream
        const text = typeof chunk === 'string' ? chunk : chunk.toString('utf8');
        
        for (const char of text) {
          if (char === EM_DASH) {
            stats.emDash++;
          } else if (char === EN_DASH) {
            stats.enDash++;
          } else if (char === HYPHEN) {
            stats.hyphen++;
          }
        }
        callback();
      } catch (error) {
        // Continue processing even if UTF-8 decode fails
        callback();
      }
    }
  });
}

function countDashesInFile(filePath) {
  return new Promise((resolve) => {
    try {
      const fileStats = fs.statSync(filePath);
      
      // Skip files that are too large
      if (fileStats.size > MAX_FILE_SIZE) {
        stats.filesSkipped++;
        resolve();
        return;
      }
      
      // Skip binary files
      if (isBinaryFile(filePath)) {
        stats.filesSkipped++;
        resolve();
        return;
      }
      
      const readStream = createReadStream(filePath, { 
        encoding: 'utf8',
        highWaterMark: CHUNK_SIZE,
        emitClose: true,
        autoClose: true
      });
      
      const counter = createDashCounter();
      
      readStream.on('error', (error) => {
        stats.errors++;
        resolve();
      });
      
      pipeline(readStream, counter, (error) => {
        if (error) {
          stats.errors++;
        } else {
          stats.filesProcessed++;
        }
        resolve();
      });
      
    } catch (error) {
      stats.errors++;
      resolve();
    }
  });
}

function updateProgress() {
  if (!options.progress || isShuttingDown) return;
  
  const now = Date.now();
  if (now - lastProgressUpdate > PROGRESS_UPDATE_INTERVAL) {
    process.stdout.write(`\r⏳ Files processed: ${stats.filesProcessed} | Skipped: ${stats.filesSkipped} | Errors: ${stats.errors}`);
    lastProgressUpdate = now;
  }
}

async function scanDirectory(dirPath, depth = 0) {
  // Prevent extremely deep recursion
  if (depth > 50) {
    return;
  }
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!shouldIgnoreDir(item, fullPath) && !stat.isSymbolicLink()) {
            await scanDirectory(fullPath, depth + 1);
          }
        } else if (stat.isFile() && isCodeFile(fullPath)) {
          await countDashesInFile(fullPath);
          updateProgress();
        }
      } catch (error) {
        stats.errors++;
      }
    }
  } catch (error) {
    stats.errors++;
  }
}

let isShuttingDown = false;

function handleShutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  process.stdout.write('\r' + ' '.repeat(80) + '\r');
  console.log('\n\n⚠️  Scan interrupted by user');
  process.exit(130); // Standard exit code for SIGINT
}

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

async function main() {
  const program = new Command();
  
  program
    .name('give-em-hell')
    .description('Find and count em dashes, en dashes, and hyphens in your codebase')
    .version(packageJson.version)
    .argument('[directory]', 'directory to scan', process.cwd())
    .option('-e, --exclude <patterns...>', 'additional glob patterns to exclude')
    .option('--no-progress', 'disable progress updates')
    .option('--max-size <mb>', 'maximum file size in MB', '10')
    .parse();
  
  const options = program.opts();
  const targetDir = program.args[0] || process.cwd();
  
  // Validate max size
  const maxSizeMB = parseFloat(options.maxSize);
  if (isNaN(maxSizeMB) || maxSizeMB <= 0 || maxSizeMB > 1000) {
    console.error('❌ Error: Invalid max-size value. Must be between 1 and 1000 MB.');
    process.exit(1);
  }
  
  MAX_FILE_SIZE = maxSizeMB * 1024 * 1024;
  userExcludes = options.exclude || [];
  
  // Sanitize and validate directory path
  const sanitizedDir = path.resolve(targetDir);
  
  // Verify the directory exists
  if (!fs.existsSync(sanitizedDir)) {
    console.error(`❌ Error: Directory "${sanitizedDir}" does not exist.`);
    process.exit(1);
  }
  
  try {
    const dirStats = fs.statSync(sanitizedDir);
    if (!dirStats.isDirectory()) {
      console.error(`❌ Error: "${sanitizedDir}" is not a directory.`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error: Cannot access "${sanitizedDir}": ${error.message}`);
    process.exit(1);
  }
  
  console.log(`🔍 Scanning for dashes in: ${sanitizedDir}\n`);
  
  if (userExcludes.length > 0) {
    console.log(`🚫 Excluding patterns: ${userExcludes.join(', ')}\n`);
  }
  
  const startTime = Date.now();
  
  await scanDirectory(sanitizedDir);
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Clear the progress line
  if (options.progress && !isShuttingDown) {
    process.stdout.write('\r' + ' '.repeat(80) + '\r');
  }
  
  console.log('\n📊 Dash Statistics:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Em Dash (—): ${stats.emDash.toLocaleString()}`);
  console.log(`En Dash (–): ${stats.enDash.toLocaleString()}`);
  console.log(`Hyphen (-): ${stats.hyphen.toLocaleString()}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Total: ${(stats.emDash + stats.enDash + stats.hyphen).toLocaleString()}`);
  console.log();
  console.log(`📁 Files processed: ${stats.filesProcessed.toLocaleString()}`);
  console.log(`⏭️  Files skipped: ${stats.filesSkipped.toLocaleString()}`);
  if (stats.errors > 0) {
    console.log(`⚠️  Errors encountered: ${stats.errors}`);
  }
  console.log(`⏱️  Time taken: ${duration}s`);
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});