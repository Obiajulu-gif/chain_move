# Deploying ChainMove Documentation to Vercel

This guide explains how to deploy the ChainMove Docusaurus documentation site to Vercel as a separate deployment from the main website.

## Project Architecture

This setup assumes you have:
- **Main Website**: Deployed from `main` branch to `chainmove.xyz`
- **Documentation Site**: Deployed from `documentation` branch to `docs.chainmove.xyz`

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository access with `documentation` branch
- Custom domain `chainmove.xyz` purchased and configured
- Node.js 18+ installed locally

## Deployment Setup

### Step 1: Create Separate Vercel Project for Documentation

Since your main website is already deployed, you need to create a **new Vercel project** specifically for documentation:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"

2. **Import Repository**
   - Select your GitHub repository `chain_move`
   - **Important**: You'll import the same repo but configure it differently

3. **Configure Project Settings**
   - **Project Name**: `chainmove-documentation` (or similar)
   - **Framework Preset**: Select "Other"
   - **Root Directory**: `docs/chainmove-docs` ⚠️ **Critical Setting**
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
   - **Node.js Version**: 18.x

### Step 2: Configure Branch Settings

1. **After project creation, go to Settings**
2. **Navigate to Git section**
3. **Change Production Branch**:
   - Change from `main` to `documentation`
   - This ensures the documentation project deploys from your documentation branch

### Step 3: Custom Domain Configuration

1. **Add Custom Domain**
   - In project settings, go to "Domains"
   - Add domain: `docs.chainmove.xyz`
   - Vercel will provide DNS configuration

2. **DNS Setup at Domain Registrar**
   ```
   Type: CNAME
   Name: docs
   Value: cname.vercel-dns.com (or value provided by Vercel)
   TTL: 3600
   ```

### Step 4: Namecheap DNS Configuration

Since you purchased your domain on Namecheap, follow these specific steps:

1. **Login to Namecheap**
   - Go to [namecheap.com](https://namecheap.com)
   - Login to your account
   - Go to "Domain List" in your dashboard

2. **Access DNS Management**
   - Find your domain `chainmove.xyz`
   - Click "Manage" next to your domain
   - Go to the "Advanced DNS" tab

3. **Configure DNS Records for Documentation**
   
   **Add CNAME Record for docs subdomain:**
   ```
   Type: CNAME Record
   Host: docs
   Value: cname.vercel-dns.com
   TTL: Automatic (or 300)
   ```

   **Your DNS records should look like this:**
   | Type | Host | Value | TTL |
   |------|------|-------|-----|
   | CNAME | docs | cname.vercel-dns.com | Automatic |
   | A Record | @ | [Your main site IP] | Automatic |
   | CNAME | www | chainmove.xyz | Automatic |

4. **Important Namecheap Settings**
   - **Nameservers**: Should be set to "Namecheap BasicDNS" (default)
   - **DNSSEC**: Can be enabled for additional security (optional)
   - **Email Forwarding**: Configure if needed (separate from website)

5. **Verify Configuration**
   - After adding the CNAME record, it may take 5-30 minutes to propagate
   - You can check propagation at [whatsmydns.net](https://www.whatsmydns.net)
   - Search for `docs.chainmove.xyz` to verify the CNAME is working

### Additional Namecheap Considerations

**If your main website (`chainmove.xyz`) isn't set up yet:**
1. **Add A Record for main domain:**
   ```
   Type: A Record
   Host: @
   Value: [Your main site server IP or Vercel IP]
   TTL: Automatic
   ```

2. **Add CNAME for www subdomain:**
   ```
   Type: CNAME Record
   Host: www
   Value: chainmove.xyz
   TTL: Automatic
   ```

**Security Features in Namecheap:**
- Enable **Domain Lock** to prevent unauthorized transfers
- Consider **WhoisGuard** for privacy protection
- Enable **Two-Factor Authentication** on your Namecheap account

## Vercel Configuration File

The `vercel.json` in your documentation directory should look like this:

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
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
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

**Note**: Do not include empty `"functions": {}` as this causes deployment errors.

## Docusaurus Configuration

Your `docusaurus.config.ts` should have:

```typescript
const config: Config = {
  title: 'ChainMove Documentation',
  tagline: 'Revolutionary blockchain platform enabling fractional vehicle ownership',
  url: 'https://docs.chainmove.xyz',  // Your custom domain
  baseUrl: '/',
  // ... rest of config
};
```

## Deployment Methods

### Method 1: Automatic Deployment (Recommended)

Once configured, Vercel will automatically deploy when you:
- Push to the `documentation` branch
- Create pull requests against `documentation` branch

### Method 2: Manual Deployment via CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to Documentation Directory**
   ```bash
   cd docs/chainmove-docs
   ```

3. **Login and Deploy**
   ```bash
   vercel login
   vercel --prod
   ```

## Branch Management

### Development Workflow

1. **Make changes on documentation branch**
2. **Test locally**:
   ```bash
   cd docs/chainmove-docs
   npm start
   ```
3. **Push to documentation branch**
4. **Vercel automatically deploys to docs.chainmove.xyz**

### Environment Setup

For local development:
```bash
# Clone and switch to documentation branch
git clone https://github.com/obiajulu-gif/chain_move.git
cd chain_move
git checkout documentation

# Navigate to docs and install
cd docs/chainmove-docs
npm install
npm start
```

## Domain Verification

After DNS configuration, verify your setup:

1. **Check DNS propagation**: Use tools like `dig docs.chainmove.xyz`
2. **Verify SSL**: Vercel automatically provides SSL certificates
3. **Test redirects**: Ensure proper routing from root domain if needed

## Multi-Environment Setup

Your complete setup should be:

| Environment | Branch | Domain | Purpose |
|-------------|--------|---------|---------|
| Production (Main) | `main` | `chainmove.xyz` | Main website |
| Production (Docs) | `documentation` | `docs.chainmove.xyz` | Documentation |
| Preview | Any branch | `*.vercel.app` | Testing |

## Build Optimization

### Performance Settings
```json
{
  "scripts": {
    "build": "docusaurus build",
    "build:analyze": "npm run build -- --bundle-analyzer"
  }
}
```

### Static Asset Optimization
- Use WebP images when possible
- Compress images before adding to `static/img/`
- Enable Vercel's automatic compression

## Troubleshooting

### Common Issues

1. **Wrong Root Directory**
   - Ensure root directory is set to `docs/chainmove-docs`
   - This is the most common cause of build failures

2. **Branch Configuration**
   - Verify production branch is set to `documentation`
   - Check that you're pushing to the correct branch

3. **Domain Not Working**
   - DNS changes can take up to 48 hours to propagate
   - Verify CNAME record is correctly configured
   - Check domain registrar's DNS management panel

4. **Build Failures**
   ```