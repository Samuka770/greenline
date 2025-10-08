import { useEffect } from 'react';
import '../styles/apresentacao.css';
import pdfApresentacao from '../pdfs/Greenline Institucional.pdf';
import apresentacaoBg from '../img/mapa-mundi-arvore.png';

export default function Apresentacao() {
  useEffect(() => {
    // Set page class and provide background image via CSS variable to avoid build-time unresolved URL warnings
    document.body.classList.add('page-apresentacao');
  document.body.style.setProperty('--apresentacao-bg', `url(${apresentacaoBg})`);
    return () => {
      document.body.classList.remove('page-apresentacao');
      document.body.style.removeProperty('--apresentacao-bg');
    };
  }, []);
  return (
    <main className="container reveal" aria-labelledby="titulo">
      <section className="card intro-seq" aria-labelledby="titulo" style={{ ['--d']: '.05s' }}>
        <h1 id="titulo" className="apresentacao-title">Apresentação</h1>
        <p className="apresentacao-sub">Se o PDF não carregar, use o botão para abrir em nova aba.</p>
        <div className="apresentacao-actions">
          <a className="btn primary pill" href={pdfApresentacao} target="_blank" rel="noopener">
            Abrir em nova guia
          </a>
        </div>
        <div className="pdf-wrap fade-lift" id="pdfWrap" tabIndex={0} style={{ ['--d']: '.25s' }}>
          <object className="pdf-embed" data={pdfApresentacao} type="application/pdf">
            <iframe className="pdf-iframe" src={pdfApresentacao} title="Apresentação Greenline" />
            <div className="fallback">
              Não foi possível incorporar o PDF neste navegador.
              <br />
              <a href={pdfApresentacao} target="_blank" rel="noopener">
                Clique aqui para abrir o arquivo
              </a>
              .
            </div>
          </object>
        </div>
      </section>
    </main>
  );
}
