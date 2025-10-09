import logoGreensat from '../img/logo-greensat.png';

// Componente isolado apenas do quadro comparativo (figure) conforme solicitado
export default function ComparisonFigure() {
  return (
    <figure className="media-frame comparison-card" role="group" aria-labelledby="cc-compare-title">
      <header className="comparison-header">
        <img className="comparison-logo-left" src={logoGreensat} alt="Greensat Technology" />
        <h3 id="cc-compare-title" className="comparison-title">Comparativo</h3>
        <div className="comparison-redd" aria-label="REDD"><strong>REDD+</strong></div>
      </header>
      <div className="comparison-table" role="table" aria-label="Comparativo Greenline vs REDD">
        {rows.map((r, i) => (
          <div key={i} className="comparison-row" role="row">
            <div className="cell left" role="cell">{r.left}</div>
            <div className="cell label" role="cell">{r.label}</div>
            <div className="cell right" role="cell">{r.right}</div>
          </div>
        ))}
      </div>
    </figure>
  );
}

const rows = [
  { left: '1', right: '1', label: 'TONELADAS CO2 POR HECTARE' },
  { left: '100 HECTARES', right: '15.000 HECTARES', label: 'PROJETO MÍNIMO' },
  { left: 'INTEGRAL', right: 'VARIÁVEL', label: 'PRESERVAÇÃO FLORESTAL' },
  { left: 'NÃO PERMITE', right: 'PERMITE', label: 'MANEJO FLORESTAL' },
  { left: '5 DIAS', right: '180 DIAS', label: 'PROJEÇÃO DE POTENCIAL' },
  { left: 'SATÉLITE', right: 'MANUAL', label: 'TECNOLOGIA' },
  { left: 'PERFORMADO', right: 'PROJETADO', label: 'MENSURAÇÃO DO VOLUME SEQUESTRADO' },
  { left: 'SIM', right: 'NÃO', label: 'CONTROLE RISCO DE INCÊNDIOS NASA' },
  { left: 'SIM', right: 'NÃO', label: 'RELATÓRIOS DE SAÚDE FLORESTAL' },
  { left: 'SIM', right: 'NÃO', label: 'FERRAMENTAS DE VERIFICAÇÃO ONLINE' },
  { left: 'SIM', right: 'NÃO', label: 'CONTROLE DE DESMATAMENTO ONLINE' },
  { left: 'SIM', right: 'NÃO', label: 'MONITORAMENTO DE BIOMASSA MENSAL' },
  { left: 'PROIBIDO', right: 'PERMITE', label: 'CORTE DE ÁRVORES CENTENÁRIAS' },
  { left: 'SIM', right: 'NÃO', label: 'CRÉDITOS RETROATIVOS DE ATÉ 11 ANOS' },
  { left: 'SIM', right: 'NÃO', label: 'REGISTRO CRÉDITOS EM BLOCKCHAIN' },
  { left: 'SIM', right: 'NÃO', label: 'SELO VERDE PARA COMPENSAÇÃO' },
  { left: '0%', right: '94%', label: 'POSSIBILIDADE DE CRÉDITOS FANTASMAS' },
  { left: 'ZERO', right: 'R$ XXX.XXX,XX', label: 'CUSTO DE CERTIFICAÇÃO' },
];
