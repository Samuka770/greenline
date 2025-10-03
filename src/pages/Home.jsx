import '../styles/index.css';

export default function Home() {
  return (
    <main>
      <section id="inicio" className="hero" role="region" aria-label="Destaque">
        <div className="hero-inner reveal">
          <img className="logo-inicio" src="src/img/logo-transparente-branco.png" alt="Logotipo Greenline" />
          <a className="cta" href="/sobre">Conheça a Greenline</a>
        </div>
      </section>

      <section className="metodologia-hero" role="region" aria-label="Metodologia">
        <video className="metodologia-hero__video-bg" src="src/img/background-validacao.mp4" autoPlay loop muted playsInline />
        <div className="metodologia-hero__inner reveal">
          <div className="metodologia-hero__content">
            <h2 className="metodologia-hero__title">
              Metodologia
              <br />
              <span>Greenline - Greensat</span>
            </h2>
            <p className="metodologia-hero__desc">
              A Metodologia Greenline/Greensat e seus Créditos de Carbono, são <strong>validados</strong> e{' '}
              <strong>verificados</strong> pela <span className="metodologia-hero__bv">Bureau Veritas</span>.
            </p>
            <a
              className="metodologia-hero__btn"
              href="https://www.bureauveritas.com.br/sites/g/files/zypfnx206/files/media/document/Declara%C3%A7%C3%A3o%20de%20Valida%C3%A7%C3%A3o%20Green%20Line%202023.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              VALIDAÇÃO
            </a>
          </div>
          <div className="metodologia-hero__logo">
            <img src="src/img/logo-greensat.png" alt="Logo Greensat Technology" />
            <div className="metodologia-hero__brand"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
