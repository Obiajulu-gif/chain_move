# Contributing to ChainMove

Thank you for your interest in contributing to ChainMove! We welcome all contributions, whether they're bug reports, feature requests, documentation improvements, or code contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
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

### Your First Code Contribution

Looking for your first contribution? Look for issues labeled `good first issue` or `help wanted` in the issue tracker.

## Development Workflow

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Run tests
6. Commit your changes
7. Push to your fork
8. Open a pull request

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent.
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

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

### Examples
```
feat(auth): add password reset functionality

Adds password reset functionality with email verification. Users can now request a password reset link via email.

Closes #123
```

## License

By contributing, you agree that your contributions will be licensed under the project's [LICENSE](LICENSE) file.
