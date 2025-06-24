# How to Set Up Algolia Search

This guide explains how to enable Algolia search functionality in your Docusaurus documentation.

## What is Algolia Search?

Algolia provides powerful search functionality for your documentation. It crawls your site and provides instant search results as users type.

## Why was it disabled?

The Algolia search was causing runtime errors because it had placeholder credentials instead of real ones. It's now disabled to prevent errors.

## Setting Up Algolia Search

### 1. Create an Algolia Account

1. Go to [Algolia](https://www.algolia.com/)
2. Sign up for a free account
3. Create a new application/index

### 2. Get Your Credentials

From your Algolia dashboard, you'll need:
- **Application ID** (appId)
- **Search-Only API Key** (apiKey) 
- **Index Name** (indexName)

### 3. Enable Algolia in Configuration

In `docusaurus.config.ts`, replace the commented algolia section with:

```typescript
algolia: {
  // The application ID provided by Algolia
  appId: 'YOUR_ACTUAL_APP_ID',
  // Public API key: it is safe to commit it
  apiKey: 'YOUR_ACTUAL_SEARCH_API_KEY',
  indexName: 'chainmove',
  // Optional: see doc section below
  contextualSearch: true,
  // Optional: Specify domains where the navigation should occur through window.location instead on history.push
  externalUrlRegex: 'external\\.com|domain\\.com',
  // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl
  replaceSearchResultPathname: {
    from: '/docs/', // or as RegExp: /\/docs\//
    to: '/',
  },
  // Optional: Algolia search parameters
  searchParameters: {},
  // Optional: path for search page that enabled by default (`false` to disable it)
  searchPagePath: 'search',
},
```

### 4. Set Up Algolia DocSearch

For documentation sites, Algolia offers DocSearch which is free for open-source projects:

1. Apply for DocSearch at [docsearch.algolia.com](https://docsearch.algolia.com/apply/)
2. Provide your documentation URL
3. Wait for approval (usually takes a few days)
4. Once approved, you'll receive credentials

### 5. Alternative: Manual Indexing

If you don't qualify for DocSearch, you can manually index your content:

1. Use the Algolia crawler or API to index your content
2. Set up a CI/CD pipeline to reindex when content changes
3. Configure the search to work with your site structure

### 6. Testing

After setting up Algolia:

1. Restart your development server
2. Look for a search box in your navbar
3. Test searching for content from your documentation
4. Verify search results link correctly to your pages

## Current State

- ❌ Algolia search is **disabled** to prevent errors
- ✅ Documentation works without search functionality
- ⏳ Ready to enable when you have Algolia credentials

## Benefits of Algolia Search

- **Instant Results**: Search as you type
- **Faceted Search**: Filter by categories, tags, etc.
- **Analytics**: Track what users search for
- **Typo Tolerance**: Finds results even with typos
- **Keyboard Navigation**: Full keyboard support

## Free Alternatives

If you prefer not to use Algolia:

- **Local Search**: Use `@easyops-cn/docusaurus-search-local` plugin
- **Simple Search**: Basic client-side search functionality
- **Google Custom Search**: Integration with Google search

---

*Note: The documentation works perfectly fine without search. Enable this feature when you're ready to add search functionality.* 