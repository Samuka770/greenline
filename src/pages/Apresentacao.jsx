import { useEffect } from 'react';
import '../styles/apresentacao.css';

export default function Apresentacao() {
  useEffect(() => {
    document.body.classList.add('page-apresentacao');
    return () => {
      document.body.classList.remove('page-apresentacao');
    };
  }, []);
  return (
    <main className="container reveal" aria-labelledby="titulo">
      <section className="card intro-seq" aria-labelledby="titulo" style={{ ['--d']: '.05s' }}>
        <h1 id="titulo" className="apresentacao-title">Apresentação</h1>
        <p className="apresentacao-sub">Se o PDF não carregar, use o botão para abrir em nova aba.</p>
        <div className="apresentacao-actions">
          <a className="btn primary pill" href="/pdfs/Greenline Institucional.pdf" target="_blank" rel="noopener">
            Abrir em nova guia
          </a>
        </div>
        <div className="pdf-wrap fade-lift" id="pdfWrap" tabIndex={0} style={{ ['--d']: '.25s' }}>
          <object className="pdf-embed" data="src/pdfs/Greenline Institucional.pdf" type="application/pdf">
            <iframe className="pdf-iframe" src="src/pdfs/Greenline Institucional.pdf" title="Apresentação Greenline" />
            <div className="fallback">
              Não foi possível incorporar o PDF neste navegador.
              <br />
              <a href="src/pdfs/Greenline Institucional.pdf" target="_blank" rel="noopener">
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
