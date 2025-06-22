# ChainMove Documentation Deployment Guide

This guide provides instructions for deploying the ChainMove documentation to various platforms, including web hosting, GitHub Pages, and documentation hosting services.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Building Documentation](#building-documentation)
- [Deployment Options](#deployment-options)
  - [GitHub Pages](#github-pages)
  - [Netlify](#netlify)
  - [Vercel](#vercel)
  - [AWS S3](#aws-s3)
  - [Custom Web Server](#custom-web-server)
- [Versioning and Releases](#versioning-and-releases)
- [Custom Domains](#custom-domains)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Prerequisites

Before deploying the documentation, ensure you have the following installed:

- Node.js 14.x or later
- npm 6.x or later
- Git
- [GitBook CLI](https://github.com/GitbookIO/gitbook-cli) (for building)
- [Calibre](https://calibre-ebook.com/download) (for PDF/EPUB export)

## Building Documentation

1. **Clone the repository** (if not already cloned):
   ```bash
   git clone https://github.com/obiajulu-gif/chain_move.git
   cd chain_move/docs
   ```

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

The built files will be available in the `_book` directory by default.

## Deployment Options

### GitHub Pages

1. **Set up GitHub Pages**:
   - Go to your repository settings on GitHub
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select the `gh-pages` branch and `/ (root)` folder
   - Click "Save"

2. **Deploy to GitHub Pages**:
   ```bash
   # Install gh-pages package if not already installed
   npm install --save-dev gh-pages
   
   # Add deploy script to package.json
   # "scripts": {
   #   "deploy": "gh-pages -d _book"
   # }
   
   # Deploy to GitHub Pages
   npm run deploy
   ```

3. **Access your documentation**:
   - Visit `https://<username>.github.io/chain_move`
   - Or your custom domain if configured

### Netlify

1. **Sign up for Netlify** if you haven't already

2. **Connect your repository**:
   - Click "New site from Git" in Netlify dashboard
   - Select your Git provider and repository
   - Configure build settings:
     - Build command: `cd docs && npm install && npm run build`
     - Publish directory: `docs/_book`
   - Click "Deploy site"

3. **Configure custom domain** (optional):
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Follow the instructions to verify ownership

### Vercel

1. **Sign up for Vercel** if you haven't already

2. **Import your repository**:
   - Click "Import Project"
   - Select your Git provider and repository
   - Configure project settings:
     - Framework: Static Site
     - Build Command: `cd docs && npm install && npm run build`
     - Output Directory: `docs/_book`
   - Click "Deploy"

3. **Set up custom domain** (optional):
   - Go to "Settings" > "Domains"
   - Add your custom domain
   - Follow the verification steps

### AWS S3

1. **Install AWS CLI** if not already installed:
   ```bash
   # On macOS
   brew install awscli
   
   # On Linux
   sudo apt-get install awscli
   
   # On Windows
   # Download from https://aws.amazon.com/cli/
   ```

2. **Configure AWS credentials**:
   ```bash
   aws configure
   ```
   Enter your AWS Access Key ID, Secret Access Key, default region, and output format.

3. **Create an S3 bucket**:
   ```bash
   aws s3 mb s3://chainmove-docs --region us-east-1
   ```

4. **Enable static website hosting**:
   ```bash
   aws s3 website s3://chainmove-docs --index-document index.html --error-document 404.html
   ```

5. **Update bucket policy** to allow public access:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::chainmove-docs/*"
       }
     ]
   }
   ```
   Save as `policy.json` and apply:
   ```bash
   aws s3api put-bucket-policy --bucket chainmove-docs --policy file://policy.json
   ```

6. **Deploy the documentation**:
   ```bash
   # Build the documentation
   npm run build
   
   # Sync to S3
   aws s3 sync _book/ s3://chainmove-docs --delete
   ```

7. **Access your documentation**:
   - Visit the S3 website endpoint (e.g., `http://chainmove-docs.s3-website-us-east-1.amazonaws.com`)
   - Or configure a CloudFront distribution and custom domain

### Custom Web Server

1. **Build the documentation**:
   ```bash
   npm run build
   ```

2. **Copy the built files** to your web server:
   ```bash
   # Using SCP
   scp -r _book/* user@yourserver:/var/www/chainmove-docs/
   
   # Or using rsync
   rsync -avz _book/ user@yourserver:/var/www/chainmove-docs/
   ```

3. **Configure your web server** to serve the static files:

   **Nginx configuration** (`/etc/nginx/sites-available/chainmove-docs`):
   ```nginx
   server {
       listen 80;
       server_name docs.chainmove.io;
       root /var/www/chainmove-docs;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }

       # Enable gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   }
   ```

   **Apache configuration** (`.htaccess` in the root directory):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

## Versioning and Releases

1. **Versioning**:
   - Follow [Semantic Versioning](https://semver.org/)
   - Update the version in `package.json` and `book.json`

2. **Creating a release**:
   ```bash
   # Update version
   npm version patch  # or minor, major
   
   # Build the documentation
   npm run build
   
   # Commit and tag the release
   git add .
   git commit -m "docs: release v$(node -p "require('./package.json').version)"
   git tag -a v$(node -p "require('./package.json').version)" -m "Version $(node -p "require('./package.json').version)"
   
   # Push to remote
   git push origin main --tags
   ```

3. **GitHub Releases**:
   - Go to "Releases" in your GitHub repository
   - Click "Draft a new release"
   - Select the tag you just created
   - Add release notes
   - Attach the built files from `_book` directory
   - Publish the release

## Custom Domains

1. **Purchase a domain** from a registrar like GoDaddy, Namecheap, or Google Domains

2. **Configure DNS**:
   - For GitHub Pages: Add A records pointing to GitHub's IPs
   - For Netlify/Vercel: Add CNAME record as instructed in their dashboard
   - For AWS: Set up a CloudFront distribution and Route 53

3. **Enable HTTPS**:
   - Most platforms (GitHub Pages, Netlify, Vercel) provide automatic HTTPS
   - For custom servers, use Let's Encrypt with Certbot

## Environment Variables

If your documentation requires environment variables (e.g., for API endpoints), set them in your deployment platform:

- **Netlify**: Settings > Build & Deploy > Environment
- **Vercel**: Project Settings > Environment Variables
- **GitHub Actions**: Add to workflow file
- **Custom Server**: Set in your server configuration

Example for Netlify:
```
API_URL=https://api.chainmove.io
ENV=production
```

## Troubleshooting

### Build Failures
- **Error: GitBook not found**: Run `npm install -g gitbook-cli`
- **Missing dependencies**: Run `npm install` in the docs directory
- **Permission denied**: Use `sudo` or fix file permissions

### Deployment Issues
- **404 errors**: Ensure the base path is correctly configured
- **Broken links**: Run the build with `--debug` flag to identify issues
- **CORS issues**: Configure CORS headers in your server configuration

### PDF/EPUB Export
- **Missing Calibre**: Install Calibre from https://calibre-ebook.com/download
- **Font issues**: Ensure required fonts are installed on the build server

## Best Practices

1. **Automate Deployments**:
   - Set up CI/CD pipelines (GitHub Actions, GitLab CI, etc.)
   - Automate testing before deployment

2. **Performance Optimization**:
   - Enable gzip/Brotli compression
   - Optimize images
   - Enable caching headers

3. **Security**:
   - Use HTTPS
   - Set security headers (CSP, HSTS, etc.)
   - Keep dependencies updated

4. **Monitoring**:
   - Set up error tracking (Sentry, LogRocket)
   - Monitor uptime (UptimeRobot, Pingdom)
   - Track usage with analytics

5. **Backup**:
   - Regularly back up your documentation
   - Store backups in a separate location

## Support

For issues with deployment, please:
1. Check the troubleshooting section
2. Search the [GitHub issues](https://github.com/obiajulu-gif/chain_move/issues)
3. Open a new issue if your problem isn't already reported

---

*Last Updated: June 2025*
*Version: 1.0.0*
