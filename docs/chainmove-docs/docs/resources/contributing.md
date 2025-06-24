---
sidebar_position: 4
---

# 🤝 Contributing to ChainMove

Thank you for your interest in contributing to ChainMove! We welcome all contributions, whether they're bug reports, feature requests, documentation improvements, or code contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Documentation Guidelines](#documentation-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@chainmove.io](mailto:conduct@chainmove.io).

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check if the issue has already been reported. If you find a closed issue that seems similar, open a new issue and link to the original one.

When creating a bug report, please include:

- **A clear, descriptive title**
- **Steps to reproduce the issue**
- **Expected vs. actual behavior**
- **Screenshots if applicable**
- **Browser/OS version**
- **Any relevant console errors**

**Use this template for bug reports:**

```markdown
**Bug Description:**
A clear and concise description of what the bug is.

**To Reproduce:**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
A clear and concise description of what you expected to happen.

**Screenshots:**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**Additional Context:**
Add any other context about the problem here.
```

### Suggesting Enhancements

We welcome suggestions for new features and improvements. When suggesting an enhancement:

- **Use a clear, descriptive title**
- **Describe the current behavior and why it's not ideal**
- **Explain the suggested change**
- **Provide examples of the new behavior**

### Your First Contribution

Looking for your first contribution? Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `documentation` - Documentation improvements needed

## Development Workflow

### 1. Fork the Repository

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/chain_move.git
   cd chain_move
   ```

### 2. Set Up Development Environment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Your Changes

- Write clean, well-commented code
- Follow our coding standards
- Add tests for new features
- Update documentation as needed

### 5. Test Your Changes

```bash
# Run tests
npm test

# Run linting
npm run lint

# Run type checking
npm run type-check

# Build project
npm run build
```

### 6. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

### 7. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Documentation Guidelines

### Writing Style

- **Use clear, concise language**
- **Write in active voice**
- **Use second person ("you") for user-focused content**
- **Be consistent with terminology**
- **Use sentence case for headings**
- **Keep paragraphs short (3-4 sentences max)**

### Markdown Formatting

- Use ATX-style headers (`##`, `###`, etc.)
- Wrap lines at 100 characters
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

### Documentation Structure

```text
docs/
├── api/                  # API reference documentation
├── getting-started/      # Getting started guides
├── smart-contracts/      # Smart contract documentation
├── user-guide/           # User-focused documentation
├── technical/            # Technical deep-dives
└── resources/            # Additional resources
```

## Pull Request Process

1. **Ensure your PR has a clear title and description**
2. **Link to any related issues**
3. **Include screenshots for UI changes**
4. **Add tests for new functionality**
5. **Update documentation as needed**
6. **Ensure all CI checks pass**

### PR Template

Use this template for your pull requests:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran to verify your changes

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- Use ES6+ features where appropriate
- Prefer `const` and `let` over `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation

### React

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props and state
- Follow the [React Hooks rules](https://reactjs.org/docs/hooks-rules.html)

### Solidity

- Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use latest stable Solidity version
- Include comprehensive comments
- Use OpenZeppelin contracts where possible
- Write comprehensive tests

### CSS/Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Keep styles modular and reusable
- Use CSS variables for theming

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
feat(auth): add password reset functionality
fix(api): resolve user registration validation
docs(readme): update installation instructions
style(ui): improve button hover states
refactor(utils): simplify date formatting functions
test(auth): add unit tests for login component
chore(deps): update dependencies to latest versions
```

## Recognition

Contributors who make significant contributions will be:

- Added to our contributors list
- Mentioned in release notes
- Invited to special contributor events
- Considered for community moderator roles

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](https://github.com/obiajulu-gif/chain_move/blob/main/LICENSE).

## Questions?

Feel free to reach out if you have questions:

- **Discord**: [Join our developer community](https://discord.gg/chainmove)
- **Email**: [dev@chainmove.io](mailto:dev@chainmove.io)
- **GitHub Discussions**: [Start a discussion](https://github.com/obiajulu-gif/chain_move/discussions)

---

*Thank you for contributing to ChainMove! Together, we're building the future of decentralized vehicle financing.* 🚀 