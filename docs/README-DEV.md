# ChainMove Documentation Development

This README provides instructions for building, testing, and contributing to the ChainMove documentation.

## Prerequisites

- Node.js 14.x or later
- npm 6.x or later (comes with Node.js)
- Git
- [Calibre](https://calibre-ebook.com/download) (for PDF/EPUB export)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/obiajulu-gif/chain_move.git
   cd chain_move/docs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Building the Documentation

### Development Server
Start a local development server with live reload:
```bash
npm run serve
```
The documentation will be available at `http://localhost:4000`

### Build for Production
Build the static HTML documentation:
```bash
npm run build
```
The built files will be in the `_book` directory.

### Export to Other Formats

#### PDF
```bash
npm run build:pdf
```

#### EPUB
```bash
npm run build:epub
```

#### MOBI
```bash
npm run build:mobi
```

#### All Formats
```bash
npm run build:all
```

## Documentation Structure

```
docs/
├── README.md              # Main documentation entry point
├── SUMMARY.md             # GitBook table of contents
├── book.json              # GitBook configuration
├── styles/                # Custom CSS styles
├── introduction/          # Introduction and overview
├── getting-started/       # Setup and installation guides
├── user-guide/            # End-user documentation
│   ├── drivers/           # Driver-specific guides
│   └── investors/         # Investor-specific guides
├── technical/             # Technical documentation
│   ├── api/               # API reference
│   ├── smart-contracts/   # Smart contract docs
│   └── architecture.md    # System architecture
└── resources/             # Additional resources
    ├── faq.md             # Frequently asked questions
    └── changelog.md       # Release notes
```

## Writing Guidelines

### Markdown Formatting
- Use ATX-style headers (with #)
- Use fenced code blocks with language specification
- Use relative links for internal documentation
- Add alt text for all images
- Keep lines under 100 characters

### Images and Assets
- Place images in `images/` directory
- Use descriptive filenames
- Optimize images for web
- Recommended formats: PNG for screenshots, SVG for diagrams

### Adding New Pages
1. Add the page to `SUMMARY.md`
2. Create the markdown file in the appropriate directory
3. Use proper front matter if needed
4. Update any related documentation

## Linting and Formatting

### Lint Markdown
```bash
npm run lint
```

### Format Markdown
```bash
npm run format
```

## Versioning

Documentation follows [Semantic Versioning](https://semver.org/):
- MAJOR: Incompatible API changes
- MINOR: Added functionality in a backward-compatible manner
- PATCH: Backward-compatible bug fixes

## Deployment

The documentation is automatically deployed when changes are pushed to the `main` branch.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This documentation is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For documentation-related issues, please open an issue in the repository.

For product support, contact support@chainmove.io
