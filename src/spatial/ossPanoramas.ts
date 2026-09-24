/** Key-free Wikimedia Commons panoramas for the Safe Journey 360 viewer. */

export type OssPano = {
  src: string;
  credit: string;
  commonsTitle: string;
};

export const OSS_PANORAMAS: Record<string, OssPano> = {
  assam: {
    src: '/360/assam-street.jpg',
    credit: 'CC BY-SA 4.0 · Subhashish Panigrahi · Wikimedia',
    commonsTitle: 'Indian street photosphere (Simulation)',
  },
  delhi: {
    src: '/360/delhi-oldfort.jpg',
    credit: 'CC BY 3.0 · Biswarup Ganguly · Wikimedia',
    commonsTitle: 'Old Fort garden, New Delhi (Simulation)',
  },
};

export function panoForCity(city?: { theme?: string; id?: string } | null): OssPano {
  const key = city?.theme || city?.id || 'assam';
  return OSS_PANORAMAS[key] || OSS_PANORAMAS.assam;
}
