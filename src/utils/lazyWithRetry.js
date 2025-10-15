// A small helper to mitigate stale chunk cache errors in production builds.
// If a dynamically imported chunk fails to load (e.g., 404 due to cache),
// we force a hard reload so the browser fetches the latest index/assets mapping.
// Implemented synchronously (no top-level await) for ES2020 targets.
import { lazy } from 'react';

export default function lazyWithRetry(factory) {
  return lazy(() =>
    factory().catch((err) => {
      const msg = String(err && err.message ? err.message : err);
      // Vite preview/dev/prod typical messages
      const isChunkFail = /Loading chunk \d+ failed|Failed to fetch dynamically imported module|Importing a module script failed/i.test(msg);
      if (isChunkFail && typeof window !== 'undefined') {
        // Try once to reload the page to refresh the manifest and chunk URLs
        window.location.reload();
      }
      throw err;
    })
  );
}
