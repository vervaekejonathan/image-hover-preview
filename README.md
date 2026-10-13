# Image Hover Preview

A tiny Firefox extension that shows a preview in the middle of the page when you hover over a link to an image.

- Works on links ending in `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` or `.svg`, and on GitHub attachment links (`github.com/user-attachments/assets/...`).
- Shows a thumbnail instantly when the page already has one, then swaps in the full image.
- Preview is at most 500×500 px, keeps its aspect ratio and sits on a dark background so white images stay visible.

## Privacy

- No extra permissions: no storage, no tabs, no background script. The only access it needs is permission to run on web pages.
- No third-party libraries, no tracking, no data collection.
- The extension itself makes no network requests. When you hover a link, Firefox does download that image from the website hosting it, with the referrer removed.

## Install

**Temporary (for trying it out):**

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…** and select `manifest.json`.
3. If previews don't show, go to `about:addons` → **Image Hover Preview** → **Permissions** and allow access to websites.

Temporary add-ons are removed when Firefox restarts. To keep it permanently, sign it (unlisted, for yourself) via [addons.mozilla.org](https://addons.mozilla.org/developers/) and install the signed `.xpi` file.

**Pin to toolbar:** 🧩 extensions menu → gear next to *Image Hover Preview* → **Pin to Toolbar**.

## Adding more sites

Some image links have no file extension. Add a pattern to `KNOWN_IMAGE_URLS` at the top of `content.js`, then click **Reload** in `about:debugging`.

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension settings (Manifest V3, Firefox 128+) |
| `content.js` | Hover detection and preview |
| `icons/icon.svg` | Toolbar and add-on icon |

## License

[MIT](LICENSE)
