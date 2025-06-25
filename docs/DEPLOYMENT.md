# ChainMove Documentation Deployment Guide

This guide provides instructions for deploying the ChainMove Docusaurus documentation to various platforms, including Vercel, Netlify, GitHub Pages, and other hosting services.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Documentation Architecture](#documentation-architecture)
- [Building Documentation](#building-documentation)
- [Deployment Options](#deployment-options)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [AWS S3](#aws-s3)
  - [Custom Web Server](#custom-web-server)
- [Domain Configuration](#domain-configuration)
- [Environment Variables](#environment-variables)
- [CI/CD Setup](#cicd-setup)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Prerequisites

Before deploying the documentation, ensure you have the following:

- Node.js 18.x or later
- npm 8.x or later
- Git
- Access to the repository with the `documentation` branch

## Documentation Architecture

The ChainMove documentation is built with **Docusaurus** and follows this structure:

```
/docs/chainmove-docs/          # Documentation root
├── docs/                      # Main documentation content
├── blog/                      # Blog posts (optional)
├── src/                       # Custom React components
├── static/                    # Static assets
├── docusaurus.config.ts       # Main configuration
├── sidebars.ts               # Navigation configuration
├── package.json              # Dependencies and scripts
└── build/                    # Built files (after npm run build)
```

**Current Setup**:
- **Main Website**: `chainmove.xyz` (from `main` branch)
- **Documentation**: `docs.chainmove.xyz` (from `documentation` branch)

## Building Documentation

### Local Development

1. **Navigate to the documentation directory**:
   ```bash
   cd docs/chainmove-docs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```
   Opens at `http://localhost:3000` with hot reload

4. **Build for production**:
   ```bash
   npm run build
   ```
   Generates static files in the `build/` directory

5. **Test the production build**:
   ```bash
   npm run serve
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run serve` | Serve built files locally |
| `npm run clear` | Clear Docusaurus cache |
| `npm run typecheck` | TypeScript type checking |
| `npm run deploy` | Deploy to GitHub Pages |

## Deployment Options

### Vercel (Recommended)

Vercel provides excellent support for Docusaurus with automatic deployments.

#### Setup

1. **Create Vercel Project**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Project Settings**:
   ```
   Framework Preset: Other
   Root Directory: docs/chainmove-docs
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   Node.js Version: 18.x
   ```

3. **Set Production Branch**:
   - Go to Project Settings → Git
   - Change production branch to `documentation`

4. **Environment Variables** (if needed):
   ```
   NODE_ENV=production
   ```

#### Custom Domain Setup

1. **Add Domain in Vercel**:
   - Go to Project Settings → Domains
   - Add `docs.chainmove.xyz`

2. **DNS Configuration**:
   ```
   Type: CNAME
   Name: docs
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

#### Vercel Configuration

Create `vercel.json` in `/docs/chainmove-docs/`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "framework": null,
  "redirects": [
    {
      "source": "/docs",
      "destination": "/"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Netlify

1. **Connect Repository**:
   - Log into Netlify
   - Click "New site from Git"
   - Select your repository

2. **Build Settings**:
   ```
   Base directory: docs/chainmove-docs
   Build command: npm run build
   Publish directory: docs/chainmove-docs/build
   ```

3. **Branch Configuration**:
   - Set production branch to `documentation`

4. **Custom Domain**:
   - Go to Domain Management
   - Add `docs.chainmove.xyz`

### GitHub Pages

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select `gh-pages` branch as source

2. **Deploy Script**:
   ```bash
   cd docs/chainmove-docs
   npm install
   npm run build
   
   # Deploy using Docusaurus deploy command
   GIT_USER=<Your GitHub username> npm run deploy
   ```

3. **Automated Deployment**:
   Create `.github/workflows/deploy-docs.yml`:

   ```yaml
   name: Deploy Documentation

   on:
     push:
       branches: [ documentation ]
     
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
             cache-dependency-path: docs/chainmove-docs/package-lock.json
             
         - name: Install dependencies
           run: |
             cd docs/chainmove-docs
             npm ci
             
         - name: Build documentation
           run: |
             cd docs/chainmove-docs
             npm run build
             
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: docs/chainmove-docs/build
   ```

### AWS S3

1. **Install AWS CLI and configure credentials**

2. **Create S3 bucket**:
   ```bash
   aws s3 mb s3://chainmove-docs --region us-east-1
   ```

3. **Enable static website hosting**:
   ```bash
   aws s3 website s3://chainmove-docs \
     --index-document index.html \
     --error-document 404.html
   ```

4. **Deploy**:
   ```bash
   cd docs/chainmove-docs
   npm run build
   aws s3 sync build/ s3://chainmove-docs --delete
   ```

5. **Set up CloudFront** for custom domain and HTTPS

### Custom Web Server

1. **Build the documentation**:
   ```bash
   cd docs/chainmove-docs
   npm run build
   ```

2. **Upload to server**:
   ```bash
   rsync -avz build/ user@yourserver:/var/www/docs.chainmove.xyz/
   ```

3. **Nginx configuration**:
   ```nginx
   server {
       listen 80;
       server_name docs.chainmove.xyz;
       root /var/www/docs.chainmove.xyz;
       index index.html;

       # Enable gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

       location / {
           try_files $uri $uri/ @rewrites;
       }

       location @rewrites {
           rewrite ^(.+)$ /index.html last;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

## Domain Configuration

### DNS Setup for docs.chainmove.xyz

1. **For Vercel/Netlify**:
   ```
   Type: CNAME
   Name: docs
   Value: cname.vercel-dns.com (or Netlify equivalent)
   TTL: 3600
   ```

2. **For CloudFront**:
   ```
   Type: CNAME
   Name: docs
   Value: your-cloudfront-distribution.cloudfront.net
   TTL: 3600
   ```

3. **For Custom Server**:
   ```
   Type: A
   Name: docs
   Value: Your server IP
   TTL: 3600
   ```

## Environment Variables

### Common Environment Variables

```bash
# Build environment
NODE_ENV=production

# Analytics (if using)
GOOGLE_ANALYTICS_ID=UA-XXXXXXXX-X

# Search (if using Algolia)
ALGOLIA_APP_ID=your_app_id
ALGOLIA_API_KEY=your_api_key
ALGOLIA_INDEX_NAME=chainmove_docs

# Custom domain
DOCUSAURUS_URL=https://docs.chainmove.xyz
```

### Setting Environment Variables

#### Vercel
```bash
vercel env add NODE_ENV production
vercel env add DOCUSAURUS_URL https://docs.chainmove.xyz
```

#### Netlify
Add in Netlify dashboard: Site Settings → Environment variables

#### GitHub Actions
Add in repository Settings → Secrets and variables → Actions

## CI/CD Setup

### GitHub Actions Workflow

Create `.github/workflows/docs-deploy.yml`:

```yaml
name: Deploy Documentation

on:
  push:
    branches: [ documentation ]
    paths: [ 'docs/chainmove-docs/**' ]
  pull_request:
    branches: [ documentation ]
    paths: [ 'docs/chainmove-docs/**' ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: docs/chainmove-docs/package-lock.json
          
      - name: Install dependencies
        run: |
          cd docs/chainmove-docs
          npm ci
          
      - name: Build documentation
        run: |
          cd docs/chainmove-docs
          npm run build
          
      - name: Test links
        run: |
          cd docs/chainmove-docs
          npm run build
          # Add link checker if available
          
  deploy:
    if: github.ref == 'refs/heads/documentation'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: docs/chainmove-docs/package-lock.json
          
      - name: Install and build
        run: |
          cd docs/chainmove-docs
          npm ci
          npm run build
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: docs/chainmove-docs
```

## Troubleshooting

### Common Issues

1. **Build Fails**:
   ```bash
   # Clear cache and rebuild
   cd docs/chainmove-docs
   npm run clear
   npm run build
   ```

2. **Missing Dependencies**:
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Root Directory Not Found**:
   - Ensure deployment platform is set to `docs/chainmove-docs`
   - Check that the path exists in your repository

4. **404 Errors After Deployment**:
   - Verify the base URL in `docusaurus.config.ts`
   - Check server routing configuration

5. **Slow Build Times**:
   ```bash
   # Use npm ci for faster installs
   npm ci
   
   # Enable build cache
   npm run build -- --cache
   ```

### Debugging

1. **Enable debug mode**:
   ```bash
   DEBUG=1 npm run build
   ```

2. **Check bundle analyzer**:
   ```bash
   npm run build -- --bundle-analyzer
   ```

3. **Validate configuration**:
   ```bash
   npm run docusaurus -- --version
   npm run typecheck
   ```

## Best Practices

### Performance

1. **Optimize images**:
   - Use WebP format when possible
   - Compress images before adding to `static/img/`
   - Use appropriate sizes for different devices

2. **Enable compression**:
   - Gzip/Brotli on server level
   - Set appropriate cache headers

3. **Bundle optimization**:
   - Tree shake unused dependencies
   - Use dynamic imports for large components

### Security

1. **HTTPS everywhere**:
   - Use HTTPS for custom domains
   - Update all links to use HTTPS

2. **Security headers**:
   ```nginx
   add_header X-Frame-Options "SAMEORIGIN" always;
   add_header X-Content-Type-Options "nosniff" always;
   add_header Referrer-Policy "no-referrer-when-downgrade" always;
   ```

### Monitoring

1. **Analytics**:
   - Set up Google Analytics
   - Monitor page views and user behavior

2. **Error tracking**:
   - Use Sentry for error monitoring
   - Set up uptime monitoring

3. **Performance monitoring**:
   - Use Lighthouse CI
   - Monitor Core Web Vitals

### Backup and Recovery

1. **Regular backups**:
   - Backup the entire repository
   - Export documentation to PDF regularly

2. **Disaster recovery**:
   - Document deployment process
   - Keep deployment scripts version controlled

## Support

For deployment issues:

1. **Check the build logs** in your deployment platform
2. **Verify all prerequisites** are met
3. **Test the build locally** before deploying
4. **Check our troubleshooting guide** above
5. **Open an issue** in the repository if problems persist

---

**Documentation Website**: [docs.chainmove.xyz](https://docs.chainmove.xyz)  
**Repository**: [github.com/obiajulu-gif/chain_move](https://github.com/obiajulu-gif/chain_move)  
**Documentation Directory**: `/docs/chainmove-docs/`

*Last Updated: December 2024*  
*Version: 2.0.0*
