import '../styles/index.css';
import { Link } from 'react-router-dom';
import videoValidacao from '../img/background-validacao.mp4';
import logoGreensat from '../img/logo-greensat.png';

export default function Home() {
  return (
    <main>
      <section id="inicio" className="hero" role="region" aria-label="Destaque">
        <div className="hero-inner reveal">
          <img className="logo-inicio" src={logoGreensat} alt="Logo Greensat Technology" decoding="async" fetchpriority="high" />
          <Link className="cta" to="/sobre">Conheça a Greenline</Link>
        </div>
      </section>

      <section className="metodologia-hero" role="region" aria-label="Metodologia">
  <video className="metodologia-hero__video-bg" src={videoValidacao} autoPlay loop muted playsInline preload="metadata" />
        <div className="metodologia-hero__inner reveal">
          <div className="metodologia-hero__logo">
            <img src={logoGreensat} alt="Logo Greensat Technology" />
            <div className="metodologia-hero__brand"></div>
          </div>
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
        </div>
      </section>
    </main>
  );
}
