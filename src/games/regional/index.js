/** Regional game data index — maps language codes to their cultural game packs */
import * as assam from './assam';
import * as bengal from './bengal';
import * as gujarat from './gujarat';
import * as karnataka from './karnataka';
import * as kerala from './kerala';
import * as manipur from './manipur';
import * as maharashtra from './maharashtra';
import * as meghalaya from './meghalaya';
import * as mizoram from './mizoram';
import * as northIndia from './northIndia';
import * as punjab from './punjab';
import * as tamilnadu from './tamilnadu';
import * as telangana from './telangana';

/** Map from i18n language code → regional pack */
const REGION_MAP = {
  as: assam,
  en: northIndia,       // default English → North India
  hi: northIndia,
  bn: bengal,
  ta: tamilnadu,
  te: telangana,
  mr: maharashtra,
  gu: gujarat,
  kn: karnataka,
  ml: kerala,
  pa: punjab,
  kha: meghalaya,
  lus: mizoram,
  mni: manipur,
  brx: assam,           // Bodo → Assam region
};

export function getRegionalPack(langCode) {
  return REGION_MAP[langCode] || northIndia;
}

/** Get all 5 games for a region */
export function getRegionalGames(langCode) {
  const pack = getRegionalPack(langCode);
  return [
    { type: 'sorting', ...pack.sorting },
    { type: 'rhythm', ...pack.rhythm },
    { type: 'match', ...pack.match },
    { type: 'tracing', ...pack.tracing },
    { type: 'navigation', ...pack.navigation },
  ];
}

export { REGION_MAP };
