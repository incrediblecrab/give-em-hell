# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and GitHub Copilot CLI when working in this repository.

give-em-hell is a Node.js CLI that counts em dashes, en dashes and hyphens across a directory tree. It is published to npm as `give-em-hell`. The repository is public.

## Commands

```bash
npm install
node index.js . --no-progress     # run the checked-out copy
node index.js --help
```

There are no tests and no linter: `npm test` deliberately exits 1 and `npm run lint` only prints a message. Check a change by running the CLI against a directory with known counts.

## Structure

Everything is in `index.js` (about 300 lines): `commander` option parsing, a recursive walk that skips hidden, symlinked and common generated directories (`node_modules`, `dist`, `build`, and so on), and a streaming `Transform` that counts the three characters per file so large files are not read into memory. The scanned extensions and skipped directory names are lists near the top of the file. `--max-size` is validated to the range above 0 and at most 1000 MB.

## Releasing

`files` in `package.json` is the allowlist (`index.js`, `README.md`, `LICENSE`). The README states the published version, so bump it with `package.json` and `CHANGELOG.md`. `PRODUCTION_CHECKLIST.md` is a dated readiness audit, not a live checklist; the release steps are in `../README.md`.
