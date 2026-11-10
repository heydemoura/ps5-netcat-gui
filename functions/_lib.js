// Shared helpers for the payload stash (R2 bucket bound as STASH).
export const TTL_MS = 15 * 60 * 1000;      // uploads live 15 minutes at most
export const MAX_BYTES = 48 * 1024 * 1024; // 48 MiB cap
// First 4 bytes (little-endian u32) accepted by the PS5 elfldr: ELF, PS4 SELF, PS5 SELF.
export const MAGICS = [0x464C457F, 0x1D3D154F, 0xEEF51454];
export const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
export const cleanName = n => (String(n || 'payload.elf').replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^[._]+/, '').slice(0, 64) || 'payload.elf');
