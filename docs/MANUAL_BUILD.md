****# Manual Build Process for ChainMove Documentation

This document provides step-by-step instructions for manually building the ChainMove documentation in various formats (HTML, PDF, Word, EPUB) without relying on the automated build script.

## Prerequisites

1. **Node.js and npm**
   - Install Node.js (v14 or later) from [nodejs.org](https://nodejs.org/)
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **GitBook CLI**
   ```bash
   npm install -g gitbook-cli
   gitbook --version
   ```

3. **Calibre (for PDF/EPUB export)**
   - Download and install from [calibre-ebook.com](https://calibre-ebook.com/)
   - Ensure `ebook-convert` is in your system PATH

4. **Pandoc (for Word export)**
   - Download and install from [pandoc.org](https://pandoc.org/installing.html)
   - Verify installation:
     ```bash
     pandoc --version
     ```

## Building HTML Documentation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Build HTML output:
   ```bash
   gitbook build . _book
   ```

3. Preview locally:
   ```bash
   gitbook serve
   ```
   Then open http://localhost:4000 in your browser.

## Building PDF Documentation

1. Ensure Calibre is installed and `ebook-convert` is in your PATH

2. Install the PDF plugin:
   ```bash
   gitbook pdf . ./chainmove-docs.pdf
   ```

   This will generate a PDF in the root directory.

## Building Word Documentation

1. First build the HTML version:
   ```bash
   gitbook build . _book
   ```

2. Convert HTML to DOCX using Pandoc:
   ```bash
   pandoc -s _book/index.html -o chainmove-docs.docx --reference-doc=templates/reference.docx
   ```

## Building EPUB Documentation

1. Ensure Calibre is installed

2. Build EPUB:
   ```bash
   gitbook epub . ./chainmove-docs.epub
   ```

## Troubleshooting

### Common Issues

1. **GitBook command not found**
   - Try installing GitBook locally:
     ```bash
     npm install gitbook-cli -g
     ```

2. **Error with ebook-convert**
   - Ensure Calibre is installed and `ebook-convert` is in your PATH
   - On Windows, you may need to add the Calibre installation directory to your PATH manually

3. **Pandoc not found**
   - Ensure Pandoc is installed and in your PATH
   - Restart your terminal/command prompt after installation

4. **Node.js version issues**
   - Use nvm (Node Version Manager) to manage Node.js versions
   - Ensure you're using Node.js v14 or later

## Manual Installation of Plugins

If the build fails due to missing plugins, install them manually:

```bash
gitbook install
```

## Cleaning Up

To clean up generated files:

```bash
# Remove build directory
rm -rf _book

# Remove installed node modules
rm -rf node_modules
```

## Alternative: Using Docker

If you're having environment issues, you can use Docker:

```bash
# Build the documentation in a container
docker run --rm -v "$PWD":/srv/gitbook fellah/gitbook gitbook build

# Or serve it interactively
docker run --rm -p 4000:4000 -v "$PWD":/srv/gitbook fellah/gitbook gitbook serve --port 4000
```

## Support

If you encounter any issues, please:
1. Check the [troubleshooting guide](./user-guide/troubleshooting.md)
2. Search the [GitHub issues](https://github.com/obiajulu-gif/chain_move/issues)
3. Open a new issue if your problem isn't already reported

---
*Last Updated: June 2025*
