# Give 'Em Hell 🔥

![npm version](https://img.shields.io/npm/v/give-em-hell)
![MLoT](https://img.shields.io/badge/MLoT-ai-blue)

Find and count em dashes (—), en dashes (–), and hyphens (-) in your codebase.

![Demo](https://raw.githubusercontent.com/incrediblecrab/mlot-developer-media/main/gifs/give-em-hell.gif)

## Installation

```bash
npm install -g give-em-hell
```

Or use directly with npx (no install needed):

```bash
npx give-em-hell
```

## Usage

```bash
# Scan current directory
give-em-hell

# Scan specific directory
give-em-hell /path/to/your/project

# Use with npx
npx give-em-hell /path/to/your/project
```

## Output Example

```
🔍 Scanning for dashes in: /Users/you/project

⏳ Files processed: 150 | Skipped: 12 | Errors: 0

📊 Dash Statistics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Em Dash (—): 253
En Dash (–): 23,452
Hyphen (-): 352
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 24,057

📁 Files processed: 150
⏭️  Files skipped: 12
⏱️  Time taken: 2.34s
```

## Features

- **Memory Efficient**: Streams files instead of loading them entirely into memory
- **Smart Filtering**: Automatically skips binary files and common non-code directories
- **Progress Tracking**: Real-time progress updates for large codebases
- **Safe Defaults**: 10MB file size limit and 50-level recursion depth limit
- **Error Resilient**: Continues processing even when individual files fail

## What Gets Scanned

### Included File Types
`.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.java`, `.c`, `.cpp`, `.h`, `.hpp`, `.cs`, `.rb`, `.go`, `.rs`, `.swift`, `.kt`, `.php`, `.html`, `.css`, `.scss`, `.sass`, `.less`, `.vue`, `.svelte`, `.md`, `.txt`, `.json`, `.xml`, `.yaml`, `.yml`

### Excluded Directories
- `node_modules`
- `.git`
- `dist`
- `build`
- `coverage`
- `.next`
- `.cache`
- `vendor`
- `bower_components`
- Hidden directories (starting with `.`)

## Why?

Typography matters! This tool helps you:
- Ensure consistency in dash usage across your codebase
- Find accidental em/en dash usage in code
- Audit documentation and comments for proper dash usage
- Have fun with typography statistics

## Resources

- 📺 [Watch Demo Video](https://youtu.be/JhQnjArz95I)
- 🌐 [Visit MLoT Page](https://mlot.ai/give-em-hell/)
- 🔒 [Privacy Policy](https://mlot.ai/privacy)

## Publisher

**Max's Lab of Things**
Visit [mlot.ai](https://mlot.ai/)

## License

MIT
