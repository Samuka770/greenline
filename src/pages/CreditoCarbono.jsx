import '../styles/credito-de-carbono.css';
import arvoreVidroMao from '../img/arvore-vidro-mao.png';
import ComparisonFigure from '../components/ComparisonFigure.jsx';

export default function CreditoCarbono() {
  return (
    <main id="topo">
      <section className="section-pad hero-pane hero-split reveal" aria-labelledby="cc-hero-title">
        <div className="hero-bg-shape" aria-hidden="true"></div>
        <div className="inner hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Mercado Voluntário de Carbono</p>
            <h1 id="cc-hero-title">
              Potencialize sua estratégia climática com <span className="grad-accent">Créditos de Carbono</span> Greenline
            </h1>
            <p className="lead">Integridade, rastreabilidade e impacto real em conservação florestal com monitoramento contínuo e validação independente.</p>
            <ul className="hero-bullets">
              <li>MRV estruturado e auditoria independente</li>
              <li>Dados geoespaciais e modelos proprietários</li>
            </ul>
            <div className="actions">
              <a className="btn primary" href="/contato">Fale conosco</a>
              <a className="btn" href="/apresentacao">Ver apresentação</a>
            </div>
          </div>
          <div className="hero-media">
            <ComparisonFigure />
          </div>
        </div>
        <div className="hero-bottom-wave" aria-hidden="true"></div>
      </section>

      <section className="section-pad reveal-left" aria-label="Benefícios principais">
        <div className="inner">
          <div className="features-row alt-surface">
            <div className="feature">
              <div className="icon">✓</div>
              <h3>Integridade</h3>
              <p>Métodos conservadores e verificáveis, com prevenção à dupla contagem.</p>
            </div>
            <div className="feature">
              <div className="icon">◎</div>
              <h3>Rastreabilidade</h3>
              <p>Emissão em lotes únicos com metadados completos e consulta pública.</p>
            </div>
            <div className="feature">
              <div className="icon">★</div>
              <h3>Tecnologia</h3>
              <p>Monitoramento satelital e modelos analíticos proprietários.</p>
            </div>
            <div className="feature">
              <div className="icon">♺</div>
              <h3>Impacto</h3>
              <p>Conservação de ecossistemas e co-benefícios socioambientais.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad reveal-right" aria-labelledby="cc-oque-title">
        <div className="inner split enhanced">
          <div className="split-media">
            <div className="media-frame angled">
              <img src={arvoreVidroMao} alt="Ilustração de créditos de carbono" />
            </div>
          </div>
          <div className="split-copy">
            <h2 id="cc-oque-title" className="section-title">O que é um Crédito de Carbono?</h2>
            <p>
              É uma unidade que representa a remoção ou a não emissão de 1 tCO₂e da atmosfera. No caso de projetos florestais de conservação, corresponde ao carbono que permanece estocado na biomassa graças à proteção e manejo sustentável da floresta, evitando que esse carbono seja liberado por desmatamento ou degradação.
            </p>
            <ul className="check">
              <li>Mensuração robusta com inventário florestal e sensoriamento remoto</li>
              <li>Geoestatística avançada para reduzir incertezas</li>
              <li>Transparência e integridade em todo o ciclo MRV</li>
            </ul>
          </div>
        </div>
        <div className="section-deco dots" aria-hidden="true"></div>
      </section>

      <section className="section-pad steps reveal" aria-labelledby="cc-metodo-title">
        <div className="inner">
          <header className="center-head">
            <h2 id="cc-metodo-title" className="section-title">Measurement, Reporting and Verification</h2>
            <p className="lead">
              Estrutura completa de <strong>Mensuração</strong>, <strong>Relato</strong> e <strong>Verificação</strong> para garantir integridade e credibilidade climática.
            </p>
          </header>
          <div className="steps-grid cols-3">
            <div className="step">
              <div className="num">1</div>
              <h3>Mensuração (M)</h3>
              <p>Uso de satélites e geotecnologias para medir perímetros, biomassa, qualidade da vegetação e carbono estocado.</p>
            </div>
            <div className="step">
              <div className="num">2</div>
              <h3>Relato (R)</h3>
              <p>Relatórios, planilhas e mapas que comunicam esses dados de forma clara e auditável, seguindo a nossa metodologia.</p>
            </div>
            <div className="step">
              <div className="num">3</div>
              <h3>Verificação (V)</h3>
              <p>Metodologia qualificada e validada por terceiros independentes através de cruzamento com dados de campo.</p>
            </div>
          </div>
          <div className="stats-band cols-3 soft-glow" aria-label="Resultados e estatísticas">
            <div className="stat">
              <strong>Monitoramento</strong>
              <span>contínuo via satélite</span>
            </div>
            <div className="stat">
              <strong>Transparência de dados</strong>
              <span>informações claras e de fácil acesso.</span>
            </div>
            <div className="stat">
              <strong>Confiabilidade científica</strong>
              <span>metodologia validada e verificada</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad cta-band reveal-right" aria-labelledby="participar">
        <div className="inner narrow">
          <h2 id="participar" className="section-title">Pronto para acelerar sua descarbonização?</h2>
          <p className="lead">Conecte-se com a Greenline para estruturar uma estratégia climática robusta com créditos de alta integridade.</p>
          <div className="actions">
            <a className="btn-ghost" href="/contato">Falar com a Greenline</a>
          </div>
        </div>
      </section>

      <section className="section-pad faq-block reveal" aria-labelledby="cc-faq-title">
        <div className="inner narrow">
          <h2 id="cc-faq-title" className="section-title">Perguntas Frequentes</h2>
          <div className="faq-list">
            <details>
              <summary>Em quais escopos os créditos podem ser utilizados?</summary>
              <p>Usualmente para compensar emissões residuais dos escopos 1, 2 e 3, após ações de redução interna e seguindo a hierarquia de mitigação.</p>
            </details>
            <details>
              <summary>Como evitam dupla contagem?</summary>
              <p>Registro único por lote, auditoria independente, e checagem cruzada espacial para evitar superposição com outras iniciativas.</p>
            </details>
            <details>
              <summary>Como monitoram a permanência dos créditos?</summary>
              <p>Modelos de risco (incêndio, conversão, clima), dados históricos e buffers de garantia asseguram permanência ao longo do tempo.</p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}
