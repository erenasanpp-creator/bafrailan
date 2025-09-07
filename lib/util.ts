// lib/util.ts

/** Paraya TR formatı */
export function formatMoney(n?: number | null): string {
  if (!n && n !== 0) return "-";
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n} TL`;
  }
}

/** "3 gün önce" gibi zaman ifadesi */
export function timeAgo(iso?: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const now = Date.now();
  let s = Math.max(1, Math.round((now - then) / 1000));
  const steps: [number, string][] = [
    [60, "sn"],
    [60, "dk"],
    [24, "sa"],
    [7, "gün"],
    [4.345, "hf"],
    [12, "ay"],
  ];
  let unit = "sn";
  for (const [f, u] of steps) {
    if (s < f) { unit = u; break; }
    s = Math.floor(s / f); unit = u;
  }
  return `${s} ${unit} önce`;
}

/**
 * Girilen serbest değerleri güvenle sayıya çevirir.
 * Örn: "30.000", "30,000", "30 000 TL" -> 30000
 */
export function toNumberLoose(v: any, fallback: number | null = null): number | null {
  if (v === null || v === undefined) return fallback;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const s = v
      .replace(/[^0-9,.\-]/g, "")     // rakam ve ayraçları bırak
      .replace(/(,)(?=.*,)/g, "")     // birden çok virgülden sonuncusu kalsın
      .replace(/\.(?=.*\.)/g, "")     // birden çok noktadan sonuncusu kalsın
      .replace(",", ".")              // virgülü noktaya çevir
      .trim();
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : fallback;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
