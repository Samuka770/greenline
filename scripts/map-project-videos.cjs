/*
  Map project entries in src/data/projects.json to video files in src/videos by slug.
  - Keeps existing valid mappings
  - Replaces placeholders like ./img/background-validacao.mp4
  - Adds missing "video" fields when a match is found
  - Prints a summary of matches and misses
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PROJECTS_PATH = path.join(ROOT, 'src', 'data', 'projects.json');
const VIDEOS_DIR = path.join(ROOT, 'src', 'videos');

function slugify(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/&/g, ' e ')
    .replace(/\s*\/(?:\s*|$)/g, ' ') // replace slashes with space
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function main() {
  const FORCE_FROM_NAME = process.argv.includes('--from-name');
  if (!fs.existsSync(PROJECTS_PATH)) {
    console.error('projects.json not found at', PROJECTS_PATH);
    process.exit(1);
  }
  if (!fs.existsSync(VIDEOS_DIR)) {
    console.error('videos directory not found at', VIDEOS_DIR);
    process.exit(1);
  }

  const projects = readJSON(PROJECTS_PATH);
  if (!Array.isArray(projects)) {
    console.error('projects.json must be an array');
    process.exit(1);
  }

  // Build index of videos by slug (base filename)
  const files = fs.readdirSync(VIDEOS_DIR).filter(f => f.toLowerCase().endsWith('.mp4'));
  const videoIndex = new Map(); // slug -> filename
  for (const f of files) {
    const base = path.basename(f, path.extname(f));
    const slug = slugify(base);
    if (!videoIndex.has(slug)) videoIndex.set(slug, f);
  }

  const STOPWORDS = new Set([
    'fazenda','fazendas','sitio','sito','lote','matricula','matriculas','grupo','grupos',
    'e','do','da','dos','das','de','del','la','el'
  ]);

  const SYNONYMS = new Map([
    ['tres','3'],
    ['três','3'],
    ['manuel','manoel'],
  ]);

  const normalizeToken = (t) => {
    t = t.trim();
    if (!t) return t;
    if (SYNONYMS.has(t)) t = SYNONYMS.get(t);
    if (/^0+\d+$/.test(t)) t = String(parseInt(t, 10)); // remove leading zeros
    // naive singularization for Portuguese common nouns (best-effort)
    if (t.length > 4 && /s$/.test(t)) t = t.replace(/s$/, '');
    return t;
  };

  const tokenize = (slug) => slug
    .split('-')
    .map(s => normalizeToken(s))
    .filter(Boolean)
    .filter(s => !STOPWORDS.has(s));

  // Precompute token sets for videos
  const videoTokens = [];
  for (const [slug, fname] of videoIndex) {
    const tokens = tokenize(slug);
    videoTokens.push({ slug, fname, tokens, tokenSet: new Set(tokens) });
  }

  const isPlaceholder = (v) => !v || v.includes('/') || v === 'background-validacao.mp4';

  let updated = 0;
  const matched = [];
  const corrected = [];
  const missing = [];

  const fileNameFromName = (name) => {
    const withoutSlash = String(name || '').replace(/[\/]+/g, ' ');
    const collapsed = withoutSlash.replace(/\s{2,}/g, ' ').trim();
    return `${collapsed}.mp4`;
  };

  for (const p of projects) {
    const nameSlug = slugify(p.name);
    const linkSlug = (typeof p.link === 'string' && p.link)
      ? slugify(p.link.split('/').filter(Boolean).pop() || '')
      : '';
    const currentVideo = p.video || '';
    const currentSlug = currentVideo ? slugify(currentVideo.replace(/\.mp4$/i, '')) : '';

    let chosen = null;

    if (FORCE_FROM_NAME) {
      const forced = fileNameFromName(p.name);
      if (p.video !== forced) {
        p.video = forced;
        updated++;
      }
      // In force mode, just continue without trying to match files
      continue;
    }

    // If current video is present and matches an existing file (by slug), keep but correct filename casing if needed
    if (currentVideo && !isPlaceholder(currentVideo) && videoIndex.has(currentSlug)) {
      const fname = videoIndex.get(currentSlug);
      if (currentVideo !== fname) {
        p.video = slugify(path.basename(fname, path.extname(fname))) + '.mp4';
        corrected.push({ name: p.name, from: currentVideo, to: p.video });
        updated++;
      }
      continue; // nothing else to do
    }

    // Try exact slug
    if (videoIndex.has(nameSlug)) {
      chosen = videoIndex.get(nameSlug);
    }

    // Token subset fuzzy match (video tokens subset of project tokens)
    if (!chosen) {
      const projTokens = tokenize(nameSlug);
      const linkTokens = linkSlug ? tokenize(linkSlug) : [];
      const combinedTokens = [...new Set([...projTokens, ...linkTokens])];
      const projSet = new Set(projTokens);
      const combinedSet = new Set(combinedTokens);

      const candidateScores = [];
      for (const v of videoTokens) {
        if (v.tokens.length === 0) continue;
        // Require at least 2 meaningful tokens or 1 token with length >= 4
        const meaningful = v.tokens.filter(t => t.length >= 2);
        if (meaningful.length < 2 && !(meaningful.length === 1 && meaningful[0].length >= 4)) continue;

        let allIn = true;
        let hits = 0;
        for (const t of v.tokens) {
          if (combinedSet.has(t)) {
            hits++;
          } else {
            allIn = false;
          }
        }
        // accept if all video tokens contained in project OR high overlap
        if (allIn || hits >= Math.max(2, Math.ceil(v.tokens.length * 0.6))) {
          candidateScores.push({ v, score: hits, len: v.tokens.length });
        }
      }
      if (candidateScores.length) {
        candidateScores.sort((a,b) => b.score - a.score || b.len - a.len);
        chosen = candidateScores[0].v.fname;
      }
    }

    // If current video had a name (even placeholder path), try its slug too
    if (!chosen && currentSlug && videoIndex.has(currentSlug)) {
      chosen = videoIndex.get(currentSlug);
    }

    // Try exact by link slug as last resort
    if (!chosen && linkSlug && videoIndex.has(linkSlug)) {
      chosen = videoIndex.get(linkSlug);
    }

    if (chosen) {
      const newVal = slugify(path.basename(chosen, path.extname(chosen))) + '.mp4';
      if (p.video !== newVal) {
        p.video = newVal;
        matched.push({ name: p.name, video: p.video });
        updated++;
      }
    } else {
      // leave as is (may be external path or truly missing)
      missing.push(p.name);
    }
  }

  if (updated > 0) {
    writeJSON(PROJECTS_PATH, projects);
  }

  console.log(`Videos indexed: ${videoIndex.size}`);
  console.log(`Projects: ${projects.length}`);
  console.log(`Updated: ${updated}`);
  if (corrected.length) {
    console.log('Corrected existing video entries:');
    for (const c of corrected) console.log(` - ${c.name}: ${c.from} -> ${c.to}`);
  }
  if (matched.length) {
    console.log('Matched by name/relaxed:');
    for (const m of matched) console.log(` - ${m.name}: ${m.video}`);
  }
  if (missing.length) {
    console.log('No match found for:');
    for (const n of missing) console.log(` - ${n}`);
  }
}

main();
