/* eslint-env node */
// Serverless function (Vercel) to send contact emails using Resend API
// Environment variables required (set in hosting provider):
// - RESEND_API_KEY: Your Resend API key (server-side secret)
// - EMAIL_TO: Destination(s) separated by commas (default: contatosamuel770@gmail.com)
// - EMAIL_FROM: Verified sender (e.g., "Greenline Site <no-reply@yourdomain.com>")
// - EMAIL_BCC: Optional BCC list, comma-separated

import { Resend } from 'resend';
import { Buffer } from 'node:buffer';

export default async function handler(req, res) {
  // Basic CORS (allow same-origin and preflight)
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse JSON body if not already parsed (Vercel plain Node functions)
    let body = req.body;
    if (!body) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString('utf8');
      if (raw) {
        try { body = JSON.parse(raw); } catch { body = {}; }
      }
    }

  const { nome, email, telefone = '', assunto = 'Contato', mensagem } = body || {};

    if (!nome || !email || !mensagem) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const to = process.env.EMAIL_TO ? process.env.EMAIL_TO.split(',').map((s) => s.trim()) : ['contatosamuel770@gmail.com'];
    // Use Resend's onboarding sender as safe default if no custom verified domain is configured
    const from = process.env.EMAIL_FROM || 'Greenline Site <onboarding@resend.dev>';
    const subject = `Contato via site • ${assunto}`;

    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; font-size: 16px; color: #111;">
        <h2 style="margin: 0 0 12px;">Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        ${telefone ? `<p><strong>Telefone:</strong> ${escapeHtml(telefone)}</p>` : ''}
        <p><strong>Assunto:</strong> ${escapeHtml(assunto)}</p>
        <p><strong>Mensagem:</strong></p>
        <div style="white-space: pre-wrap; border-left: 3px solid #e5e7eb; padding-left: 10px; margin-top: 6px;">${escapeHtml(mensagem)}</div>
      </div>
    `;
    const text = `Nova mensagem de contato\n\nNome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone}\nAssunto: ${assunto}\n\nMensagem:\n${mensagem}`;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'RESEND_API_KEY não configurada no servidor.' });
    }

    const resend = new Resend(apiKey);
    const bccRaw = process.env.EMAIL_BCC || '';
    const bcc = bccRaw ? bccRaw.split(',').map((s) => s.trim()) : undefined;
    try {
      const { data: sendData, error: sendError } = await resend.emails.send({
        from,
        to,
        subject,
        html,
        text,
        reply_to: email,
        bcc,
      });
      if (sendError) {
        return res.status(502).json({ error: 'Falha ao enviar e-mail', details: sendError });
      }
      return res.status(200).json({ ok: true, id: sendData?.id });
    } catch (e) {
      return res.status(502).json({ error: 'Falha ao enviar e-mail', details: String(e) });
    }
  } catch (err) {
    console.error('send-contact error', err);
    return res.status(500).json({ error: 'Erro no servidor ao enviar e-mail' });
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
