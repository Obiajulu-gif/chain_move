# 📚 ChainMove Documentation Hub

Welcome to the official documentation for ChainMove, the decentralized vehicle financing platform. This documentation is designed to help you understand, use, and contribute to the ChainMove ecosystem.

[![Documentation Status](https://img.shields.io/badge/docs-latest-brightgreen.svg)](https://chainmove.io/docs)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## 🌟 Features

- **Comprehensive Guides**: Step-by-step instructions for all user roles
- **API Documentation**: Complete REST and WebSocket API references
- **Smart Contract Docs**: Detailed technical documentation for developers
- **Multiple Formats**: Available in HTML, PDF, and Word formats
- **Searchable**: Full-text search across all documentation
- **Versioned**: Documentation for all released versions
- **Responsive**: Works on desktop and mobile devices


## 🚀 Getting Started

- [Introduction](./user-guide/getting-started.md) - Overview of ChainMove and its benefits
- [Quick Start Guide](./user-guide/quick-start.md) - Get up and running in minutes
- [Glossary](./user-guide/glossary.md) - Key terms and concepts


## 👥 User Guides

### For Drivers

- [Creating an Account](./user-guide/drivers/account-setup.md)
- [Finding Vehicles](./user-guide/drivers/finding-vehicles.md)
- [Making Payments](./user-guide/drivers/making-payments.md)
- [Vehicle Maintenance](./user-guide/drivers/vehicle-maintenance.md)


### For Investors

- [Investment Guide](./user-guide/investors/investment-guide.md)
- [Portfolio Management](./user-guide/investors/portfolio-management.md)
- [Earnings & Payouts](./user-guide/investors/earnings.md)
- [Risk Management](./user-guide/investors/risk-management.md)


## 🛠️ Developer Documentation

### API Reference

- [REST API](./api/README.md) - Complete API documentation
- [WebSocket API](./api/websockets.md) - Real-time updates
- [Authentication](./api/authentication.md) - API authentication methods
- [SDKs & Libraries](./api/sdks.md) - Client libraries and tools


### Smart Contracts
- [Overview](./smart-contracts/README.md) - Smart contract architecture
- [Deployment Guide](./smart-contracts/deployment.md)
- [Integration Guide](./smart-contracts/integration.md)
- [Audit Reports](./smart-contracts/audits.md)

### Architecture
- [System Overview](./technical/architecture.md) - High-level architecture
- [Data Flow](./technical/data-flow.md) - How data moves through the system
- [Security Model](./technical/security.md) - Security principles and practices
- [Scaling](./technical/scaling.md) - Performance and scaling considerations

## 🏗️ Development

### Building the Documentation

1. **Prerequisites**:
   - Node.js 14.x or later
   - npm 6.x or later
   - Git
   - [Calibre](https://calibre-ebook.com/download) (for PDF/EPUB export)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the documentation**:
   ```bash
   # Build all formats (HTML, PDF, Word, EPUB)
   npm run build
   
   # Or build specific formats
   npm run build:html  # HTML only
   npm run build:pdf   # PDF only
   npm run build:word  # Word only
   npm run build:epub  # EPUB only
   ```

4. **Preview locally**:
   ```bash
   npm run serve
   ```
   Then open http://localhost:4000 in your browser.

### Contributing

We welcome contributions to improve the documentation! Please see our [Contribution Guidelines](CONTRIBUTING.md) for details.

### Development Resources

- [Setting Up Your Environment](./technical/setup.md)
- [Running Tests](./technical/testing.md)
- [Code Style Guide](./technical/code-style.md)
- [Debugging](./technical/debugging.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Release Checklist](./RELEASE_CHECKLIST.md)
- [Performance Optimization](./technical/performance.md)

## 🚀 Deployment

- [Production Deployment](./technical/deployment/production.md)
- [CI/CD Pipeline](./technical/deployment/ci-cd.md)
- [Monitoring & Logging](./technical/deployment/monitoring.md)
- [Backup & Recovery](./technical/deployment/backup.md)

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contribution Guidelines](./CONTRIBUTING.md) to get started.

- [How to Contribute](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Reporting Issues](./.github/ISSUE_TEMPLATE/bug_report.md)
- [Feature Requests](./.github/ISSUE_TEMPLATE/feature_request.md)
- [Pull Request Template](./.github/PULL_REQUEST_TEMPLATE.md)

## 📚 Additional Resources

- [FAQ](./resources/faq.md) - Frequently asked questions
- [Troubleshooting](./resources/troubleshooting.md) - Common issues and solutions
- [Changelog](./CHANGELOG.md) - Release history and version information
- [Contributing](./CONTRIBUTING.md) - How to contribute to the documentation
- [Code of Conduct](./CODE_OF_CONDUCT.md) - Community guidelines
- [Glossary](./user-guide/glossary.md) - Key terms and definitions
- [API Reference](./api/README.md) - Complete API documentation
- [Smart Contracts](./smart-contracts/README.md) - Technical documentation for developers

## 📦 Available Formats

The documentation is available in multiple formats for your convenience:

| Format | Command | Output |
|--------|---------|--------|
| HTML | `npm run build:html` | `_book/` |
| PDF | `npm run build:pdf` | `_book/chainmove-documentation.pdf` |
| Word | `npm run build:word` | `_book/chainmove-documentation.docx` |
| EPUB | `npm run build:epub` | `_book/chainmove-documentation.epub` |

## 🔍 Search

Use the search functionality to quickly find what you're looking for. The search index is built automatically and supports:

- Full-text search across all pages
- Fuzzy matching for typos
- Keyword highlighting in results
- Section hierarchy in results

## 📱 Mobile Support

The documentation is fully responsive and works on:

- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets (iPad, Android)
- Mobile devices (iPhone, Android)
- E-readers (Kindle, Kobo, etc.)

## 📝 License

This documentation is licensed under the [MIT License](LICENSE).

## 📬 Contact

For documentation-related questions or feedback, please [open an issue](https://github.com/obiajulu-gif/chain_move/issues) or contact our team at docs@chainmove.io.

---

*Last Updated: June 2025*

## 📚 Resources

- [Blog](https://blog.chainmove.io) - Latest news and updates
- [Community Forum](https://community.chainmove.io) - Join the discussion
- [GitHub Repository](https://github.com/your-org/chain-move) - Source code
- [Status Page](https://status.chainmove.io) - System status and incidents

## ❓ Need Help?

- [FAQs](./user-guide/faq.md) - Common questions and answers
- [Troubleshooting Guide](./user-guide/troubleshooting.md)
- [Contact Support](mailto:support@chainmove.io)
- [Community Chat](https://discord.gg/your-invite)

---

<p align="center">
  📄 <a href="./CHANGELOG.md">View Changelog</a> • 
  📝 <a href="./LICENSE">License</a> • 
  🌐 <a href="https://chainmove.io">Website</a>
</p>
