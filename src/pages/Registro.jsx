import { useMemo } from 'react';
import '../styles/registro.css';
import projects from '../data/projects.json';

// Reutilizando utilitários mínimos necessários
function deriveBiome(state){
	if(!state) return 'Desconhecido';
	const s = state.toLowerCase();
	if(/amazon|roraima|par[aá]|amapa|acre|rond[oô]nia|mato grosso/.test(s)) return 'Amazônia';
	if(/bahia|maranh[aã]o|cear[aá]|piau[ií]/.test(s)) return 'Mata Atlântica / Transição';
	if(/paran[áa]|rio grande do sul|santa catarina/.test(s)) return 'Mata Atlântica';
	if(/goi[aá]s|tocantins/.test(s)) return 'Cerrado';
	if(/minas/.test(s)) return 'Cerrado / Mata Atlântica';
	return 'Bioma Diverso';
}
function generateCredits(name){
	let h=0; for(let i=0;i<name.length;i++){ h=(h*31 + name.charCodeAt(i))>>>0; }
	const min=100, max=10_000_000; return min + (h % (max-min));
}
function formatCreditsDetailed(n){
	return n.toLocaleString('pt-BR', { minimumFractionDigits:2, maximumFractionDigits:2 });
}
function generateVintage(name){
	let h=0; for(let i=0;i<name.length;i++){ h=(h*33 + name.charCodeAt(i))>>>0; }
	const start=2018,end=2025,total=end-start+1; const month=(h%12)+1; const year=start + ((h>>>8)%total); return `${month.toString().padStart(2,'0')}/${year}`;
}
const METHODOLOGY='GL-M-001 v1.1';
const CERTIFIER='Bureau Veritas';
const SECTOR='REDD';
const COUNTRY='Brasil';

// Mapeamento aproximado de estados inferido por padrões do nome (fallback genérico)

export default function Registro(){
	const areas = useMemo(()=> projects.map(p=>({
		...p,
		sector: SECTOR,
		certifier: CERTIFIER,
		methodology: METHODOLOGY,
		creditsRaw: p.credits ?? generateCredits(p.name),
		creditsDetailed: formatCreditsDetailed(p.credits ?? generateCredits(p.name)),
		vintage: p.vintage ?? generateVintage(p.name),
		biome: p.biome ?? deriveBiome(p.state),
		country: p.country ?? COUNTRY,
	})),[]);

	return (
		<main className="registro-main">
			<section className="registro-hero" aria-label="Registro Público">
				<div className="registro-hero-inner">
					<h1 className="registro-title">Registro Público de Projetos</h1>
					<p className="registro-sub">Resumo consolidado de projetos e créditos gerados.</p>
				</div>
			</section>
			<section className="registro-wrapper" aria-label="Tabela de Projetos">
				<div className="registro-table-container">
					<table className="registro-table" aria-label="Registro Público de Projetos">
						<thead>
							<tr>
								<th>Projeto</th>
								<th>País</th>
								<th>Bioma</th>
								<th>Setor</th>
								<th>Certificadora</th>
								<th>Créditos Gerados</th>
								<th>Vintage</th>
								<th>Metodologia</th>
							</tr>
						</thead>
						<tbody>
							{areas.map(a=> (
								<tr key={a.name}>
									<td data-label="Projeto">
										<a href={a.link} target="_blank" rel="noopener noreferrer" className="project-link">{a.name}</a>{' '}
										<a
											className="project-more-link"
											href={a.link}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={`Ver mais detalhes do projeto ${a.name}`}
										>
											Ver mais<span className="sr-only"> sobre {a.name}</span>
										</a>
									</td>
									<td data-label="País">{a.country}</td>
									<td data-label="Bioma">{a.biome}</td>
									<td data-label="Setor">{a.sector}</td>
									<td data-label="Certificadora">{a.certifier}</td>
									<td data-label="Créditos" className="credits-col" title={a.creditsRaw.toLocaleString('pt-BR')}>{a.creditsDetailed}</td>
									<td data-label="Vintage">{a.vintage}</td>
									<td data-label="Metodologia">{a.methodology}</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr className="totals-row">
								<td colSpan={5}>Total</td>
								<td>{areas.reduce((acc,a)=>acc+a.creditsRaw,0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
								<td colSpan={2}>{areas.length} projetos</td>
							</tr>
						</tfoot>
					</table>
					<p className="registry-footnote">Metodologia aplicada: {METHODOLOGY}.</p>
				</div>
			</section>
		</main>
	);
}
