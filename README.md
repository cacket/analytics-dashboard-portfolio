# Boos — Business Analytics Dashboard

A front-end **portfolio project** showcasing responsive UI development, accessible interactions, data visualization and reusable application configuration.

A reusable business analytics dashboard with a black canvas, muted slate-blue accents and white typography. Built entirely with **HTML, CSS and vanilla JavaScript**. No framework, build step, remote fonts or runtime dependencies.

![Boos dashboard preview](assets/preview.png)

## Make it your own

Start with **`dashboard.config.js`**. Set your brand, workspace, profile, currency, accent palette, page titles, reports, customer records, regions and activity data in one file. Toggle individual dashboard sections using `sections`. Provide actual chart arrays to replace the demo's generated distributions.

For a step-by-step guide in Polish, see [CUSTOMIZE.md](CUSTOMIZE.md).

You can use, modify and integrate this dashboard into personal or commercial projects under the MIT license. Keep the license notice when redistributing the code. No visible Boos attribution is required in your interface.

## Run locally

Open `index.html` in your browser, or use the optional Node.js preview server:

```sh
node .tools/server.cjs
```

Visit `http://127.0.0.1:4180`.

## Features

- Overview, analytics, customer directory and downloadable reports
- Reporting period filters and accessible interactive revenue charts
- Order activity heatmap with selectable weeks
- Searchable transactions, customer search and global search (`Ctrl/Cmd + K`)
- CSV export generated in the browser
- Three muted accent palettes saved with localStorage
- Central project configuration, currency formatting and optional dashboard sections
- Responsive navigation, native accessible dialogs and reduced-motion support
- Local sample data, explicitly identified as a demo

## GitHub Pages

Upload this folder to a GitHub repository. In **Settings → Pages**, choose **Deploy from a branch**, select your branch and `/ (root)`, and save. The relative asset paths also work under a repository subpath. No build workflow is needed.

## Project structure

```text
index.html          Semantic dashboard layout
dashboard.config.js Brand, theme, text, features and business data
styles.css          Theme, charts and responsive layouts
app.js              Sample data and all dashboard interactions
.tools/server.cjs   Optional local preview server
.tools/check.cjs    Browser interaction and responsive layout checks
```

The default configuration is a portfolio demonstration. Notifications, profile information and business records are sample content; there is no authentication or backend. Changing `demo` hides the sample-data badges but does not connect a backend: provide your own records before using that setting.

## Browser checks

With the preview server running and Playwright installed in your test environment, run `node .tools/check.cjs`. Alternatively, set `BOOS_PLAYWRIGHT_PATH` to an existing `@playwright/test` installation. The checks cover six viewport widths (320–1920px), navigation, keyboard access, filtering, CSV content, dialogs, saved colors and opening the page directly from disk. A separate configuration test verifies a custom brand, Polish currency formatting, actual chart arrays, optional sections and branded CSV exports. Screenshots are saved to the ignored `.verification` folder.

## License

MIT. See `LICENSE`.
