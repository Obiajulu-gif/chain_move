# ChainMove Documentation Development

This README provides instructions for building, testing, and contributing to the ChainMove Docusaurus documentation.

## Prerequisites

- Node.js 18.x or later
- npm 8.x or later (comes with Node.js)
- Git
- Basic knowledge of Markdown and React (for advanced customization)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/obiajulu-gif/chain_move.git
   cd chain_move
   ```

2. **Switch to documentation branch**
   ```bash
   git checkout documentation
   ```

3. **Navigate to documentation directory**
   ```bash
   cd docs/chainmove-docs
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

## Development Workflow

### Development Server
Start a local development server with live reload:
```bash
npm start
```
The documentation will be available at `http://localhost:3000`

### Build for Production
Build the static documentation:
```bash
npm run build
```
The built files will be in the `build/` directory.

### Serve Production Build
Test the production build locally:
```bash
npm run serve
```

### Additional Commands

| Command | Description |
|---------|-------------|
| `npm start` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run serve` | Serve built files locally |
| `npm run clear` | Clear Docusaurus cache |
| `npm run typecheck` | TypeScript type checking |
| `npm run deploy` | Deploy to GitHub Pages (if configured) |

## Documentation Structure

The Docusaurus documentation follows this structure:

```
docs/chainmove-docs/
├── docs/                      # Main documentation content
│   ├── intro.md              # Introduction page
│   ├── getting-started/      # Setup and installation guides
│   │   ├── quick-start.md
│   │   ├── installation.md
│   │   └── configuration.md
│   ├── user-guide/           # End-user documentation
│   │   ├── drivers/          # Driver-specific guides
│   │   └── investors/        # Investor-specific guides
│   ├── technical/            # Technical documentation
│   │   ├── api/              # API reference
│   │   ├── smart-contracts/  # Smart contract docs
│   │   ├── frontend/         # Frontend development
│   │   ├── backend/          # Backend development
│   │   └── architecture.md   # System architecture
│   ├── smart-contracts/      # Smart contract documentation
│   ├── api/                  # API reference documentation
│   ├── introduction/         # Platform introduction
│   └── resources/            # Additional resources
│       ├── faq.md           # Frequently asked questions
│       ├── troubleshooting.md
│       └── glossary.md
├── blog/                     # Blog posts (optional)
├── src/                      # Custom React components
│   ├── components/          # Reusable components
│   ├── css/                 # Custom CSS
│   └── pages/               # Custom pages
├── static/                   # Static assets
│   ├── img/                 # Images
│   ├── files/               # Downloadable files
│   └── css/                 # Additional stylesheets
├── docusaurus.config.ts     # Main configuration file
├── sidebars.ts              # Navigation sidebar configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vercel.json              # Vercel deployment config
└── README.md                # Documentation about the docs
```

**Live Documentation**: [https://docs.chainmove.xyz](https://docs.chainmove.xyz)

## Writing Guidelines

### Markdown Formatting
- Use ATX-style headers (with #)
- Use fenced code blocks with language specification
- Use relative links for internal documentation
- Add alt text for all images
- Keep lines under 100 characters for readability
- Use admonitions for important notes:

```markdown
:::tip
This is a helpful tip!
:::

:::warning
This is a warning.
:::

:::danger
This is dangerous information.
:::
```

### Images and Assets
- Place images in `static/img/` directory
- Use descriptive filenames
- Optimize images for web (use WebP when possible)
- Recommended formats: PNG for screenshots, SVG for diagrams
- Add alt text for accessibility

### Adding New Pages

1. **Create the markdown file** in the appropriate directory under `docs/`
2. **Add to sidebar** by editing `sidebars.ts`
3. **Use proper front matter** if needed:

```markdown
---
title: Page Title
description: Page description for SEO
sidebar_position: 1
---

# Page Content
```

4. **Test locally** with `npm start`
5. **Update any related documentation**

### Creating Custom Components

1. **Create component** in `src/components/`
2. **Export from index** if reusable
3. **Use in MDX files**:

```markdown
import CustomComponent from '@site/src/components/CustomComponent';

<CustomComponent prop="value" />
```

## Configuration

### Main Configuration
Edit `docusaurus.config.ts` for:
- Site metadata
- Theme configuration
- Plugin settings
- Navigation bar
- Footer

### Sidebar Configuration
Edit `sidebars.ts` for:
- Documentation structure
- Category organization
- Page ordering

### Styling
- Global styles: `src/css/custom.css`
- Component styles: Individual CSS modules
- Dark mode: Automatically handled by Docusaurus

## Content Guidelines

### Documentation Types

#### User Guides
- **Audience**: End users (drivers, investors)
- **Style**: Step-by-step instructions with screenshots
- **Location**: `docs/user-guide/`

#### Technical Documentation
- **Audience**: Developers and integrators
- **Style**: Code examples, API references, technical deep-dives
- **Location**: `docs/technical/`, `docs/api/`

#### Smart Contract Documentation
- **Audience**: Blockchain developers
- **Style**: Code samples, deployment guides, integration examples
- **Location**: `docs/smart-contracts/`

### Writing Style
- Use clear, concise language
- Write in active voice
- Use second person ("you") for user-focused content
- Be consistent with terminology (check the [Glossary](https://docs.chainmove.xyz/resources/glossary))
- Use sentence case for headings
- Keep paragraphs short (3-4 sentences max)

## Development Best Practices

### Before Making Changes
1. **Pull latest changes** from the documentation branch
2. **Create a feature branch**:
   ```bash
   git checkout -b docs/your-feature-name
   ```
3. **Test locally** before committing

### Testing Checklist
- [ ] Documentation builds successfully (`npm run build`)
- [ ] All links work (internal and external)
- [ ] Images display correctly
- [ ] Navigation works as expected
- [ ] Mobile responsiveness
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Search functionality works (if enabled)

### Performance Considerations
- Optimize images before adding them
- Use lazy loading for heavy content
- Minimize custom CSS and JavaScript
- Test build size with `npm run build -- --bundle-analyzer`

## Contributing Workflow

### For Documentation Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b docs/your-feature-name
   ```

2. **Make your changes**:
   - Edit markdown files in `docs/`
   - Update `sidebars.ts` if adding new pages
   - Add images to `static/img/` if needed

3. **Test locally**:
   ```bash
   npm start
   ```

4. **Build to verify**:
   ```bash
   npm run build
   ```

5. **Commit and push**:
   ```bash
   git add .
   git commit -m "docs: your descriptive message"
   git push origin docs/your-feature-name
   ```

6. **Open a pull request** targeting the `documentation` branch

### For Code Changes That Affect Documentation

When making changes to the main ChainMove platform that require documentation updates:

1. **Identify affected documentation** (see CONTRIBUTING.md for guidelines)
2. **Update documentation** in the same PR when possible
3. **Test both code and documentation**
4. **Include documentation changes in PR description**

## Automation and CI/CD

### Automated Checks
- **Build verification**: Documentation must build successfully
- **Link checking**: Validates all internal and external links
- **Type checking**: Ensures TypeScript compatibility
- **Deployment**: Automatic deployment to `docs.chainmove.xyz`

### Local Testing
```bash
# Run all checks locally
npm run typecheck
npm run build
# Manual link testing
```

## Troubleshooting

### Common Issues

1. **Build fails with module errors**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port 3000 already in use**:
   ```bash
   npm start -- --port 3001
   ```

3. **TypeScript errors**:
   ```bash
   npm run typecheck
   # Fix reported errors
   ```

4. **Cache issues**:
   ```bash
   npm run clear
   npm start
   ```

### Getting Help

1. **Check Docusaurus documentation**: [docusaurus.io](https://docusaurus.io/)
2. **Search existing issues**: [GitHub Issues](https://github.com/obiajulu-gif/chain_move/issues)
3. **Ask in Discord**: #documentation channel
4. **Create new issue** if problem persists

## Deployment

The documentation is automatically deployed to `docs.chainmove.xyz` when changes are pushed to the `documentation` branch.

### Manual Deployment
```bash
# Build and deploy manually (if needed)
npm run build
# Upload build/ directory to your hosting provider
```

### Local Testing of Production Build
```bash
npm run build
npm run serve
# Test at http://localhost:3000
```

## Advanced Topics

### Custom Plugins
Add custom Docusaurus plugins in `docusaurus.config.ts`:

```typescript
plugins: [
  [
    '@docusaurus/plugin-content-docs',
    {
      // Plugin configuration
    },
  ],
],
```

### SEO Optimization
- Add proper meta descriptions
- Use structured data when appropriate
- Optimize images with alt text
- Create XML sitemaps (auto-generated)

### Analytics
Configure analytics in `docusaurus.config.ts`:

```typescript
gtag: {
  trackingID: 'GA_TRACKING_ID',
  anonymizeIP: true,
},
```

## License

This documentation is licensed under the [Apache License 2.0](LICENSE).

## Support

For documentation development issues:
- **Documentation Team**: [docs@chainmove.xyz](mailto:docs@chainmove.xyz)
- **GitHub Issues**: [Repository Issues](https://github.com/obiajulu-gif/chain_move/issues)
- **Community**: [Discord](https://discord.gg/chainmove)

---

**Documentation Website**: [docs.chainmove.xyz](https://docs.chainmove.xyz)  
**Repository**: [github.com/obiajulu-gif/chain_move](https://github.com/obiajulu-gif/chain_move)  
**Documentation Directory**: `/docs/chainmove-docs/`

*Last Updated: December 2024*  
*Version: 2.0.0 (Docusaurus)*
