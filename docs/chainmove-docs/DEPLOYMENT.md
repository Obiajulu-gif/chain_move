# Deploying ChainMove Documentation to Vercel

This guide explains how to deploy the ChainMove Docusaurus documentation site to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository access
- Node.js 18+ installed locally

## Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect GitHub Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing your ChainMove project

2. **Configure Project Settings**
   - **Framework Preset**: Select "Other"
   - **Root Directory**: Set to `docs/chainmove-docs`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
   - **Node.js Version**: 18.x

3. **Environment Variables** (if needed)
   - No special environment variables required for basic deployment
   - For Algolia search (if configured): Add `ALGOLIA_API_KEY` and `ALGOLIA_APP_ID`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your site

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to Documentation Directory**
   ```bash
   cd docs/chainmove-docs
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Follow the prompts:**
   - Set up and deploy: Yes
   - Which scope: Your account/team
   - Link to existing project: No (for first deployment)
   - Project name: chainmove-docs (or your preferred name)
   - Directory: ./
   - Build Command: npm run build
   - Output Directory: build

## Vercel Configuration File

Create a `vercel.json` file in the `docs/chainmove-docs` directory for more control:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "framework": null,
  "functions": {},
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Build Configuration

### Package.json Scripts
Ensure your `package.json` includes these scripts:

```json
{
  "scripts": {
    "docusaurus": "docusaurus",
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy",
    "clear": "docusaurus clear",
    "serve": "docusaurus serve",
    "write-translations": "docusaurus write-translations",
    "write-heading-ids": "docusaurus write-heading-ids",
    "typecheck": "tsc"
  }
}
```

### Build Optimization

For better performance, consider:

1. **Enable compression** (automatically handled by Vercel)
2. **Optimize images** - Use WebP format when possible
3. **Bundle analyzer** - Use `npm run build -- --bundle-analyzer` to analyze bundle size

## Custom Domain Setup

1. **In Vercel Dashboard**
   - Go to your project settings
   - Navigate to "Domains"
   - Add your custom domain (e.g., `docs.chainmove.com`)

2. **DNS Configuration**
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel nameservers for full DNS management

## Environment Variables

Set up environment variables in Vercel dashboard if needed:

- `NODE_VERSION`: 18
- `ALGOLIA_API_KEY`: (if using Algolia search)
- `ALGOLIA_APP_ID`: (if using Algolia search)

## Automatic Deployments

Vercel automatically deploys when you:
- Push to the main branch (production)
- Create pull requests (preview deployments)
- Push to other branches (preview deployments)

## Troubleshooting

### Common Issues

1. **Build fails with "Module not found"**
   - Ensure all dependencies are in `package.json`
   - Check import paths are correct

2. **Static files not loading**
   - Verify `static` folder is in the correct location
   - Check base URL configuration in `docusaurus.config.ts`

3. **Routing issues**
   - Ensure `trailingSlash: false` in config for better Vercel compatibility

### Build Commands

- **Development**: `npm start`
- **Production build**: `npm run build`
- **Serve built site**: `npm run serve`
- **Clear cache**: `npm run clear`

## Performance Monitoring

Monitor your deployment:
- Use Vercel Analytics for traffic insights
- Check Core Web Vitals in Vercel dashboard
- Monitor build times and bundle sizes

## Maintenance

- Keep dependencies updated
- Monitor Vercel build logs for warnings
- Regular content updates trigger automatic rebuilds

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Docusaurus Deployment Guide](https://docusaurus.io/docs/deployment)
- Contact team via project channels 