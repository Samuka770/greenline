import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import projects from '../data/projects.json';
import '../styles/projetos.css';
import videoFallback from '../img/background-validacao.mp4';
import logoGreensat from '../img/logo-greensat.png';

export default function Projetos() {
  const [open, setOpen] = useState(false);
  const [selectedName, setSelectedName] = useState(projects[0]?.name || '');
  const dropdownRef = useRef(null);
  const selected = useMemo(()=> projects.find(p=>p.name===selectedName) || projects[0], [selectedName]);

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
      <section id="inicio" className="projetos-hero" role="region" aria-label="Áreas em Preservação">
        <div className="projetos-hero-inner reveal">
          <h1 className="projetos-title">Áreas em Preservação</h1>
          <p className="projetos-subtitle">Monitoradas em tempo Real!</p>
          <Link className="projetos-cta" to="/registros">Conheça as áreas</Link>
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
                    className="area-satellite-image"
                    src={selected?.video ? `src/videos/${selected.video}` : videoFallback}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-label={`Visualização em vídeo ilustrativa da área selecionada`}
                    onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=videoFallback; }}
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

      {/* Introduction Section */}
      <section className="projetos-metodologia" role="region" aria-label="Introdução">
  <video className="projetos-metodologia__video-bg" src={videoFallback} autoPlay loop muted playsInline />
        <div className="projetos-metodologia__inner reveal">
          <div className="projetos-metodologia__content">
            <h2 className="projetos-metodologia__title">Conheça as áreas<br /><span>em preservação pela Greenline</span></h2>
            <p className="projetos-metodologia__desc">A Greenline monitora <strong>mais de 50 áreas</strong> em preservação distribuídas por todo o Brasil, utilizando <strong>tecnologia satelital</strong> e <strong>sistemas de monitoramento contínuo</strong> para garantir a conservação e integridade florestal.</p>
            <div className="projetos-stats">
              <div className="projetos-stat"><div className="projetos-stat-number">50+</div><div className="projetos-stat-label">Áreas Monitoradas</div></div>
              <div className="projetos-stat"><div className="projetos-stat-number">12</div><div className="projetos-stat-label">Estados</div></div>
              <div className="projetos-stat"><div className="projetos-stat-number">24/7</div><div className="projetos-stat-label">Monitoramento</div></div>
            </div>
          </div>
          <div className="projetos-metodologia__logo">
            <img src={logoGreensat} alt="Logo Greensat Technology" />
            <div className="metodologia-hero__brand" />
          </div>
        </div>
      </section>
    </main>
  );
}