# ChainMove Documentation Overview

> **Note**: This file provides an overview of the documentation structure. The actual navigation for the live documentation is handled by Docusaurus and configured in `/docs/chainmove-docs/sidebars.ts`.

**Live Documentation**: [https://docs.chainmove.xyz](https://docs.chainmove.xyz)  
**Documentation Directory**: `/docs/chainmove-docs/`

## 📚 Documentation Structure

The ChainMove documentation is built with Docusaurus and organized as follows:

### 🌟 Introduction
- [Welcome & Overview](https://docs.chainmove.xyz/docs/intro) - Introduction to ChainMove
- [Features](https://docs.chainmove.xyz/docs/introduction/features) - Platform capabilities
- [Architecture](https://docs.chainmove.xyz/docs/introduction/architecture) - High-level system design

### 🚀 Getting Started
- [Quick Start](https://docs.chainmove.xyz/docs/getting-started/quick-start) - Get up and running quickly
- [Installation](https://docs.chainmove.xyz/docs/getting-started/installation) - Setup instructions
- [Configuration](https://docs.chainmove.xyz/docs/getting-started/configuration) - Configuration guide

### 👥 User Guides

#### For Drivers
- [Driver Overview](https://docs.chainmove.xyz/docs/user-guide/drivers/) - Getting started as a driver
- [Creating an Account](https://docs.chainmove.xyz/docs/user-guide/drivers/creating-account) - Account setup process
- [Listing a Vehicle](https://docs.chainmove.xyz/docs/user-guide/drivers/listing-vehicle) - How to list your vehicle
- [Managing Payments](https://docs.chainmove.xyz/docs/user-guide/drivers/managing-payments) - Payment management

#### For Investors
- [Investor Overview](https://docs.chainmove.xyz/docs/user-guide/investors/) - Getting started as an investor
- [Browsing Investments](https://docs.chainmove.xyz/docs/user-guide/investors/browsing) - Finding investment opportunities
- [Making an Investment](https://docs.chainmove.xyz/docs/user-guide/investors/making-investment) - Investment process
- [Tracking Returns](https://docs.chainmove.xyz/docs/user-guide/investors/tracking-returns) - Monitoring your investments

### 💻 Developer Documentation

#### Smart Contracts
- [Smart Contract Overview](https://docs.chainmove.xyz/docs/smart-contracts/) - Blockchain architecture
- [Contract Architecture](https://docs.chainmove.xyz/docs/smart-contracts/architecture) - Technical design
- [Deployment Guide](https://docs.chainmove.xyz/docs/smart-contracts/deployment) - How to deploy contracts
- [Integration Guide](https://docs.chainmove.xyz/docs/smart-contracts/interaction) - How to interact with contracts

#### API Reference
- [API Overview](https://docs.chainmove.xyz/docs/api/) - REST API documentation
- [Authentication](https://docs.chainmove.xyz/docs/api/authentication) - API authentication methods
- [Endpoints](https://docs.chainmove.xyz/docs/api/endpoints) - Complete endpoint reference
- [WebSockets](https://docs.chainmove.xyz/docs/api/websockets) - Real-time updates

#### Backend Development
- [Backend Overview](https://docs.chainmove.xyz/docs/technical/backend/) - Backend architecture
- [Setup Guide](https://docs.chainmove.xyz/docs/technical/backend/setup) - Development environment setup
- [Database](https://docs.chainmove.xyz/docs/technical/backend/database) - Database design and management
- [API Development](https://docs.chainmove.xyz/docs/technical/backend/api-development) - Building APIs

### 🔧 Technical Reference
- [System Architecture](https://docs.chainmove.xyz/docs/technical/architecture) - Overall system design
- [Developer Guide](https://docs.chainmove.xyz/docs/technical/developer-guide) - Development best practices
- [Testing](https://docs.chainmove.xyz/docs/technical/testing) - Testing strategies and tools
- [Deployment](https://docs.chainmove.xyz/docs/technical/deployment) - Production deployment guide

### 📝 Additional Resources
- [FAQ](https://docs.chainmove.xyz/docs/resources/faq) - Frequently asked questions
- [Troubleshooting](https://docs.chainmove.xyz/docs/resources/troubleshooting) - Common issues and solutions
- [Changelog](https://docs.chainmove.xyz/docs/resources/changelog) - Version history and updates
- [Glossary](https://docs.chainmove.xyz/docs/resources/glossary) - Key terms and definitions
- [Contributing](https://docs.chainmove.xyz/docs/resources/contributing) - How to contribute
- [Code of Conduct](https://docs.chainmove.xyz/docs/resources/code-of-conduct) - Community guidelines

## 🛠️ Documentation Development

For developers working on the documentation:

### Local Development
```bash
cd docs/chainmove-docs
npm install
npm start  # Development server at http://localhost:3000
```

### Building
```bash
npm run build  # Production build
npm run serve  # Serve built files locally
```

### Key Files
- **Navigation**: `/docs/chainmove-docs/sidebars.ts`
- **Configuration**: `/docs/chainmove-docs/docusaurus.config.ts`
- **Content**: `/docs/chainmove-docs/docs/`
- **Assets**: `/docs/chainmove-docs/static/`

### Adding New Pages
1. Create markdown file in `/docs/chainmove-docs/docs/`
2. Update `/docs/chainmove-docs/sidebars.ts` for navigation
3. Test locally with `npm start`
4. Build and verify with `npm run build`

## 📚 Documentation Types

### User-Focused Documentation
- **Location**: `docs/user-guide/`
- **Audience**: End users (drivers, investors)
- **Style**: Step-by-step guides with screenshots

### Technical Documentation  
- **Location**: `docs/technical/`, `docs/api/`
- **Audience**: Developers and integrators
- **Style**: Code examples, API references, technical deep-dives

### Smart Contract Documentation
- **Location**: `docs/smart-contracts/`
- **Audience**: Blockchain developers
- **Style**: Contract interfaces, deployment guides, integration examples

## 🔗 Quick Links

- **Live Documentation**: [docs.chainmove.xyz](https://docs.chainmove.xyz)
- **Main Website**: [chainmove.xyz](https://chainmove.xyz)
- **GitHub Repository**: [github.com/obiajulu-gif/chain_move](https://github.com/obiajulu-gif/chain_move)
- **Contributing Guide**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Development Guide**: [README-DEV.md](./README-DEV.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📋 Documentation Standards

### Writing Guidelines
- Use clear, concise language
- Write in active voice
- Use second person ("you") for user-focused content
- Be consistent with terminology
- Keep paragraphs short (3-4 sentences)

### Technical Standards
- All code examples must be tested
- Include error handling in examples
- Use proper markdown formatting
- Add alt text to all images
- Test all links before publishing

### Review Process
- Content review for accuracy
- Technical review for code examples
- Editorial review for style and clarity
- Final approval before publishing

---

**Last Updated**: December 2024  
**Documentation Version**: 2.0.0 (Docusaurus)  
**Platform Compatibility**: ChainMove v1.x
