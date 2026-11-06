// Inline style strings from the design -> React style objects (cached, they repeat on every render).
const cache = new Map();

export function css(str) {
  if (!str) return undefined;
  let hit = cache.get(str);
  if (hit) return hit;
  const out = {};
  for (const decl of str.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop) continue;
    const key = prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = val;
  }
  if (cache.size > 5000) cache.clear();
  cache.set(str, out);
  return out;
}
