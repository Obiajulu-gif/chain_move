# ChainMove Documentation Release Checklist

This checklist ensures that all documentation updates are properly reviewed, tested, and deployed. Use this for both major and minor documentation releases.

## Pre-Release Preparation

### Content Review
- [ ] All new features and changes are documented
- [ ] All API endpoints are up-to-date
- [ ] All screenshots and diagrams are current
- [ ] All code examples are tested and working
- [ ] All links are verified (no broken links)
- [ ] Version numbers are updated in:
  - [ ] `package.json`
  - [ ] `book.json`
  - [ ] `docs/README.md`
  - [ ] Version history/CHANGELOG.md

### Technical Review
- [ ] Documentation builds successfully in all formats:
  - [ ] HTML
  - [ ] PDF
  - [ ] Word
  - [ ] EPUB
- [ ] Search functionality works
- [ ] Navigation is consistent
- [ ] Mobile responsiveness is verified
- [ ] Browser compatibility is verified:
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Edge (latest)

## Testing

### Local Testing
- [ ] Run spell check on all documentation
- [ ] Test all code examples
- [ ] Verify all interactive elements
- [ ] Check all external links
- [ ] Test accessibility (keyboard navigation, screen readers)
- [ ] Verify table of contents generation
- [ ] Test print styles (for PDF/print versions)

### Cross-Platform Testing
- [ ] Windows
- [ ] macOS
- [ ] Linux
- [ ] Mobile devices (iOS/Android)

## Documentation Review

### Technical Accuracy
- [ ] All technical details are accurate
- [ ] API references match the current version
- [ ] Configuration examples are correct
- [ ] Installation instructions are up-to-date
- [ ] Dependencies are correctly listed

### Content Quality
- [ ] Consistent tone and style throughout
- [ ] No typos or grammatical errors
- [ ] Clear and concise language
- [ ] Appropriate use of headings and sections
- [ ] All images have alt text
- [ ] All code blocks have syntax highlighting

## Pre-Release

### Version Control
- [ ] All changes are committed to the correct branch
- [ ] Commit messages follow the project's conventions
- [ ] Branch is up-to-date with the main branch
- [ ] Pull request is created (if applicable)
- [ ] All CI/CD checks are passing

### Changelog
- [ ] Update CHANGELOG.md with:
  - [ ] Version number and release date
  - [ ] List of new features
  - [ ] List of bug fixes
  - [ ] List of breaking changes
  - [ ] Upgrade instructions (if applicable)

## Release Process

### Build Process
- [ ] Build all documentation formats:
  ```bash
  npm run build:all
  ```
- [ ] Verify build output in `_book/` directory
- [ ] Test the built documentation locally

### Deployment
- [ ] Deploy to staging environment (if applicable)
- [ ] Verify staging deployment
- [ ] Get approval from stakeholders
- [ ] Deploy to production
- [ ] Verify production deployment
- [ ] Update any related systems (e.g., API documentation)

### Post-Release
- [ ] Create a GitHub release
- [ ] Attach all built documentation files
- [ ] Write release notes
- [ ] Publish the release
- [ ] Update any version-specific documentation
- [ ] Archive old documentation (if applicable)

## Post-Release Verification

### Smoke Testing
- [ ] Homepage loads correctly
- [ ] Navigation works as expected
- [ ] Search functionality works
- [ ] All internal links work
- [ ] All external links work
- [ ] All forms and interactive elements work

### Performance
- [ ] Page load times are acceptable
- [ ] No 404 errors in the console
- [ ] No JavaScript errors
- [ ] No broken images or assets

## Communication

### Internal Communication
- [ ] Notify the team about the release
- [ ] Update internal documentation
- [ ] Update project management tools

### External Communication
- [ ] Update the website (if applicable)
- [ ] Send release announcement (if applicable)
- [ ] Update community forums (if applicable)
- [ ] Update social media (if applicable)

## Rollback Plan

### If Something Goes Wrong
- [ ] Revert to the previous version
- [ ] Document the issue
- [ ] Fix the issue
- [ ] Update the release checklist to prevent recurrence
- [ ] Communicate the issue and resolution

## Final Sign-Off

- [ ] Product Owner: _________________ Date: ________
- [ ] Tech Lead: ____________________ Date: ________
- [ ] Documentation Lead: ___________ Date: ________

---

*Last Updated: June 2025*  
*Version: 1.0.0*
