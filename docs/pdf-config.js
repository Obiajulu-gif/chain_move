// PDF/Word export configuration for GitBook
module.exports = {
  // PDF specific options
  pdf: {
    // Page options
    page: {
      // Page size (A4, A3, etc.)
      size: 'A4',
      // Page margins (in mm)
      margin: {
        top: '40mm',
        bottom: '30mm',
        left: '25mm',
        right: '25mm'
      },
      // Header template (HTML)
      headerTemplate: `
        <div style="width: 100%; text-align: center; font-size: 10px; color: #666; margin-bottom: 10px;">
          <span>ChainMove Documentation</span>
        </div>
      `,
      // Footer template (HTML)
      footerTemplate: `
        <div style="width: 100%; text-align: center; font-size: 9px; color: #999;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `
    },
    // Print background colors and images
    printBackground: true,
    // Paper format options
    format: 'A4',
    // Whether to prefer page size as defined by CSS
    preferCSSPageSize: true,
    // Scale of the page rendering
    scale: 0.8,
    // Header and footer styles
    displayHeaderFooter: true,
    // Header and footer template strings
    headerTemplate: '<div></div>',
    footerTemplate: '<div></div>',
    // Margin for header and footer (in inches)
    margin: {
      top: '1.5in',
      right: '1in',
      bottom: '1in',
      left: '1in'
    },
    // Path to custom CSS file
    stylesheets: [
      'styles/pdf.css'
    ],
    // HTML template for the PDF cover
    cover: 'templates/cover.html',
    // Table of contents options
    toc: {
      depth: 3,
      maxDepth: 3,
      title: 'Table of Contents',
      className: 'toc',
      backToTop: true
    },
    // Page numbering options
    pageNumbers: {
      // Position: 'bottom-center', 'bottom-left', 'bottom-right', 'top-center', 'top-left', 'top-right'
      position: 'bottom-center',
      // Format: '1', 'i', 'I', 'a', 'A', 'i/1', '1/1', 'i/1/1', '1/1/1', 'i-1', '1-1', 'i-1-1', '1-1-1'
      format: '1',
      // Alignment: 'left', 'center', 'right'
      align: 'center',
      // Text before the page number
      before: '',
      // Text after the page number
      after: '',
      // Style for the page numbers
      style: {
        'font-family': 'Arial',
        'font-size': '10px',
        'color': '#666666',
        'margin': '10px 0'
      }
    },
    // PDF metadata
    pdfInfo: {
      title: 'ChainMove Documentation',
      author: 'ChainMove Team',
      subject: 'Comprehensive documentation for ChainMove platform',
      keywords: 'chainmove, documentation, guide, api, smart contracts',
      creator: 'ChainMove Documentation Generator',
      producer: 'GitBook PDF Generator',
      creationDate: new Date().toISOString(),
      modDate: new Date().toISOString(),
      // PDF/A compliance
      conformance: 'PDF/A-1b',
      // PDF version
      version: '1.7',
      // Embed fonts
      embedFonts: true,
      // Compress the PDF
      compress: true
    },
    // PDF security options
    security: {
      // Password protection
      userPassword: '',
      ownerPassword: '',
      // Permissions (empty array means all permissions)
      permissions: [],
      // Encryption level (40, 128, or 256)
      encryption: 128
    },
    // Custom PDF options
    custom: {
      // Add cover page
      cover: true,
      // Add table of contents
      toc: true,
      // Add page numbers
      pageNumbers: true,
      // Add bookmarks
      bookmarks: true,
      // Add hyperlinks
      links: true,
      // Add outline
      outline: true,
      // Add page labels
      pageLabels: true,
      // Add attachments
      attachments: true,
      // Add metadata
      metadata: true
    }
  },
  
  // Word export specific options
  word: {
    // Document properties
    title: 'ChainMove Documentation',
    subject: 'Comprehensive documentation for ChainMove platform',
    keywords: 'chainmove, documentation, guide, api, smart contracts',
    description: 'Official documentation for ChainMove platform',
    // Document author
    creator: 'ChainMove Team',
    // Document company
    company: 'ChainMove Inc.',
    // Document revision
    revision: 1,
    // Document creation date
    created: new Date(),
    // Document modification date
    modified: new Date(),
    // Document last printed date
    lastModifiedBy: 'ChainMove Documentation Generator',
    // Document security
    security: {
      // Password protection
      password: '',
      // Document protection
      protect: false,
      // Document encryption
      encrypted: false,
      // Document signing
      signed: false
    },
    // Document formatting
    formatting: {
      // Default font
      font: 'Arial',
      // Default font size (in points)
      size: 11,
      // Line height
      lineHeight: 1.15,
      // Margins (in inches)
      margins: {
        top: 1,
        right: 1,
        bottom: 1,
        left: 1.25,
        header: 0.5,
        footer: 0.5,
        gutter: 0.5
      },
      // Page size
      page: {
        // Page size (Letter, A4, etc.)
        size: 'Letter',
        // Page orientation (portrait or landscape)
        orientation: 'portrait',
        // Page numbers
        numbers: {
          // Start page number
          start: 1,
          // Number format (1, I, i, a, A)
          format: '1',
          // Include chapter number (e.g., 1-1, 1-2, etc.)
          includeChapterNumber: false,
          // Chapter separator
          chapterSeparator: '-',
          // Alignment (left, center, right)
          align: 'center'
        }
      },
      // Headers and footers
      header: {
        // Default header text
        text: 'ChainMove Documentation',
        // Header alignment (left, center, right)
        align: 'left',
        // Header font size (in points)
        size: 10,
        // Header font color (hex or color name)
        color: '#666666',
        // Show page number in header
        pageNumber: false
      },
      footer: {
        // Default footer text
        text: 'Confidential',
        // Footer alignment (left, center, right)
        align: 'center',
        // Footer font size (in points)
        size: 9,
        // Footer font color (hex or color name)
        color: '#999999',
        // Show page number in footer
        pageNumber: true
      },
      // Table of contents
      toc: {
        // Include table of contents
        include: true,
        // Table of contents title
        title: 'Table of Contents',
        // Table of contents heading style
        headingStyle: {
          // Font size (in points)
          size: 14,
          // Font weight (normal, bold, etc.)
          weight: 'bold',
          // Font color (hex or color name)
          color: '#000000',
          // Text alignment (left, center, right)
          align: 'left',
          // Spacing before (in points)
          spaceBefore: 24,
          // Spacing after (in points)
          spaceAfter: 12
        },
        // Table of contents entry style
        entryStyle: {
          // Font size (in points)
          size: 11,
          // Font weight (normal, bold, etc.)
          weight: 'normal',
          // Font color (hex or color name)
          color: '#000000',
          // Text alignment (left, center, right)
          align: 'left',
          // Spacing before (in points)
          spaceBefore: 6,
          // Spacing after (in points)
          spaceAfter: 0
        },
        // Maximum depth of headings to include
        depth: 3,
        // Include page numbers
        pageNumbers: true,
        // Right align page numbers
        rightAlignPageNumbers: true,
        // Tab leader character
        tabLeader: '.',
        // Tab stop position (in twips, 1/20th of a point)
        tabStop: 900
      },
      // Headings
      headings: {
        // Heading 1 style
        h1: {
          // Font size (in points)
          size: 24,
          // Font weight (normal, bold, etc.)
          weight: 'bold',
          // Font color (hex or color name)
          color: '#2c3e50',
          // Text alignment (left, center, right)
          align: 'left',
          // Spacing before (in points)
          spaceBefore: 36,
          // Spacing after (in points)
          spaceAfter: 12,
          // Page break before
          pageBreakBefore: 'always',
          // Keep with next
          keepWithNext: true,
          // Outline level
          outlineLvl: 1
        },
        // Heading 2 style
        h2: {
          size: 18,
          weight: 'bold',
          color: '#2c3e50',
          align: 'left',
          spaceBefore: 24,
          spaceAfter: 8,
          keepWithNext: true,
          outlineLvl: 2
        },
        // Heading 3 style
        h3: {
          size: 14,
          weight: 'bold',
          color: '#2c3e50',
          align: 'left',
          spaceBefore: 16,
          spaceAfter: 6,
          keepWithNext: true,
          outlineLvl: 3
        },
        // Heading 4 style
        h4: {
          size: 12,
          weight: 'bold',
          color: '#2c3e50',
          align: 'left',
          spaceBefore: 12,
          spaceAfter: 4,
          keepWithNext: true,
          outlineLvl: 4
        },
        // Heading 5 style
        h5: {
          size: 11,
          weight: 'bold',
          color: '#2c3e50',
          align: 'left',
          spaceBefore: 10,
          spaceAfter: 4,
          keepWithNext: true,
          outlineLvl: 5
        },
        // Heading 6 style
        h6: {
          size: 10,
          weight: 'bold',
          color: '#2c3e50',
          align: 'left',
          spaceBefore: 8,
          spaceAfter: 4,
          keepWithNext: true,
          outlineLvl: 6
        }
      },
      // Paragraphs
      paragraph: {
        // Default paragraph style
        normal: {
          // Font size (in points)
          size: 11,
          // Font weight (normal, bold, etc.)
          weight: 'normal',
          // Font color (hex or color name)
          color: '#000000',
          // Text alignment (left, center, right, justify)
          align: 'left',
          // Line height (multiplier)
          lineHeight: 1.15,
          // Spacing before (in points)
          spaceBefore: 0,
          // Spacing after (in points)
          spaceAfter: 8,
          // First line indent (in points)
          firstLineIndent: 0,
          // Hanging indent (in points)
          hangingIndent: 0,
          // Left indent (in points)
          leftIndent: 0,
          // Right indent (in points)
          rightIndent: 0,
          // Keep lines together
          keepLines: true,
          // Keep with next
          keepNext: false,
          // Page break before
          pageBreakBefore: false,
          // Widow/Orphan control
          widowControl: true,
          // Word wrap
          wordWrap: true
        },
        // Code block style
        code: {
          font: 'Courier New',
          size: 10,
          color: '#333333',
          background: '#f5f5f5',
          border: '1pt solid #dddddd',
          padding: '6pt',
          lineHeight: 1.2,
          spaceBefore: 8,
          spaceAfter: 8
        },
        // Blockquote style
        blockquote: {
          font: 'Times New Roman',
          size: 11,
          color: '#555555',
          background: '#f9f9f9',
          borderLeft: '3pt solid #dddddd',
          padding: '4pt 12pt',
          margin: '8pt 0',
          lineHeight: 1.4
        },
        // List style
        list: {
          // Ordered list style
          ordered: {
            type: 'decimal',
            level: 1,
            format: '%1.',
            text: '%1.',
            indent: 0.25,
            align: 'left',
            tabStop: 0.5,
            start: 1
          },
          // Unordered list style
          unordered: {
            type: 'bullet',
            level: 1,
            format: '•',
            text: '•',
            indent: 0.25,
            align: 'left',
            tabStop: 0.5
          }
        },
        // Table style
        table: {
          // Table border
          border: {
            style: 'single',
            size: 1,
            color: '#dddddd',
            space: 0,
            shadow: false
          },
          // Table cell padding (in points)
          cellPadding: 4,
          // Table cell spacing (in points)
          cellSpacing: 0,
          // Table width (percentage of page width)
          width: 100,
          // Table alignment (left, center, right)
          align: 'center',
          // Table layout (autofit, fixed)
          layout: 'autofit',
          // Table style
          style: 'Table Grid',
          // Table header row style
          headerRow: {
            // Background color (hex or color name)
            background: '#f2f2f2',
            // Text alignment (left, center, right, justify)
            align: 'center',
            // Font weight (normal, bold, etc.)
            weight: 'bold',
            // Font size (in points)
            size: 10,
            // Font color (hex or color name)
            color: '#333333',
            // Border style
            border: {
              style: 'single',
              size: 1,
              color: '#dddddd',
              space: 0
            }
          },
          // Table row style
          row: {
            // Background color (hex or color name)
            background: '#ffffff',
            // Text alignment (left, center, right, justify)
            align: 'left',
            // Font weight (normal, bold, etc.)
            weight: 'normal',
            // Font size (in points)
            size: 10,
            // Font color (hex or color name)
            color: '#333333',
            // Border style
            border: {
              style: 'single',
              size: 1,
              color: '#dddddd',
              space: 0
            },
            // Alternating row colors
            banding: {
              // Enable alternating row colors
              enabled: true,
              // Even row background color (hex or color name)
              even: '#ffffff',
              // Odd row background color (hex or color name)
              odd: '#f9f9f9'
            }
          },
          // Table cell style
          cell: {
            // Vertical alignment (top, center, bottom)
            valign: 'top',
            // Text direction (ltr, rtl, ttb, btt)
            direction: 'ltr',
            // Text rotation (0, 90, 180, 270)
            textRotation: 0,
            // Cell margins (in points)
            margin: {
              top: 0,
              right: 4,
              bottom: 0,
              left: 4
            },
            // Cell padding (in points)
            padding: {
              top: 2,
              right: 4,
              bottom: 2,
              left: 4
            },
            // Cell border
            border: {
              style: 'single',
              size: 1,
              color: '#dddddd',
              space: 0
            },
            // Cell background color (hex or color name)
            background: '#ffffff',
            // Cell text alignment (left, center, right, justify)
            align: 'left',
            // Cell vertical alignment (top, center, bottom)
            verticalAlign: 'top',
            // Cell text direction (ltr, rtl, ttb, btt)
            textDirection: 'ltr',
            // Cell text rotation (0, 90, 180, 270)
            textRotation: 0
          }
        },
        // Hyperlink style
        hyperlink: {
          // Hyperlink color (hex or color name)
          color: '#0066cc',
          // Hyperlink underline style (single, double, thick, dotted, dashDot, dashDotDot, wave)
          underline: 'single',
          // Hyperlink underline color (hex or color name)
          underlineColor: '#0066cc',
          // Visited hyperlink color (hex or color name)
          visitedColor: '#800080',
          // Hover hyperlink color (hex or color name)
          hoverColor: '#ff0000',
          // Hover background color (hex or color name)
          hoverBackground: '#ffff00',
          // Hover underline style (single, double, thick, dotted, dashDot, dashDotDot, wave)
          hoverUnderline: 'single',
          // Hover underline color (hex or color name)
          hoverUnderlineColor: '#ff0000',
          // Hover effect (none, color, background, underline, all)
          hoverEffect: 'underline'
        },
        // Image style
        image: {
          // Image alignment (left, center, right, inline)
          align: 'center',
          // Image width (in points or percentage)
          width: '100%',
          // Image height (in points or auto)
          height: 'auto',
          // Image border
          border: {
            style: 'none',
            size: 1,
            color: '#000000',
            space: 0
          },
          // Image margin (in points)
          margin: {
            top: 8,
            right: 0,
            bottom: 8,
            left: 0
          },
          // Image padding (in points)
          padding: 0,
          // Image rotation (in degrees)
          rotation: 0,
          // Image wrapping (inline, square, tight, through, topAndBottom, behind, inFront)
          wrap: 'inline',
          // Image position (in points from top-left corner)
          position: {
            x: 0,
            y: 0
          },
          // Image size (in points)
          size: {
            width: 0,
            height: 0
          },
          // Image scaling (percentage)
          scale: 100,
          // Image brightness (percentage)
          brightness: 100,
          // Image contrast (percentage)
          contrast: 100
        },
        // Page break style
        pageBreak: {
          // Page break before (auto, always, left, right, page)
          before: 'auto',
          // Page break after (auto, always, left, right, page)
          after: 'auto',
          // Page break inside (auto, avoid)
          inside: 'auto',
          // Widow control (auto, avoid)
          widow: 'auto',
          // Orphan control (auto, avoid)
          orphan: 'auto',
          // Keep with next (auto, always)
          keepNext: 'auto',
          // Keep lines together (auto, always)
          keepLines: 'auto'
        },
        // Section break style
        sectionBreak: {
          // Section break type (nextPage, nextColumn, evenPage, oddPage)
          type: 'nextPage',
          // Section break page numbering (continue, restart, nextPage, nextColumn, evenPage, oddPage)
          pageNumbering: 'continue',
          // Section break page orientation (portrait, landscape)
          pageOrientation: 'portrait',
          // Section break page size (Letter, A4, etc.)
          pageSize: 'Letter',
          // Section break page margins (in points)
          pageMargins: {
            top: 72,
            right: 72,
            bottom: 72,
            left: 72,
            header: 36,
            footer: 36,
            gutter: 0
          },
          // Section break page columns
          pageColumns: 1,
          // Section break page column spacing (in points)
          pageColumnSpacing: 12,
          // Section break line numbering (start, restart, continue, off)
          lineNumbering: 'continue',
          // Section break line numbering start
          lineNumberingStart: 1,
          // Section break line numbering increment
          lineNumberingIncrement: 1,
          // Section break line numbering distance (in points)
          lineNumberingDistance: 6,
          // Section break line numbering count by
          lineNumberingCountBy: 1,
          // Section break line numbering restart
          lineNumberingRestart: 'continuous',
          // Section break line numbering format (decimal, upperRoman, lowerRoman, upperLetter, lowerLetter, etc.)
          lineNumberingFormat: 'decimal',
          // Section break line numbering separator (tab, space, none)
          lineNumberingSeparator: 'tab'
        }
      }
    }
  }
};
