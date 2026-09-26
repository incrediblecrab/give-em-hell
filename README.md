# give-em-hell

![npm version](https://img.shields.io/npm/v/give-em-hell) ![MLoT](https://img.shields.io/badge/MLoT-ai-blue)

give-em-hell is a Node.js CLI for counting em dashes, en dashes and hyphens across a codebase. It is published on npm as [`give-em-hell`](https://www.npmjs.com/package/give-em-hell) version 1.5.1, matching this repository.

![Demo](https://raw.githubusercontent.com/incrediblecrab/mlot-developer-media/main/gifs/give-em-hell.gif)

**Objective:** give maintainers a quick count of dash characters in code and documentation so they can spot accidental typographic substitutions or audit writing style.

**Inputs:** Node.js and a directory to scan; the CLI can also take extra exclude patterns and a maximum file size.

**Files:**

- [`index.js`](index.js): the CLI implementation and scanner
- [`CHANGELOG.md`](CHANGELOG.md): release notes
- [`PRODUCTION_CHECKLIST.md`](PRODUCTION_CHECKLIST.md): package readiness checklist
- [`package.json`](package.json): npm metadata, scripts and the `give-em-hell` bin mapping

**Try it:** `npm install -g give-em-hell`, then `give-em-hell . --no-progress`, or run the checked-out copy with `node index.js --help`.

## CLI reference

`give-em-hell [directory] [options]` scans the supplied directory, using the current working directory when no directory is supplied.

Options verified against `index.js`:

- `-e, --exclude <patterns...>` adds simple directory or path patterns to skip.
- `--no-progress` disables progress updates while scanning.
- `--max-size <mb>` sets the maximum file size in megabytes; the default is `10`, and valid values are greater than `0` and no more than `1000`.
- `-V, --version` prints the package version.

## What it scans

The scanner reads code and text extensions including JavaScript, TypeScript, Python, Java, C, C++, C#, Ruby, Go, Rust, Swift, Kotlin, PHP, HTML, CSS, Vue, Svelte, Markdown, plain text, JSON, XML and YAML. It skips binary files, files over the configured size limit, hidden directories, symbolic-link directories, and common generated or dependency directories such as `node_modules`, `.git`, `dist`, `build`, `coverage`, `.next`, `.cache`, `vendor` and `bower_components`.

## Output

The CLI prints the scanned path, optional exclude patterns, counts for em dash, en dash and hyphen, the total count, files processed, files skipped, errors when any occur, and elapsed time.

## Output example

```text
Scanning for dashes in: /Users/you/project

Files processed: 150 | Skipped: 12 | Errors: 0

Dash Statistics:
Em Dash: 253
En Dash: 23,452
Hyphen: 352
Total: 24,057

Files processed: 150
Files skipped: 12
Time taken: 2.34s
```

## What gets scanned

### Included file types

`.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.java`, `.c`, `.cpp`, `.h`, `.hpp`, `.cs`, `.rb`, `.go`, `.rs`, `.swift`, `.kt`, `.php`, `.html`, `.css`, `.scss`, `.sass`, `.less`, `.vue`, `.svelte`, `.md`, `.txt`, `.json`, `.xml`, `.yaml` and `.yml`.

### Excluded directories

- `node_modules`
- `.git`
- `dist`
- `build`
- `coverage`
- `.next`
- `.cache`
- `vendor`
- `bower_components`
- hidden directories, which start with `.`

## Development

```bash
npm install
npm run lint
```

The current `test` script is the default placeholder and exits with an error; no automated test suite is configured in this repository.

## Links

- [npm package](https://www.npmjs.com/package/give-em-hell)
- [Demo video](https://youtu.be/JhQnjArz95I)
- [MLoT product page](https://mlot.ai/give-em-hell/)
- [Privacy policy](https://mlot.ai/privacy)
- [Issues](https://github.com/incrediblecrab/give-em-hell/issues)
- Publisher: [Max's Lab of Things](https://mlot.ai/)

## License

MIT. See [`LICENSE`](LICENSE).
