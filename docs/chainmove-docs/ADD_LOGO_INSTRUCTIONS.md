# How to Add the ChainMove Logo

## 📝 Instructions

To complete the logo setup for your ChainMove documentation:

### 1. Save the Logo File
1. Save your orange ChainMove logo image as `chainmovelogo.png`
2. Place it in the following directory: `docs/chainmove-docs/static/img/chainmovelogo.png`

### 2. File Requirements
- **Filename**: Must be exactly `chainmovelogo.png`
- **Format**: PNG format (recommended for logos with transparency)
- **Size**: Recommended 40-60px height for navbar display
- **Quality**: Use high-resolution for crisp display on retina screens

### 3. Logo Behavior (Already Configured)
The logo is already configured to:
- ✅ Display in the navbar next to "ChainMove" title
- ✅ Link to GitHub repository when clicked
- ✅ Open GitHub in a new tab (`target="_blank"`)
- ✅ Have proper alt text for accessibility

### 4. Current Configuration
The logo configuration in `docusaurus.config.ts` is set to:

```typescript
logo: {
  alt: 'ChainMove Logo',
  src: 'img/chainmovelogo.png',
  href: 'https://github.com/obiajulu-gif/chain_move',
  target: '_blank',
},
```

### 5. Directory Structure
After adding the logo, your directory should look like:
```
docs/chainmove-docs/static/img/
├── chainmovelogo.png          ← Your new logo file
├── logo.svg                   ← Original Docusaurus logo
├── favicon.ico                ← Site favicon
└── ...other files
```

### 6. Testing
After adding the logo file:
1. Restart the development server: `npm start`
2. Visit `http://localhost:3000`
3. Verify the logo appears in the navbar
4. Click the logo to ensure it opens the GitHub repository

### 7. Troubleshooting
If the logo doesn't appear:
- Check the filename is exactly `chainmovelogo.png`
- Ensure the file is in the correct directory
- Restart the development server
- Check browser console for any errors

---

*Note: Once you add the logo file, it will automatically be used in the documentation.* 