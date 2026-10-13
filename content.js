(() => {
  'use strict';

  const IMAGE_EXT = /\.(jpe?g|png|gif|webp|svg)$/i;
  // Image links without a file extension. Add more "host/path-prefix" patterns here.
  const KNOWN_IMAGE_URLS = [
    /^https:\/\/github\.com\/user-attachments\/assets\/[0-9a-f-]+$/i
  ];

  let container = null;
  let img = null;
  let label = null;
  let currentLink = null;
  // Downloads the full image in the background while a thumbnail is already on screen.
  const loader = new Image();
  loader.referrerPolicy = 'no-referrer';

  function isImageLink(a) {
    try {
      const url = new URL(a.href);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
      return IMAGE_EXT.test(url.pathname) || KNOWN_IMAGE_URLS.some((re) => re.test(url.origin + url.pathname));
    } catch {
      return false;
    }
  }

  function ensureContainer() {
    if (container) return;
    container = document.createElement('div');
    // Inline styles so page CSS can't easily restyle the preview; pointer-events:none prevents flicker.
    container.style.cssText = [
      'position:fixed', 'top:50%', 'left:50%', 'transform:translate(-50%,-50%)',
      'z-index:2147483647', 'display:none', 'min-width:48px', 'min-height:48px',
      'pointer-events:none', 'padding:6px', 'margin:0', 'background:#1e1e1e',
      'border:1px solid rgba(255,255,255,0.15)', 'border-radius:6px',
      'box-shadow:0 4px 16px rgba(0,0,0,0.45)'
    ].join(';');

    label = document.createElement('div');
    label.textContent = 'Loading…';
    label.style.cssText = 'color:#ccc;font:12px/36px sans-serif;padding:0 8px;margin:0';

    img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async'; // decode off the main thread so the page stays smooth
    img.referrerPolicy = 'no-referrer'; // don't tell the image host which page you were on
    img.style.cssText = [
      'display:block', 'max-width:min(500px,90vw)', 'max-height:min(500px,90vh)', 'width:auto', 'height:auto',
      'margin:0', 'padding:0', 'border:0', 'pointer-events:none'
    ].join(';');
    img.addEventListener('load', () => { if (currentLink) label.style.display = 'none'; });
    // Broken link or not actually an image (e.g. a video): hide instead of showing an empty box.
    img.addEventListener('error', () => { if (currentLink) hide(); });

    container.append(label, img);
    document.documentElement.appendChild(container);
  }

  function hide() {
    currentLink = null;
    if (!container) return;
    container.style.display = 'none';
    img.src = ''; // release the decoded image
    loader.src = '';
  }

  function show(a) {
    ensureContainer();
    currentLink = a;
    label.style.display = 'block';
    container.style.display = 'block'; // show "Loading…" right away so it never feels stuck

    // If the link wraps an image the page already loaded (e.g. GitHub), show it instantly,
    // then swap in the full image once it has downloaded.
    const thumb = a.querySelector('img');
    const thumbSrc = thumb && thumb.complete && thumb.naturalWidth ? thumb.currentSrc : '';
    if (thumbSrc && thumbSrc !== a.href) {
      img.src = thumbSrc;
      loader.onload = () => { if (currentLink === a) img.src = a.href; }; // now served from cache
      loader.src = a.href;
    } else {
      img.src = a.href; // Firefox renders large images progressively as they arrive
    }
  }

  document.addEventListener('mouseover', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (a === currentLink) return; // moving between children of the same link
    if (!a || !isImageLink(a)) { if (currentLink) hide(); return; }
    show(a);
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (!currentLink) return;
    // Ignore moves into a child element of the same link.
    if (e.relatedTarget instanceof Node && currentLink.contains(e.relatedTarget)) return;
    if (e.target instanceof Node && currentLink.contains(e.target)) hide();
  }, { passive: true });
})();
