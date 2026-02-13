import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

function makePlaceholder(title, subtitle, colorA = '#ffd6e0', colorB = '#ff4b7a') {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
    <defs>
      <linearGradient id='g' x1='0' x2='1'>
        <stop offset='0' stop-color='${colorA}' />
        <stop offset='1' stop-color='${colorB}' />
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)' rx='20' ry='20' />
    <g>
      <circle cx='980' cy='120' r='110' fill='rgba(255,255,255,0.08)' />
      <circle cx='140' cy='660' r='140' fill='rgba(255,255,255,0.06)' />
    </g>
    <text x='80' y='420' font-size='72' fill='#fff' font-family='Dancing Script, serif'>${title}</text>
    <text x='80' y='520' font-size='28' fill='rgba(255,255,255,0.95)'>${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const FALLBACK = [
  makePlaceholder('First Met', '14 Apr 2022'),
  makePlaceholder('First Valentine', '14 Feb 2023'),
  makePlaceholder('Marriage', '15 Dec 2024'),
  makePlaceholder('First Trip', '24 Dec 2024')
];

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(src);
    img.src = src;
  });
}

// Tries a manifest first, otherwise probes common filenames
async function discoverPublicPhotos() {
  // Use PUBLIC_URL as the base so this works when app is served from a subpath
  const rawBase = (process.env.PUBLIC_URL || '').toString();
  const base = rawBase.replace(/\/$/, ''); // remove trailing slash if any

  // try manifest using both PUBLIC_URL and root (''), in case app is served at root or a subpath
  const basesToTry = Array.from(new Set([base, '']));
  for (const b of basesToTry) {
    try {
      const manifestUrl = `${b}/photos/manifest.json`.replace(/\/\//g, '/');
      // record manifest attempt in diagnostics via a temporary variable (will return it if needed)
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(manifestUrl);
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length) {
          const urls = list.map(f => `${b}/photos/${f}`.replace(/\/\//g, '/'));
          // preload and filter
          const settled = await Promise.allSettled(urls.map(preloadImage));
          const found = settled.filter(s => s.status === 'fulfilled').map(s => s.value);
          const failed = settled.filter(s => s.status === 'rejected').map(s => s.reason || 'unknown');
          return { found, tried: urls, failed, manifestTried: basesToTry.map(x => `${x}/photos/manifest.json`.replace(/\/\//g, '/')) };
        }
      }
    } catch (e) {
      // ignore and continue to next base
    }
  }

  // probe common names (photo1..10, img1..10, 1..10)
  const prefixes = ['photo', 'img', 'image', 'pic'];
  const exts = ['jpg', 'jpeg', 'png', 'webp'];
  const candidates = [];
  for (const p of prefixes) {
    for (let i = 1; i <= 12; i++) {
      for (const e of exts) candidates.push(`/photos/${p}${i}.${e}`);
    }
  }
  for (let i = 1; i <= 12; i++) {
    for (const e of exts) candidates.push(`/photos/${i}.${e}`);
  }

  // prepend base to candidates so probing works when app is hosted on a subpath
  const rawBase2 = (process.env.PUBLIC_URL || '').toString();
  const base2 = rawBase2.replace(/\/$/, '');
  const probed = candidates.map(c => `${base2}${c}`);

  const results = [];
  const failed = [];
  const tried = [];
  // try to preload candidates but stop once we have a reasonable number
  for (const c of probed) {
    tried.push(c);
    try {
      // eslint-disable-next-line no-await-in-loop
      const ok = await preloadImage(c);
      results.push(ok);
      if (results.length >= 12) break;
    } catch (e) {
      failed.push(c);
    }
  }

  return { found: results, tried, failed };
}

export default function Gallery() {
  const [images, setImages] = useState(FALLBACK);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [diagnostics, setDiagnostics] = useState({ tried: [], failed: [], found: [] });

  useEffect(() => {
    let mounted = true;
    discoverPublicPhotos().then(result => {
      if (!mounted) return;
      // result can be array (older) or object {found,tried,failed}
      if (Array.isArray(result)) {
        if (result && result.length) {
          setImages(result);
          setIndex(0);
          setDiagnostics({ tried: [], failed: [], found: result, manifestTried: [] });
        } else {
          setDiagnostics({ tried: [], failed: [], found: [], manifestTried: [] });
        }
      } else if (result && typeof result === 'object') {
        const { found, tried, failed } = result;
        if (found && found.length) {
          setImages(found);
          setIndex(0);
        }
        setDiagnostics({ tried: tried || [], failed: failed || [], found: found || [], manifestTried: result.manifestTried || [] });
      }
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  function go(n) {
    if (isAnimating || images.length === 0) return;
    setIsAnimating(true);
    setDir(n > 0 ? 1 : -1);
    setIndex(i => (i + (n > 0 ? 1 : -1) + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 750);
  }

  const prevIdx = (index - dir + images.length) % images.length;

  const flipperStyle = {
    width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', borderRadius: 12
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass p-6 rounded-2xl">
        <div className="text-center mb-4">Photo Gallery</div>
        <div style={{ perspective: 1800 }} className="relative">
          <div className="w-full h-64 sm:h-80 mx-auto relative" style={{ minHeight: 320 }}>
            {loading && <div className="absolute inset-0 flex items-center justify-center">Loading photos…</div>}

            <img src={images[prevIdx]} alt={`base-${prevIdx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', willChange: 'transform' }} />

            <motion.div
              key={index}
              initial={{ rotateY: dir === 1 ? -180 : 180 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: dir === 1 ? 180 : -180 }}
              transition={{ duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ ...flipperStyle, transformOrigin: dir === 1 ? 'left center' : 'right center', zIndex: 5 }}
            >
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 12, boxShadow: '0 30px 60px rgba(0,0,0,0.35)' }}>
                <img src={images[index]} alt={`front-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', willChange: 'transform' }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.18), rgba(0,0,0,0))', mixBlendMode: 'multiply', pointerEvents: 'none' }} />
            </motion.div>

            <div style={{ position: 'absolute', top: 12, right: dir === 1 ? 12 : 'auto', left: dir === -1 ? 12 : 'auto', width: 6, height: 'calc(100% - 24px)', borderRadius: 3, background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.06))', opacity: 0.9 }} />
          </div>

          <div className="flex items-center justify-between mt-4">
            <button disabled={isAnimating} onClick={() => go(-1)} className="px-4 py-2 rounded-md bg-white/30">Prev</button>
            <div className="text-sm text-gray-700">{images.length ? (index + 1) : 0} / {images.length}</div>
            <button disabled={isAnimating} onClick={() => go(1)} className="px-4 py-2 rounded-md bg-valent-500 text-white">Next</button>
          </div>
          {(!loading && (!diagnostics.found || diagnostics.found.length === 0)) && (
            <div className="mt-4 text-xs text-left text-gray-600 bg-white/5 p-3 rounded">
              <div><strong>No photos found in <code>/public/photos</code>.</strong></div>
              <div className="mt-2">What I tried:</div>
              {diagnostics.manifestTried && diagnostics.manifestTried.length > 0 && (
                <div className="mt-1"><strong>Manifest URLs tried:</strong></div>
              )}
              <ul className="list-disc list-inside text-xs">
                {diagnostics.manifestTried && diagnostics.manifestTried.slice(0, 8).map((u, i) => <li key={`m-${i}`}>{u}</li>)}
              </ul>
              <div className="mt-1"><strong>Tried URLs:</strong></div>
              <ul className="list-disc list-inside text-xs">
                {diagnostics.tried.slice(0, 8).map((u, i) => <li key={`t-${i}`}>{u}</li>)}
              </ul>
              <div className="mt-1"><strong>Failed URLs:</strong></div>
              <ul className="list-disc list-inside text-xs">
                {diagnostics.failed.slice(0, 8).map((u, i) => <li key={`f-${i}`}>{u}</li>)}
              </ul>
              <div className="mt-2">To fix: add photos to <code>public/photos/</code> (recommended: include a <code>manifest.json</code> listing filenames), then restart the dev server.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
