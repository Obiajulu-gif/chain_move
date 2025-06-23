#!/usr/bin/env node

/**
 * ChainMove Documentation Builder
 * 
 * This script builds the ChainMove documentation in multiple formats:
 * - HTML (for web)
 * - PDF (for printing and offline reading)
 * - Word (for editing and distribution)
 * - EPUB (for e-readers)
 * 
 * Usage:
 *   node build.js [options]
 * 
 * Options:
 *   --format=FORMAT    Build specific format (html, pdf, word, epub, all)
 *   --output=DIR       Output directory (default: _book)
 *   --version          Show version
 *   --help             Show help
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const { program } = require('commander');
const pkg = require('./package.json');
const pdfConfig = require('./pdf-config');

// Command line options
program
  .version(pkg.version)
  .option('--format <type>', 'Build specific format (html, pdf, word, epub, all)', 'all')
  .option('--output <dir>', 'Output directory', '_book')
  .option('--verbose', 'Enable verbose output', false)
  .parse(process.argv);

const options = program.opts();
const formats = options.format === 'all' ? ['html', 'pdf', 'word', 'epub'] : [options.format];
const outputDir = path.resolve(process.cwd(), options.output);
const tempDir = path.resolve(process.cwd(), '.temp');
const verbose = options.verbose;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

/**
 * Log a message to the console
 * @param {string} message - The message to log
 * @param {string} [level=info] - The log level (info, success, warn, error, debug)
 */
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] `;
  
  switch (level.toLowerCase()) {
    case 'success':
      console.log(`${colors.green}${colors.bright}✓${colors.reset} ${prefix}${message}`);
      break;
    case 'warn':
      console.warn(`${colors.yellow}${colors.bright}⚠${colors.reset} ${prefix}${message}`);
      break;
    case 'error':
      console.error(`${colors.red}${colors.bright}✗${colors.reset} ${prefix}${message}`);
      break;
    case 'debug':
      if (verbose) {
        console.log(`${colors.dim}${prefix}${message}${colors.reset}`);
      }
      break;
    case 'info':
    default:
      console.log(`${colors.blue}${colors.bright}i${colors.reset} ${prefix}${message}`);
  }
}

/**
 * Execute a shell command
 * @param {string} command - The command to execute
 * @param {Object} [options] - Options for execSync
 * @returns {string} - The command output
 */
function exec(command, options = {}) {
  try {
    log(`Executing: ${command}`, 'debug');
    const result = execSync(command, {
      stdio: verbose ? 'inherit' : 'pipe',
      encoding: 'utf8',
      ...options
    });
    return result || '';
  } catch (error) {
    log(`Command failed: ${command}`, 'error');
    if (!verbose && error.stderr) {
      log(error.stderr.toString(), 'error');
    }
    process.exit(1);
  }
}

/**
 * Clean the output directory
 */
async function clean() {
  log('Cleaning output directory...');
  
  try {
    await fs.remove(outputDir);
    await fs.mkdirp(outputDir);
    log('Output directory cleaned', 'success');
  } catch (error) {
    log(`Failed to clean output directory: ${error.message}`, 'error');
    process.exit(1);
  }
}

/**
 * Install GitBook plugins
 */
function installPlugins() {
  log('Installing GitBook plugins...');
  
  try {
    // Check if GitBook is installed
    exec('gitbook --version');
    
    // Install plugins
    exec('gitbook install');
    log('GitBook plugins installed', 'success');
  } catch (error) {
    log('GitBook is not installed. Installing GitBook...', 'warn');
    exec('npm install -g gitbook-cli');
    exec('gitbook install');
    log('GitBook and plugins installed', 'success');
  }
}

/**
 * Build HTML documentation
 */
function buildHtml() {
  log('Building HTML documentation...');
  
  try {
    exec(`gitbook build . ${outputDir}`);
    log('HTML documentation built successfully', 'success');
  } catch (error) {
    log(`Failed to build HTML documentation: ${error.message}`, 'error');
    process.exit(1);
  }
}

/**
 * Build PDF documentation
 */
function buildPdf() {
  log('Building PDF documentation...');
  
  try {
    // Check if Calibre is installed (required for PDF/EPUB export)
    exec('ebook-convert --version');
    
    // Create PDF
    exec(`gitbook pdf . ${path.join(outputDir, 'chainmove-documentation.pdf')}`);
    log('PDF documentation built successfully', 'success');
  } catch (error) {
    log('Calibre is not installed. PDF export requires Calibre.', 'warn');
    log('Please install Calibre from https://calibre-ebook.com/download', 'warn');
    
    if (confirm('Do you want to continue without PDF export?')) {
      log('Skipping PDF export', 'warn');
    } else {
      process.exit(1);
    }
  }
}

/**
 * Build Word documentation
 */
function buildWord() {
  log('Building Word documentation...');
  
  try {
    // Check if Pandoc is installed
    exec('pandoc --version');
    
    // Create a temporary directory
    fs.mkdirpSync(tempDir);
    
    // First build HTML
    exec(`gitbook build . ${tempDir}`);
    
    // Convert HTML to Word using Pandoc
    exec(`pandoc ${path.join(tempDir, 'index.html')} \
      -o ${path.join(outputDir, 'chainmove-documentation.docx')} \
      --toc \
      --toc-depth=3 \
      --reference-doc=${path.join(__dirname, 'templates', 'reference.docx')} \
      --self-contained \
      --metadata title="ChainMove Documentation" \
      --metadata author="ChainMove Team" \
      --metadata date="${new Date().toISOString()}"`);
    
    // Clean up
    fs.removeSync(tempDir);
    
    log('Word documentation built successfully', 'success');
  } catch (error) {
    log('Pandoc is not installed. Word export requires Pandoc.', 'warn');
    log('Please install Pandoc from https://pandoc.org/installing.html', 'warn');
    
    if (confirm('Do you want to continue without Word export?')) {
      log('Skipping Word export', 'warn');
    } else {
      process.exit(1);
    }
  }
}

/**
 * Build EPUB documentation
 */
function buildEpub() {
  log('Building EPUB documentation...');
  
  try {
    // Check if Calibre is installed (required for EPUB export)
    exec('ebook-convert --version');
    
    // Create EPUB
    exec(`gitbook epub . ${path.join(outputDir, 'chainmove-documentation.epub')}`);
    log('EPUB documentation built successfully', 'success');
  } catch (error) {
    log('Calibre is not installed. EPUB export requires Calibre.', 'warn');
    log('Please install Calibre from https://calibre-ebook.com/download', 'warn');
    
    if (confirm('Do you want to continue without EPUB export?')) {
      log('Skipping EPUB export', 'warn');
    } else {
      process.exit(1);
    }
  }
}

/**
 * Prompt for confirmation
 * @param {string} message - The confirmation message
 * @returns {boolean} - True if confirmed, false otherwise
 */
function confirm(message) {
  if (process.env.CI) {
    return false;
  }
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    readline.question(`${message} (y/N) `, (answer) => {
      readline.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Main function
 */
async function main() {
  log(`ChainMove Documentation Builder v${pkg.version}`);
  log(`Building formats: ${formats.join(', ')}`);
  log(`Output directory: ${outputDir}`);
  
  try {
    // Clean output directory
    await clean();
    
    // Install GitBook plugins
    installPlugins();
    
    // Build requested formats
    for (const format of formats) {
      switch (format) {
        case 'html':
          buildHtml();
          break;
        case 'pdf':
          buildPdf();
          break;
        case 'word':
          await buildWord();
          break;
        case 'epub':
          buildEpub();
          break;
        default:
          log(`Unknown format: ${format}`, 'warn');
      }
    }
    
    log('Documentation build completed successfully!', 'success');
    log(`Output files are available in: ${outputDir}`);
  } catch (error) {
    log(`Build failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run the main function
main();
