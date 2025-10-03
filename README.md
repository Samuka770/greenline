## Greenline site — React port

This project ports the HTML/CSS site from https://github.com/Samuka770/greenlinewy into a Vite + React app with React Router.

Included
- Pages: Home, Crédito de Carbono, Sobre, Contato, Apresentação
- Shared layout with navbar (desktop/mobile), animated indicator, scroll-reveal, and footer
- Global and page-specific styles in `src/styles`

Run locally
```powershell
npm install
npm run dev
```

Place assets
Put these files under `public/` to match the original visuals:

- public/img/
	- logo-nav.png
	- logo-transparente-branco.png
	- background-inicio.gif
	- background-validacao.mp4
	- logo-greensat.png
	- background-satelite.png
	- comparativo.png
	- arvore-vidro-mao.png
	- folhas-sol.png
	- mapa-mundi-arvore.png
	- background-greenline.gif (if referenced)

- public/pdfs/
	- Greenline Institucional.pdf
	- politica_de_privacidade_greenline.pdf

Notes
- Internal links use paths like `/sobre`, `/contato`, `/apresentacao`.
- For sub-path deployments, set `base` in `vite.config.js` and consider `createHashRouter` if needed.

## Gerenciar `projects.json`

Foi adicionado um pequeno CLI para listar, criar, atualizar, renomear e remover projetos em `src/data/projects.json`.

Arquivo: `scripts/projects.mjs` (ESM, sem dependências externas).

### Comandos básicos

```powershell
# Listar todos (nome + créditos)
npm run projects:list

# Ver projeto completo (usar exatamente o nome)
node scripts/projects.mjs get --name "Caure Grupo 1"
# ou
npm run projects:get -- --name "Caure Grupo 1"

# Adicionar novo projeto
node scripts/projects.mjs add --name "Novo Projeto" --link "https://exemplo" --country Brasil --state Acre --biome Amazônia --vintage 09/2025 --credits 1000

# Atualizar campos (use --set e pares campo=valor)
node scripts/projects.mjs update --name "Caure Grupo 1" --set credits=123456 biome="Amazônia"

# Renomear
node scripts/projects.mjs rename --name "Caure Grupo 1" --to "Caure Grupo 1A"

# Remover
node scripts/projects.mjs remove --name "Projeto Antigo"

# Incrementar / decrementar créditos (delta)
node scripts/projects.mjs inc --name "Caure Grupo 1" --credits 500
node scripts/projects.mjs inc --name "Caure Grupo 1" --credits -250
```

Observações
- O arquivo é salvo já ordenado alfabeticamente por `name` para manter organização.
- Campos aceitos: `name, link, country, state, biome, vintage, credits`.
- `credits` sempre tratado como número; outros campos como string.
- Para usar scripts npm que passam flags, adicione `--` antes dos argumentos (ex: `npm run projects:get -- --name "Caure Grupo 1"`).

### Ajuda
```
node scripts/projects.mjs --help
```

Sinta-se à vontade para pedir melhorias (ex: filtrar por estado/bioma, exportar CSV, etc.).
