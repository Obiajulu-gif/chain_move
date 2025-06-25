# Manual Build Process for ChainMove Documentation

This document provides step-by-step instructions for manually building the ChainMove Docusaurus documentation without relying on automated build scripts.

## Prerequisites

1. **Node.js and npm**
   - Install Node.js (v18 or later) from [nodejs.org](https://nodejs.org/)
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Git**
   - Ensure Git is installed and configured
   - Verify installation:
     ```bash
     git --version
     ```

## Building the Documentation

### Step 1: Clone and Navigate

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/obiajulu-gif/chain_move.git
   cd chain_move
   ```

2. **Switch to documentation branch**:
   ```bash
   git checkout documentation
   ```

3. **Navigate to documentation directory**:
   ```bash
   cd docs/chainmove-docs
   ```

### Step 2: Install Dependencies

1. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

   If you encounter permission issues on Linux/Mac:
   ```bash
   sudo npm install
   ```

2. **Verify installation**:
   ```bash
   npm list --depth=0
   ```

### Step 3: Build for Development

1. **Start development server**:
   ```bash
   npm start
   ```

2. **Access the documentation**:
   - Open your browser to `http://localhost:3000`
   - The development server supports hot reload for live editing

3. **Stop the server**:
   - Press `Ctrl+C` in the terminal

### Step 4: Build for Production

1. **Build static files**:
   ```bash
   npm run build
   ```

2. **Verify build output**:
   - Built files will be in the `build/` directory
   - Check for any build errors in the terminal output

3. **Test the production build locally**:
   ```bash
   npm run serve
   ```
   - Open `http://localhost:3000` to test the built site

### Step 5: Advanced Build Options

#### Clear Cache (if encountering issues)
```bash
npm run clear
```

#### Type Checking
```bash
npm run typecheck
```

#### Build with Debug Information
```bash
DEBUG=1 npm run build
```

## Manual Deployment Preparation

### For Static Hosting

1. **Build the documentation**:
   ```bash
   npm run build
   ```

2. **Copy build files**:
   ```bash
   # Copy to your web server directory
   cp -r build/* /path/to/your/webserver/docs/
   
   # Or create a zip file for upload
   cd build
   zip -r chainmove-docs.zip .
   ```

### For Docker Deployment

1. **Create a Dockerfile** in `/docs/chainmove-docs/`:
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   # Copy package files
   COPY package*.json ./
   
   # Install dependencies
   RUN npm ci --only=production

   # Copy source code
   COPY . .

   # Build the documentation
   RUN npm run build

   # Serve the built files
   FROM nginx:alpine
   COPY --from=0 /app/build /usr/share/nginx/html
   
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build Docker image**:
   ```bash
   docker build -t chainmove-docs .
   ```

3. **Run container**:
   ```bash
   docker run -p 8080:80 chainmove-docs
   ```

## Troubleshooting

### Common Issues and Solutions

#### 1. Node.js Version Issues
**Error**: `Node.js version not compatible`
**Solution**:
```bash
# Check current version
node --version

# Install Node.js 18 or later
# Use nvm for version management
nvm install 18
nvm use 18
```

#### 2. npm Install Fails
**Error**: `EACCES: permission denied`
**Solution**:
```bash
# Option 1: Use npx
npx --yes npm install

# Option 2: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

#### 3. Build Fails with Memory Issues
**Error**: `JavaScript heap out of memory`
**Solution**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### 4. Port Already in Use
**Error**: `Port 3000 is already in use`
**Solution**:
```bash
# Use a different port
npm start -- --port 3001

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

#### 5. Missing Dependencies
**Error**: `Cannot resolve dependency`
**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or try yarn instead
yarn install
```

#### 6. Build Directory Issues
**Error**: `Cannot create build directory`
**Solution**:
```bash
# Clean previous builds
rm -rf build
mkdir build

# Check permissions
chmod 755 .
```

### Debugging Build Issues

1. **Enable verbose logging**:
   ```bash
   npm run build -- --verbose
   ```

2. **Check for TypeScript errors**:
   ```bash
   npm run typecheck
   ```

3. **Validate configuration**:
   ```bash
   # Check Docusaurus version
   npx docusaurus --version
   
   # Validate config file
   node -e "console.log(require('./docusaurus.config.ts'))"
   ```

4. **Check for broken links**:
   ```bash
   npm run build
   # Look for warnings about broken links in the output
   ```

## Alternative Build Methods

### Using Yarn

If npm is causing issues, you can use Yarn:

```bash
# Install Yarn
npm install -g yarn

# Install dependencies
yarn install

# Start development
yarn start

# Build for production
yarn build
```

### Using Docker (for consistent builds)

```bash
# Build in a container to ensure consistency
docker run --rm -v "$PWD":/app -w /app node:18-alpine sh -c "npm install && npm run build"
```

### Using GitHub Codespaces

1. Open the repository in GitHub Codespaces
2. Navigate to the documentation directory:
   ```bash
   cd docs/chainmove-docs
   ```
3. Follow the normal build process

## Manual Testing Checklist

Before considering the build complete, verify:

- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Search functionality works (if enabled)
- [ ] Images and assets load properly
- [ ] Links (internal and external) work
- [ ] Mobile responsiveness
- [ ] Dark mode toggle (if implemented)
- [ ] No console errors in browser

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build -- --bundle-analyzer
```

### Image Optimization

```bash
# Optimize images before building
# Install imagemin-cli globally
npm install -g imagemin-cli

# Optimize images in static directory
imagemin static/img/* --out-dir=static/img/optimized
```

## Creating Release Builds

### Version Tagging

```bash
# Update version in package.json
npm version patch  # or minor, major

# Build with version info
npm run build

# Create git tag
git tag -a v$(node -p "require('./package.json').version") -m "Documentation v$(node -p "require('./package.json').version")"
```

### Archive Creation

```bash
# Create versioned archive
npm run build
cd build
tar -czf "../chainmove-docs-v$(node -p "require('../package.json').version").tar.gz" .
cd ..
```

## Support and Resources

### Getting Help

1. **Check the Docusaurus documentation**: [docusaurus.io](https://docusaurus.io/)
2. **Search existing issues**: [GitHub Issues](https://github.com/obiajulu-gif/chain_move/issues)
3. **Create a new issue** if your problem isn't documented

### Useful Commands Reference

| Command | Purpose |
|---------|---------|
| `npm start` | Development server |
| `npm run build` | Production build |
| `npm run serve` | Serve built files |
| `npm run clear` | Clear cache |
| `npm run typecheck` | Type checking |
| `npm install` | Install dependencies |
| `npm ci` | Clean install (faster for CI) |

---

**Documentation Website**: [docs.chainmove.xyz](https://docs.chainmove.xyz)  
**Repository**: [github.com/obiajulu-gif/chain_move](https://github.com/obiajulu-gif/chain_move)  
**Documentation Directory**: `/docs/chainmove-docs/`

*Last Updated: December 2024*  
*Version: 2.0.0 (Docusaurus)*
