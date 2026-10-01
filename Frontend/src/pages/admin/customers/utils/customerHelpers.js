export const fmt = (n) => {
  if (n === undefined || n === null) return '—';
  return Number(n).toLocaleString('en-PK', { maximumFractionDigits: 0 });
};
