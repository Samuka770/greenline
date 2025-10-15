export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { 'Allow': 'POST' }, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body || '{}');

    // Basic validation
    const required = ['nome', 'email', 'mensagem'];
    for (const f of required) {
      if (!payload[f]) {
        return { statusCode: 400, body: JSON.stringify({ error: `Campo obrigatório ausente: ${f}` }) };
      }
    }

    const assunto = payload.assunto || 'Contato';

    // Forward to FormSubmit using fetch from the Netlify server (no CORS issues)
    const resp = await fetch('https://formsubmit.co/ajax/info@greenlinewy.com', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: payload.nome,
        email: payload.email,
        telefone: payload.telefone || '',
        assunto,
        mensagem: payload.mensagem,
        _subject: `Contato via site • ${assunto}`,
        _replyto: payload.email,
        _template: 'table',
        _captcha: 'false',
        _honey: payload._honey || ''
      })
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return { statusCode: resp.status, body: JSON.stringify({ error: 'FormSubmit falhou', details: text }) };
    }

    const json = await resp.json().catch(() => ({}));
    return { statusCode: 200, body: JSON.stringify({ ok: true, ...json }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro interno', details: String(err) }) };
  }
}