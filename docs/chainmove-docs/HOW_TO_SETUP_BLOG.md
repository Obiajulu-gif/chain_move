# How to Set Up the Blog

This guide explains how to re-enable and configure the blog for your Docusaurus documentation site.

## 1. Re-enable the Blog Plugin

In `docusaurus.config.ts`, you need to re-enable the blog feature.

1.  Open `docusaurus.config.ts`.
2.  Find the `presets` section.
3.  Locate the `'classic'` preset.
4.  Change `blog: false` back to the full blog configuration object.

**Replace this:**

```typescript
// ...
presets: [
  [
    'classic',
    {
      docs: {
        // ... docs config
      },
      blog: false, // This is what you'll change
      theme: {
        customCss: './src/css/custom.css',
      },
    },
  ],
],
// ...
```

**With this:**

```typescript
// ...
presets: [
  [
    'classic',
    {
      docs: {
        // ... docs config
      },
      blog: {
        showReadingTime: true,
        // Please change this to your repo.
        // Remove this to remove the "edit this page" links.
        editUrl:
          'https://github.com/obiajulu-gif/chain_move/tree/main/docs/',
      },
      theme: {
        customCss: './src/css/custom.css',
      },
    },
  ],
],
// ...
```

## 2. Add the Blog Link to the Navbar

Still in `docusaurus.config.ts`, you need to add the link to the blog back into the navigation bar.

1.  Find the `themeConfig` section.
2.  Locate the `navbar` object.
3.  Uncomment the blog item in the `items` array.

```typescript
// ...
navbar: {
  title: 'ChainMove',
  // ... logo config
  items: [
    {
      type: 'docSidebar',
      sidebarId: 'docsSidebar',
      position: 'left',
      label: 'Documentation',
    },
    // ... other navbar items
    {to: '/blog', label: 'Blog', position: 'left'}, // Uncomment this line
    {
      href: 'https://github.com/obiajulu-gif/chain_move',
      label: 'GitHub',
      position: 'right',
    },
  ],
},
// ...
```

## 3. Create the Blog Directory and Posts

1.  Create a `blog` directory in the `docs/chainmove-docs` directory.
2.  Inside the `blog` directory, create your markdown files for your blog posts.

The filename format for blog posts is `YYYY-MM-DD-your-post-title.md`.

Here is an example of a blog post file named `2025-06-24-welcome.md`:

```markdown
---
slug: welcome
title: Welcome to our new blog!
authors: [chainmove_team]
tags: [hello, docusaurus]
---

This is our very first blog post.

We are excited to share updates and news with our community.
```

## 4. Add Blog Authors

You can define authors for your blog posts in a `authors.yml` file.

1.  Create an `authors.yml` file in the `blog` directory (`docs/chainmove-docs/blog/authors.yml`).
2.  Define your authors in the `authors.yml` file.

Example `authors.yml`:

```yaml
chainmove_team:
  name: ChainMove Team
  title: Maintainer of ChainMove
  url: https://github.com/obiajulu-gif
  image_url: https://github.com/obiajulu-gif.png
```

After completing these steps, restart your development server, and the blog will be visible on your site. 