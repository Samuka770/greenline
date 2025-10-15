import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import projects from '../data/projects.json';
import '../styles/projetos.css';
import videoFallback from '../img/background-validacao.mp4';

// Mapeia todos os .mp4 sob src/ para URLs estáticas resolvidas pelo Vite
// Isso permite usar caminhos vindos do JSON (ex.: "./img/arquivo.mp4" ou "caure-grupo-2.mp4")
const VIDEO_URLS = import.meta.glob('../**/*.mp4', { eager: true, query: '?url', import: 'default' });

// Build um índice por slug para arquivos em src/videos/*.mp4
const VIDEO_BY_SLUG = (() => {
  const map = new Map();
  const toSlug = (s) => s.toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  for (const [key, url] of Object.entries(VIDEO_URLS)) {
    // queremos apenas os dentro de ../videos/
    if (!key.includes('/videos/')) continue;
    const file = key.split('/').pop() || '';
    const base = file.replace(/\.mp4$/i, '');
    map.set(toSlug(base), url);
  }
  return { get: (slug) => map.get(slug), toSlug };
})();

// Índice auxiliar para fallback aproximado por tokens (nome do vídeo mais próximo)
const VIDEO_TOKEN_INDEX = (() => {
  const toSlug = VIDEO_BY_SLUG.toSlug;
  const STOP = new Set(['fazenda','fazendas','sitio','lote','matricula','matriculas','grupo','grupos','e','do','da','dos','das']);
  const SYN = new Map([
    ['três','3'], ['tres','3'],
    ['manuel','manoel'],
  ]);
  const normTok = (t) => {
    t = t.trim();
    if (!t) return t;
    if (SYN.has(t)) t = SYN.get(t);
    if (/^0+\d+$/.test(t)) t = String(parseInt(t,10));
    if (t.length > 4 && /s$/.test(t)) t = t.replace(/s$/,''); // singularização simples
    return t;
  };
  const tokenize = (text) => {
    return toSlug(text).split('-').map(normTok).filter(Boolean).filter(x => !STOP.has(x));
  };
  const entries = [];
  for (const [key, url] of Object.entries(VIDEO_URLS)) {
    if (!key.includes('/videos/')) continue;
    const file = key.split('/').pop() || '';
    const base = file.replace(/\.mp4$/i, '');
    const tokens = tokenize(base);
    entries.push({ url, tokens, len: tokens.length });
  }
  const findBestByTokens = (tokens) => {
    if (!tokens || tokens.length === 0) return null;
    const set = new Set(tokens);
    let best = null;
    let bestScore = -1;
    for (const e of entries) {
      if (!e.tokens.length) continue;
      let hits = 0;
      for (const t of e.tokens) if (set.has(t)) hits++;
      if (hits > bestScore || (hits === bestScore && e.len > (best?.len || 0))) {
        best = e; bestScore = hits;
      }
    }
    // Critério mínimo: pelo menos 2 acertos ou 1 acerto com token de 4+ letras
    if (!best) return null;
    if (bestScore >= 2) return best.url;
    if (bestScore === 1) {
      const longHit = best.tokens.find(t => tokens.includes(t) && t.length >= 4);
      if (longHit) return best.url;
    }
    return null;
  };
  return { tokenize, findBestByTokens };
})();

function resolveVideoFromJson(videoField) {
  // Casos triviais
  if (!videoField) return videoFallback;
  if (/^https?:\/\//.test(videoField) || videoField.startsWith('/')) return videoField;

  // Normaliza removendo ./ inicial, se houver
  const clean = videoField.replace(/^\.\//, '');

  // Candidatos de caminho relativos a este arquivo (src/pages)
  const candidates = [
    `../${clean}`,               // ex.: ../img/background-validacao.mp4
    `../videos/${clean}`,        // ex.: ../videos/caure-grupo-2.mp4
    `../img/${clean}`,           // ex.: ../img/caure-grupo-2.mp4
  ];

  for (const key of candidates) {
    if (VIDEO_URLS[key]) return VIDEO_URLS[key];
  }

  // Se não achou pelo caminho bruto, tenta por slug do próprio videoField (sem extensão)
  const base = clean.replace(/\.mp4$/i, '');
  const slugFromField = VIDEO_BY_SLUG.toSlug(base);
  const byFieldSlug = VIDEO_BY_SLUG.get(slugFromField);
  if (byFieldSlug) return byFieldSlug;

  // Se nada bater, usa fallback
  return videoFallback;
}
// Resolve o vídeo para um projeto: usa field "video" se existir; senão tenta por slug do "name"
function getVideoForProject(p){
  if (!p) return videoFallback;
  // 1) Se o JSON trouxe um caminho explícito, tenta resolver
  if (p.video) {
    const fromField = resolveVideoFromJson(p.video);
    if (fromField && fromField !== videoFallback) return fromField;
  }
  // 2) Tenta por slug do nome em src/videos/<slug>.mp4
  const slug = VIDEO_BY_SLUG.toSlug(p.name || '');
  const bySlug = VIDEO_BY_SLUG.get(slug);
  if (bySlug) return bySlug;
  // 2.1) Fallback aproximado por tokens (combina tokens do name e do videoField)
  const tokensName = VIDEO_TOKEN_INDEX.tokenize(p.name || '');
  const baseField = (p.video || '').replace(/\.mp4$/i,'');
  const tokensField = baseField ? VIDEO_TOKEN_INDEX.tokenize(baseField) : [];
  const combined = [...new Set([...tokensName, ...tokensField])];
  const approx = VIDEO_TOKEN_INDEX.findBestByTokens(combined);
  if (approx) return approx;
  // 3) fallback padrão
  return videoFallback;
}

export default function Projetos() {
  const [open, setOpen] = useState(false);
  const [selectedName, setSelectedName] = useState(projects[0]?.name || '');
  const dropdownRef = useRef(null);
  const videoRef = useRef(null);
  const selected = useMemo(()=> projects.find(p=>p.name===selectedName) || projects[0], [selectedName]);
  const videoSrc = useMemo(()=> getVideoForProject(selected), [selected]);
  const isFallback = videoSrc === videoFallback;

  // Preload the current video aggressively to reduce startup delay
  useEffect(() => {
    if (!videoSrc) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = videoSrc;
    // Some CDNs require anonymous to allow range requests during preload
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [videoSrc]);

  // Derivações auxiliares (placeholders imaginando dados adicionais futuramente)
  // (Métricas removidas a pedido: barra comparativa e participação no total)

  const closeOnOutside = useCallback((e)=>{
    if(open && dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
  },[open]);
  useEffect(()=>{
    document.addEventListener('mousedown', closeOnOutside);
    return ()=> document.removeEventListener('mousedown', closeOnOutside);
  },[closeOnOutside]);

  useEffect(()=>{
    const onKey = (e)=>{
      if(e.key==='Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  },[]);

  return (
    <main>
      {/* Hero Section */}
      <section id="inicio" className="projetos-hero" role="region" aria-label="Registro Público">
        <div className="projetos-hero-inner reveal">
          <h1 className="projetos-title">Registro Público</h1>
          <p className="projetos-subtitle">Projetos Greenline</p>
          <Link className="projetos-cta" to="/registros">Conheça os projetos</Link>
        </div>
      </section>

      {/* Nova Seção Dinâmica de Seleção e Detalhes */}
      <section className="areas-section" aria-label="Detalhes da Área Selecionada">
        <div className="areas-container">
          <div className="area-selector-container" ref={dropdownRef}>
            <h3 className="selector-title" id="selectorLabel">Selecionar Área</h3>
            <div className="custom-dropdown">
              <button
                type="button"
                className="dropdown-button"
                aria-haspopup="listbox"
                aria-labelledby="selectorLabel"
                aria-expanded={open}
                onClick={()=> setOpen(o=>!o)}
              >
                <span className="selected-area">{selected?.name}</span>
                <span className={`dropdown-arrow${open? ' open':''}`}>▼</span>
              </button>
              {open && (
                <ul className="dropdown-menu" role="listbox" aria-activedescendant={selected?.name} tabIndex={-1}>
                  {projects.map(p=> (
                    <li key={p.name}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected?.name===p.name}
                        className={`dropdown-item${selected?.name===p.name? ' selected':''}`}
                        onClick={()=> { setSelectedName(p.name); setOpen(false); }}
                      >
                        <span className="area-name">{p.name}</span>
                        <span className="area-state">{p.state}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Painel de Detalhes */}
          <div className="area-details-section reveal" aria-live="polite">
            <div className="area-details-grid">
              <div className="area-visual">
                <div className="area-image-container">
                  {/* Substituindo placeholder por vídeo fixo. Pode-se mapear vídeos específicos depois. */}
                  <video
                    ref={videoRef}
                    key={videoSrc}
                    className="area-satellite-image"
                    src={videoSrc}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    loop={isFallback}
                    aria-label={`Visualização em vídeo ilustrativa da área selecionada`}
                    onLoadedMetadata={(e)=>{ const v=e.currentTarget; if(v.paused){ const p=v.play(); if(p&&p.catch) p.catch(()=>{}); } }}
                    onLoadedData={(e)=>{ const v=e.currentTarget; if(v.paused){ const p=v.play(); if(p&&p.catch) p.catch(()=>{}); } }}
                    onCanPlay={(e)=>{ const v=e.currentTarget; if(v.paused){ const p=v.play(); if(p&&p.catch) p.catch(()=>{}); } }}
                    onError={(e)=>{ const v=e.currentTarget; v.onerror=null; v.src=videoFallback; v.loop=true; const p=v.play(); if(p&&p.catch) p.catch(()=>{}); }}
                  />
                  {/* Overlay removido (estado e créditos) conforme solicitação */}
                </div>
              </div>
              <div className="area-info-panel">
                <header className="area-panel-header">
                  <div className="area-panel-title-wrap">
                    <h2 className="area-panel-title">{selected?.name}</h2>
                    <div className="badge-group">
                      <span className="badge state">{selected?.state}</span>
                      <span className="badge biome">{selected?.biome}</span>
                      <span className="badge status"><span className="dot" />Ativa</span>
                    </div>
                  </div>
                </header>

                <p className="area-description">
                  Área integrante do programa de monitoramento ambiental contínuo, mantendo cobertura vegetal e contribuindo para conservação de estoques de carbono, biodiversidade e serviços ecossistêmicos associados.
                </p>
                <ul className="area-text-list">
                  <li><span>País:</span> {selected?.country}</li>
                  <li><span>Estado:</span> {selected?.state}</li>
                  <li><span>Bioma:</span> {selected?.biome}</li>
                  <li><span>Vintage:</span> {selected?.vintage}</li>
                  <li><span>Créditos:</span> {selected?.credits.toLocaleString('pt-BR')}</li>
                </ul>

                {/* Estatísticas comparativas removidas conforme solicitação */}

                <div className="area-actions">
                  {selected?.link && (
                    <a href={selected.link} target="_blank" rel="noopener noreferrer" className="area-detail-btn primary">Ver Página Pública</a>
                  )}
                  <Link to="/registros" className="area-detail-btn secondary">Ver Registro Completo</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 'projetos-metodologia' movida para Registro.jsx */}
    </main>
  );
}