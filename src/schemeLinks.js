const SCHEME_RULES = [
  {
    id: 'SRV-2002',
    label: 'Ayushman Bharat',
    patterns: [
      /ayushman/i, /pmjay/i, /pm-jay/i, /आयुष्मान/, /ayushman bharat/i,
      /health insurance/i, /health card/i, /स्वास्थ्य बीमा/, /5\s*lakh.*health/i,
      /hospital bill/i, /hospital cover/i,
    ],
  },
  {
    id: 'SRV-2001',
    label: 'Old Age Pension (IGNOAPS)',
    patterns: [
      /\bnsap\b/i, /national social assistance/i, /old age pension/i, /ignoaps/i,
      /वृद्धावस्था पेंशन/, /elderly pension/i, /senior citizen pension/i,
      /indira gandhi national old/i,
    ],
  },
  {
    id: 'SRV-2010',
    label: 'Assam Old Age Pension',
    patterns: [
      /assam.*pension/i, /state old age/i, /ner.*pension/i, /असम.*पेंशन/,
    ],
  },
  {
    id: 'SRV-2003',
    label: 'NPHCE Geriatric Care',
    patterns: [
      /\bnphce\b/i, /geriatric/i, /memory clinic/i, /elderly care programme/i,
      /healthcare of the elderly/i, /guwahati medical/i, /gauhati medical/i,
    ],
  },
  {
    id: 'SRV-2004',
    label: 'Rashtriya Vayoshri',
    patterns: [
      /vayoshri/i, /hearing aid/i, /walking stick/i, /assistive device/i,
      /alimco/i, /spectacles/i, /wheelchair/i, /denture/i,
    ],
  },
  {
    id: 'SRV-2005',
    label: 'Tele-MANAS',
    patterns: [
      /tele-?manas/i, /14416/i, /mental health helpline/i, /टेली.?मानस/,
      /counselling/i, /distress/i,
    ],
  },
  {
    id: 'SRV-2006',
    label: 'Elderline (14567)',
    patterns: [
      /elderline/i, /14567/i, /senior citizen helpline/i, /एल्डरलाइन/,
      /elder abuse/i, /neglect/i,
    ],
  },
  {
    id: 'SRV-2007',
    label: 'AVYAY Senior Care',
    patterns: [
      /avyay/i, /atal vayo/i, /day.?care/i, /old.?age home/i, /senior care/i,
    ],
  },
  {
    id: 'SRV-2009',
    label: 'eSanjeevani',
    patterns: [
      /esanjeevani/i, /telemedicine/i, /video consult/i, /ई.?संजीवनी/,
    ],
  },
  {
    id: 'SRV-2011',
    label: 'District Mental Health',
    patterns: [
      /\bdmhp\b/i, /\bnmhp\b/i, /district mental/i, /psychiatrist/i,
      /psychologist/i, /memory loss clinic/i,
    ],
  },
  {
    id: 'SRV-2012',
    label: 'SAGE Seniorcare',
    patterns: [
      /\bsage\b/i, /home care/i, /caregiver support/i, /trained care/i,
    ],
  },
  {
    id: 'SRV-2008',
    label: 'Senior Citizens Act / NALSA',
    patterns: [
      /\bnalsa\b/i, /legal aid/i, /maintenance.*parent/i, /senior citizens act/i,
      /15100/, /abandon/i, /मुफ्त कानूनी/,
    ],
  },
  {
    id: 'SRV-2013',
    label: 'Annapurna Foodgrain',
    patterns: [
      /annapurna/i, /foodgrain/i, /ration.*elderly/i, /अन्नपूर्णा/,
    ],
  },
  {
    id: 'SRV-2014',
    label: 'ASHA / Community Visit',
    patterns: [
      /\basha\b/i, /community health/i, /home visit/i, /anm\b/i, /phc\b/i,
    ],
  },
  {
    id: 'SRV-2001',
    label: 'Elderly Pension Support',
    patterns: [
      /\bpension\b/i, /पेंशन/, /pensan/i,
    ],
  },
];

const GENERIC_SCHEME_TALK = /scheme|yojana|योजना|care schemes|government (service|benefit)|सरकारी|documents? (for|needed)|दस्तावेज|aadhaar|आधार|dementia|memory care|elderly care|senior citizen/i;

export function getSchemeChips(text) {
  if (!text || typeof text !== 'string') return [];

  const seen = new Set();
  const chips = [];

  for (const rule of SCHEME_RULES) {
    if (seen.has(rule.id)) continue;
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      seen.add(rule.id);
      chips.push({
        id: rule.id,
        label: rule.label,
        action: 'Open in Care Schemes',
      });
    }
  }

  if (chips.length === 0 && GENERIC_SCHEME_TALK.test(text)) {
    chips.push({
      id: null,
      label: 'Care Schemes',
      action: 'View Care Schemes',
    });
  }

  return chips.slice(0, 3);
}

export function relatedSchemeLine(chips) {
  if (!chips?.length) return '';
  return `Related: ${chips.map((chip) => chip.label).join(', ')}`;
}
