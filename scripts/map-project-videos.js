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

  const isPlaceholder = (v) => !v || v.includes('/') || v === 'background-validacao.mp4';

  let updated = 0;
  const matched = [];
  const corrected = [];
  const missing = [];

  for (const p of projects) {
    const nameSlug = slugify(p.name);
    const currentVideo = p.video || '';
    const currentSlug = currentVideo ? slugify(currentVideo.replace(/\.mp4$/i, '')) : '';

    let chosen = null;

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

    // Try to find by project name slug
    if (videoIndex.has(nameSlug)) {
      chosen = videoIndex.get(nameSlug);
    }

    // Try relaxed variants: remove common words like 'fazenda', 'sitio', 'lote', 'matricula', 'matriculas'
    if (!chosen) {
      const relaxed = nameSlug
        .replace(/\b(fazenda|sitio|s\u00edtio|lote|matricula|matriculas|grupo|grupos)\b/g, '')
        .replace(/-{2,}/g, '-')
        .replace(/^-+|-+$/g, '');
      if (videoIndex.has(relaxed)) chosen = videoIndex.get(relaxed);
    }

    // If current video had a name (even placeholder path), try its slug too
    if (!chosen && currentSlug && videoIndex.has(currentSlug)) {
      chosen = videoIndex.get(currentSlug);
    }

    if (chosen) {
      p.video = slugify(path.basename(chosen, path.extname(chosen))) + '.mp4';
      matched.push({ name: p.name, video: p.video });
      updated++;
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
