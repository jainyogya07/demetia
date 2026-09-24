import { ASSIST_GAMES } from './assistCatalog.js';
import { CIRCLE_MEMBERS, getProgressSnapshot, getRoutineItems } from './liveState.js';

const GAMES_HOW = {
  'story-solver': {
    title: 'Past stories',
    how: 'Care Agent ek purani kahani bolti hai. Aap suno, phir usi scene se ek sawaal aata hai.',
    tap: 'Continue dabao jab kahani aage badhe. All Games se wapas list pe aao.',
  },
  'match-pairs': {
    title: 'Match pairs',
    how: 'Do same photos ki jodi dhundo. Ek card tap, phir uska match.',
    tap: 'Pehle ek photo, phir doosri matching photo.',
  },
  'spot-diff': {
    title: 'Spot difference',
    how: 'Do tasveeron mein jo alag hai, us par tap karo.',
    tap: 'Left aur right dono dekho, phir farak par tap.',
  },
  'balloon-pop': {
    title: 'Balloon pop',
    how: 'Ugte balloons par tap karo. Galat jawab nahi hota.',
    tap: 'Jo balloon dikhe, usko chhoo do.',
  },
  sequence: {
    title: 'Sequence',
    how: 'Pehle order dekho. Phir wahi cheezein usi kram mein tap karo.',
    tap: 'Light ke baad pehli cheez, phir agli.',
  },
  faces: {
    title: 'Familiar faces',
    how: 'Chehra dekho aur naam se jodo — family, ASHA, doctor.',
    tap: 'Sahi naam wala button dabao.',
  },
  'object-find': {
    title: 'Find object',
    how: 'Jo cheez boli jaaye, table par usko dhundo.',
    tap: 'Sahi object par tap karo.',
  },
};

export const SCREEN_GUIDES = {
  home: {
    title: 'Home',
    what: 'Yeh aapka din ka pehla page hai — routine, games, family, aur Speak yahan se milte hain.',
    how: 'Badi cards dekho. Jo karna hai us card par tap karo. Left side se koi bhi screen khol sakte ho.',
    tap: 'Aaj ka kaam dekhne ke liye Daily Routine card, baat ke liye Speak, photos ke liye Memory Book.',
    next: 'Sabse pehle aaj ki list dekho, phir dawa ya ek chhota game.',
  },
  medicine: {
    title: 'Medicine and Health',
    what: 'Yahan health schemes aur support dikhta hai. Roz ki dawa ka time Daily Routine par hai.',
    how: 'Scheme cards padho. Jo scheme chahiye us par tap karke details kholo. Dose time change yahan nahi hota.',
    tap: 'Pehle scheme ka naam padho. Call ya apply wale button tab dabao jab samajh aa jaye.',
    next: 'Agli dawa ka time Routine screen par tick karo jab le lo.',
  },
  routine: {
    title: 'Daily Routine',
    what: 'Aaj ke kaam yahan time ke saath hain — dawa, paani, game, khana, walk.',
    how: 'List upar se neeche padho. Jo ho chuka hai uske saath wale tick par tap karo. Due items wait karte hain jab tak aap mark na karo.',
    tap: 'Jo item ab karna hai, us row ke complete button par tap.',
    next: 'Pehle due item complete karo. Baaki aaram se.',
  },
  'memory-book': {
    title: 'Memory Book',
    what: 'Family photos aur unke din yahan hain — tea garden, Zoo Road, Rina ki chai.',
    how: 'Upar album buttons se filter karo. Photo card tap karke badi dekho. Neeche naya memory add ho sakta hai.',
    tap: 'Pehle ek photo par tap. Phir zoom ya next ke liye mujhse bolo “photo badi” ya “agli photo”.',
    next: 'Ek purani family photo kholo. Uske baare mein baat ke liye bolo “mujhse baat karo”.',
  },
  games: {
    title: 'Brain Games',
    what: 'Chhote dimaag ke khel — matching, kahani, balloons. Koi jaldi nahi.',
    how: 'Tile par tap karke game shuru. Upar All Games se list par wapas. Score Progress par milta hai.',
    tap: 'Jo game chahiye uske Start par tap, ya mujhse bolo game ka naam.',
    next: 'Aaj ek easy game kaafi hai — Match pairs ya Balloon pop.',
  },
  progress: {
    title: 'Memory Progress',
    what: 'Is hafte games aur routine kitna hua, yahan dikhta hai.',
    how: 'Numbers aur bars padho. Recent games neeche hain. Yeh diagnosis nahi, sirf aapka week.',
    tap: 'Koi extra button nahi. Dekho, phir Home ya Games par jao.',
    next: 'Agar list khali lage to aaj ek chhota game khelo.',
  },
  'care-circle': {
    title: 'Care Circle',
    what: 'Yahan Rina, Doom, aur Mina hain — family aur health worker.',
    how: 'Har card par naam aur relation hai. Call ke liye bolo “Rina ko call karo” — pehle confirm hoga.',
    tap: 'Jis se baat karni hai uska card dekho. Call confirm ke baad phone khulega.',
    next: 'Zarurat ho to Rina ko call. Message ke liye bolo kya likhna hai.',
  },
  safety: {
    title: 'Safety',
    what: 'Yahan ghar aur location dikhte hain. Emergency Help hamesha left red button par hai.',
    how: 'Map aur check-in dekho. Location tabhi sach dikhegi jab phone allow kare. Fake jagah nahi dikhati.',
    tap: 'Check-in button agar dikhe to tap. Emergency ke liye left red Help.',
    next: 'Family ko alert ke liye confirm maangungi. 112 sidebar se hamesha available hai.',
  },
  settings: {
    title: 'Settings',
    what: 'Naam, language, text size, contrast, aur voice yahan badalte hain.',
    how: 'Section scroll karo. Language header se bhi badalti hai. Text size ke steps safe hain — 100 se 160.',
    tap: 'Language chip, text size, ya contrast toggle. Profile save alag button se.',
    next: 'Pehle language theek karo, phir text size.',
  },
  language: {
    title: 'Language',
    what: 'Assamese, Hindi, English aur NER bhashayein. Bada text yahan se.',
    how: 'Header language menu use karo, ya mujhse bolo “Hindi kar do”.',
    tap: 'Upar language button, phir jo bhasha chahiye.',
    next: 'Jo bhasha bolte ho wahi chuno.',
  },
  documents: {
    title: 'Documents',
    what: 'Aapke kaagaz yahan rehte hain.',
    how: 'File list dekho. Naya document add karne ka form neeche ho sakta hai.',
    tap: 'Jo file chahiye us par tap karke kholo.',
    next: 'Agar list khali hai to family se photo bhejne ko kaho.',
  },
  help: {
    title: 'Emergency Help',
    what: '112, Elderline, Tele-MANAS. Yeh hamesha left red button se khulta hai.',
    how: 'Number par tap karke call. Assist band ho to bhi yeh button dikhta hai.',
    tap: 'Left red Emergency Help, phir jo number chahiye us par Call.',
    next: 'Turant madad ho to 112.',
  },
  ai: {
    title: 'Care Agent',
    what: 'Yahan gupshup aur purani yaadein. Kaam karne ke liye Assist use karo — yeh baat ke liye hai.',
    how: 'Start Voice Call dabao. Mic se baat karo. Assist alag green button hai.',
    tap: 'Start Voice Call, phir bolo.',
    next: 'Photos ya dawa kholni ho to Assist se kaho, yahan se nahi.',
  },
  services: {
    title: 'Health schemes',
    what: 'Yeh Medicine/Health jaisa page hai — schemes aur support.',
    how: 'Cards padho, details kholo. Dawa ka roz ka time Routine par hai.',
    tap: 'Scheme card, phir uske andar likha padho.',
    next: 'Jo scheme samajh na aaye, bolo “isko samjhao”.',
  },
};

export function screenGuide(moduleId, gameId) {
  if (gameId && GAMES_HOW[gameId]) {
    const game = GAMES_HOW[gameId];
    return {
      title: game.title,
      what: `Ab ${game.title} khula hai.`,
      how: game.how,
      tap: game.tap,
      next: 'Khelte raho. Wapas list ke liye All Games.',
    };
  }
  return SCREEN_GUIDES[moduleId] || SCREEN_GUIDES.home;
}

export function explainScreen(moduleId, options = {}) {
  const guide = screenGuide(moduleId, options.gameId);
  const mode = options.mode || 'explain';
  if (mode === 'how') {
    return `${guide.title}. ${guide.how} ${guide.tap}`;
  }
  if (mode === 'simple') {
    return `${guide.title} hai. ${guide.tap}`;
  }
  if (mode === 'read') {
    return readScreen(moduleId, options.gameId);
  }
  return `${guide.what} ${guide.how}`;
}

export function readScreen(moduleId, gameId) {
  const guide = screenGuide(moduleId, gameId);
  if (moduleId === 'routine') {
    const items = getRoutineItems();
    const next = items.find((row) => !row.completed);
    const due = items.filter((row) => row.status === 'due' && !row.completed).length;
    if (!next) return 'Routine screen. Aaj ki list complete ho chuki hai.';
    return `Routine screen. ${due ? `${due} kaam due hain. ` : ''}Agli: ${next.title} ${next.time}. Tick se complete.`;
  }
  if (moduleId === 'progress') {
    const snap = getProgressSnapshot();
    return `Progress screen. Is hafte accuracy ${snap.accuracy}%. Streak ${snap.streak} din. ${snap.routineDone} of ${snap.routineTotal} routine done.`;
  }
  if (moduleId === 'care-circle') {
    return `Family screen. ${CIRCLE_MEMBERS.map((row) => row.name).join(', ')}. Call se pehle confirm.`;
  }
  if (moduleId === 'games' && gameId) return `${guide.what} ${guide.how}`;
  if (moduleId === 'games') return 'Games list. Ek tile par Start dabao. Match pairs easy hai.';
  if (moduleId === 'medicine') return 'Medicine page. Schemes yahan. Roz ki dawa Routine par.';
  return `${guide.what} ${guide.tap}`;
}

export function visualOpenLine(moduleId, gameId) {
  const guide = screenGuide(moduleId, gameId);
  return `${guide.title} khol di. ${guide.tap}`;
}

export function helpForTopic(raw) {
  const text = String(raw || '').toLowerCase();
  const hits = [
    [/memory book|purani photo|tasveer|album/, 'memory-book'],
    [/dawa|medicine|tablet|scheme/, 'medicine'],
    [/routine|dincharya|task|kaam/, 'routine'],
    [/game|khel|puzzle/, 'games'],
    [/progress|score/, 'progress'],
    [/family|care circle|beti|caregiver/, 'care-circle'],
    [/safety|location|gps|map/, 'safety'],
    [/setting|language|font|text/, 'settings'],
    [/document|kaagaz|file/, 'documents'],
    [/emergency|112|help/, 'help'],
    [/companion|care agent|gupshup|speak/, 'ai'],
    [/offline/, 'home'],
    [/app kaise|ye app/, 'home'],
  ];
  const found = hits.find(([re]) => re.test(text));
  if (found) return explainScreen(found[1], { mode: /kaise|how|samjh/.test(text) ? 'how' : 'explain' });
  if (/offline/.test(text)) {
    return 'Offline mode mein yeh phone par kaam karta hai. Dawa, routine, photos, games local rehte hain. Sync baad mein.';
  }
  if (/caregiver kya dekh/.test(text)) {
    return 'Caregiver routine, safety, aur progress dekh sakta hai. Dawa badalna Assist nahi karti.';
  }
  return explainScreen('home', { mode: 'how' });
}

export function namedScreenFromText(raw) {
  const text = String(raw || '').toLowerCase();
  const map = [
    [/memory book|purani photo|tasveer|\balbum\b/, 'memory-book'],
    [/routine|dincharya/, 'routine'],
    [/medicine|dawa|health|scheme/, 'medicine'],
    [/game|khel/, 'games'],
    [/progress|score/, 'progress'],
    [/family|care circle|parivar/, 'care-circle'],
    [/safety|map|location/, 'safety'],
    [/setting/, 'settings'],
    [/language|bhasha/, 'language'],
    [/document|kaagaz/, 'documents'],
    [/home|dashboard/, 'home'],
    [/speak|companion|care agent/, 'ai'],
  ];
  const hit = map.find(([re]) => re.test(text));
  return hit ? hit[1] : null;
}

export function gameHow(gameId) {
  return GAMES_HOW[gameId] || null;
}

export function allGameIds() {
  return ASSIST_GAMES.map((row) => row.id);
}
