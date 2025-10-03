import '../styles/sobre.css';

export default function Sobre() {
  return (
    <main className="sobre-wrapper" id="topo">
      <section className="sobre-hero reveal-fade" aria-labelledby="sobre-hero-title">
        <div className="sobre-hero__grid">
          <div className="sobre-hero__copy">
            <div className="sobre-hero__pre">Desde 2018</div>
            <h1 id="sobre-hero-title" className="sobre-hero__title">
              Estratégia, Tecnologia
              <br />
              <em>Impacto Climático Real</em>
            </h1>
            <p className="sobre-hero__desc">
              A Greenline combina <strong>conservação florestal</strong>, <strong>modelagem científica</strong> e{' '}
              <strong>monitoramento satelital</strong> para gerar resultados climáticos verificáveis e de alto valor para parceiros e ecossistemas.
            </p>
            <div className="sobre-hero__highlights" aria-label="Destaques estratégicos">
              <div className="highlight-item reveal-fade" style={{ ['--d']: '.15s' }}>
                <h3>Integridade Climática</h3>
                <p>Modelagem robusta + verificação independente para confiança de longo prazo.</p>
              </div>
              <div className="highlight-item reveal-fade" style={{ ['--d']: '.25s' }}>
                <h3>Tecnologia & Monitoramento</h3>
                <p>Uso de sensoriamento remoto e geoestatística para decisões precisas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="empresa" className="empresa-hero reveal-fade" aria-label="Nossa origem" style={{ ['--d']: '.15s' }}>
        <div className="empresa-hero__inner">
          <div className="empresa-hero__top">
            <img className="empresa-hero__logo" src="src/img/logo-transparente-branco.png" alt="Logo Greenline" />
            <div className="empresa-hero__brand" aria-hidden="true"></div>
          </div>
          <div className="empresa-hero__grid">
            <div className="reveal-fade" style={{ ['--d']: '.3s' }}>
              <div className="empresa-hero__year">Fundação</div>
              <p className="empresa-hero__text">
                A Greenline Associates LLC foi fundada em 2018, no estado de Wyoming - EUA, com o objetivo de ser uma empresa de desenvolvimento de soluções ambientais voltada à <strong>preservação florestal</strong> e <strong>combate ao desmatamento</strong>.
              </p>
            </div>
            <div className="reveal-fade" style={{ ['--d']: '.42s' }}>
              <p className="empresa-hero__text">
                Nossa atuação integra ciência aplicada, sistemas de monitoramento contínuo, transparência de dados e compromisso ético. Buscamos gerar confiança e integridade climática, criando valor para parceiros e clientes enquanto priorizamos a conservação de ecossistemas estratégicos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-block stagger" aria-label="Pilares estratégicos">
        <div className="feature-card">
          <div className="feature-icon">⚙️</div>
          <h3>Metodologia</h3>
          <p>Estruturas robustas de MRV com validação independente e atualização contínua.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛰️</div>
          <h3>Monitoramento</h3>
          <p>Uso de satélites, geoestatística e modelos proprietários para aferição de risco e estoque.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🌱</div>
          <h3>Conservação</h3>
          <p>Foco em permanência de carbono e proteção de biodiversidade em áreas de alta relevância.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔐</div>
          <h3>Integridade</h3>
          <p>Prevenção à dupla contagem, rastreabilidade e transparência documental.</p>
        </div>
      </section>

      <section className="split-block" aria-labelledby="valores-title">
        <div className="split-media reveal-fade" style={{ ['--d']: '.25s' }}>
          <div className="frame">
            <img src="src/img/background-satelite.png" alt="Imagem de floresta com gradiente" />
          </div>
        </div>
        <div className="split-copy reveal-fade" style={{ ['--d']: '.35s' }}>
          <h2 id="valores-title">Visão Estratégica</h2>
          <p>
            Estabelecer um padrão elevado para a geração, manutenção e credibilidade de resultados climáticos florestais, escalando soluções que aliem tecnologia, governança e impacto social legítimo.
          </p>
          <p>
            Buscamos parcerias de longa duração, foco em risco real e modelagem transparente para catalisar confiança e eficiência na transição para uma economia de baixo carbono.
          </p>
          <ul className="list-check">
            <li>Transparência técnica e documental</li>
            <li>Ciência aplicada e revisão contínua</li>
            <li>Rastreabilidade e segurança de dados</li>
            <li>Compromisso socioambiental permanente</li>
          </ul>
        </div>
      </section>

      <section className="cta-final reveal-fade" aria-labelledby="cta-final-title">
        <h2 id="cta-final-title">Quer conhecer melhor a empresa?</h2>
        <p>
          Clique no botão abaixo para ver nossa apresentação formal.
        </p>
        <a className="btn primary pill" href="/Apresentacao" target="_blank" rel="noopener">
          Apresentação
        </a>
      </section>
    </main>
  );
}
