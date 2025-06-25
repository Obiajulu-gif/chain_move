# 📚 ChainMove Documentation Hub

Welcome to the official documentation for ChainMove, the decentralized vehicle financing platform. This documentation is designed to help you understand, use, and contribute to the ChainMove ecosystem.

[![Documentation Status](https://img.shields.io/badge/docs-latest-brightgreen.svg)](https://docs.chainmove.xyz)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](../LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## 🌟 Features

- **Comprehensive Guides**: Step-by-step instructions for all user roles
- **API Documentation**: Complete REST and WebSocket API references
- **Smart Contract Docs**: Detailed technical documentation for developers
- **Interactive Examples**: Live code examples and tutorials
- **Searchable**: Full-text search across all documentation powered by Algolia
- **Versioned**: Documentation for all released versions
- **Responsive**: Works on desktop and mobile devices
- **Dark Mode**: Support for both light and dark themes

## 📍 Documentation Location

The main documentation site is built with **Docusaurus** and is located in:
```
/docs/chainmove-docs/
```

**Live Documentation**: [https://docs.chainmove.xyz](https://docs.chainmove.xyz)

## 🚀 Getting Started

### Quick Links
- [📖 Introduction](https://docs.chainmove.xyz/) - Overview of ChainMove and its benefits
- [⚡ Quick Start Guide](https://docs.chainmove.xyz/getting-started/quick-start) - Get up and running in minutes
- [📚 System Architecture](https://docs.chainmove.xyz/technical/architecture) - Key terms and concepts

### For New Users
- [Creating an Account](https://docs.chainmove.xyz/user-guide/drivers/creating-account)
- [Making Your First Investment](https://docs.chainmove.xyz/user-guide/investors/)
- [Understanding the Platform](https://docs.chainmove.xyz/introduction/features)

## 👥 User Guides

### For Drivers
- [Account Setup](https://docs.chainmove.xyz/user-guide/drivers/creating-account)
- [Vehicles Listing](https://docs.chainmove.xyz/user-guide/drivers/listing-vehicle)
- [Making Payments](https://docs.chainmove.xyz/user-guide/drivers/managing-payments)
- [Vehicle Maintenance](https://docs.chainmove.xyz/user-guide/drivers/vehicle-maintenance)

### For Investors
- [Investment Guide](https://docs.chainmove.xyz/user-guide/investors/)
- [Portfolio Management](https://docs.chainmove.xyz/user-guide/investors/portfolio-management)
- [Earnings & Payouts](https://docs.chainmove.xyz/user-guide/investors/opportunities)

## 🛠️ Developer Documentation

### API Reference
- [REST API](https://docs.chainmove.xyz/api/) - Complete API documentation

### Smart Contracts
- [Overview](https://docs.chainmove.xyz/smart-contracts/) - Smart contract architecture
- [Deployment Guide](https://docs.chainmove.xyz/technical/developer-guide)


### Architecture
- [System Overview](https://docs.chainmove.xyz/technical/architecture) - High-level architecture
- [Data Flow](https://docs.chainmove.xyz/technical/developer-guide#developer-workflow) - How data moves through the system
- [Security Model](https://docs.chainmove.xyz/technical/architecture#-security-architecture) - Security principles and practices
- [Scaling](https://docs.chainmove.xyz/technical/architecture#-scalability-considerations) - Performance and scaling considerations

## 🏗️ Local Development

### Prerequisites
- Node.js 18.x or later
- npm 8.x or later
- Git

### Setting Up the Documentation

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
   The documentation will be available at `http://localhost:3000`

4. **Build for production**:
   ```bash
   npm run build
   ```
   Built files will be in the `build/` directory

5. **Serve the built site locally**:
   ```bash
   npm run serve
   ```

### Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with hot reload |
| `npm run build` | Build static site for production |
| `npm run serve` | Serve built site locally |
| `npm run clear` | Clear Docusaurus cache |
| `npm run deploy` | Deploy to GitHub Pages (if configured) |
| `npm run typecheck` | Run TypeScript type checking |

## 📝 Contributing to Documentation

We welcome contributions to improve the documentation! Please see our [Contribution Guidelines](CONTRIBUTING.md) for details.

### Quick Contribution Guide

1. **For Content Updates**:
   - Edit files in `/docs/chainmove-docs/docs/`
   - Test locally with `npm start`
   - Submit a pull request

2. **For Configuration Changes**:
   - Modify `docusaurus.config.ts`
   - Update `sidebars.ts` for navigation changes
   - Test thoroughly before submitting

3. **For New Features/Sections**:
   - Create new markdown files in appropriate directories
   - Update `sidebars.ts` to include in navigation
   - Add any necessary assets to `/docs/chainmove-docs/static/`

## 🔄 Documentation Update Guidelines for Developers

When making changes to the ChainMove platform, update the corresponding documentation:

### Frontend Changes
- **Component Updates**: Update [UI Components](https://docs.chainmove.xyz/technical/frontend/components)
- **New Features**: Add to [User Guide](https://docs.chainmove.xyz/user-guide/)
- **API Integration**: Update [API Usage Examples](https://docs.chainmove.xyz/api/examples)

### Backend Changes
- **API Endpoints**: Update [API Reference](https://docs.chainmove.xyz/api/)
- **Database Schema**: Update [Database Documentation](https://docs.chainmove.xyz/technical/database)
- **Authentication**: Update [Auth Guide](https://docs.chainmove.xyz/api/authentication)

### Smart Contract Changes
- **Contract Updates**: Update [Smart Contracts](https://docs.chainmove.xyz/smart-contracts/)
- **ABI Changes**: Update [Integration Guide](https://docs.chainmove.xyz/smart-contracts/integration)
- **Deployment**: Update [Deployment Guide](https://docs.chainmove.xyz/smart-contracts/deployment)

### Configuration Changes
- **Environment Variables**: Update [Configuration Guide](https://docs.chainmove.xyz/getting-started/configuration)

## 🚀 Deployment

The documentation is automatically deployed to `docs.chainmove.xyz` when changes are pushed to the `documentation` branch. For manual deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 📱 Mobile and Accessibility

The documentation is fully responsive and accessible:
- Works on all modern browsers
- Mobile-friendly responsive design
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support

## 🔍 Search

The documentation includes powerful search capabilities:
- **Algolia Search**: Fast, typo-tolerant search
- **Keyboard Shortcuts**: `Ctrl+K` or `Cmd+K` to open search
- **Faceted Search**: Filter by document type and category
- **Highlight Results**: Search terms highlighted in results

## 📦 Available Formats

The documentation is primarily available as a web application, with additional formats available on request:

| Format | Access Method | Best For |
|--------|--------------|----------|
| **Web** | [docs.chainmove.xyz](https://docs.chainmove.xyz) | Interactive browsing, search |
| **PDF** | Download from website | Offline reading, printing |
| **Mobile** | Responsive web design | Mobile devices, tablets |

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

- [How to Contribute](./CONTRIBUTING.md) - Complete contribution guide
- [Code of Conduct](https://docs.chainmove.xyz/resources/code-of-conduct) - Community guidelines
- [Issue Templates](https://github.com/obiajulu-gif/chain_move/issues/new) - Report bugs or request features
- [Pull Requests](https://github.com/obiajulu-gif/chain_move/pulls) - Submit changes

### Types of Contributions Needed

- **Content**: Writing, editing, and improving documentation
- **Technical**: Code examples, API documentation, troubleshooting guides
- **Design**: UI/UX improvements, accessibility enhancements
- **Translation**: Multi-language support (coming soon)

## 📚 Additional Resources

- [FAQ](https://docs.chainmove.xyz/resources/faq) - Frequently asked questions
- [Troubleshooting](https://docs.chainmove.xyz/resources/troubleshooting) - Common issues and solutions
- [Changelog](https://docs.chainmove.xyz/resources/changelog) - Release history and version information
- [Glossary](https://docs.chainmove.xyz/resources/glossary) - Key terms and definitions
- [Contributing](https://docs.chainmove.xyz/resources/contributing) - Contributing to the project

## 🔧 Technical Documentation

### For Platform Developers
- [Development Setup](https://docs.chainmove.xyz/technical/setup)
- [Architecture Overview](https://docs.chainmove.xyz/technical/architecture)
- [Testing Guide](https://docs.chainmove.xyz/technical/testing)
- [Deployment Guide](https://docs.chainmove.xyz/technical/deployment)

### For Integration Partners
- [API Documentation](https://docs.chainmove.xyz/api/)
- [SDK Documentation](https://docs.chainmove.xyz/api/sdks)
- [Webhook Guide](https://docs.chainmove.xyz/api/webhooks)
- [Partner Portal](https://docs.chainmove.xyz/partners/)

## 📧 Contact & Support

- **Documentation Issues**: [GitHub Issues](https://github.com/obiajulu-gif/chain_move/issues)
- **General Support**: [support@chainmove.xyz](mailto:support@chainmove.xyz)
- **Documentation Team**: [docs@chainmove.xyz](mailto:docs@chainmove.xyz)
- **Community**: [Discord](https://discord.gg/chainmove) | [Telegram](https://t.me/chainmove)

## 📄 License

This documentation is licensed under the [Apache License 2.0](../LICENSE).

---

## 🌐 Quick Links

- [🏠 Main Website](https://chainmove.xyz) - ChainMove platform
- [📖 Documentation](https://docs.chainmove.xyz) - This documentation site
- [💻 GitHub](https://github.com/obiajulu-gif/chain_move) - Source code
- [📊 Status](https://status.chainmove.xyz) - System status
- [📰 Blog](https://blog.chainmove.xyz) - Latest updates
- [💬 Community](https://community.chainmove.xyz) - Community forum

---

<p align="center">
  📄 <a href="https://docs.chainmove.xyz/resources/changelog">View Changelog</a> • 
  📝 <a href="./LICENSE">License</a> • 
  🌐 <a href="https://chainmove.xyz">Website</a> •
  📖 <a href="https://docs.chainmove.xyz">Documentation</a>
</p>

---

*Last Updated: December 2025*  
*Documentation Version: 2.0.0*  
*Platform Version: Compatible with ChainMove v1.x*
