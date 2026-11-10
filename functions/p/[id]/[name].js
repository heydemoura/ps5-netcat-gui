// GET /p/<id>/<name> -> the stashed payload. One-shot: deleted as soon as it's served.
import { json } from '../../_lib.js';

export async function onRequestGet({ params, env }) {
  const id = String(params.id || '');
  if (!/^[a-f0-9]{40}$/.test(id)) return json({ ok: false, error: 'not found' }, 404);
  const obj = await env.STASH.get(id);
  if (!obj) return json({ ok: false, error: 'not found or already fetched' }, 404);
  if (+obj.customMetadata?.expires < Date.now()) { await env.STASH.delete(id); return json({ ok: false, error: 'expired' }, 410); }
  const body = await obj.arrayBuffer();
  await env.STASH.delete(id);
  return new Response(body, { headers: {
    'content-type': 'application/octet-stream',
    'content-length': String(body.byteLength), // sceHttp needs a Content-Length
    'content-disposition': `attachment; filename="${obj.customMetadata?.name || 'payload.elf'}"`,
    'cache-control': 'no-store',
  } });
}
