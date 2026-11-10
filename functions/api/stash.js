// POST /api/stash?name=foo.elf  (raw body) -> { ok, url, expires }
// Parks a payload for a few minutes so the PS5 elfldr can pull it with `GET /?uri=<url>`.
import { TTL_MS, MAX_BYTES, MAGICS, json, cleanName } from '../_lib.js';

export async function onRequestPost({ request, env }) {
  const len = +request.headers.get('content-length') || 0;
  if (len > MAX_BYTES) return json({ ok: false, error: `Payload too large (max ${MAX_BYTES >> 20} MiB)` }, 413);
  const buf = await request.arrayBuffer();
  if (buf.byteLength < 4) return json({ ok: false, error: 'Empty payload' }, 400);
  if (buf.byteLength > MAX_BYTES) return json({ ok: false, error: `Payload too large (max ${MAX_BYTES >> 20} MiB)` }, 413);
  const magic = new DataView(buf).getUint32(0, true);
  if (!MAGICS.includes(magic)) return json({ ok: false, error: 'Not an ELF/SELF payload (elfldr would reject it)' }, 415);

  const name = cleanName(new URL(request.url).searchParams.get('name'));
  const id = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '').slice(0, 8);
  const expires = Date.now() + TTL_MS;
  await env.STASH.put(id, buf, { customMetadata: { name, expires: String(expires) } });
  const url = `${new URL(request.url).origin}/p/${id}/${encodeURIComponent(name)}`;
  return json({ ok: true, url, id, bytes: buf.byteLength, expires });
}

// DELETE /api/stash?id=..  -> drop an upload the console never fetched
export async function onRequestDelete({ request, env }) {
  const id = new URL(request.url).searchParams.get('id') || '';
  if (/^[a-f0-9]{40}$/.test(id)) await env.STASH.delete(id);
  return json({ ok: true });
}
