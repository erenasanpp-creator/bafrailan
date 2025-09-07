export function formatMoney(n?: number | null): string {
  if (!n && n !== 0) return "-"
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n)
  } catch {
    return `${n} TL`
  }
}

export function timeAgo(iso?: string | null): string {
  if (!iso) return ""
  const then = new Date(iso).getTime()
  const now = Date.now()
  const s = Math.max(1, Math.round((now - then) / 1000))
  const map: [number, string][] = [
    [60, "sn"],
    [60, "dk"],
    [24, "sa"],
    [7, "gün"],
    [4.345, "hf"],
    [12, "ay"],
  ]
  let qty = s; let unit = "sn"
  let i = 0
  let d = 1
  for (const [f, u] of map) {
    if (qty < f) { unit = u; break }
    qty = Math.floor(qty / f); unit = u; i++; d *= f
  }
  return `${qty} ${unit} önce`
}
