import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const founderEmail = import.meta.env.FOUNDER_EMAIL;

  const contentType = request.headers.get('content-type') ?? '';
  const wantsJson = contentType.includes('application/json');

  const respond = (status: number, body: Record<string, unknown>, redirectPath?: string) => {
    if (wantsJson) {
      return new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      });
    }
    return redirect(redirectPath ?? '/demo?ok=1', 303);
  };

  let payload: Record<string, string> = {};
  try {
    if (wantsJson) {
      payload = await request.json();
    } else {
      const form = await request.formData();
      for (const [key, value] of form.entries()) {
        if (typeof value === 'string') payload[key] = value;
      }
    }
  } catch (err) {
    console.error('Demo form parse error:', err);
    return respond(400, { error: 'Invalid request body' }, '/demo?err=1');
  }

  const name = (payload.name ?? '').trim();
  const email = (payload.email ?? '').trim();
  const company = (payload.company ?? '').trim();
  const message = (payload.message ?? '').trim();
  const honeypot = (payload.website ?? '').trim();

  if (honeypot) {
    return respond(200, { ok: true }, '/demo?ok=1');
  }

  if (!name || !email || !company) {
    return respond(400, { error: 'Missing required fields' }, '/demo?err=1');
  }

  if (!apiKey || !founderEmail) {
    console.warn(
      'Demo form: RESEND_API_KEY or FOUNDER_EMAIL not configured. Submission accepted but not delivered.'
    );
    return respond(200, { ok: true }, '/demo?ok=1');
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: 'Demo Requests <onboarding@resend.dev>',
      to: founderEmail,
      replyTo: email,
      subject: `Demo request from ${name} at ${company}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message || '(none)'}`,
    });
    return respond(200, { ok: true }, '/demo?ok=1');
  } catch (err) {
    console.error('Demo form Resend error:', err);
    return respond(500, { error: 'Failed to send' }, '/demo?err=1');
  }
};
