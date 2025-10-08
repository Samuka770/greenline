import { useEffect, useRef, useState } from 'react';
import '../styles/contato.css';
import politicaPrivacidade from '../pdfs/politica_de_privacidade_greenline.pdf';

export default function Contato() {
  const formRef = useRef(null);
  const successRef = useRef(null);
  const errorRef = useRef(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const form = formRef.current;
    const success = successRef.current;
    const error = errorRef.current;
    if (!form) return;
  const requiredFields = ['nome', 'email', 'assunto', 'mensagem', 'lgpd'];

    function setError(name, msg) {
      const span = form.querySelector(`[data-error-for="${name}"]`);
      if (span) span.textContent = typeof msg === 'string' ? msg : msg ? 'Obrigatório' : '';
      const label = form.querySelector(`label[for="${name}"]`);
      if (label && label.innerHTML.includes('*')) label.style.color = msg ? '#f87171' : '';
    }
    function clearErrors() {
      requiredFields.forEach((f) => setError(f, ''));
    }
    const onSubmit = async (e) => {
      e.preventDefault();
      clearErrors();
      if (success) success.hidden = true;
      if (error) error.hidden = true;
      let ok = true;
      const data = new FormData(form);
      const missing = [];
      requiredFields.forEach((f) => {
        if (!data.get(f) || (f === 'lgpd' && !form.lgpd.checked)) {
          setError(f, true);
          ok = false;
          missing.push(f);
        } else {
          setError(f, false);
        }
      });
      const email = data.get('email');
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        setError('email', 'E-mail inválido');
        ok = false;
        missing.push('email');
      }
      if (!ok) {
        if (error) {
          error.hidden = false;
          error.focus && error.focus();
        }
        return;
      }

      // Envio real: usar endpoint configurado (prioriza back-end próprio)
      const endpoint =
        import.meta.env.VITE_CONTACT_ENDPOINT || // ex.: "/api/send-contact" (Vercel)
        import.meta.env.VITE_FORMSPREE_ENDPOINT || // ex.: https://formspree.io/f/xxxxxx
        '/api/send-contact';
      if (!import.meta.env.VITE_CONTACT_ENDPOINT && typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
        console.warn('[Contato] Sem VITE_CONTACT_ENDPOINT definido. Para evitar 404 no Vite, aponte para a URL publicada, por exemplo: VITE_CONTACT_ENDPOINT=https://SEU_APP.vercel.app/api/send-contact');
      }
      if (!endpoint) {
        // Sem endpoint configurado, exibir erro claro
        if (error) {
          error.hidden = false;
          error.textContent = 'Não foi possível enviar: configure o endpoint (VITE_FORMSPREE_ENDPOINT).';
          error.focus && error.focus();
        }
        return;
      }

      try {
        setSending(true);
        const payload = {
          nome: data.get('nome'),
          email: data.get('email'),
          telefone: data.get('telefone') || '',
          assunto: data.get('assunto') || 'Contato',
          mensagem: data.get('mensagem'),
          _subject: `Contato via site • ${data.get('assunto') || 'Contato'}`,
          _replyto: data.get('email'),
        };
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (resp.ok) {
          form.reset();
          if (success) {
            success.hidden = false;
            success.textContent = 'Mensagem enviada com sucesso! Entraremos em contato.';
            success.focus && success.focus();
          }
        } else {
          const txt = await resp.text().catch(() => '');
          if (error) {
            error.hidden = false;
            // Mensagens mais claras por status
            let base = `Não foi possível enviar sua mensagem (status ${resp.status}). Tente novamente em instantes.`;
            // Dica específica para ambiente local sem função /api
            if (resp.status === 404 && typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
              base += ' Dica: para testar localmente a rota /api, rode o projeto com "vercel dev" (ou aponte VITE_CONTACT_ENDPOINT para um endpoint válido).';
            }
            error.textContent = base + (txt ? ` Detalhes: ${txt}` : '');
            error.focus && error.focus();
          }
        }
      } catch {
        if (error) {
          error.hidden = false;
          error.textContent = 'Falha de rede ao enviar sua mensagem. Verifique sua conexão e tente novamente.';
          error.focus && error.focus();
        }
      } finally {
        setSending(false);
      }
    };
    form.addEventListener('submit', onSubmit);
    return () => form.removeEventListener('submit', onSubmit);
  }, []);

  return (
    <main className="contato-wrapper" id="topo">
      <section className="contato-hero reveal" aria-labelledby="contato-title">
        <div className="contato-grid">
          <div className="contato-info">
            <h1 id="contato-title" className="contato-title">Entre em Contato</h1>
            <p className="contato-lead" style={{ marginBottom: 22, fontSize: '1.13rem', color: 'var(--txt)', fontWeight: 500 }}>
              Fale com nossa equipe para tirar dúvidas, solicitar informações ou iniciar uma parceria.
            </p>
            <div className="contato-blocos-nice" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 420 }}>
              <div
                style={{
                  background: 'linear-gradient(120deg, #1a3a2a 0%, #10271b 100%)',
                  borderRadius: 12,
                  padding: '18px 20px',
                  border: '1px solid #18382a',
                  color: 'var(--txt)',
                  fontSize: '1.07rem',
                  marginBottom: 32,
                  lineHeight: 1.6,
                }}
              >
                <strong>A Greenline é excelência em soluções ambientais.</strong>
                <br />Atuamos com ética, inovação e compromisso com a sustentabilidade, oferecendo atendimento ágil e personalizado para cada cliente.
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '1.7rem', color: 'var(--acc)', marginTop: 2 }}>&#128337;</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--txt)', fontSize: '1.01rem' }}>Atendimento</div>
                  <div style={{ color: 'var(--muted)', fontSize: '.98rem' }}>Seg a Sex • 9h às 18h (BRT)</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'linear-gradient(120deg, #1a3a2a 0%, #10271b 100%)', borderRadius: 14, padding: '16px 18px', border: '1px solid #18382a' }}>
                <span style={{ fontSize: '1.7rem', color: 'var(--acc)', marginTop: 2 }}>&#9993;</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--txt)', fontSize: '1.01rem' }}>E-mail</div>
                  <div style={{ color: 'var(--acc)', fontSize: '.98rem' }}>
                    <a href="mailto:contato@greenline.com" className="link" style={{ color: 'var(--acc)' }}>
                      contato@greenline.com
                    </a>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '1.7rem', color: 'var(--acc)', marginTop: 2 }}>&#127968;</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--txt)', fontSize: '1.01rem' }}>Local</div>
                  <div style={{ color: 'var(--muted)', fontSize: '.98rem' }}>Curitiba - PR, Brasil</div>
                </div>
              </div>

              <div style={{ marginTop: 38, background: 'linear-gradient(120deg, #1a3a2a 0%, #10271b 100%)', borderRadius: 12, padding: '18px 18px 14px 18px', border: '1px solid #18382a', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ fontSize: '1.5rem', color: '#a7f3d0', marginTop: 2 }}>&#128274;</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--txt)', fontSize: '1.01rem', marginBottom: 2 }}>Seus dados estão protegidos</div>
                  <div style={{ color: 'var(--muted)', fontSize: '.97rem' }}>
                    A Greenline preza pela segurança e privacidade das suas informações. Utilizamos seus dados apenas para contato e não compartilhamos com terceiros.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contato-form-wrapper" aria-labelledby="form-title">
            <form className="contato-form" id="formContato" ref={formRef} noValidate>
              <h2 id="form-title" className="form-title">
                Envie sua Mensagem
              </h2>
              <p className="form-desc">Preencha os campos obrigatórios. *</p>

              <div className="field-group">
                <label htmlFor="nome">Nome *</label>
                <input type="text" id="nome" name="nome" placeholder="Seu nome completo" required autoComplete="name" />
                <span className="error" data-error-for="nome"></span>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="email">E-mail *</label>
                  <input type="email" id="email" name="email" placeholder="voce@empresa.com" required autoComplete="email" />
                  <span className="error" data-error-for="email"></span>
                </div>
                <div className="field-group">
                  <label htmlFor="telefone">Telefone / WhatsApp</label>
                  <input type="tel" id="telefone" name="telefone" placeholder="(DDD) 00000-0000" autoComplete="tel" />
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="assunto">Assunto</label>
                <select id="assunto" name="assunto" required defaultValue="">
                  <option value="" disabled>
                    Selecionar...
                  </option>
                  <option>Créditos de Carbono</option>
                  <option>Parcerias / Projeto</option>
                  <option>Monitoramento &amp; MRV</option>
                  <option>Imprensa / Mídia</option>
                  <option>Outros</option>
                </select>
                <span className="error" data-error-for="assunto"></span>
              </div>

              <div className="field-group">
                <label htmlFor="mensagem">Mensagem *</label>
                <textarea id="mensagem" name="mensagem" placeholder="Descreva sua necessidade ou interesse" rows={5} required></textarea>
                <span className="error" data-error-for="mensagem"></span>
              </div>

              <div className="field-row compact">
                <label className="check">
                  <input type="checkbox" id="lgpd" name="lgpd" required />
                  <span>
                    Aceito o tratamento dos dados conforme{' '}
                    <a href={politicaPrivacidade} target="_blank" style={{ color: 'var(--acc)', textDecoration: 'underline' }}>
                      política de privacidade
                    </a>
                    .
                  </span>
                </label>
                <span className="error" data-error-for="lgpd"></span>
              </div>

              <button type="submit" className="btn primary full" disabled={sending} aria-busy={sending}>
                {sending ? 'Enviando…' : 'Enviar Mensagem'}
              </button>
              <p className="small" style={{ margin: '12px 0 0', color: 'var(--muted)' }}>
                Utilizamos suas informações apenas para responder a esta solicitação.
              </p>
              <div
                className="form-error"
                id="formError"
                role="alert"
                aria-live="assertive"
                hidden
                ref={errorRef}
                style={{ marginTop: 14, background: '#f87171', color: '#fff', fontWeight: 600, padding: '12px 16px', borderRadius: 10, fontSize: '.98rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
              >
                A mensagem não pode ser enviada. Preencha todos os campos obrigatórios corretamente.
              </div>
              <div className="form-success" id="formSuccess" role="status" aria-live="polite" hidden ref={successRef}>
                Mensagem enviada com sucesso! Entraremos em contato.
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
