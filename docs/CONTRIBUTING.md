# Contributing to ChainMove

Thank you for your interest in contributing to ChainMove! We welcome all contributions, whether they're bug reports, feature requests, documentation improvements, or code contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Documentation Guidelines](#documentation-guidelines)
- [Development Workflow](#development-workflow)
- [Documentation Workflow](#documentation-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Documentation Update Requirements](#documentation-update-requirements)
- [License](#license)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check if the issue has already been reported. If you find a closed issue that seems similar, open a new issue and link to the original one.

When creating a bug report, please include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots if applicable
- Browser/OS version
- Any relevant console errors


### Suggesting Enhancements

We welcome suggestions for new features and improvements. When suggesting an enhancement:

- Use a clear, descriptive title
- Describe the current behavior and why it's not ideal
- Explain the suggested change
- Provide examples of the new behavior


### Your First Contribution

Looking for your first contribution? Look for issues labeled `good first issue` or `help wanted` in the issue tracker. For documentation-specific contributions, look for the `documentation` label.

## Documentation Guidelines

### Documentation Structure

Our documentation is built with **Docusaurus** and is located in:

```text
docs/chainmove-docs/
├── docs/                     # Main documentation content
│   ├── intro.md             # Introduction page
│   ├── getting-started/     # Getting started guides
│   ├── user-guide/          # User-focused documentation
│   │   ├── drivers/         # Driver-specific guides
│   │   └── investors/       # Investor-specific guides
│   ├── technical/           # Technical documentation
│   │   ├── api/             # API reference
│   │   ├── smart-contracts/ # Smart contract docs
│   │   ├── frontend/        # Frontend development
│   │   └── backend/         # Backend development
│   ├── smart-contracts/     # Smart contract documentation
│   ├── api/                 # API reference documentation
│   ├── introduction/        # Platform introduction
│   └── resources/           # Additional resources
├── blog/                    # Blog posts (optional)
├── src/                     # Custom React components
├── static/                  # Static assets (images, files)
├── docusaurus.config.ts     # Docusaurus configuration
├── sidebars.ts             # Navigation sidebar configuration
└── package.json            # Dependencies and scripts
```

**Live Documentation**: [https://docs.chainmove.xyz](https://docs.chainmove.xyz)

### Writing Style

- Use clear, concise language
- Write in active voice
- Use second person ("you") for user-focused content
- Be consistent with terminology (check the [Glossary](https://docs.chainmove.xyz/docs/resources/glossary))
- Use sentence case for headings
- Keep paragraphs short (3-4 sentences max)
- Use lists for sequential steps or multiple items

### Markdown Formatting

- Use ATX-style headers (##, ###, etc.)
- Wrap lines at 100 characters for readability
- Use backticks for `code`, `variables`, and `commands`
- Use fenced code blocks with language specification:

  ```javascript
  // Example code
  function example() {
    return "Hello, World!";
  }
  ```

- Use relative links for internal documentation links
- Add alt text for images
- Use admonitions for important notes:

  ```markdown
  :::tip
  This is a helpful tip for users!
  :::

  :::warning
  This is an important warning.
  :::

  :::danger
  This indicates something dangerous or critical.
  :::
  ```

### Building Documentation Locally

1. **Navigate to the documentation directory**:
   ```bash
   cd docs/chainmove-docs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   Then open http://localhost:3000 in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   Built files will be in the `build/` directory.

5. **Serve the built site locally**:
   ```bash
   npm run serve
   ```

### Documentation Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with hot reload |
| `npm run build` | Build static site for production |
| `npm run serve` | Serve built site locally |
| `npm run clear` | Clear Docusaurus cache |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run deploy` | Deploy to GitHub Pages (if configured) |

## Development Workflow

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Test your changes (including documentation)
6. Update documentation if needed
7. Run tests
8. Commit your changes
9. Push to your fork
10. Open a pull request

## Documentation Workflow

### For Documentation-Only Changes

1. **Navigate to documentation directory**:
   ```bash
   cd docs/chainmove-docs
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b docs/your-feature-name
   ```

3. **Make your changes**:
   - Edit markdown files in `docs/`
   - Update `sidebars.ts` if adding new pages
   - Add images to `static/img/` if needed

4. **Test locally**:
   ```bash
   npm start
   ```

5. **Build to verify**:
   ```bash
   npm run build
   ```

6. **Commit and push**:
   ```bash
   git add .
   git commit -m "docs: your descriptive message"
   git push origin docs/your-feature-name
   ```

7. **Open a pull request** targeting the `documentation` branch

### For Code Changes That Require Documentation Updates

1. **Make your code changes** in the main codebase
2. **Update the corresponding documentation** (see [Documentation Update Requirements](#documentation-update-requirements))
3. **Test both code and documentation**
4. **Include both in your pull request**

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build
2. Update the documentation with details of changes to the interface, including new environment variables, exposed ports, useful file locations, and container parameters
3. Update version numbers in any examples files and documentation to reflect the new version that this Pull Request represents
4. You may merge the Pull Request once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you

### Pull Request Checklist

- [ ] Code changes are tested and working
- [ ] Documentation is updated (if applicable)
- [ ] New documentation builds successfully
- [ ] All links are working
- [ ] Images have alt text
- [ ] Commit messages follow our guidelines
- [ ] PR description clearly explains the changes

## Coding Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow the [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- Use ES6+ features where appropriate
- Prefer `const` and `let` over `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation

### Styling
- Use Tailwind CSS for styling
- Follow the existing design system
- Keep styles modular and reusable
- Use CSS variables for theming

### React
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props and state
- Follow the [React Hooks rules](https://reactjs.org/docs/hooks-rules.html)

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

### Scopes
For documentation changes, use these scopes:
- `docs(api)`: API documentation changes
- `docs(guide)`: User guide changes
- `docs(tech)`: Technical documentation changes
- `docs(contracts)`: Smart contract documentation changes

### Examples
```
feat(auth): add password reset functionality

Adds password reset functionality with email verification. Users can now request a password reset link via email.

Closes #123
```

```
docs(api): update authentication endpoints

- Add new OAuth2 flow documentation
- Update API examples with correct headers
- Fix broken links in authentication guide

Closes #456
```

## Documentation Update Requirements

**🚨 Important**: When making changes to the ChainMove platform, you **MUST** update the corresponding documentation. Here's what to update for different types of changes:

### Frontend Changes

#### Component Updates
- **When**: Modifying existing UI components or adding new ones
- **Update**: [UI Components Guide](https://docs.chainmove.xyz/docs/technical/frontend/components)
- **Include**: Component API, props, usage examples, screenshots

#### New Features
- **When**: Adding new user-facing features
- **Update**: Appropriate section in [User Guide](https://docs.chainmove.xyz/docs/user-guide/)
- **Include**: Step-by-step instructions, screenshots, common use cases

#### API Integration Changes
- **When**: Changing how frontend consumes APIs
- **Update**: [API Usage Examples](https://docs.chainmove.xyz/docs/api/examples)
- **Include**: Updated code examples, error handling

### Backend Changes

#### API Endpoints
- **When**: Adding, modifying, or removing API endpoints
- **Update**: [API Reference](https://docs.chainmove.xyz/docs/api/)
- **Include**: Request/response schemas, authentication requirements, examples

#### Database Schema Changes
- **When**: Modifying database structure
- **Update**: [Database Documentation](https://docs.chainmove.xyz/docs/technical/database)
- **Include**: ERD diagrams, migration notes, data relationships

#### Authentication Changes
- **When**: Modifying auth flows or requirements
- **Update**: [Authentication Guide](https://docs.chainmove.xyz/docs/api/authentication)
- **Include**: Updated flow diagrams, code examples, security considerations

### Smart Contract Changes

#### Contract Updates
- **When**: Deploying new contracts or updating existing ones
- **Update**: [Smart Contracts Documentation](https://docs.chainmove.xyz/docs/smart-contracts/)
- **Include**: Contract addresses, ABI changes, function documentation

#### ABI Changes
- **When**: Contract interface changes
- **Update**: [Integration Guide](https://docs.chainmove.xyz/docs/smart-contracts/integration)
- **Include**: Updated integration examples, migration guide

#### Deployment Changes
- **When**: Changing deployment process or requirements
- **Update**: [Deployment Guide](https://docs.chainmove.xyz/docs/smart-contracts/deployment)
- **Include**: Updated deployment scripts, network configurations

### Configuration Changes

#### Environment Variables
- **When**: Adding or modifying environment variables
- **Update**: [Configuration Guide](https://docs.chainmove.xyz/docs/getting-started/configuration)
- **Include**: Variable descriptions, example values, security notes

#### Deployment Configuration
- **When**: Changing deployment processes or infrastructure
- **Update**: [Deployment Guide](https://docs.chainmove.xyz/docs/technical/deployment)
- **Include**: Updated deployment scripts, environment setup

### Documentation Update Process

1. **Identify affected documentation** using the guidelines above
2. **Make documentation changes** in the same PR as code changes when possible
3. **Test documentation changes** locally before submitting
4. **Include documentation in PR description**:
   ```markdown
   ## Documentation Updates
   - [ ] Updated API documentation for new endpoints
   - [ ] Added user guide for new feature
   - [ ] Updated configuration guide with new environment variables
   ```

### Documentation Review Checklist

Before submitting your PR, ensure:

- [ ] All affected documentation sections are updated
- [ ] New features have corresponding user guides
- [ ] API changes are reflected in the API documentation
- [ ] Code examples are tested and working
- [ ] Screenshots are up-to-date (if UI changes)
- [ ] Links are working and pointing to correct locations
- [ ] Spelling and grammar are correct
- [ ] Documentation builds successfully

### Automation and Tools

We provide tools to help keep documentation in sync:

1. **Link Checker**: Automatically validates all internal and external links
2. **Build Verification**: Documentation must build successfully in CI
3. **Content Linting**: Checks for common writing issues
4. **API Documentation**: Auto-generated from OpenAPI specs (when available)

### Getting Help with Documentation

If you're unsure about what documentation to update:

1. **Check similar PRs** for examples
2. **Ask in the PR description** what documentation might be affected
3. **Tag the documentation team** in your PR: `@chainmove/docs-team`
4. **Join our Discord** and ask in the #documentation channel

## License

By contributing, you agree that your contributions will be licensed under the project's [LICENSE](LICENSE) file.

---

**Documentation Website**: [docs.chainmove.xyz](https://docs.chainmove.xyz)  
**Documentation Repository**: `/docs/chainmove-docs/`  
**Last Updated**: December 2024
