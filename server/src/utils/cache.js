export function memoizeByKey(asyncFn) {
  const cache = new Map();
  async function wrapped(key) {
    if (cache.has(key)) return cache.get(key);
    const p = asyncFn(key); cache.set(key, p); return p;
  }
  wrapped.clear = () => cache.clear();
  return wrapped;
}
