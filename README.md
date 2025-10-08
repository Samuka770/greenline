## Greenline site — React port

This project ports the HTML/CSS site from https://github.com/Samuka770/greenlinewy into a Vite + React app with React Router.

Included

Run locally
```powershell
npm install
npm run dev
```

### Configurar envio do formulário de contato

Você pode enviar as mensagens para:

1) Um endpoint próprio (recomendado)
	- Já existe uma função serverless em `api/send-contact.js` (padrão Vercel) que usa a API do Resend para enviar e-mails.
	- Defina as variáveis de ambiente no servidor:
	  - `RESEND_API_KEY` (server)
	  - `EMAIL_TO` (opcional, padrão `contato@greenline.com`)
	  - `EMAIL_FROM` (opcional, ex.: `Greenline Site <no-reply@greenline.com>`)
	- No frontend, você pode definir (opcional) `VITE_CONTACT_ENDPOINT` para apontar explicitamente (ex.: `/api/send-contact`). Caso não defina, o front já tenta `/api/send-contact` por padrão.

2) Um serviço externo como Formspree
	- Configure no `.env`:

```
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/SEU_ID_AQUI
```

Observações
- Em desenvolvimento (`npm run dev`), o Vite aplica as variáveis do `.env` automaticamente.
- Em produção (build/deploy), defina as variáveis no painel do provedor (front: `VITE_*`; server: segredos/keys).
- Campos enviados: `nome, email, telefone, assunto, mensagem`.

Routing and build notes:

- The app uses React Router (createBrowserRouter) with basename derived from Vite's BASE_URL. If you deploy under a subpath, set VITE_BASE in the environment (e.g., "/greenline/") so links resolve correctly in production.
- Because this is a single-page application, your host must serve index.html for all route paths (SPA fallback). Configure rewrites:
	- Nginx: try_files $uri /index.html;
	- Apache: add a RewriteRule to index.html
	- Vercel/Netlify: add a fallback rule in their config ("/*": "/index.html").
- Internal navigation uses Link/NavLink everywhere. Avoid raw <a href="/rota">...</a> for app routes, otherwise the browser will do a full reload and may 404 in production.
- Static PDFs and media are imported in components (e.g., import pdf from '../pdfs/file.pdf') to ensure Vite copies them to dist and URLs are correct.


Notes
- Internal links use paths like `/sobre`, `/contato`, `/apresentacao`.
- For sub-path deployments, set `base` in `vite.config.js` and consider `createHashRouter` if needed.


### Opção 1 — Rápida e estável (recomendada)

Objetivo: publicar a função de e-mail e apontar o front local para o endpoint em produção, evitando 404 no Vite.

Passos
1. Deploy na Vercel (ou similar)
	- Faça login e crie um projeto a partir deste repositório.
	- Confirme que o arquivo `vercel.json` está presente (ele configura SPA fallback e função Node para `api/**/*.js`).
2. Configure variáveis de servidor (no painel do projeto)
	- RESEND_API_KEY = seu token do Resend
	- EMAIL_TO = destinatário(s) (ex.: contatosamuel770@gmail.com)
	- EMAIL_FROM = Greenline Site <onboarding@resend.dev> (ou um domínio verificado)
3. Publique
	- Depois do primeiro deploy, copie a URL do app (ex.: https://seuapp.vercel.app)
4. Aponte o front local para o endpoint publicado (2 opções)
	 - Opção A: variável direta
		 - Crie `.env` local e defina:
			 - VITE_CONTACT_ENDPOINT=https://SEU_APP.vercel.app/api/send-contact
	 - Opção B: proxy no Vite (continuar usando "/api" no código)
		 - Crie `.env` local e defina:
			 - VITE_API_PROXY_TARGET=https://SEU_APP.vercel.app
	 - Reinicie `npm run dev`.

Notas (Windows/OneDrive)
- Se `vercel dev` falhar localmente com erro de symlink (EPERM) dentro do OneDrive, use esta Opção 1.
- Alternativas: mover o projeto fora do OneDrive, executar PowerShell como Admin com Modo Desenvolvedor ativo, ou usar WSL.

## Dados de projetos

Os dados exibidos nas páginas Projetos/Registro vêm de `src/data/projects.json`. Você pode editar esse arquivo manualmente.
