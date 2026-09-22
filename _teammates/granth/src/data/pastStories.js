const LAST_KEY = 'smriti-last-story-id';

export const STORY_LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'as', label: 'অসমীয়া' },
];

export function storyLang(code) {
  if (code === 'hi' || code === 'as' || code === 'en') return code;
  if (code === 'bn' || code === 'mni') return 'as';
  if (['ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'brx'].includes(code)) return 'hi';
  return 'en';
}

export function loc(lang, pack) {
  if (pack == null) return '';
  if (typeof pack === 'string') return pack;
  const key = storyLang(lang);
  return pack[key] || pack.en || pack.hi || pack.as || '';
}

const t = (en, hi, as) => ({ en, hi, as });

function opt(en, hi, as, ok) {
  return { en, hi, as, ok };
}

function beat(kind, say, ask, options, hint) {
  return { kind, say, ask, options, hint };
}

export const PAST_STORIES = [
  {
    id: 'tea-garden',
    title: t('Dew in the tea garden', 'चाय बागान की ओस', 'চাহ বাৰীৰ শিচিৰ'),
    opening: t(
      'Latveria was still a girl when the garden woke before the sun. The rows of tea ran like a wet green sea down the slope. Dew clung to her ankles. Far below, the factory chimney breathed iron. This is that morning, told slowly, the way a person remembers while pouring tea.',
      'लत्वेरिया तब भी लड़की थी जब बागान सूरज से पहले जागता था। चाय की पंक्तियाँ गीले हरे समुद्र की तरह ढलान पर दौड़ती थीं। ओस टखनों पर चिपकती। नीचे कारखाने की चिमन लोहा साँस लेती। यह वही सुबह है, धीरे बताई हुई, जैसे कोई चाय डालते हुए याद करे।',
      'লটভেৰিয়া তেতিয়াও ছোৱালী আছিল যেতিয়া বাগিচাখন সূৰ্যৰ আগতে সাৰ পায়। চাহৰ শাৰী তিতা সেউজীয়া সাগৰৰ দৰে ঢালেদি দৌৰে। শিচিৰে ভৰিৰ গাঁঠিত লাগে। তলত কাৰখানাৰ চিমনিয়ে লোহাৰ উশাহ লয়। এইখন সেই পুৱা, লাহে লাহে কোৱা, যেনেকৈ কোনোবাই চাহ ঢালি থাকোঁতে মনত পেলায়।',
    ),
    close: t(
      'The baskets went down the slope. The dew had already paid them. Latveria still smells crushed leaf when rain starts.',
      'टोकरियाँ ढलान से उतर गईं। ओस पहले ही मजदूरी दे चुकी थी। बारिश शुरू हो तो लत्वेरिया को अब भी कुचली पत्ती की महक आती है।',
      'পাচিবোৰ ঢালেদি নামিল। শিচিৰেই মজুৰী দিলে। বৰষুণ আহিলে লটভেৰিয়াই এতিয়াও চেপা পাতৰ গোন্ধ পায়।',
    ),
    beats: [
      beat(
        'memory',
        t(
          'Before the sun had cleared the bushes, Latveria walked between the rows. Dew clung to her ankles like cold glass bangles. A hornbill called once from the shade tree, then went quiet, as if it too was waiting for the first leaf.',
          'सूरज झाड़ियों से ऊपर आने से पहले लत्वेरिया पंक्तियों के बीच चली। ओस टखनों पर ठंडी कांच की चूड़ियों जैसी चिपक गई। छाँव के पेड़ से हॉर्नबिल एक बार बोला, फिर चुप — जैसे वह भी पहली पत्ती का इंतज़ार कर रहा हो।',
          'সূৰ্যই গছৰ ওপৰলৈ উঠাৰ আগতে লটভেৰিয়া শাৰীৰ মাজেৰে খোজ কাঢ়িলে। শিচিৰে ঠাণ্ডা কাঁচৰ বালাৰ দৰে ভৰিৰ গাঁঠিত লাগিল। ছাঁৰ গছৰ পৰা হৰ্ণবিলে এবাৰ মাতিলে, তাৰ পাছত নিমাত।',
        ),
        t('What clung to her ankles at dawn?', 'भोर में टखनों पर क्या चिपक गया?', 'পুৱাতে ভৰিৰ গাঁঠিত কি লাগিছিল?'),
        [
          opt('Dew, like cold glass', 'ओस, ठंडी कांच जैसी', 'শিচিৰ, ঠাণ্ডা কাঁচৰ দৰে', true),
          opt('Engine oil', 'इंजन तेल', 'ইঞ্জিন তেল', false),
          opt('River sand', 'नदी की रेत', 'নদীৰ বালি', false),
        ],
        t('Dew on the ankles, before the sun.', 'सूरज से पहले टखनों पर ओस।', 'সূৰ্যৰ আগতে ভৰিৰ গাঁঠিত শিচিৰ।'),
      ),
      beat(
        'memory',
        t(
          'Her sister walked ahead with a gamosa tied at her waist, red border bright. The pluckers’ baskets bumped softly against the leaves. They were not rich. They were early. The dew was the first wage, and nobody wrote it in a ledger.',
          'बहन कमर पर गामोसा बाँधे आगे चली, लाल किनारी चमकीली। तोड़ने वालों की टोकरियाँ पत्तों से धीरे टकराती रहीं। वे अमीर नहीं थे। वे जल्दी थे। ओस पहली मजदूरी थी, किसी बही में नहीं लिखी।',
          'ভনীয়েক কঁকালত গামোচা বান্ধি আগে গ\'ল, ৰঙা কাষ জিলিকিছিল। তোলাসকলৰ পাচিবোৰে পাতত লাহি খুন্দা মাৰিছিল। তেওঁলোক ধনী নাছিল। আগতীয়া আছিল। শিচিৰেই প্ৰথম মজুৰী।',
        ),
        t('What cloth was tied at her sister’s waist?', 'बहन की कमर पर कौन-सा कपड़ा था?', 'ভনীয়েকৰ কঁকালত কোন কাপোৰ আছিল?'),
        [
          opt('A gamosa', 'गामोसा', 'গামোচা', true),
          opt('A raincoat', 'रेनकोट', 'ৰেইনকোট', false),
          opt('A school tie', 'स्कूल की टाई', 'স্কুলৰ টাই', false),
        ],
        t('A gamosa at the waist, red border.', 'कमर पर गामोसा, लाल किनारी।', 'কঁকালত গামোচা, ৰঙা কাষ।'),
      ),
      beat(
        'riddle',
        t(
          'The overseer did not shout. He only lifted two fingers and a bud — the oldest grammar of this garden. Anyone who has stood between the rows knows what those three green things mean when the basket is still light.',
          'निरीक्षक चिल्लाया नहीं। केवल दो उंगलियाँ और एक कली उठाई — इस बागान का सबसे पुराना व्याकरण। पंक्तियों में खड़ा कोई जानता है, टोकरी हल्की हो तो वे तीन हरी चीजें क्या कहती हैं।',
          'অভাৰচিয়াৰে চিঞৰা নাছিল। কেৱল দুই আঙুলি আৰু এটা কলি তুলিছিল। পাচিখন পাতল হ’লে সেই তিনিটা সেউজীয়া বস্তুৱে কি কয়, শাৰীত থিয় হোৱাজনে জানে।',
        ),
        t('What is the garden’s oldest measure of a good pluck?', 'अच्छी तोड़ाई का सबसे पुराना नाप क्या है?', 'ভাল তোলাৰ পুৰণি মাপ কি?'),
        [
          opt('Two leaves and a bud', 'दो पत्ती और एक कली', 'দুখিলা আৰু এটা কলি', true),
          opt('A full coconut', 'पूरा नारियल', 'গোটেই নাৰিকল', false),
          opt('A steel thali', 'स्टील थाली', 'ষ্টীল থালী', false),
        ],
        t('Two leaves and a bud.', 'दो पत्ती एक कली।', 'দুখিলা-এটা-কলি।'),
      ),
      beat(
        'memory',
        t(
          'By mid-morning Latveria’s fingers were green and a little numb. She tucked a young leaf behind her ear the way the older women did, not for beauty, only so the smell would stay when the whistle called them down.',
          'दोपहर से पहले लत्वेरिया की उंगलियाँ हरी और थोड़ी सुन्न थीं। उसने युवा पत्ती कान के पीछे रखी, जैसे बड़ी औरतें रखती हैं — सुंदरता के लिए नहीं, ताकि सीटी बजने पर भी महक साथ रहे।',
          'দুপৰীয়াৰ আগতে লটভেৰিয়াৰ আঙুলি সেউজীয়া আৰু অলপ অবশ। তাই ডেকা পাত কাণৰ পাছফালে থলে, বয়সীয়া তিৰোতাসকলে থোৱাৰ দৰে — সুন্দৰৰ বাবে নহয়, চিঞৰিলেও গোন্ধ থাকিবলৈ।',
        ),
        t('Where did she tuck the young leaf?', 'युवा पत्ती उसने कहाँ रखी?', 'ডেকা পাত তাই ক\'ত থলে?'),
        [
          opt('Behind her ear', 'कान के पीछे', 'কাণৰ পাছফালে', true),
          opt('In a steel box', 'स्टील डिब्बे में', 'ষ্টীল বাকচত', false),
          opt('Under the chimney', 'चिमन के नीचे', 'চিমনিৰ তলত', false),
        ],
        t('A leaf behind the ear, like the older women.', 'कान के पीछे पत्ती।', 'কাণৰ পাছফালে পাত।'),
      ),
      beat(
        'memory',
        t(
          'The whistle was not kind and not cruel. It was a fact, like rain. When it sounded, baskets turned toward the path. Latveria looked once at the shade tree. The hornbill had not called again.',
          'सीटी न दयालु थी न क्रूर। वह तथ्य थी, बारिश जैसी। बजते ही टोकरियाँ रास्ते की ओर मुड़ीं। लत्वेरिया ने छाँव के पेड़ को एक बार देखा। हॉर्नबिल फिर नहीं बोला।',
          'চিঞৰি দয়াবানও নহয় নিষ্ঠুৰও নহয়। সেয়া তথ্য, বৰষুণৰ দৰে। বাজিলে পাচিবোৰ বাটলৈ ঘূৰিল। লটভেৰিয়াই ছাঁৰ গছলৈ এবাৰ চাইছিল। হৰ্ণবিলে আৰু নমতা।',
        ),
        t('What made the baskets turn toward the path?', 'टोकरियाँ रास्ते की ओर किससे मुड़ीं?', 'পাচিবোৰ বাটলৈ কিহে ঘূৰালে?'),
        [
          opt('The factory whistle', 'कारखाने की सीटी', 'কাৰখানাৰ চিঞৰি', true),
          opt('A temple bell', 'मंदिर की घंटी', 'মন্দিৰৰ ঘণ্টা', false),
          opt('A radio song', 'रेडियो का गाना', 'ৰেডিঅ’ৰ গান', false),
        ],
        t('The whistle, like rain — a fact.', 'सीटी, बारिश जैसी — एक तथ्य।', 'চিঞৰি, বৰষুণৰ দৰে।'),
      ),
      beat(
        'riddle',
        t(
          'On the path an old plucker asked Latveria a garden joke, not to be cruel, only to keep the feet moving. “I drink fire and become a river in a cup. What am I before I am poured?”',
          'रास्ते पर एक बुजुर्ग तोड़ने वाली ने लत्वेरिया से बागान की पहेली पूछी, क्रूरता से नहीं, कदम चलते रहें इसलिए। “मैं आग पीती हूँ और प्याले में नदी बन जाती हूँ। उंडेले जाने से पहले मैं क्या हूँ?”',
          'বাটত এগৰাকী বয়সীয়া তোলাই লটভেৰিয়াক বাগিচাৰ সাঁথৰ সুধিলে, নিষ্ঠুৰতাৰ বাবে নহয়, ভৰি চলি থাকিবলৈ। “মই জুই খাওঁ আৰু পিয়লাত নদী হওঁ। ঢলাৰ আগতে মই কি?”',
        ),
        t('What drinks fire and becomes a river in a cup?', 'क्या आग पीकर प्याले में नदी बनती है?', 'কি জুই খাই পিয়লাত নদী হয়?'),
        [
          opt('Dried tea leaf', 'सूखी चाय पत्ती', 'শুকান চাহ পাত', true),
          opt('A fish', 'मछली', 'মাছ', false),
          opt('A lantern', 'लालटेन', 'লণ্ঠন', false),
        ],
        t('Dried leaf, then hot water, then the cup.', 'सूखी पत्ती, फिर गरम पानी, फिर प्याला।', 'শুকান পাত, তাৰ পাছত গৰম পানী।'),
      ),
      beat(
        'memory',
        t(
          'At the weighing shed Latveria’s mother counted without looking at the numbers, the way one counts rain. She pressed a small jaggery into Latveria’s palm. “Eat. The dew was work. Work may also be sweet.” Years later Doom would ask why her hands still smell of leaf. She would tell him this morning, not all at once.',
          'तौल छप्पर पर माँ ने बिना अंक देखे गिना, जैसे बारिश गिनते हैं। लत्वेरिया की हथेली में थोड़ा गुड़ दबाया। “खा। ओस काम था। काम मीठा भी हो सकता है।” सालों बाद डूम पूछेगा हाथों में पत्ती क्यों महकती है। वह यही सुबह बताएगी, एक साथ नहीं।',
          'তোলা চালিয়াত মাকে সংখ্যা নোচোৱাকৈ গণিলে, বৰষুণ গণিলে যেনেকৈ। লটভেৰিয়াৰ হাতত অলপ গুৰ দিলে। “খা। শিচিৰ কাম আছিল। কাম মিঠাও হ’ব পাৰে।” বছৰৰ পাছত ডুমে সুধিব হাতত পাতৰ গোন্ধ কিয়। তাই এই পুৱা ক’ব, একেবাৰে নহয়।',
        ),
        t('What did her mother press into her palm?', 'माँ ने हथेली में क्या दबाया?', 'মাকে হাতত কি দিলে?'),
        [
          opt('A little jaggery', 'थोड़ा गुड़', 'অলপ গুৰ', true),
          opt('A silver coin', 'चाँदी का सिक्का', 'ৰূপৰ মুদ্ৰা', false),
          opt('A school pencil', 'स्कूल की पेंसिल', 'স্কুলৰ পেঞ্চিল', false),
        ],
        t('Jaggery in the palm after the dew-work.', 'ओस-काम के बाद हथेली में गुड़।', 'শিচিৰ-কামৰ পাছত হাতত গুৰ।'),
      ),
    ],
  },
  {
    id: 'ferry',
    title: t('The Brahmaputra ferry', 'ब्रह्मपुत्र की नाव', 'ব্ৰহ্মপুত্ৰৰ নাও'),
    opening: t(
      'The river was wider than any road Latveria trusted. They were going to the other bank for a cousin’s wedding. Doom was small then, holding the rail as if the rail were a person. The ferry coughed, then agreed to move. This crossing is still in her bones when the wind smells of silt.',
      'नदी किसी भरोसेमंद सड़क से चौड़ी थी। वे चचेरे की शादी के लिए उस पार जा रहे थे। डूम तब छोटा था, रेलिंग ऐसे पकड़े जैसे रेलिंग इंसान हो। नाव खाँसी, फिर चलने को राजी हुई। गाद की महक वाली हवा में यह पार आज भी हड्डियों में है।',
      'নদীখন যিকোনো বিশ্বাসী বাটতকৈ বহল। তেওঁলোক খুলশালীৰ বিয়ালৈ সিপাৰলৈ গৈ আছিল। ডুম তেতিয়া সৰু, ৰেলিং ধৰি যেন ৰেলিং মানুহ। নাওখনে কাহিল, তাৰ পাছত চলিবলৈ সন্মত হ’ল। পলিৰ গোন্ধ থকা বতাহত এই পাৰ এতিয়াও হাড়ত আছে।',
    ),
    close: t(
      'The other bank arrived the way a promise arrives — late, then all at once. Doom let go of the rail. Latveria did not.',
      'वह पार वादे की तरह आया — देर से, फिर एक साथ। डूम ने रेलिंग छोड़ी। लत्वेरिया ने नहीं।',
      'সিপাৰ অঙ্গীকাৰৰ দৰে আহিল — পলমকৈ, তাৰ পাছত একেবাৰে। ডুমে ৰেলিং এৰিলে। লটভেৰিয়াই নেরিলে।',
    ),
    beats: [
      beat(
        'memory',
        t(
          'Tickets were paper that wanted to fly. Latveria put Doom’s ticket inside her blouse like the older aunties did. The ferryman’s hands were cracked from rope. He called the river “he”, not “it”, and nobody corrected him.',
          'टिकट कागज थे जो उड़ना चाहते थे। लत्वेरिया ने डूम की टिकट ब्लाउज में रखी, जैसे बड़ी चाचियाँ रखती हैं। मल्लाह के हाथ रस्सी से फटे थे। वह नदी को “वह” कहता था, “यह” नहीं, और किसी ने नहीं टोका।',
          'টিকট কাগজ, উৰিব খোজে। লটভেৰিয়াই ডুমৰ টিকট ব্লাউজত থলে, বয়সীয়া খুড়ীসকলে থোৱাৰ দৰে। নাওখীয়াৰ হাত ৰছীৰে ফাটিছিল। সি নদীক “সি” বোলে, “সেয়া” নহয়।',
        ),
        t('Where did Latveria put Doom’s ticket?', 'डूम की टिकट लत्वेरिया ने कहाँ रखी?', 'ডুমৰ টিকট লটভেৰিয়াই ক\'ত থলে?'),
        [
          opt('Inside her blouse', 'ब्लाउज के अंदर', 'ব্লাউজৰ ভিতৰত', true),
          opt('In the river', 'नदी में', 'নদীত', false),
          opt('Under the engine', 'इंजन के नीचे', 'ইঞ্জিনৰ তলত', false),
        ],
        t('The paper ticket went inside the blouse.', 'कागजी टिकट ब्लाउज में गई।', 'কাগজৰ টিকট ব্লাউজত গ’ল।'),
      ),
      beat(
        'memory',
        t(
          'Mid-river the engine coughed twice. People became quiet in the honest way. A man offered Doom a boiled egg from a newspaper cone. Latveria said thank you with her eyes. The water was the colour of strong tea with too much milk.',
          'बीच धारा में इंजन दो बार खाँसा। लोग ईमानदार खामोशी में आ गए। एक आदमी ने अखबार की पुड़िया से डूम को उबला अंडा दिया। लत्वेरिया ने आँखों से धन्यवाद कहा। पानी ज्यादा दूध वाली गहरी चाय जैसा था।',
          'মাজ নদীত ইঞ্জিনে দুবাৰ কাহিল। মানুহে সত্ নিমাত হ’ল। এজন মানুহে খবৰ-কাগজৰ পুৰিয়াৰ পৰা ডুমক সিজা কণী দিলে। পানী বেছি গাখীৰ থকা টান চাহৰ ৰঙৰ।',
        ),
        t('What did the man offer Doom?', 'आदमी ने डूम को क्या दिया?', 'মানুহজনে ডুমক কি দিলে?'),
        [
          opt('A boiled egg', 'उबला अंडा', 'সিজা কণী', true),
          opt('A kite', 'पतंग', 'চিলনী', false),
          opt('A bicycle bell', 'साइकिल की घंटी', 'চাইকেলৰ ঘণ্টা', false),
        ],
        t('A boiled egg from a newspaper cone.', 'अखबार की पुड़िया से उबला अंडा।', 'খবৰ-কাগজৰ পুৰিয়াৰ পৰা সিজা কণী।'),
      ),
      beat(
        'riddle',
        t(
          'An old woman on the bench tapped Doom’s knee. “I have a back but I never lie down. I carry villages and still I am a road. What am I, child, if I am also a snake in the maps?”',
          'बेंच पर एक बुजुर्ग औरत ने डूम के घुटने पर थपकी दी। “मेरी पीठ है पर मैं लेटती नहीं। गाँव ढोती हूँ और फिर भी सड़क हूँ। नक्शे में साँप भी हूँ तो मैं क्या हूँ, बच्चे?”',
          'বেঞ্চত এগৰাকী বয়সীয়া তিৰোতাই ডুমৰ আঁঠুত টোকৰ মাৰিলে। “মোৰ পিঠি আছে কিন্তু মই শোৱা নাই। গাঁও কঢ়িয়াওঁ আৰু তথাপি বাট। মানচিত্ৰত সাপও হওঁ, তেন্তে মই কি, ল’ৰা?”',
        ),
        t('What carries villages, is a road, and is a snake on maps?', 'क्या गाँव ढोती है, सड़क है, नक्शे में साँप है?', 'কি গাঁও কঢ়িয়ায়, বাট, মানচিত্ৰত সাপ?'),
        [
          opt('The river', 'नदी', 'নদী', true),
          opt('A railway clock', 'रेल की घड़ी', 'ৰেলৰ ঘড়ী', false),
          opt('A market bag', 'बाजार का थैला', 'বজাৰৰ বেগ', false),
        ],
        t('The river — back, road, snake on the map.', 'नदी — पीठ, सड़क, नक्शे का साँप।', 'নদী — পিঠি, বাট, মানচিত্ৰৰ সাপ।'),
      ),
      beat(
        'memory',
        t(
          'A line of geese crossed the sky as if they had paid for a separate ticket. Doom pointed. Latveria did not look up at first; she was counting the remaining coughs of the engine. Then she looked, and the geese were already a rumour.',
          'हंसों की पंक्ति आकाश से ऐसे गई जैसे उन्होंने अलग टिकट लिया हो। डूम ने इशारा किया। लत्वेरिया पहले ऊपर नहीं देखी; वह इंजन की बाकी खाँसियाँ गिन रही थी। फिर देखा, हंस अफवाह बन चुके थे।',
          'হাঁহৰ শাৰী আকাশত গ’ল যেন বেলেগ টিকট লৈছে। ডুমে আঙুলিয়াই দেখুৱালে। লটভেৰিয়াই প্ৰথমে ওপৰলৈ নচোৱা; তাই ইঞ্জিনৰ বাকী কাহ গণি আছিল।',
        ),
        t('What crossed the sky in a line?', 'आकाश में पंक्ति बनाकर क्या गया?', 'আকাশত শাৰীকৈ কি গ’ল?'),
        [
          opt('Geese', 'हंस', 'হাঁহ', true),
          opt('Aeroplanes', 'हवाई जहाज', 'বিমান', false),
          opt('Kites only', 'केवल पतंगें', 'কেৱল চিলনী', false),
        ],
        t('Geese, already a rumour when she looked.', 'हंस, देखने तक अफवाह।', 'হাঁহ, চোৱাৰ সময়লৈ গুজব।'),
      ),
      beat(
        'memory',
        t(
          'Near the bank the water grew brown and busy. Bamboo poles appeared like arguments. The ferryman spat into the current for luck, then looked ashamed, then did not apologise. Latveria held Doom’s shoulder. The rail was no longer enough.',
          'किनारे के पास पानी भूरा और व्यस्त हो गया। बांस के डंडे दलीलों जैसे निकले। मल्लाह ने किस्मत को थूक दिया धारा में, फिर शर्मिंदा हुआ, फिर माफी नहीं मांगी। लत्वेरिया ने डूम का कंधा थामा। रेलिंग अब काफी नहीं थी।',
          'পাৰৰ ওচৰত পানী মুগা আৰু ব্যস্ত হ’ল। বাঁহৰ খুঁটা তৰ্কৰ দৰে ওলাল। নাওখীয়াই ভাগ্যলৈ থুই পেলালে সোঁতত। লটভেৰিয়াই ডুমৰ কান্ধ ধৰিলে।',
        ),
        t('What did Latveria hold when the bank came close?', 'किनारा पास आया तो लत्वेरिया ने क्या थामा?', 'পাৰ ওচৰ হোৱাত লটভেৰিয়াই কি ধৰিলে?'),
        [
          opt('Doom’s shoulder', 'डूम का कंधा', 'ডুমৰ কান্ধ', true),
          opt('The chimney', 'चिमन', 'চিমনি', false),
          opt('A bicycle', 'साइकिल', 'চাইকেল', false),
        ],
        t('Doom’s shoulder — the rail was not enough.', 'डूम का कंधा — रेलिंग काफी नहीं।', 'ডুমৰ কান্ধ — ৰেলিং যথেষ্ট নহয়।'),
      ),
      beat(
        'riddle',
        t(
          'On the gangplank a boy asked a riddle to pass the waiting. “I clap without hands when I meet the bank. I write my name in mud and erase it. Who am I?”',
          'पाटन पर एक लड़के ने इंतज़ार काटने को पहेली पूछी। “किनारे से मिलकर बिना हाथ ताली बजाता हूँ। कीचड़ में नाम लिखता हूँ और मिटा देता हूँ। मैं कौन?”',
          'পাটনত এটা ল’ৰাই অপেক্ষা কটাবলৈ সাঁথৰ সুধিলে। “পাৰ লগ পালে হাত নোহোৱাকৈ চাপৰি মাৰোঁ। বোকাত নাম লিখোঁ আৰু মোহাৰোঁ। মই কোন?”',
        ),
        t('What claps without hands at the bank and writes in mud?', 'किनारे बिना हाथ ताली कौन बजाता है?', 'পাৰত হাত নোহোৱাকৈ চাপৰি কিয়ে মাৰে?'),
        [
          opt('A wave', 'लहर', 'ঢৌ', true),
          opt('A drum', 'ढोल', 'ঢোল', false),
          opt('A teacher', 'शिक्षक', 'শিক্ষক', false),
        ],
        t('A wave — clap, mud-name, gone.', 'लहर — ताली, कीचड़-नाम, गई।', 'ঢৌ — চাপৰি, বোকা-নাম, গ’ল।'),
      ),
      beat(
        'memory',
        t(
          'Wedding music leaked from a loudspeaker on the sand. Someone had already started the feast without them, which is how families work. Latveria laughed once, short. Doom asked if the river would come to the wedding. “He is invited,” she said. “He always is.”',
          'रेत पर लाउडस्पीकर से शादी का संगीत रिस रहा था। किसी ने उनके बिना भोज शुरू कर दिया था, परिवार ऐसे ही चलते हैं। लत्वेरिया एक बार हँसी, छोटी। डूम ने पूछा नदी शादी में आएगी क्या। “उसे न्योता है,” उसने कहा। “हमेशा रहता है।”',
          'বালিত লাউডস্পিকাৰৰ পৰা বিয়াৰ সংগীত ওলাই আছিল। তেওঁলোক নোহোৱাকৈ ভোজ আৰম্ভ হৈছিল। লটভেৰিয়াই এবাৰ হাঁহিলে। ডুমে সুধিলে নদী বিয়ালৈ আহিবনে। “তাইক নিমন্ত্ৰণ আছে,” তাই ক’লে।',
        ),
        t('What leaked from the loudspeaker on the sand?', 'रेत पर लाउडस्पीकर से क्या रिस रहा था?', 'বালিত লাউডস্পিকাৰৰ পৰা কি ওলাই আছিল?'),
        [
          opt('Wedding music', 'शादी का संगीत', 'বিয়াৰ সংগীত', true),
          opt('News of cricket', 'क्रिकेट की खबर', 'ক্ৰিকেটৰ খবৰ', false),
          opt('A weather warning', 'मौसम चेतावनी', 'বতৰৰ সতৰ্কবাণী', false),
        ],
        t('Wedding music on the sand.', 'रेत पर शादी का संगीत।', 'বালিত বিয়াৰ সংগীত।'),
      ),
    ],
  },
  {
    id: 'bihu-courtyard',
    title: t('Bihu in the courtyard', 'आंगन में बिहू', 'চোতালত বিহু'),
    opening: t(
      'The courtyard had been swept twice. That is how you know a festival is serious. Latveria sat on the low veranda with Doom against her knee. Someone was already arguing about the dhol skin. The first clap of the evening was not music yet. It was a decision.',
      'आंगन दो बार झाड़ा जा चुका था। इससे पता चलता है त्योहार गंभीर है। लत्वेरिया निचली बरामदे पर बैठी, डूम घुटने से सटा। कोई ढोल की खाल पर पहले से बहस कर रहा था। शाम की पहली ताली अभी संगीत नहीं थी। वह एक फैसला थी।',
      'চোতাল দুবাৰ কাটিছিল। ইয়ে জনায় উৎসৱ গুৰুতৰ। লটভেৰিয়া তলৰ বৰান্দাত বহিছিল, ডুম আঁঠুৰ ওচৰত। কোনোবাই ঢোলৰ ছাল লৈ তৰ্ক কৰি আছিল। গধূলিৰ প্ৰথম চাপৰি এতিয়াও সংগীত নাছিল। সেয়া সিদ্ধান্ত আছিল।',
    ),
    close: t(
      'When the last song thinned, the courtyard returned to being a place for drying clothes. Doom fell asleep with red on his palm from clapping. Latveria did not wash it off until morning.',
      'आखिरी गीत पतला पड़ा तो आंगन फिर कपड़े सुखाने की जगह बन गया। डूम ताली से लाल हथेली लिए सो गया। लत्वेरिया ने सुबह तक नहीं धोया।',
      'শেষ গীত পাতল হোৱাত চোতাল পুনৰ কাপোৰ শুকুওৱা ঠাই হ’ল। ডুম চাপৰিৰে ৰঙা হাত লৈ শুই পৰিল। লটভেৰিয়াই ৰাতিপুৱালৈ নধুলে।',
    ),
    beats: [
      beat(
        'memory',
        t(
          'The dhol player spat on his palms and looked at the sky as if asking permission. When the first beat landed, even the goats at the fence stopped chewing. Doom tried to clap on the off-beat and failed, which is also a kind of joining.',
          'ढोलिये ने हथेलियों पर थूककर आसमान देखा जैसे इजाजत माँग रहा हो। पहली थाप पड़ी तो बाड़ के बकरे भी चबाना भूल गए। डूम ने बेताल ताली बजाने की कोशिश की और चूक गया, जो जुड़ने का एक तरीका भी है।',
          'ঢোলোৱাই হাতত থুই আকাশলৈ চাইছিল যেন অনুমতি খুজিছে। প্ৰথম মাত পৰাত বেৰৰ ছাগলীয়েও চোবাবলৈ পাহৰিলে। ডুমে বেলেগ তালত চাপৰি মাৰিবলৈ চেষ্টা কৰিলে আৰু ব্যৰ্থ হ’ল।',
        ),
        t('Which instrument started the evening?', 'शाम किस वाद्य से शुरू हुई?', 'গধূলি কোন বাদ্যে আৰম্ভ হ’ল?'),
        [
          opt('The dhol', 'ढोल', 'ঢোল', true),
          opt('A piano', 'पियानो', 'পিয়ানো', false),
          opt('A conch in the kitchen', 'रसोई में शंख', 'ৰান্ধনিত শংখ', false),
        ],
        t('The dhol — first beat, goats forgotten.', 'ढोल — पहली थाप, बकरे भूल गए।', 'ঢোল — প্ৰথম মাত।'),
      ),
      beat(
        'memory',
        t(
          'Women in muga silk moved like slow lamps. Latveria had not worn her good mekhela that year; her back was tired. She still stamped the earth once, privately, when the pepa cried. Doom copied the stamp and fell into her lap, laughing.',
          'मूगा रेशम में औरतें धीमे दीयों जैसी चलीं। लत्वेरिया ने उस साल अच्छी मेखला नहीं पहनी; पीठ थकी थी। फिर भी पेपा के रोने पर उसने एक बार धरती पर निजी थाप दी। डूम ने थाप की नकल की और गोद में गिर हँसा।',
          'মুগা ৰেচমত তিৰোতাসকল লেহেমীয়া চাকিৰ দৰে গতি কৰিলে। লটভেৰিয়াই সেই বছৰ ভাল মেখেলা পিন্ধা নাছিল। তথাপি পেপা কান্দোতে তাই এবাৰ মাটিত ব্যক্তিগত টোকৰ দিলে।',
        ),
        t('What did Latveria stamp, privately, when the pepa cried?', 'पेपा रोया तो लत्वेरिया ने निजी तौर पर क्या कुचला?', 'পেপা কান্দোতে লটভেৰিয়াই ব্যক্তিগতভাৱে কি টোকৰ দিলে?'),
        [
          opt('The earth', 'धरती', 'মাটি', true),
          opt('A steel plate', 'स्टील प्लेट', 'ষ্টীল প্লেট', false),
          opt('The radio', 'रेडियो', 'ৰেডিঅ’', false),
        ],
        t('She stamped the earth once.', 'उसने धरती पर एक थाप दी।', 'তাই মাটিত এবাৰ টোকৰ দিলে।'),
      ),
      beat(
        'riddle',
        t(
          'A neighbour’s child asked from the steps, “I have a waist of bamboo and a voice of buffalo. I cry and people smile. What am I?” Latveria answered before Doom could, then let him think he had known.',
          'सीढ़ियों से पड़ोस के बच्चे ने पूछा, “मेरी कमर बाँस की है, आवाज़ भैंस की। मैं रोता हूँ लोग मुस्कराते हैं। मैं क्या हूँ?” लत्वेरिया ने डूम से पहले जवाब दिया, फिर उसे सोचने दिया कि वह जानता था।',
          'খেজত ওচৰৰ ল’ৰাই সুধিলে, “মোৰ কঁকাল বাঁহৰ, মাত ম’হৰ। মই কান্দোঁ মানুহে হাঁহে। মই কি?” লটভেৰিয়াই ডুমৰ আগতে উত্তৰ দিলে।',
        ),
        t('What has a bamboo waist, a buffalo voice, and makes people smile when it cries?', 'बाँस की कमर, भैंस की आवाज़, रोने पर मुस्कान — क्या है?', 'বাঁহৰ কঁকাল, ম’হৰ মাত, কান্দিলে হাঁহি — কি?'),
        [
          opt('The pepa', 'पेपा', 'পেপা', true),
          opt('A pressure cooker', 'प्रेशर कुकर', 'প্ৰেচাৰ কুকাৰ', false),
          opt('A motorcycle', 'मोटरसाइकिल', 'মটৰচাইকেল', false),
        ],
        t('The pepa — bamboo, buffalo, festival cry.', 'पेपा — बाँस, भैंस, त्योहार का रोना।', 'পেপা — বাঁহ, ম’হ, উৎসৱৰ কান্দোন।'),
      ),
      beat(
        'memory',
        t(
          'Pitha arrived on a wide steel plate, still breathing steam. Someone had burnt the first batch and called it “the offering to the dog”. The dog, being wise, refused. Doom ate two, then hid a third in his fist like a secret coin.',
          'चौड़ी स्टील थाली पर पीठा आया, अभी भाप लेता। किसी ने पहली खेप जलाकर “कुत्ते की भेंट” कहा। कुत्ता समझदार था, मना कर दिया। डूम ने दो खाए, तीसरा मुट्ठी में छिपाया जैसे गुप्त सिक्का।',
          'বহল ষ্টীল থালীত পিঠা আহিল, এতিয়াও ভাপ লৈ। কোনোবাই প্ৰথম খেপ পুৰি “কুকুৰৰ উপহাৰ” বুলিলে। কুকুৰে নামানিলে। ডুমে দুটা খালে, তৃতীয়টো মুঠিত লুকুৱালে।',
        ),
        t('What arrived on the wide steel plate?', 'चौड़ी स्टील थाली पर क्या आया?', 'বহল ষ্টীল থালীত কি আহিল?'),
        [
          opt('Pitha', 'पीठा', 'পিঠা', true),
          opt('Ice cream', 'आइसक्रीम', 'আইচক্ৰীম', false),
          opt('Packets of chips', 'चिप्स के पैकेट', 'চিপছৰ পেকেট', false),
        ],
        t('Pitha, still steaming.', 'पीठा, अभी भाप लेता।', 'পিঠা, এতিয়াও ভাপ।'),
      ),
      beat(
        'memory',
        t(
          'When the men formed a circle, the dust rose and became part of the song. Latveria pulled Doom back from the flying elbows. She named the steps under her breath, old names, the way one names relatives at a funeral so they do not get lost.',
          'मर्दों का घेरा बना तो धूल उठी और गीत का हिस्सा बन गई। लत्वेरिया ने उड़ती कहनियों से डूम को पीछे खींचा। उसने कदमों के पुराने नाम साँस में लिए, जैसे अंतिम संस्कार में रिश्तेदारों के नाम लेते हैं ताकि वे खो न जाएँ।',
          'পুৰুষে ঘেৰা সুমোৱাত ধূলি উঠিল আৰু গীতৰ অংশ হ’ল। লটভেৰিয়াই উৰা কিলাকুটিৰ পৰা ডুমক পিছলৈ টানিলে। তাই খোজৰ পুৰণি নাম উশাহত ল’লে।',
        ),
        t('What rose and became part of the song?', 'क्या उठा और गीत का हिस्सा बन गया?', 'কি উঠিল আৰু গীতৰ অংশ হ’ল?'),
        [
          opt('Dust from the circle', 'घेरे की धूल', 'ঘেৰাৰ ধূলি', true),
          opt('Smoke from a train', 'ट्रेन का धुआँ', 'ৰেলৰ ধোঁৱা', false),
          opt('Chalk from a classroom', 'कक्षा की खड़िया', 'শ্ৰেণীৰ খৰি', false),
        ],
        t('Dust from the men’s circle.', 'मर्दों के घेरे की धूल।', 'পুৰুষৰ ঘেৰাৰ ধূলি।'),
      ),
      beat(
        'riddle',
        t(
          'Between songs someone asked, “I am beaten and I am happy. My skin is an animal’s old work. Without me the feet forget the earth. What am I?”',
          'गीतों के बीच किसी ने पूछा, “मुझे पीटा जाता है और मैं खुश हूँ। मेरी खाल जानवर का पुराना काम है। मेरे बिना पाँव धरती भूल जाते हैं। मैं क्या हूँ?”',
          'গীতৰ মাজত কোনোবাই সুধিলে, “মোক পিটক আৰু মই সুখী। মোৰ ছাল জন্তুৰ পুৰণি কাম। মোক নোহোৱাকৈ ভৰিয়ে মাটি পাহৰে। মই কি?”',
        ),
        t('What is beaten and happy, with an animal-skin, so feet remember the earth?', 'किसे पीटा जाता है और वह खुश है, खाल वाली?', 'কাক পিটক আৰু সি সুখী, ছাল থকা?'),
        [
          opt('The dhol', 'ढोल', 'ঢোল', true),
          opt('A pillow', 'तकिया', 'বালিশ', false),
          opt('A mango', 'आम', 'আম', false),
        ],
        t('The dhol — beaten, happy, skin.', 'ढोल — पीटा, खुश, खाल।', 'ঢোল — পিটা, সুখী, ছাল।'),
      ),
      beat(
        'memory',
        t(
          'Late, a cousin put a gamosa on Doom’s shoulders as a joke that was also a blessing. Doom stood too straight, like a small official. Latveria took a photograph in her mind only. The phone was in another room, charging, which is also a kind of mercy.',
          'देर से एक चचेरे ने मजाक में भी आशीष में डूम के कंधों पर गामोसा रखा। डूम बहुत सीधा खड़ा रहा, छोटे अधिकारी जैसा। लत्वेरिया ने केवल मन में तस्वीर ली। फोन दूसरे कमरे में चार्ज हो रहा था, जो दया भी है।',
          'পলমকৈ এজন খুলশালীয়ে ठाट্টাতো আशीर्वादতো ডুমৰ কান্ধত গামোচা থলে। ডুম বৰ পোনকৈ থিয় হ’ল। লটভেৰিয়াই কেৱল মনত ফটো ল’লে। ফোন আন কোঠাত চাৰ্জ হৈ আছিল।',
        ),
        t('What was placed on Doom’s shoulders?', 'डूम के कंधों पर क्या रखा गया?', 'ডুমৰ কান্ধত কি থলোৱা হ’ল?'),
        [
          opt('A gamosa', 'गामोसा', 'গামোচা', true),
          opt('A school bag', 'स्कूल बैग', 'স্কুল বেগ', false),
          opt('A wet towel only', 'केवल गीला तौलिया', 'কেৱল তিতা টাৱেল', false),
        ],
        t('A gamosa on the shoulders — joke and blessing.', 'कंधों पर गामोसा — मजाक और आशीष।', 'কান্ধত গামোচা।'),
      ),
    ],
  },
  {
    id: 'kitchen-pitha',
    title: t('Steam in the kitchen', 'रसोई की भाप', 'ৰান্ধনিৰ ভাপ'),
    opening: t(
      'The kitchen was the smallest room and the largest country. Latveria’s mother-in-law sat on the low stool as if it were a throne that did not need gold. Rice had been soaked since before the crows. Doom kept coming in to steal the smell. This afternoon is still warm when someone fries sesame.',
      'रसोई सबसे छोटा कमरा और सबसे बड़ा देश था। सास निचले स्टूल पर ऐसी बैठी जैसे सिंहासन हो जिसे सोने की जरूरत न हो। कौओं से पहले चावल भिगोया जा चुका था। डूम महक चुराने आता रहा। तिल तलते ही यह दोपहर अभी गर्म है।',
      'ৰান্ধনি আটাইতকৈ সৰু কোঠা আৰু আটাইতকৈ ডাঙৰ দেশ। শাহু তলৰ টুলত বহিছিল যেন সিংহাসন, সোণৰ প্ৰয়োজন নাই। কাউৰীৰ আগতে চাউল তিয়াই থোৱা। ডুম গোন্ধ চোৰাবলৈ আহি থাকিল।',
    ),
    close: t(
      'They ate standing, because sitting would have been a different festival. The last pitha was cut in three. Nobody counted who got the larger share.',
      'वे खड़े-खड़े खाए, बैठना दूसरा त्योहार होता। आखिरी पीठा तीन में कटा। बड़े हिस्से का हिसाब किसी ने नहीं रखा।',
      'তেওঁলোকে থিয় হৈ খালে। শেষ পিঠা তিনিভাগত কটা হ’ল। ডাঙৰ অংশৰ হিচাপ কোনেও ৰখা নাই।',
    ),
    beats: [
      beat(
        'memory',
        t(
          'The pot lid lifted itself on steam and sat back down like a person changing their mind. Latveria stirred with a coconut-shell spoon older than Doom. The rice had become a slow white river.',
          'भाप से ढक्कन खुद उठा और बैठ गया जैसे किसी ने विचार बदल लिया। लत्वेरिया नारियल खोल के चम्मच से चला रही थी, डूम से पुराना। चावल धीमी सफेद नदी बन चुका था।',
          'ভাপে ঢাকনি নিজে উঠিল আৰু বহিল যেন কাৰোবাৰ মন সলনি। লটভেৰিয়াই নাৰিকল খোলাৰ চামুচেৰে ঘাঁটিছিল, ডুমতকৈ পুৰণি।',
        ),
        t('What kind of spoon did Latveria use?', 'लत्वेरिया किस चम्मच से चला रही थी?', 'লটভেৰিয়াই কি চামুচেৰে ঘাঁটিছিল?'),
        [
          opt('A coconut-shell spoon', 'नारियल खोल का चम्मच', 'নাৰিকল খোলাৰ চামুচ', true),
          opt('A silver fork', 'चाँदी का काँटा', 'ৰূপৰ কাঁটা', false),
          opt('A plastic ladle from a mall', 'मॉल का प्लास्टिक कलछी', 'মলৰ প্লাষ্টিক চাটু', false),
        ],
        t('Coconut-shell spoon, older than Doom.', 'नारियल खोल का चम्मच।', 'নাৰিকল খোলাৰ চামুচ।'),
      ),
      beat(
        'memory',
        t(
          'Sesame crackled in the pan and the whole house became a mouth. Doom reached; Latveria tapped his wrist, not hard. “Wait. Heat is also a relative. It visits, then it sits.” He waited, which surprised them both.',
          'कड़ाही में तिल फटा और पूरा घर मुँह बन गया। डूम ने हाथ बढ़ाया; लत्वेरिया ने कलाई पर थपकी दी, जोर से नहीं। “रुको। गर्मी भी रिश्तेदार है। आती है, फिर बैठती है।” वह रुका, दोनों हैरान हुए।',
          'কেৰাহীত তিল ফুটিল আৰু গোটেই ঘৰ মুখ হ’ল। ডুমে হাত আগবঢ়ালে; লটভেৰিয়াই মণিবন্ধত টোকৰ দিলে। “ৰ\'বা। তাপো আত্মীয়। আহে, তাৰ পাছত বহে।”',
        ),
        t('What crackled in the pan?', 'कड़ाही में क्या फटा?', 'কেৰাহীত কি ফুটিল?'),
        [
          opt('Sesame', 'तिल', 'তিল', true),
          opt('Ice cubes', 'बर्फ के टुकड़े', 'বৰফৰ টুকুৰা', false),
          opt('Nails', 'कीलें', 'कील', false),
        ],
        t('Sesame in the pan.', 'कड़ाही में तिल।', 'কেৰাহীত তিল।'),
      ),
      beat(
        'riddle',
        t(
          'The mother-in-law, without looking up, said, “I am a leaf that is not from a tree. I wrap a secret that is eaten. Fire knows me. What am I?” Doom guessed blanket. Latveria did not laugh at him.',
          'सास ने बिना सिर उठाए कहा, “मैं पत्ती हूँ पेड़ की नहीं। एक खाया जाने वाला राज़ लपेटती हूँ। आग मुझे जानती है। मैं क्या हूँ?” डूम ने कम्बल कहा। लत्वेरिया उस पर नहीं हँसी।',
          'শাহুৱে মুৰ নোতোলাকৈ ক’লে, “মই পাত, গছৰ নহয়। খোৱা গোপন লুকুৱাওঁ। জুইয়ে মোক চিনি পায়। মই কি?” ডুমে কम्बल ক’লে।',
        ),
        t('What leaf is not from a tree, wraps an eaten secret, and knows fire?', 'कौन सी पत्ती पेड़ की नहीं, खाए राज़ को लपेटती है?', 'কোন পাত গছৰ নহয়, খোৱা গোপন লুকুৱায়?'),
        [
          opt('A banana leaf', 'केले का पत्ता', 'কলপাত', true),
          opt('A newspaper', 'अखबार', 'খবৰ-কাগজ', false),
          opt('A bedsheet', 'चादर', 'চাদৰ', false),
        ],
        t('Banana leaf — wrap, steam, fire.', 'केले का पत्ता — लपेट, भाप, आग।', 'কলপাত — মেৰ, ভাপ, জুই।'),
      ),
      beat(
        'memory',
        t(
          'They folded the first til pitha badly on purpose, so the house would not become proud. The second was neat. The third Latveria made with Doom’s small hands over hers, which is how skill pretends to be born twice.',
          'पहला तिल पीठा जानबूझकर टेढ़ा मोड़ा, ताकि घर घमंडी न हो। दूसरा साफ था। तीसरा लत्वेरिया ने डूम के छोटे हाथ अपने हाथों पर रखकर बनाया — हुनर ऐसे दो बार जन्म लेता है।',
          'প্ৰথম তিল পিঠা জানি-বুজি বেঁকা ভাঁজ কৰিলে, ঘৰ অহংকাৰী নহ’বলৈ। দ্বিতীয়টো চোকা। তৃতীয়টো লটভেৰিয়াই ডুমৰ সৰু হাত নিজৰ হাতৰ ওপৰত থৈ বনালে।',
        ),
        t('Which pitha did they fold badly on purpose?', 'कौन सा पीठा जानबूझकर टेढ़ा मोड़ा?', 'কোন পিঠা জানি-বুজি বেঁকা ভাঁজ কৰা হ’ল?'),
        [
          opt('The first til pitha', 'पहला तिल पीठा', 'প্ৰথম তিল পিঠা', true),
          opt('A birthday cake', 'जन्मदिन का केक', 'জন্মদিনৰ কেক', false),
          opt('Store biscuits', 'दुकान की बिस्कुट', 'দোকানৰ বিস্কুট', false),
        ],
        t('The first one, so the house would not grow proud.', 'पहला, ताकि घर घमंड न करे।', 'প্ৰথমটো, ঘৰ গৰ্বী নহ’বলৈ।'),
      ),
      beat(
        'memory',
        t(
          'Jaggery melted into a dark lake and the spoon drew islands. Latveria told Doom not to touch; he touched the air above it instead, which is almost obedience. The smell was of festivals that had not asked for a calendar.',
          'गुड़ पिघलकर काली झील बना, चम्मच ने द्वीप खींचे। लत्वेरिया ने छूने को मना किया; डूम ने उसके ऊपर की हवा छुई, जो लगभग आज्ञा है। महक उन त्योहारों की थी जिन्हें कैलेंडर की जरूरत नहीं।',
          'গুৰ গলি ডাঠ হ্ৰদ হ’ল, চামুচে দ্বীপ আঁকিলে। লটভেৰিয়াই নছুনিবলৈ ক’লে; ডুমে ওপৰৰ বতাহ চুলে।',
        ),
        t('What melted into a dark lake in the pan?', 'कड़ाही में काली झील क्या बनकर पिघला?', 'কেৰাহীত ডাঠ হ্ৰদ কি গলি হ’ল?'),
        [
          opt('Jaggery', 'गुड़', 'গুৰ', true),
          opt('Soap', 'साबुन', 'চাবোন', false),
          opt('Candle wax', 'मोमबत्ती का मोम', 'মমবাতিৰ মম', false),
        ],
        t('Jaggery — a dark lake.', 'गुड़ — काली झील।', 'গুৰ — ডাঠ হ্ৰদ।'),
      ),
      beat(
        'riddle',
        t(
          'From the doorway Doom asked his own riddle, proud. “I am white, I sleep in water, I wake as a river in the pot. What am I?” The mother-in-law nodded as if the boy had paid rent.',
          'दरवाजे से डूम ने गर्व से अपनी पहेली पूछी। “मैं सफेद हूँ, पानी में सोता हूँ, हांड़ी में नदी बनकर जागता हूँ। मैं क्या हूँ?” सास ने सिर हिलाया जैसे लड़के ने किराया चुका दिया हो।',
          'দুৱাৰৰ পৰা ডুমে গৰ্বেৰে নিজৰ সাঁথৰ সুধিলে। “মই বগা, পানীত শোৱোঁ, পাত্ৰত নদী হৈ সাৰ পাওঁ। মই কি?” শাহুৱে মুৰ দুলায়।',
        ),
        t('What is white, sleeps in water, and wakes as a river in the pot?', 'क्या सफेद है, पानी में सोता है, हांड़ी में नदी बनता है?', 'কি বগা, পানীত শোৱে, পাত্ৰত নদী হয়?'),
        [
          opt('Rice', 'चावल', 'চাউল', true),
          opt('Cotton', 'कपास', 'কাপাহ', false),
          opt('Chalk', 'खड़िया', 'খৰি', false),
        ],
        t('Soaked rice, then the pot.', 'भिगोया चावल, फिर हांड़ी।', 'তিয়াই থোৱা চাউল, তাৰ পাছত পাত্ৰ।'),
      ),
      beat(
        'memory',
        t(
          'They carried the plate to the veranda because the kitchen had become a cloud. A neighbour called over the wall, not to take, only to witness. Latveria sent one pitha across like a letter. Doom waved as if the pitha could wave back.',
          'थाली बरामदे ले गए क्योंकि रसोई बादल बन गई थी। पड़ोसी ने दीवार के ऊपर से आवाज दी, लेने को नहीं, गवाह बनने को। लत्वेरिया ने एक पीठा पत्र की तरह भेज दिया। डूम ने हाथ हिलाया जैसे पीठा जवाब में हिलाए।',
          'থালী বৰান্দালৈ নিলে কাৰণ ৰান্ধনি ডাৱৰ হৈছিল। ওচৰৰ জনে দেৱালৰ ওপৰেৰে মাতিলে, ল’বলৈ নহয়, সাক্ষী হ’বলৈ। লটভেৰিয়াই এটা পিঠা চিঠিৰ দৰে পঠিয়ালে।',
        ),
        t('Where did they carry the plate because the kitchen became a cloud?', 'रसोई बादल बनी तो थाली कहाँ ले गए?', 'ৰান্ধনি ডাৱৰ হোৱাত থালী ক\'লৈ নিলে?'),
        [
          opt('The veranda', 'बरामदा', 'বৰান্দা', true),
          opt('The riverbank', 'नदी तट', 'নদীৰ পাৰ', false),
          opt('The bus stand', 'बस अड्डा', 'বাস ষ্টেণ্ড', false),
        ],
        t('To the veranda, out of the steam-cloud.', 'बरामदे, भाप-बादल से बाहर।', 'বৰান্দালৈ, ভাপ-ডাৱৰৰ পৰা।'),
      ),
    ],
  },
  {
    id: 'market-fish',
    title: t('Saturday market', 'शनिवार का बाजार', 'শনিবাৰৰ বজাৰ'),
    opening: t(
      'Saturday market was a river that had decided to walk. Latveria held Doom’s wrist, not his hand, because wrists do not slip as easily. There was mud, argument, coriander, and a man selling batteries as if they were medicine. They had come for fish. They would leave with more stories than fish.',
      'शनिवार का बाजार ऐसी नदी था जिसने चलने का फैसला किया हो। लत्वेरिया ने डूम का हाथ नहीं, कलाई पकड़ी, क्योंकि कलाई आसानी से नहीं छूटती। कीचड़, बहस, धनिया, और एक आदमी बैटरियाँ दवा की तरह बेच रहा था। वे मछली को आए थे। जाएँगे तो मछली से ज्यादा कहानियाँ साथ होंगी।',
      'শনিবাৰৰ বজাৰ এখন নদীয়ে খোজ কাঢ়িবলৈ সিদ্ধান্ত লোৱাৰ দৰে। লটভেৰিয়াই ডুমৰ হাত নহয়, মণিবন্ধ ধৰিলে। বোকা, তৰ্ক, ধনিয়া। তেওঁলোক মাছৰ বাবে আহিছিল।',
    ),
    close: t(
      'On the way home the fish stared from the bag as if it had opinions about the government. Doom named it. Latveria told him not to name dinner. Then she used the name anyway, once, under her breath.',
      'घर जाते थैले से मछली ऐसे देखती रही जैसे सरकार पर राय हो। डूम ने नाम रखा। लत्वेरिया ने कहा रात के खाने का नाम मत लो। फिर भी उसने एक बार साँस में वही नाम लिया।',
      'ঘৰলৈ যাওঁতে থলিত মাছে চাই থাকিল যেন চৰকাৰৰ ওপৰত মতামত আছে। ডুমে নাম থলে। লটভেৰিয়াই ক’লে ৰাতিৰ খোৱাৰ নাম নিদিবা। তাৰ পাছতো তাই এবাৰ উশাহত সেই নাম ল’লে।',
    ),
    beats: [
      beat(
        'memory',
        t(
          'The fish stall was a wet altar. Ice had given up and become water. The seller weighed with a look more than with the scale. Latveria asked the price as a conversation, not a war. Doom held his nose, then forgot, then held it again.',
          'मछली की दुकान गीला वेदी थी। बर्फ हारकर पानी बन गई थी। विक्रेता तराजू से ज्यादा नजर से तौलता था। लत्वेरिया ने दाम बातचीत की तरह पूछा, लड़ाई की तरह नहीं। डूम ने नाक दबाई, फिर भूला, फिर दबाई।',
          'মাছৰ দোকান তিতা বেদী। বৰফে হাৰি পানী হ’ল। বেচাজনে তৰাজুতকৈ চকুৰে তুলিলে। লটভেৰিয়াই দাম কথাৰ দৰে সুধিলে, যুদ্ধৰ দৰে নহয়।',
        ),
        t('What had the ice at the fish stall become?', 'मछली की दुकान पर बर्फ क्या बन गई थी?', 'মাছৰ দোকানত বৰফ কি হ’ল?'),
        [
          opt('Water', 'पानी', 'পানী', true),
          opt('Sugar', 'चीनी', 'চেনি', false),
          opt('Cement', 'सीमेंट', 'চিমেণ্ট', false),
        ],
        t('The ice had given up and become water.', 'बर्फ हारकर पानी बन गई।', 'বৰফে হাৰি পানী হ’ল।'),
      ),
      beat(
        'memory',
        t(
          'Coriander bunches stood like small green brooms. A woman bought ten rupees of chillies and spoke of her daughter in Guwahati as if Guwahati were a weather. Latveria nodded. Doom asked if chillies were flowers. “Angry flowers,” she said.',
          'धनिये के गट्टे छोटे हरे झाड़ू जैसे खड़े थे। एक औरत ने दस रुपये की मिर्च ली और गुवाहाटी में बेटी की बात ऐसे की जैसे गुवाहाटी मौसम हो। लत्वेरिया ने सिर हिलाया। डूम ने पूछा मिर्च फूल हैं क्या। “गुस्सैल फूल,” उसने कहा।',
          'ধনিয়াৰ মুঠি সৰু সেউজীয়া ঝাড়ুৰ দৰে থিয়। এগৰাকী তিৰোতাই দহ টকাৰ জলকীয়া কিনি গুৱাহাটীত জীয়েকৰ কথা ক’লে। ডুমে সুধিলে জলকীয়া ফুল হয়নে। “খঙাল ফুল,” তাই ক’লে।',
        ),
        t('What did Latveria call the chillies when Doom asked if they were flowers?', 'डूम ने पूछा मिर्च फूल हैं, लत्वेरिया ने क्या कहा?', 'ডুমে জলকীয়া ফুল হয়নে সুধিলে, লটভেৰিয়াই কি ক’লে?'),
        [
          opt('Angry flowers', 'गुस्सैल फूल', 'খঙাল ফুল', true),
          opt('Paper boats', 'कागजी नावें', 'কাগজৰ নাও', false),
          opt('School bells', 'स्कूल की घंटियाँ', 'স্কুলৰ ঘণ্টা', false),
        ],
        t('Angry flowers — that is what she named chillies.', 'गुस्सैल फूल — मिर्च का नाम।', 'খঙাল ফুল — জলকীয়াৰ নাম।'),
      ),
      beat(
        'riddle',
        t(
          'The battery-seller, bored, offered a riddle with the batteries. “I have no legs and I travel in a bag. I open my mouth in oil. People argue my name at the table. What am I?”',
          'बैटरी वाले ने बोरियत में बैटरियों के साथ पहेली दी। “मेरे पाँव नहीं, थैले में यात्रा करती हूँ। तेल में मुँह खोलती हूँ। मेज पर लोग मेरे नाम पर बहस करते हैं। मैं क्या हूँ?”',
          'বেটাৰী বেচাজনে বিৰক্তিত বেটাৰীৰ লগত সাঁথৰ দিলে। “মোৰ ভৰি নাই, থলিত ভ্ৰমণ কৰোঁ। তেলত মুখ মেলি দিওঁ। মেজত মানুহে মোৰ নাম লৈ তৰ্ক কৰে। মই কি?”',
        ),
        t('What travels in a bag with no legs, opens in oil, and is argued over at table?', 'बिना पाँव थैले में चलती, तेल में खुलती, मेज पर बहस — क्या?', 'ভৰি নোহোৱাকৈ থলিত যায়, তেলত মুখ মেলে — কি?'),
        [
          opt('A fish', 'मछली', 'মাছ', true),
          opt('A shoe', 'जूता', 'জোতা', false),
          opt('A clock', 'घड़ी', 'ঘড়ী', false),
        ],
        t('A fish — bag, oil, argument.', 'मछली — थैला, तेल, बहस।', 'মাছ — থলি, তেল, তৰ্ক।'),
      ),
      beat(
        'memory',
        t(
          'They bought one river fish that still believed in swimming. The seller wrapped it in yesterday’s newspaper; a minister’s face got wet. Doom asked if the minister would mind. “He is used to weather,” Latveria said, and paid without counting the coins twice, which meant the price was fair enough.',
          'उन्होंने एक नदी मछली ली जो अभी तैरने पर यकीन रखती थी। विक्रेता ने कल के अखबार में लपेटा; मंत्री का चेहरा भीग गया। डूम ने पूछा मंत्री को बुरा लगेगा क्या। “उन्हें मौसम की आदत है,” लत्वेरिया ने कहा, और सिक्के दो बार नहीं गिने, यानी दाम ठीक-ठाक था।',
          'তেওঁলোকে এটা নদীৰ মাছ কিনিলে যি এতিয়াও সাঁতোৰাত বিশ্বাস কৰে। বেচাজনে কালিৰ খবৰ-কাগজত মেৰিয়ালে; মন্ত্ৰীৰ মুখ তিতিল। ডুমে সুধিলে মন্ত্ৰীৰ বেয়া লাগিবনে।',
        ),
        t('What was the fish wrapped in?', 'मछली किसमें लपेटी गई?', 'মাছ কিহেৰে মেৰোৱা হ’ল?'),
        [
          opt('Yesterday’s newspaper', 'कल का अखबार', 'কালিৰ খবৰ-কাগজ', true),
          opt('A silk scarf', 'रेशमी स्कार्फ', 'ৰেচম স্কাৰ্ফ', false),
          opt('A school notebook', 'स्कूल की कॉपी', 'স্কুলৰ কপি', false),
        ],
        t('Yesterday’s paper, minister’s face wet.', 'कल का कागज, मंत्री का चेहरा भीगा।', 'কালিৰ কাগজ, মন্ত্ৰীৰ মুখ তিতা।'),
      ),
      beat(
        'memory',
        t(
          'At the jaggery mound Latveria broke a corner with her nail and tasted, the old permission. The seller pretended not to see. Doom wanted a piece the size of his fist. She gave him a piece the size of a tooth, which is how love measures in markets.',
          'गुड़ के टीले पर लत्वेरिया ने नाखून से कोना तोड़कर चखा, पुरानी इजाजत। विक्रेता ने न देखने का नाटक किया। डूम को मुट्ठी भर चाहिए था। उसने दाँत भर दिया, बाजार में प्यार ऐसे नापा जाता है।',
          'গুৰৰ টিলাত লটভেৰিয়াই নখৰে চুক ভাঙি চাকিল, পুৰণি অনুমতি। বেচাজনে নোচোৱা ভাও ধৰিলে। ডুমক মুঠিৰ সমান লাগিছিল। তাই দাঁতৰ সমান দিলে।',
        ),
        t('What did Latveria taste by breaking a corner with her nail?', 'नाखून से कोना तोड़कर लत्वेरिया ने क्या चखा?', 'নখৰে চুক ভাঙি লটভেৰিয়াই কি চাকিল?'),
        [
          opt('Jaggery', 'गुड़', 'গুৰ', true),
          opt('Soap', 'साबुन', 'চাবোন', false),
          opt('Brick', 'ईंट', 'ইটা', false),
        ],
        t('Jaggery, the old market permission.', 'गुड़, बाजार की पुरानी इजाजत।', 'গুৰ, বজাৰৰ পুৰণি অনুমতি।'),
      ),
      beat(
        'riddle',
        t(
          'On the way between stalls Doom invented, “I make your eyes water and I am not sad. I am small and I can stop a king’s dinner. What am I?” Latveria knew, but she let the market noise think with them.',
          'दुकानों के बीच डूम ने गढ़ी, “मैं आँखों में पानी लाता हूँ और उदास नहीं। छोटा हूँ और बादशाह का खाना रोक सकता हूँ। मैं क्या हूँ?” लत्वेरिया जानती थी, पर बाजार के शोर को साथ सोचने दिया।',
          'দোকানৰ মাজত ডুমে বনালে, “মই চকুত পানী আনো আৰু দুখী নহয়। সৰু, ৰজাৰ খোৱাও ৰখাব পাৰোঁ। মই কি?” লটভেৰিয়াই জানিছিল।',
        ),
        t('What makes eyes water without being sad, and can stop a dinner?', 'बिना उदास आँखों में पानी, खाना रोक सकता — क्या?', 'দুখী নহৈ চকুত পানী, খোৱা ৰখায় — কি?'),
        [
          opt('Chilli', 'मिर्च', 'জলকীয়া', true),
          opt('An onion clock', 'प्याज घड़ी', 'পিয়াজ ঘড়ী', false),
          opt('A pillow', 'तकिया', 'বালিশ', false),
        ],
        t('Chilli — tears without sadness.', 'मिर्च — बिना गम आँसू।', 'জলকীয়া — দুখ নোহোৱাকৈ চকুলো।'),
      ),
      beat(
        'memory',
        t(
          'They missed the shared auto because Doom had stopped to watch a man sharpen knives on a wheel that threw sparks like tiny Bihu. Latveria did not scold. Walking home with a wet bag is also a kind of festival if you decide it is.',
          'साझा ऑटो छूट गया क्योंकि डूम उस आदमी को देख रहा था जो पहिए पर चाकू तेज कर रहा था, चिंगारियाँ छोटे बिहू जैसी। लत्वेरिया ने डाँटा नहीं। गीला थैला लेकर पैदल जाना भी त्योहार है अगर आप ठान लें।',
          'শ্বেয়াৰ অটো এৰাই গ’ল কাৰণ ডুম সেই মানুহক চাই আছিল যি চকাত চাকু ধাৰ কৰি আছিল, ফিৰিঙতি সৰু বিহুৰ দৰে। লটভেৰিয়াই গালি নিদিলে।',
        ),
        t('Why did they miss the shared auto?', 'साझा ऑटो क्यों छूटा?', 'শ্বেয়াৰ অটো কিয় এৰাই গ’ল?'),
        [
          opt('Doom watched knives being sharpened', 'डूम चाकू तेज होते देख रहा था', 'ডুম চাকু ধাৰ হোৱা চাই আছিল', true),
          opt('The river flooded the stand', 'नदी ने अड्डा डुबो दिया', 'নদীয়ে ষ্টেণ্ড ডুবালে', false),
          opt('They forgot the fish', 'वे मछली भूल गए', 'তেওঁলোকে মাছ পাহৰিলে', false),
        ],
        t('Sparks on the wheel — Doom stopped, auto left.', 'पहिए की चिंगारी — डूम रुका, ऑटो गया।', 'চকাৰ ফিৰিঙতি — ডুম ৰ’ল।'),
      ),
    ],
  },
  {
    id: 'namghar',
    title: t('Evening at the namghar', 'नामघर की शाम', 'নামঘৰৰ গধূলি'),
    opening: t(
      'The namghar was not loud. That was the point. Latveria left her slippers in the row that always became a small argument of left and right. Doom wanted to run on the cool floor. She held him with two fingers. Inside, someone was already singing as if the day had been a long letter and this was the signature.',
      'नामघर शोर नहीं था। बात यही थी। लत्वेरिया ने चप्पलें उस पंक्ति में उतारी जो हमेशा बाएँ-दाएँ की छोटी बहस बन जाती। डूम ठंडी फर्श पर दौड़ना चाहता था। उसने दो उंगलियों से थामा। अंदर कोई पहले से गा रहा था जैसे दिन लंबा पत्र हो और यह दस्तखत।',
      'নামঘৰ ডাঙৰকৈ নহয়। কথা সেয়ে। লটভেৰিয়াই চেলেং সেই শাৰীত থলে যি সদায় বাওঁ-সোঁৰ সৰু তৰ্ক হয়। ডুম ঠাণ্ডা মজলিত দৌৰিব খোজে। তাই দুই আঙুলিৰে ধৰিলে।',
    ),
    close: t(
      'They walked home without talking much. The song stayed in the throat the way turmeric stays on a nail. Doom asked if God had been in the room. “The room was in us,” Latveria said, and then felt shy about the sentence.',
      'वे घर ज्यादा बात किए बिना गए। गीत गले में रहा जैसे हल्दी नाखून पर रहती है। डूम ने पूछा भगवान कमरे में थे क्या। “कमरा हममें था,” लत्वेरिया ने कहा, फिर वाक्य से शर्मा गई।',
      'তেওঁলোকে বেছি কথা নোকৈ ঘৰলৈ গ’ল। গীত ডিঙিত থাকিল হালধি নখত থকাৰ দৰে। ডুমে সুধিলে ভগৱান কোঠাত আছিল নেকি। “কোঠা আমাৰ ভিতৰত আছিল,” লটভেৰিয়াই ক’লে।',
    ),
    beats: [
      beat(
        'memory',
        t(
          'Lampblack and ghee made a small sun that did not heat the air. An old man coughed into his gamosa and continued the line as if the cough were a comma. Latveria sat at the back, which is also a kind of front if you are listening.',
          'काजल और घी ने छोटा सूरज बनाया जो हवा नहीं सेकता था। एक बुजुर्ग ने गामोसे में खाँसा और पंक्ति जारी रखी जैसे खाँसी अल्पविराम हो। लत्वेरिया पीछे बैठी, जो सुन रहे हों तो आगे भी है।',
          'কাজল আৰু ঘিয়ে সৰু সূৰ্য বনালে যি বতাহ নগৰমায়। এজন বয়সীয়াকৈ গামোচাত কাহিল আৰু শাৰী চলাই নিলে যেন কাহ কমা। লটভেৰিয়া পিছফালে বহিলে।',
        ),
        t('What did the old man cough into?', 'बुजुर्ग ने किसमें खाँसा?', 'বয়সীয়াজনে কিহত কাহিল?'),
        [
          opt('His gamosa', 'अपना गामोसा', 'নিজৰ গামোচা', true),
          opt('A microphone', 'माइक्रोफोन', 'মাইক্ৰ’ফোন', false),
          opt('A school bag', 'स्कूल बैग', 'স্কুল বেগ', false),
        ],
        t('The cough went into the gamosa, then the line continued.', 'खाँसी गामोसे में, फिर पंक्ति।', 'কাহ গামোচাত, তাৰ পাছত শাৰী।'),
      ),
      beat(
        'memory',
        t(
          'The floor was cool as river stone. Doom pressed his cheek to it until Latveria lifted him, half scold, half envy. A woman in white passed them a tulsi leaf as if it were a ticket that did not fly away.',
          'फर्श नदी के पत्थर जैसा ठंडा था। डूम ने गाल चिपकाया जब तक लत्वेरिया उठा ले, आधी डाँट आधी ईर्ष्या। सफेद कपड़ों में एक औरत ने तुलसी पत्ती ऐसे दी जैसे टिकट हो जो उड़ती नहीं।',
          'মজলি নদীৰ শিলৰ দৰে ঠাণ্ডা। ডুমে গাল লাগালে লটভেৰিয়াই নুতোলালৈকে। বগা কাপোৰ পিন্ধা এগৰাকীয়ে তুলসী পাত টিকটৰ দৰে দিলে।',
        ),
        t('What did the woman in white pass them?', 'सफेद कपड़ों वाली ने क्या दिया?', 'বগা কাপোৰ পিন্ধা গৰাকীয়ে কি দিলে?'),
        [
          opt('A tulsi leaf', 'तुलसी पत्ती', 'তুলসী পাত', true),
          opt('A cinema stub', 'सिनेमा की पर्ची', 'চিনেমাৰ পৰ্চি', false),
          opt('A bus pass', 'बस पास', 'বাস পাছ', false),
        ],
        t('A tulsi leaf, like a ticket that stays.', 'तुलसी पत्ती, टिकट जो रहती है।', 'তুলসী পাত, থকা টিকট।'),
      ),
      beat(
        'riddle',
        t(
          'After the kirtan a teacher of small children whispered a riddle so the holy would not feel interrupted. “I have a flame and I eat ghee. I do not walk, yet I bring the sun indoors. What am I?”',
          'कीर्तन के बाद छोटे बच्चों की शिक्षिका ने फुसफुसाहट में पहेली कही ताकि पवित्र टूटे नहीं। “मेरी लौ है, घी खाती हूँ। चलती नहीं, फिर भी सूरज घर के अंदर लाती हूँ। मैं क्या हूँ?”',
          'কীৰ্তনৰ পাছত সৰু ল’ৰা-ছোৱালীৰ শিক্ষয়িত্ৰীয়ে সাঁথৰ ফুচফুচাই ক’লে। “মোৰ শিখা আছে, ঘি খাওঁ। নচলো, তথাপি সূৰ্য ঘৰৰ ভিতৰলৈ আনো। মই কি?”',
        ),
        t('What has a flame, eats ghee, and brings the sun indoors?', 'लौ है, घी खाती है, सूरज अंदर लाती है — क्या?', 'শিখা আছে, ঘি খায়, সূৰ্য ভিতৰলৈ আনে — কি?'),
        [
          opt('A lamp', 'दीया', 'চাকি', true),
          opt('A torch phone', 'फोन की टॉर्च', 'ফোনৰ টৰ্চ', false),
          opt('A matchbox empty', 'खाली माचिस', 'খালী জুইশলা', false),
        ],
        t('The lamp — flame, ghee, indoor sun.', 'दीया — लौ, घी, घर का सूरज।', 'চাকি — শিখা, ঘি, ঘৰৰ সূৰ্য।'),
      ),
      beat(
        'memory',
        t(
          'Someone distributed prasad in little paper cones that wanted to leak. Doom got more than his share because he looked like a person who might cry. Latveria ate her portion slowly, as if speed would offend the sweetness.',
          'किसी ने प्रसाद छोटे कागजी कोनों में बाँटा जो रिसना चाहते थे। डूम को हिस्सा ज्यादा मिला क्योंकि वह रो सकने वाले इंसान जैसा दिखता था। लत्वेरिया ने अपना हिस्सा धीरे खाया, जैसे तेजी मिठास का अपमान हो।',
          'কোনোবাই প্ৰসাদ সৰু কাগজৰ কোনাত ভাগ কৰিলে। ডুমক বেছি পালে কাৰণ সি কান্দিব পৰা মানুহৰ দৰে দেখা গৈছিল। লটভেৰিয়াই নিজৰ অংশ লাহে খালে।',
        ),
        t('What was distributed in little paper cones?', 'छोटे कागजी कोनों में क्या बँटा?', 'সৰু কাগজৰ কোনাত কি ভাগ হ’ল?'),
        [
          opt('Prasad', 'प्रसाद', 'প্ৰসাদ', true),
          opt('Nails', 'कीलें', 'कील', false),
          opt('Bus tickets', 'बस टिकट', 'বাস টিকট', false),
        ],
        t('Prasad in paper cones.', 'कागजी कोनों में प्रसाद।', 'কাগজৰ কোনাত প্ৰসাদ।'),
      ),
      beat(
        'memory',
        t(
          'Outside, the courtyard dogs had arranged themselves like ushers. A bicycle bell far away sounded like another kind of hymn. Latveria put her slippers on the correct feet on the second try. Doom clapped once, for no reason that needed a name.',
          'बाहर आंगन के कुत्ते व्यवस्थापकों जैसे बैठे थे। दूर साइकिल की घंटी दूसरे भजन जैसी बजी। लत्वेरिया ने चप्पलें दूसरी कोशिश में सही पाँव पर पहनीं। डूम ने एक ताली बजाई, बिना नाम के कारण।',
          'বাহিৰত চোতালৰ কুকুৰে ব্যৱস্থাপকৰ দৰে বহিছিল। দূৰত চাইকেলৰ ঘণ্টা আন ধৰণৰ নাম-কীৰ্তনৰ দৰে বাজিল। লটভেৰিয়াই চেলেং দ্বিতীয় চেষ্টাত শুদ্ধ ভৰিত পিন্ধিলে।',
        ),
        t('What sounded far away like another kind of hymn?', 'दूर किसकी आवाज़ दूसरे भजन जैसी थी?', 'দূৰত কি আন ধৰণৰ কীৰ্তনৰ দৰে বাজিল?'),
        [
          opt('A bicycle bell', 'साइकिल की घंटी', 'চাইকেলৰ ঘণ্টা', true),
          opt('A factory siren', 'कारखाने की सायरन', 'কাৰখানাৰ ছাইৰেন', false),
          opt('Thunder only', 'केवल गरज', 'কেৱল মেঘধ্বনি', false),
        ],
        t('A bicycle bell, far, like a hymn.', 'दूर साइकिल घंटी, भजन जैसी।', 'দূৰৰ চাইকেল ঘণ্টা।'),
      ),
      beat(
        'riddle',
        t(
          'On the steps an aunt asked Doom, “I am taken off for respect and I wait in a row. I know the shape of your day from the dust I collect. What am I?”',
          'सीढ़ियों पर एक चाची ने डूम से पूछा, “सम्मान में उतारी जाती हूँ और पंक्ति में इंतज़ार करती हूँ। जो धूल इकट्ठा करती हूँ उससे तुम्हारे दिन का आकार जानती हूँ। मैं क्या हूँ?”',
          'খেজত এগৰাকী খুড়ীয়ে ডুমক সুধিলে, “সন্মানত নমাই থওঁ আৰু শাৰীত অপেক্ষা কৰোঁ। যি ধূলি গোটাওঁ তাতে তোমাৰ দিনৰ আকাৰ জানো। মই কি?”',
        ),
        t('What is taken off for respect, waits in a row, and collects the day’s dust?', 'सम्मान में क्या उतारा जाता है, पंक्ति में इंतज़ार?', 'সন্মানত কি নমায়, শাৰীত অপেক্ষা কৰে?'),
        [
          opt('Slippers', 'चप्पलें', 'চেলেং', true),
          opt('Spectacles', 'चश्मा', 'চশমা', false),
          opt('A crown', 'मुकुट', 'মুকুট', false),
        ],
        t('Slippers in a row at the door.', 'द्वार पर पंक्ति में चप्पलें।', 'দুৱাৰত শাৰীকৈ চেলেং।'),
      ),
      beat(
        'memory',
        t(
          'Rain began as a rumour on the tin of a nearby shop. They did not run. The namghar behind them kept its quiet like a person who has finished speaking and is content. Latveria tasted prasad still at the back of her teeth.',
          'बारिश पास की दुकान की टिन पर अफवाह बनकर शुरू हुई। वे भागे नहीं। पीछे नामघर ने खामोशी ऐसे रखी जैसे कोई बोल चुका हो और संतुष्ट हो। लत्वेरिया को दाँतों के पीछे अभी प्रसाद का स्वाद था।',
          'বৰষুণ ওচৰৰ দোকানৰ টিনত গুজব হৈ আৰম্ভ হ’ল। তেওঁলোকে নদৌৰিলে। পিছফালে নামঘৰে নিমাত ৰাখিলে। লটভেৰিয়াৰ দাঁতৰ পাছফালে এতিয়াও প্ৰসাদৰ সোৱাদ।',
        ),
        t('Where did the rain first sound as a rumour?', 'बारिश की अफवाह पहले कहाँ सुनाई दी?', 'বৰষুণৰ গুজব প্ৰথমে ক\'ত শুনা গ’ল?'),
        [
          opt('On a nearby shop’s tin', 'पास की दुकान की टिन पर', 'ওচৰৰ দোকানৰ টিনত', true),
          opt('Inside a well', 'कुएँ के अंदर', 'নাদৰ ভিতৰত', false),
          opt('On a drum kit', 'ड्रम किट पर', 'ড্ৰাম কিটত', false),
        ],
        t('Rain on the shop tin first.', 'पहले दुकान की टिन पर बारिश।', 'প্ৰথমে দোকানৰ টিনত বৰষুণ।'),
      ),
    ],
  },
  {
    id: 'tin-roof',
    title: t('Rain on the tin roof', 'टिन की छत पर बारिश', 'টিনৰ ছাদত বৰষুণ'),
    opening: t(
      'The first rain of the season always arrived like a relative who does not send a letter. Latveria and Doom sat under the tin. The house became a drum. This is not a sad story. It is only loud, then quiet, then loud again, which is how many true stories are.',
      'मौसम की पहली बारिश हमेशा ऐसे रिश्तेदार की तरह आई जिसने चिट्ठी न भेजी हो। लत्वेरिया और डूम टिन के नीचे बैठे। घर ढोल बन गया। यह उदास कहानी नहीं। केवल तेज, फिर शांत, फिर तेज — बहुत सी सच्ची कहानियाँ ऐसी ही हैं।',
      'ঋতুৰ প্ৰথম বৰষুণ সদায় চিঠি নিপঠোৱা আত্মীয়ৰ দৰে আহে। লটভেৰিয়া আৰু ডুম টিনৰ তলত বহিলে। ঘৰ ঢোল হ’ল। এইখন দুখৰ কাহিনী নহয়।',
    ),
    close: t(
      'When the rain thinned, a frog spoke from the drain as if taking attendance. Doom answered. Latveria let him. The tin kept a few last drops like a person clearing their throat.',
      'बारिश पतली पड़ी तो नाली से मेंढक ने हाजिरी ली। डूम ने जवाब दिया। लत्वेरिया ने रहने दिया। टिन ने आखिरी बूँदें गले साफ करते इंसान की तरह रखीं।',
      'বৰষুণ পাতল হোৱাত নৰ্দমাৰ পৰা বেঙে হাজিৰি ল’লে। ডুমে উত্তৰ দিলে। লটভেৰিয়াই থাকিবলৈ দিলে। টিনে শেষ টোপালবোৰ ডিঙি চাফা কৰা মানুহৰ দৰে ৰাখিলে।',
    ),
    beats: [
      beat(
        'memory',
        t(
          'The first drops were shy, like visitors at the gate. Then the tin found its full voice. Doom shouted to be taller than the sound and failed, happily. Latveria put a bowl under the leak they always meant to fix.',
          'पहली बूँदें शर्मीली थीं, द्वार के मेहमान जैसी। फिर टिन ने पूरी आवाज़ पाई। डूम आवाज़ से लंबा होने को चिल्लाया और हार गया, खुशी से। लत्वेरिया ने उस रिसाव के नीचे कटोरा रखा जिसे वे हमेशा ठीक करने वाले थे।',
          'প্ৰথম টোপাল লাজুক, দুৱাৰৰ অতিথিৰ দৰে। তাৰ পাছত টিনে গোটেই মাত পালে। ডুম শব্দতকৈ ওখ হ’বলৈ চিঞৰিলে আৰু হাৰিল, সুখেৰে। লটভেৰিয়াই সদায় মেৰামতি কৰিব খোজা টোপালৰ তলত বাটি থলে।',
        ),
        t('What did Latveria put under the leak?', 'रिसाव के नीचे लत्वेरिया ने क्या रखा?', 'টোপালৰ তলত লটভেৰিয়াই কি থলে?'),
        [
          opt('A bowl', 'कटोरा', 'বাটি', true),
          opt('A television', 'टेलीविजन', 'টেলিভিছন', false),
          opt('A bicycle', 'साइकिल', 'চাইকেল', false),
        ],
        t('A bowl under the leak they meant to fix.', 'रिसाव के नीचे कटोरा।', 'টোপালৰ তলত বাটি।'),
      ),
      beat(
        'memory',
        t(
          'The courtyard turned into a shallow sea for ants. A gamosa on the line became heavier and wiser. Latveria pulled it in. Doom wanted to leave it, to see if cloth could become a river. She said cloth has other work.',
          'आंगन चींटियों के लिए उथला समुद्र बन गया। रस्सी पर गामोसा भारी और समझदार हो गया। लत्वेरिया ने उसे अंदर खींचा। डूम छोड़ना चाहता था, देखना था कपड़ा नदी बनता है क्या। उसने कहा कपड़े का और काम है।',
          'চোতাল পৰুৱাৰ বাবে অগভীৰ সাগৰ হ’ল। ৰছীত গামোচা গধুৰ আৰু জ্ঞানী হ’ল। লটভেৰিয়াই ভিতৰলৈ টানিলে। ডুম এৰিব খোজে, কাপোৰ নদী হয়নে চাবলৈ।',
        ),
        t('What did Latveria pull in from the line?', 'रस्सी से लत्वेरिया ने क्या अंदर खींचा?', 'ৰছীৰ পৰা লটভেৰিয়াই কি ভিতৰলৈ টানিলে?'),
        [
          opt('A gamosa', 'गामोसा', 'গামোচা', true),
          opt('A car tyre', 'कार का टायर', 'গাড়ীৰ টায়াৰ', false),
          opt('A fishing net from the sea', 'समुद्र का जाल', 'সাগৰৰ জাল', false),
        ],
        t('The gamosa, heavier, came in.', 'गामोसा, भारी, अंदर आया।', 'গামোচা, গধুৰ, ভিতৰলৈ আহিল।'),
      ),
      beat(
        'riddle',
        t(
          'Between rolls of thunder Doom asked, “I am a roof that sings. I am thin and I am brave. Birds do not like my heat in April. What am I?”',
          'गरज के दरम्यान डूम ने पूछा, “मैं छत हूँ जो गाती है। पतली हूँ और बहादुर। अप्रैल में पक्षी मेरी गर्मी नहीं भाते। मैं क्या हूँ?”',
          'মেঘধ্বনিৰ মাজত ডুমে সুধিলে, “মই ছাদ, গাওঁ। মই পাতল আৰু সাহসী। এপ্ৰিলত চৰায়ে মোৰ তাপ নিবিচাৰে। মই কি?”',
        ),
        t('What roof sings, is thin and brave, and too hot for birds in April?', 'कौन सी छत गाती है, पतली, अप्रैल में पक्षियों को गरम?', 'কোন ছাদে গায়, পাতল, এপ্ৰিলত চৰাইৰ বাবে গৰম?'),
        [
          opt('Tin', 'टिन', 'টিন', true),
          opt('A carpet', 'कालीन', 'কাৰ্পেট', false),
          opt('A cloud made of wool', 'ऊन का बादल', 'উৰাৰ ডাৱৰ', false),
        ],
        t('The tin roof — thin, brave, singing.', 'टिन की छत — पतली, बहादुर, गाती।', 'টিনৰ ছাদ — পাতল, সাহসী, গোৱা।'),
      ),
      beat(
        'memory',
        t(
          'They drank tea that tasted of the weather. Latveria crumbled pitha from yesterday into Doom’s cup until he protested it was a lake. She said lakes are allowed in cups during first rain. He believed her, which is a kind of weather too.',
          'उन्होंने ऐसी चाय पी जिसका स्वाद मौसम था। लत्वेरिया ने कल का पीठा डूम के प्याले में तब तक तोड़ा जब तक उसने विरोध न किया कि यह झील है। उसने कहा पहली बारिश में प्याले में झील चलती है। उसने यकीन किया, जो मौसम भी है।',
          'তেওঁলোকে বতৰৰ সোৱাদ থকা চাহ খালে। লটভেৰিয়াই কালিৰ পিঠা ডুমৰ পিয়লাত ভাঙিলে সি নকওঁতালৈকে যে এইখন হ্ৰদ। তাই ক’লে প্ৰথম বৰষুণত পিয়লাত হ্ৰদ চলে।',
        ),
        t('What did she crumble into Doom’s tea?', 'डूम की चाय में उसने क्या तोड़ा?', 'ডুমৰ চাহত তাই কি ভাঙিলে?'),
        [
          opt('Yesterday’s pitha', 'कल का पीठा', 'কালিৰ পিঠা', true),
          opt('Soap', 'साबुन', 'চাবোন', false),
          opt('Chalk', 'खड़िया', 'খৰি', false),
        ],
        t('Yesterday’s pitha in the cup.', 'प्याले में कल का पीठा।', 'পিয়লাত কালিৰ পিঠা।'),
      ),
      beat(
        'memory',
        t(
          'A power cut arrived without knocking. The fridge hummed a last note and died like a polite guest. Candles were not needed yet; the afternoon was still a grey lantern. Doom counted seconds between lightnings and got the numbers wrong on purpose.',
          'बिजली बिना खटखटाए चली गई। फ्रिज ने आखिरी सुर गुनगुनाया और विनम्र मेहमान की तरह मर गया। मोमबत्ती अभी नहीं चाहिए थी; दोपहर अभी धूसर लालटेन थी। डूम ने बिजली कड़कने के बीच सेकंड गिने और जानबूझकर गिनती गलत की।',
          'বিজুলী খুন্দা নোমাৰাকৈ গ’ল। ফ্ৰিজে শেষ সুৰ গুণগুণাই ভদ্ৰ অতিথিৰ দৰে মৰিল। মমবাতি এতিয়াও নালাগে; দুপৰীয়া এতিয়াও ধূসৰ লণ্ঠন।',
        ),
        t('What hummed a last note and died like a polite guest?', 'किसने आखिरी सुर गुनगुनाया और विनम्र मेहमान की तरह दम तोड़ा?', 'কিয়ে শেষ সুৰ গুণগুণাই ভদ্ৰ অতিথিৰ দৰে মৰিল?'),
        [
          opt('The fridge', 'फ्रिज', 'ফ্ৰিজ', true),
          opt('A train', 'ट्रेन', 'ৰেল', false),
          opt('The namghar bell', 'नामघर की घंटी', 'নামঘৰৰ ঘণ্টা', false),
        ],
        t('The fridge, after the power cut.', 'बिजली जाने के बाद फ्रिज।', 'বিজুলী যোৱাৰ পাছত ফ্ৰিজ।'),
      ),
      beat(
        'riddle',
        t(
          'Latveria offered a slow riddle while they waited. “I fall but I am not clumsy. I stitch the roof to the ground for an hour. Plants drink me and so do stories. What am I?”',
          'इंतज़ार में लत्वेरिया ने धीमी पहेली दी। “मैं गिरती हूँ और फूहड़ नहीं। एक घंटे के लिए छत को धरती से सिल देती हूँ। पौधे मुझे पीते हैं, कहानियाँ भी। मैं क्या हूँ?”',
          'অপেক্ষাত লটভেৰিয়াই লাহে সাঁথৰ দিলে। “মই পৰোঁ আৰু অশোধ নাই। এঘণ্টালৈ ছাদ মাটিৰ লগত চিলাই দিওঁ। গছে মোক খায়, কাহিনীয়েও। মই কি?”',
        ),
        t('What falls without being clumsy, stitches roof to ground, and is drunk by plants and stories?', 'बिना फूहड़ गिरती, छत-धरती सीलती, पौधे पीते — क्या?', 'অশোধ নোহোৱাকৈ পৰে, ছাদ-মাটি চিলায় — কি?'),
        [
          opt('Rain', 'बारिश', 'বৰষুণ', true),
          opt('A needle', 'सुई', 'চুই', false),
          opt('A brick', 'ईंट', 'ইটা', false),
        ],
        t('Rain — falling, stitching, drunk by plants.', 'बारिश — गिरना, सीलना, पौधों का पेय।', 'বৰষুণ — পৰা, চিলা, গছৰ পানীয়।'),
      ),
      beat(
        'memory',
        t(
          'When a patch of sun returned, steam rose from the road as if the earth were making tea. Doom wanted to walk in it. Latveria said wait five minutes, which in rain-time is both nothing and a whole season. They waited. Then they went, slippers slapping, like a small procession of two.',
          'जब धूप का टुकड़ा लौटा, सड़क से भाप उठी जैसे धरती चाय बना रही हो। डूम उसमें चलना चाहता था। लत्वेरिया ने पाँच मिनट ठहरने को कहा, बारिश-समय में जो कुछ नहीं भी है और पूरा मौसम भी। वे ठहरे। फिर चप्पलें थपकाते गए, दो की छोटी जूलूस।',
          'ৰ’দৰ টুকুৰা ঘূৰি অহাত বাটৰ পৰা ভাপ উঠিল যেন পৃথিৱীয়ে চাহ বনাইছে। ডুম তাত খোজ কাঢ়িব খोজে। লটভেৰিয়াই পাঁচ মিনিট ৰ’বলৈ ক’লে।',
        ),
        t('What rose from the road when a patch of sun returned?', 'धूप का टुकड़ा लौटा तो सड़क से क्या उठी?', 'ৰ’দৰ টুকুৰা ঘূৰি অহাত বাটৰ পৰা কি উঠিল?'),
        [
          opt('Steam', 'भाप', 'ভাপ', true),
          opt('Snow', 'बर्फ', 'তুষাৰ', false),
          opt('Kites', 'पतंगें', 'চিলনী', false),
        ],
        t('Steam from the road, like the earth making tea.', 'सड़क की भाप, धरती की चाय।', 'বাটৰ ভাপ, পৃথিৱীৰ চাহ।'),
      ),
    ],
  },
  {
    id: 'tortoise-folk',
    title: t('The tortoise and the river tea', 'कछुआ और नदी की चाय', 'কাছ আৰু নদীৰ চাহ'),
    opening: t(
      'This one is a folk tale Latveria told Doom when the lights went and the phone battery was a rumour. A tortoise lived where the river bends like a gamosa on a shoulder. He was slow, which the other animals called a fault and the river called a virtue. Listen as if you have nowhere else to be.',
      'यह लोककथा लत्वेरिया ने डूम को तब कही जब बत्तियाँ गईं और फोन की बैटरी अफवाह थी। एक कछुआ वहाँ रहता था जहाँ नदी कंधे पर गामोसा जैसी मुड़ती है। वह धीमा था, जिसे दूसरे जानवर दोष कहते, नदी गुण। ऐसे सुनो जैसे और कहीं नहीं जाना।',
      'এই লোক-কাহিনী লটভেৰিয়াই ডুমক ক’লে যেতিয়া লাইট গ’ল আৰু ফোনৰ বেটাৰী গুজব। এটা কাছ তাত থাকিছিল য’ত নদী কান্ধত গামোচাৰ দৰে ঘূৰে। সি লাহে, আন জন্তুৱে দোষ বোলে, নদীয়ে গুণ।',
    ),
    close: t(
      'Doom asked if the tortoise was still there. Latveria said if you go slowly enough to the bend, you will meet someone who has been waiting without looking at a clock. That is the end, and also not.',
      'डूम ने पूछा कछुआ अभी है क्या। लत्वेरिया ने कहा मोड़ पर इतना धीरे जाओगे तो किसी ऐसे से मिलोगे जो घड़ी देखे बिना इंतज़ार कर रहा हो। यही अंत है, और नहीं भी।',
      'ডুমে সুধিলে কাছ এতিয়াও আছে নেকি। লটভেৰিয়াই ক’লে ঘূৰণিলৈ ইমান লাহে গ’লে ঘড়ী নোচোৱাকৈ অপেক্ষা কৰা কাৰোবাক লগ পাবা। এইয়ে শেষ, আৰু নহয়ও।',
    ),
    beats: [
      beat(
        'memory',
        t(
          'The tortoise kept a small fire of driftwood and boiled river water with a pinch of something that was not quite tea and not quite patience. Birds mocked him. He invited them anyway. None came, except a crow who wanted to steal the pinch.',
          'कछुआ बहाव की लकड़ी की छोटी आग रखता, नदी का पानी उबालता, एक चुटकी ऐसी चीज़ डालता जो ठीक चाय नहीं ठीक सब्र भी नहीं। पक्षी चिढ़ाते। वह बुलाता फिर भी। कोई न आया, एक कौआ चुटकी चुराने आया।',
          'কাছে বহা কাঠৰ সৰু জুই ৰাখি নদীৰ পানী উতলাইছিল, এমুঠি এনেকুৱা দিছিল যি ঠিক চাহও নহয় ধৈৰ্যও নহয়। চৰায়ে বিদ্ৰূপ কৰিলে। সি তথাপি মাতিলে।',
        ),
        t('Who came to steal the pinch from the tortoise’s pot?', 'कछुए की हांड़ी से चुटकी कौन चुराने आया?', 'কাছৰ পাত্ৰৰ পৰা চোৰাবলৈ কোন আহিল?'),
        [
          opt('A crow', 'कौआ', 'কাউৰী', true),
          opt('A policeman', 'सिपाही', 'আৰক্ষী', false),
          opt('A cricket team', 'क्रिकेट टीम', 'ক্ৰিকেট দল', false),
        ],
        t('A crow came for the pinch.', 'चुटकी को कौआ आया।', 'চোৰাবলৈ কাউৰী আহিল।'),
      ),
      beat(
        'memory',
        t(
          'The crow asked why anyone would sit still when the world was a race. The tortoise said the river was already racing; somebody had to stay and keep the cups. The crow did not understand cups. He understood winning. He flew off to tell the hare.',
          'कौए ने पूछा दुनिया दौड़ हो तो कोई बैठता क्यों है। कछुए ने कहा नदी पहले से दौड़ रही है; किसी को रुककर प्याले संभालने होंगे। कौआ प्याले न समझा। जीतना समझा। खरगोश को बताने उड़ गया।',
          'কাউৰীয়ে সুধিলে জগত দৌৰ হ’লে কোনোবাই কিয় বহি থাকে। কাছে ক’লে নদীয়েই দৌৰি আছে; কাৰোবাই ৰৈ পিয়লা চোৱাচিতা কৰিব লাগিব। কাউৰীয়ে পিয়লা নুবুজিলে।',
        ),
        t('Who did the crow fly off to tell?', 'कौआ किसे बताने उड़ गया?', 'কাউৰীয়ে কাক ক’বলৈ উৰিল?'),
        [
          opt('The hare', 'खरगोश', 'ঠেকীয়া', true),
          opt('The king of England', 'इंग्लैंड का राजा', 'ইংলেণ্ডৰ ৰজা', false),
          opt('A traffic light', 'ट्रैफिक लाइट', 'ট্ৰাফিক লাইট', false),
        ],
        t('The crow went to tell the hare.', 'कौआ खरगोश को बताने गया।', 'কাউৰী ঠেকীয়াৰ ওচৰলৈ গ’ল।'),
      ),
      beat(
        'riddle',
        t(
          'The hare arrived laughing. “Riddle me this, slow uncle — I have a house I carry and I never pay rent. When danger comes I become a stone that breathes. Who is that if it is not me?” The tortoise smiled into his shell.',
          'खरगोश हँसता आया। “पहेली बुझो, धीमे चाचा — घर ढोता हूँ किराया नहीं। खतरा आए तो साँस लेता पत्थर बन जाता हूँ। वह कौन, मैं नहीं तो?” कछुआ खोल में मुस्कराया।',
          'ঠেকীয়া হাঁহি আহিল। “সাঁথৰ বুজা, লাহে খুড়া — ঘৰ কঢ়িয়াওঁ ভাড়া নিদিওঁ। বিপদ আহিলে উশাহ লোৱা শিল হওঁ। সেইজন কোন, মই নহ’লে?” কাছ খোলাত মুচকিয়াইলে।',
        ),
        t('Who carries a house, pays no rent, and becomes a breathing stone?', 'घर ढोता, किराया नहीं, साँस लेता पत्थर — कौन?', 'ঘৰ কঢ়িয়ায়, ভাড়া নিদিয়ে, উশাহ লোৱা শিল — কোন?'),
        [
          opt('The tortoise', 'कछुआ', 'কাছ', true),
          opt('The hare', 'खरगोश', 'ঠেকীয়া', false),
          opt('A landlord', 'मकान मालिक', 'ঘৰৰ গৰাকী', false),
        ],
        t('The tortoise — house on the back.', 'कछुआ — पीठ पर घर।', 'কাছ — পিঠিত ঘৰ।'),
      ),
      beat(
        'memory',
        t(
          'They made a contest anyway, because stories enjoy foolishness. The hare ran toward the next village. The tortoise stayed and poured for a heron who had been flying since dawn. By evening the hare was thirsty and lost. The tortoise’s fire was still small and still enough.',
          'फिर भी मुकाबला हुआ, कहानियों को मूर्खता पसंद है। खरगोश अगले गाँव दौड़ा। कछुआ रुका, एक बगुले को पिलाया जो भोर से उड़ रहा था। शाम तक खरगोश प्यासा और खोया। कछुए की आग छोटी थी और काफी थी।',
          'তথাপি প্ৰতিযোগিতা হ’ল, কাহিনীয়ে মূৰ্খতা ভাল पায়। ঠেকীয়া পিছৰ গাঁৱলৈ দৌৰিলে। কাছ ৰ’ল, এটা বগাক ঢালি দিলে। গধূলিলৈ ঠেকীয়া পিয়াহত আৰু হেৰুৱা।',
        ),
        t('Who did the tortoise pour for while the hare ran?', 'खरगोश दौड़ा तो कछुए ने किसे पिलाया?', 'ঠেকীয়া দৌৰোতে কাছে কাক ঢালি দিলে?'),
        [
          opt('A heron', 'बगुला', 'বগা', true),
          opt('A film star', 'फिल्मी सितारा', 'চলচ্চিত্ৰৰ তাৰকা', false),
          opt('A bus conductor', 'बस कंडक्टर', 'বাস কণ্ডাক্টৰ', false),
        ],
        t('A heron, flying since dawn.', 'बगुला, भोर से उड़ता।', 'বগা, পুৱাৰে পৰা উৰা।'),
      ),
      beat(
        'memory',
        t(
          'When the hare stumbled back, the tortoise did not say I told you. He moved a second cup an inch closer. The river made the sound of someone rinsing rice. Doom, hearing this, always asked for a second cup of actual tea. Latveria always poured.',
          'खरगोश लड़खड़ाकर लौटा तो कछुए ने “मैंने कहा था” नहीं कहा। दूसरा प्याला एक इंच पास खिसकाया। नदी ने चावल धोते इंसान जैसी आवाज़ की। यह सुन डूम सच्ची चाय का दूसरा प्याला माँगता। लत्वेरिया हमेशा ढालती।',
          'ঠেকীয়া উৰুৱাই ঘূৰি অহাত কাছে মই কৈছিলোঁ নক’লে। দ্বিতীয় পিয়লা এইঞ্চ ওচৰ কৰিলে। নদীয়ে চাউল ধোৱা মাত কৰিলে। এই শুনি ডুমে সঁচা চাহৰ দ্বিতীয় পিয়লা খোজে।',
        ),
        t('What did the tortoise move closer when the hare returned?', 'खरगोश लौटा तो कछुए ने क्या पास खिसकाया?', 'ঠেকীয়া ঘূৰি অহাত কাছে কি ওচৰ কৰিলে?'),
        [
          opt('A second cup', 'दूसरा प्याला', 'দ্বিতীয় পিয়লা', true),
          opt('A racing medal', 'दौड़ का मेडल', 'দৌৰৰ মেডেল', false),
          opt('A closed door', 'बंद दरवाजा', 'বন্ধ দুৱাৰ', false),
        ],
        t('A second cup, an inch closer.', 'दूसरा प्याला, एक इंच पास।', 'দ্বিতীয় পিয়লা, এইঞ্চ ওচৰ।'),
      ),
      beat(
        'riddle',
        t(
          'The hare, humbled into poetry, asked, “I travel without feet when the sky is kind. I wear white and I drink the river from above. Children point at me. What am I?” The tortoise knew, and still let the hare win this one.',
          'खरगोश कविता में विनम्र होकर पूछा, “आकाश दयालु हो तो बिना पाँव यात्रा करता हूँ। सफेद पहनता हूँ, ऊपर से नदी पीता हूँ। बच्चे इशारा करते हैं। मैं क्या हूँ?” कछुआ जानता था, फिर भी यह खरगोश को जीतने दी।',
          'ঠেকীয়া কবিতাত নম্ৰ হৈ সুধিলে, “আকাশ দয়াবান হ’লে ভৰি নোহোৱাকৈ ভ্ৰমণ কৰোঁ। বগা পিন্ধোঁ, ওপৰৰ পৰা নদী খাওঁ। ল’ৰা-ছোৱালীয়ে আঙুলিয়ায়। মই কি?”',
        ),
        t('What travels without feet when the sky is kind, wears white, drinks the river from above?', 'दयालु आकाश में बिना पाँव चलता, सफेद, ऊपर से नदी पीता — क्या?', 'দয়াবান আকাশত ভৰি নোহোৱাকৈ যায়, বগা, ওপৰৰ পৰা নদী খায় — কি?'),
        [
          opt('A cloud', 'बादल', 'ডাৱৰ', true),
          opt('A shoe', 'जूता', 'জোতা', false),
          opt('A bus', 'बस', 'বাস', false),
        ],
        t('A cloud — white, drinking the river from above.', 'बादल — सफेद, ऊपर से नदी।', 'ডাৱৰ — বগা, ওপৰৰ পৰা নদী।'),
      ),
      beat(
        'memory',
        t(
          'Latveria always ended here: the tortoise rinsed the cups in the river and the river, being a river, did not ask who won. Doom would be nearly asleep. She would add, very small, that slow is not late if you were never racing the people you love.',
          'लत्वेरिया यहीं खत्म करती: कछुआ ने प्याले नदी में धोए और नदी ने, नदी होने के नाते, नहीं पूछा कौन जीता। डूम लगभग सो चुका होता। वह बहुत छोटे स्वर में जोड़ती, धीमा देर नहीं अगर तुम जिनसे प्रेम करते हो उनसे दौड़ ही न रहे हो।',
          'লটভেৰিয়া ইয়াতে শেষ কৰে: কাছে পিয়লা নদীত ধুলে আৰু নদীয়ে, নদী হোৱাৰ বাবে, নুসুধিলে কোনে জিনিলে। ডুম প্ৰায় শুই পৰে। তাই সৰুকৈ কয়, লাহে পলম নহয় যদি তুমি প্ৰেম কৰা মানুহৰ লগত দৌৰা নাই।',
        ),
        t('Where did the tortoise rinse the cups?', 'कछुए ने प्याले कहाँ धोए?', 'কাছে পিয়লা ক\'ত ধুলে?'),
        [
          opt('In the river', 'नदी में', 'নদীত', true),
          opt('In a washing machine', 'वॉशिंग मशीन में', 'ৱাছিং মেচিনত', false),
          opt('On the moon', 'चाँद पर', 'চন্দ্ৰত', false),
        ],
        t('Cups rinsed in the river. The river did not ask who won.', 'प्याले नदी में। नदी ने विजेता नहीं पूछा।', 'পিয়লা নদীত। নদীয়ে বিজয়ী নুসুধিলে।'),
      ),
    ],
  },
];

export const STORY_COUNT = PAST_STORIES.length;

export function pickStory() {
  let last = '';
  try {
    last = localStorage.getItem(LAST_KEY) || '';
  } catch {
    last = '';
  }
  const pool = PAST_STORIES.filter((item) => item.id !== last);
  const next = pool[Math.floor(Math.random() * pool.length)] || PAST_STORIES[0];
  try {
    localStorage.setItem(LAST_KEY, next.id);
  } catch {
    /* ignore */
  }
  return next;
}
