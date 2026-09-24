const LAST_KEY = 'smriti-last-story-id';

const INDIC_HI = new Set(['ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'brx']);
const AS_NEAR = new Set(['bn', 'mni']);

export function storyLang(code) {
  if (code === 'hi' || code === 'as' || code === 'en') return code;
  if (AS_NEAR.has(code)) return 'as';
  if (INDIC_HI.has(code)) return 'hi';
  return 'en';
}

export function loc(lang, pack) {
  if (pack == null) return '';
  if (typeof pack === 'string') return pack;
  const key = storyLang(lang);
  return pack[key] || pack.en || pack.hi || pack.as || '';
}

export const STORY_SCENARIOS = [
  {
    "id": "tea-garden-dawn",
    "title": {
      "en": "Dew in the tea garden",
      "hi": "चाय बागान की ओस",
      "as": "চাহ বাৰীৰ শিচিৰ"
    },
    "close": {
      "en": "The baskets went down the slope. The dew had already paid us.",
      "hi": "टोकरियाँ ढलान से उतर गईं। ओस पहले ही मजदूरी दे चुकी थी।",
      "as": "পাচিবোৰ ঢালেদি নামিল। শিচিৰেই আমাক মজুৰী দিলে।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "Before the sun had cleared the tea bushes, the garden was already a wet green sea. Dew clung to my ankles like cold glass bangles. A hornbill called once from the shade tree, then went quiet, as if it too was waiting for the first leaf. I still remember the smell — crushed two-leaves-and-a-bud, wet earth, and the iron breath of the factory chimney far down the slope.",
          "hi": "सूरज चाय की झाड़ियों से ऊपर आने से पहले बागान गीला हरा समुद्र था। ओस टखनों पर ठंडी कांच की चूड़ियों जैसी चिपक गई। छाँव के पेड़ से हॉर्नबिल एक बार बोला, फिर चुप — जैसे वह भी पहली पत्ती का इंतज़ार कर रहा हो। महक अब भी है — दो पत्ती एक कली, गीली मिट्टी, और नीचे कारखाने की चिमन की लोहे जैसी साँस।",
          "as": "সূৰ্যই চাহ গছৰ ওপৰলৈ উঠাৰ আগতেই বাগিচাখন তিতা সেউজীয়া সাগৰ আছিল। শিচিৰে মোৰ ডিঙিৰ দৰে ঠাণ্ডা কাঁচৰ বালাৰ দৰে ভৰিৰ গাঁঠিত লাগি থাকিল। ছাঁৰ গছৰ পৰা হৰ্ণবিলে এবাৰ মাতিলে, তাৰ পাছত নিমাত — যেন সিও প্ৰথম পাতৰ বাবে অপেক্ষা কৰি আছে। গোন্ধটো এতিয়াও মনত আছে — দুখিলা-এটা-কলি, তিতা মাটি, আৰু তলৰ কাৰখানাৰ চিমনিৰ লোহাৰ উশাহ।"
        },
        "ask": {
          "en": "What clung to the ankles at dawn?",
          "hi": "भोर में टखनों पर क्या चिपक गया?",
          "as": "পুৱাতে ভৰিৰ গাঁঠিত কি লাগিছিল?"
        },
        "options": [
          {
            "en": "Dew, like cold glass",
            "hi": "ओस, ठंडी कांच जैसी",
            "as": "শিচিৰ, ঠাণ্ডা কাঁচৰ দৰে",
            "ok": true
          },
          {
            "en": "Engine oil",
            "hi": "इंजन तेल",
            "as": "ইঞ্জিন তেল",
            "ok": false
          },
          {
            "en": "River sand only",
            "hi": "केवल नदी की रेत",
            "as": "কেৱল নদীৰ বালি",
            "ok": false
          }
        ],
        "hint": {
          "en": "Dew on the ankles, before the sun cleared the bushes.",
          "hi": "झाड़ियों से पहले टखनों पर ओस।",
          "as": "গছৰ আগতে ভৰিৰ গাঁঠিত শিচিৰ।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "My sister walked ahead with a gamosa tied at her waist, red border bright as a wound of joy. The pluckers' baskets bumped softly against the leaves. We were not rich. We were early. The dew was our first wage, and nobody wrote it in a ledger.",
          "hi": "बहन कमर पर गामोसा बाँधे आगे चली, लाल किनारी खुशी के घाव जैसी चमकीली। तोड़ने वालों की टोकरियाँ पत्तों से धीरे टकराती रहीं। हम अमीर नहीं थे। हम जल्दी थे। ओस पहली मजदूरी थी, और किसी बही में नहीं लिखी गई।",
          "as": "ভনীয়েক কঁকালত গামোচা বান্ধি আগে আগে গ'ল, ৰঙা কাষ সুখৰ ঘাঁৰ দৰে জিলিকিছিল। তোলাসকলৰ পাচিবোৰে পাতত লাহি লাহি খুন্দা মাৰিছিল। আমি ধনী নাছিলোঁ। আমি আগতীয়া আছিলোঁ। শিচিৰেই আমাৰ প্ৰথম মজুৰী, আৰু কাৰো বহীত নিলিখা।"
        },
        "ask": {
          "en": "What cloth was tied at her waist?",
          "hi": "कमर पर कौन-सा कपड़ा बँधा था?",
          "as": "কঁকালত কোন কাপোৰ বন্ধা আছিল?"
        },
        "options": [
          {
            "en": "A gamosa",
            "hi": "गामोसा",
            "as": "গামোচা",
            "ok": true
          },
          {
            "en": "A raincoat",
            "hi": "रेनकोट",
            "as": "ৰেইনকোট",
            "ok": false
          },
          {
            "en": "A school tie",
            "hi": "स्कूल की टाई",
            "as": "স্কুলৰ টাই",
            "ok": false
          }
        ],
        "hint": {
          "en": "A gamosa at the waist, red border bright.",
          "hi": "कमर पर गामोसा, लाल किनारी।",
          "as": "কঁকালত গামোচা, ৰঙা কাষ।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "The overseer did not shout. He only lifted two fingers and a bud — the oldest grammar of this garden. Anyone who has stood between the rows knows what those three green things mean when the basket is still light.",
          "hi": "निरीक्षक चिल्लाया नहीं। केवल दो उंगलियाँ और एक कली उठाई — इस बागान का सबसे पुराना व्याकरण। पंक्तियों के बीच खड़ा कोई जानता है, टोकरी हल्की हो तो वे तीन हरी चीजें क्या कहती हैं।",
          "as": "অভাৰচিয়াৰে চিঞৰা নাছিল। কেৱল দুই আঙুলি আৰু এটা কলি তুলিছিল — এই বাগিচাৰ আটাইতকৈ পুৰণি ব্যাকৰণ। শাৰীৰ মাজত থিয় হোৱা কোনোবাই জানে, পাচিখন যেতিয়া পাতল, সেই তিনিটা সেউজীয়া বস্তুৱে কি কয়।"
        },
        "ask": {
          "en": "What is the garden’s oldest measure of a good pluck?",
          "hi": "अच्छी तोड़ाई का सबसे पुराना नाप क्या है?",
          "as": "ভাল তোলাৰ আটাইতকৈ পুৰণি মাপ কি?"
        },
        "options": [
          {
            "en": "Two leaves and a bud",
            "hi": "दो पत्ती और एक कली",
            "as": "দুখিলা আৰু এটা কলি",
            "ok": true
          },
          {
            "en": "A full coconut",
            "hi": "पूरा नारियल",
            "as": "গোটেই নাৰিকল",
            "ok": false
          },
          {
            "en": "A steel thali",
            "hi": "स्टील थाली",
            "as": "ষ্টীল থালী",
            "ok": false
          }
        ],
        "hint": {
          "en": "Two leaves and a bud — the garden’s grammar.",
          "hi": "दो पत्ती एक कली — बागान का व्याकरण।",
          "as": "দুখিলা-এটা-কলি — বাগিচাৰ ব্যাকৰণ।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "At the weighing shed the clerk wrote numbers as if they were weather. A woman laughed because her basket had come out heavier than her worry. Someone passed a steel glass of black tea that tasted of smoke on purpose, and the morning finally agreed to be a morning.",
          "hi": "तौल शेड में बाबू ने अंक मौसम की तरह लिखे। एक औरत हँसी क्योंकि टोकरी उसकी चिंता से भारी निकली। किसी ने जानबूझकर धुएँ वाली काली चाय का स्टील गिलास बढ़ाया, और सुबह आखिर सुबह मान गई।",
          "as": "ওজন ঘৰত বাবুয়ে সংখ্যাবোৰ বতৰৰ দৰে লিখিলে। এগৰাকী তিৰোতাই হাঁহিলে কাৰণ পাচিখন তাইৰ চিন্তাতকৈ গধুৰ ওলাল। কোনোবাই জানি-বুজি ধোঁৱাৰ সোৱাদ থকা ক'লা চাহৰ ষ্টীল গিলাচ আগবঢ়ালে, আৰু ৰাতিপুৱাই অৱশেষত ৰাতিপুৱা হ'বলৈ মান্তি হ'ল।"
        },
        "ask": {
          "en": "What was passed around in a steel glass?",
          "hi": "स्टील गिलास में क्या घूमा?",
          "as": "ষ্টীল গিলাচত কি ঘূৰিছিল?"
        },
        "options": [
          {
            "en": "Black tea that tasted of smoke",
            "hi": "धुएँ वाली काली चाय",
            "as": "ধোঁৱাৰ সোৱাদ থকা ক'লা চাহ",
            "ok": true
          },
          {
            "en": "Iced soda",
            "hi": "बर्फ़ सोडा",
            "as": "বৰফ চ'ডা",
            "ok": false
          },
          {
            "en": "Milk from a carton ad",
            "hi": "कार्टन वाले दूध का विज्ञापन",
            "as": "কাৰ্টনৰ গাখীৰৰ বিজ্ঞাপন",
            "ok": false
          }
        ],
        "hint": {
          "en": "Black tea, smoky on purpose.",
          "hi": "काली चाय, जानबूझकर धुएँ वाली।",
          "as": "ক'লা চাহ, জানি-বুজি ধোঁৱাৰ।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I kept one tender leaf in my palm until it warmed, then let it go. Children do that when they want the garden to notice them. My mother said, without looking up from her row, that the bush would forgive a stolen greeting.",
          "hi": "मैंने एक कोमल पत्ती हथेली में तब तक रखी जब तक गुनगुनी न हो, फिर छोड़ दी। बच्चे ऐसा करते हैं जब चाहते हैं बागान उन्हें देखे। माँ ने पंक्ति से आँख उठाए बिना कहा, झाड़ी चोरी की नमस्कार माफ़ कर देगी।",
          "as": "মই এপাত কোমল পাত হাতৰ তলুৱাত গৰম নোহোৱালৈকে ৰাখিলোঁ, তাৰ পাছত এৰি দিলোঁ। ল'ৰা-ছোৱালীয়ে তেনেকুৱা কৰে যেতিয়া বাগিচাখনে সিহঁতক চোৱাটো বিচাৰে। মায়ে শাৰীৰ পৰা চকু নুতোৱাকৈ ক'লে, গছজোপাই চোৰাই নিয়া নমস্কাৰ ক্ষমা কৰিব।"
        },
        "ask": {
          "en": "What did I warm in my palm?",
          "hi": "हथेली में क्या गुनगुना किया?",
          "as": "হাতৰ তলুৱাত কি গৰম কৰিলোঁ?"
        },
        "options": [
          {
            "en": "A tender tea leaf",
            "hi": "एक कोमल चाय पत्ती",
            "as": "এপাত কোমল চাহ পাত",
            "ok": true
          },
          {
            "en": "A mobile phone",
            "hi": "मोबाइल फोन",
            "as": "ম'বাইল ফোন",
            "ok": false
          },
          {
            "en": "A railway ticket",
            "hi": "रेल टिकट",
            "as": "ৰেল টিকট",
            "ok": false
          }
        ],
        "hint": {
          "en": "A tender leaf, then let go.",
          "hi": "कोमल पत्ती, फिर छोड़ दी।",
          "as": "কোমল পাত, তাৰ পাছত এৰি দিলোঁ।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "It is not a river, yet it has banks of green. It is not a school, yet it teaches the hand the same three letters every dawn. What were we walking through while the hornbill kept our secret?",
          "hi": "नदी नहीं, फिर भी हरे किनारे हैं। स्कूल नहीं, फिर भी हर भोर हाथ को तीन अक्षर सिखाती है। हॉर्नबिल जब राज़ रखे, हम किसमें चल रहे थे?",
          "as": "নদী নহয়, তথাপি সেউজীয়া পাৰ আছে। বিদ্যালয় নহয়, তথাপি প্ৰতি পুৱা হাতক তিনিটা আখৰ শিকায়। হৰ্ণবিলে যেতিয়া গোপন কথা ৰাখিছিল, আমি কিৰ মাজেৰে খোজ কাঢ়িছিলোঁ?"
        },
        "ask": {
          "en": "Where were we walking?",
          "hi": "हम कहाँ चल रहे थे?",
          "as": "আমি ক'ত খোজ কাঢ়িছিলোঁ?"
        },
        "options": [
          {
            "en": "A tea garden",
            "hi": "चाय बागान",
            "as": "চাহ বাৰী",
            "ok": true
          },
          {
            "en": "A cinema hall",
            "hi": "सिनेमा हॉल",
            "as": "চিনেমা হল",
            "ok": false
          },
          {
            "en": "An airport lounge",
            "hi": "एयरपोर्ट लाउंज",
            "as": "বিমানবন্দৰৰ লাউঞ্জ",
            "ok": false
          }
        ],
        "hint": {
          "en": "Between the tea rows.",
          "hi": "चाय की पंक्तियों के बीच।",
          "as": "চাহৰ শাৰীৰ মাজত।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "By nine the sun had a sharp edge. We sat under the shade tree and ate puffed rice from a newspaper that still talked of a cricket match in Guwahati. Ants arrived like a small committee. Nobody shooed them. The garden had enough for committees.",
          "hi": "नौ बजे सूरज की धार तेज़ थी। छाँव के पेड़ तले बैठे, गुवाहाटी क्रिकेट की खबर वाले अखबार में मुरमुरा खाया। चींटियाँ छोटी कमेटी बनकर आईं। किसी ने नहीं हटाया। बागान में कमेटियों के लिए काफी था।",
          "as": "নটাৰ সময়ত ৰ'দৰ ধাৰ চোকা আছিল। ছাঁৰ গছৰ তলত বহি গুৱাহাটীৰ ক্ৰিকেটৰ খবৰ থকা বাতৰি কাকতত মুৰমুৰা খালোঁ। পৰুৱাবোৰ সৰু সমিতিৰ দৰে আহিল। কাও নখেদিলে। বাগিচাত সমিতিৰ বাবে যথেষ্ট আছিল।"
        },
        "ask": {
          "en": "What did we eat under the shade tree?",
          "hi": "छाँव के पेड़ तले क्या खाया?",
          "as": "ছাঁৰ গছৰ তলত কি খালোঁ?"
        },
        "options": [
          {
            "en": "Puffed rice from newspaper",
            "hi": "अखबार में मुरमुरा",
            "as": "বাতৰি কাকতত মুৰমুৰা",
            "ok": true
          },
          {
            "en": "Ice cream cups",
            "hi": "आइसक्रीम कप",
            "as": "আইচক্ৰীম কাপ",
            "ok": false
          },
          {
            "en": "Airport sandwiches",
            "hi": "एयरपोर्ट सैंडविच",
            "as": "বিমানবন্দৰৰ চেণ্ডউইচ",
            "ok": false
          }
        ],
        "hint": {
          "en": "Puffed rice, cricket news underneath.",
          "hi": "मुरमुरा, नीचे क्रिकेट की खबर।",
          "as": "মুৰমুৰা, তলত ক্ৰিকেটৰ খবৰ।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "When we walked home the factory whistle wrote a line across the air. My sister untied the gamosa and wiped my forehead as if I were still a child, which, in that garden, I was. The dew had dried. The wage remained.",
          "hi": "घर जाते कारखाने की सीटी हवा पर एक पंक्ति लिख गई। बहन ने गामोसा खोल माथे पोंछा जैसे मैं अब भी बच्चा हूँ — और उस बागान में था भी। ओस सूख गई। मजदूरी रह गई।",
          "as": "ঘৰলৈ যাওঁতে কাৰখানাৰ চিঞৰিয়ে বতাহত এশাৰী লিখি থৈ গ'ল। ভনীয়েকে গামোচা খুলি মোৰ কপাল মচিলে যেন মই এতিয়াও শিশু — আৰু সেই বাগিচাত আছিলোঁও। শিচিৰ শুকাই গ'ল। মজুৰী থাকিল।"
        },
        "ask": {
          "en": "What wrote a line across the air as we went home?",
          "hi": "घर जाते हवा पर पंक्ति किसने लिखी?",
          "as": "ঘৰলৈ যাওঁতে বতাহত শাৰী কোনোৱে লিখিলে?"
        },
        "options": [
          {
            "en": "The factory whistle",
            "hi": "कारखाने की सीटी",
            "as": "কাৰখানাৰ চিঞৰি",
            "ok": true
          },
          {
            "en": "A jet plane",
            "hi": "जेट विमान",
            "as": "জেট বিমান",
            "ok": false
          },
          {
            "en": "A temple bell in a mall",
            "hi": "मॉल की मंदिर घंटी",
            "as": "মলৰ মন্দিৰ ঘণ্টা",
            "ok": false
          }
        ],
        "hint": {
          "en": "The factory whistle, then home.",
          "hi": "कारखाने की सीटी, फिर घर।",
          "as": "কাৰখানাৰ চিঞৰি, তাৰ পাছত ঘৰ।"
        }
      }
    ]
  },
  {
    "id": "bihu-courtyard",
    "title": {
      "en": "Bihu in the brick courtyard",
      "hi": "ईंट के आंगन में बिहू",
      "as": "ইটাৰ চোতালত বিহু"
    },
    "close": {
      "en": "The dhol went home. Our feet kept the mud’s memory.",
      "hi": "ढोल घर चला गया। पाँव कीचड़ की याद रखे रहे।",
      "as": "ঢোলে ঘৰলৈ গ'ল। ভৰিয়ে কাদাৰ মনত ৰাখিলে।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "Bohag arrived smelling of new rice and crushed herbs. Someone had already tied a red-and-white gamosa at the bamboo gate, as if the house itself had dressed. The brick courtyard was still cool. A crow argued with a mango stone. My aunt lit the chulha before the sun had the courage to look in.",
          "hi": "बोहाग नई चावल और कुटी जड़ी-बूटी की महक संग आया। बाँस के फाटक पर लाल-सफ़ेद गामोसा बँध चुका था, जैसे घर ने कपड़े पहन लिए हों। ईंट का आंगन अभी ठंडा था। कौआ आम की गुठली से बहस कर रहा था। चाची ने सूरज के झाँकने से पहले चूल्हा जलाया।",
          "as": "বহাগ নতুন চাউল আৰু গুৰি কৰা বনৌষধিৰ গোন্ধ লৈ আহিল। বাঁহৰ দুৱাৰত ৰঙা-বগা গামোচা বন্ধা আছিল, যেন ঘৰখনেই কাপোৰ পিন্ধিলে। ইটাৰ চোতাল এতিয়াও ঠাণ্ডা। কাউৰীয়ে আমৰ গুটিৰ সৈতে তৰ্ক কৰি আছিল। খুৰীয়ে ৰ'দ চোৱাৰ সাহস পোৱাৰ আগতেই চুহ্লা জ্বলাইছিল।"
        },
        "ask": {
          "en": "Which season had come to the gate?",
          "hi": "फाटक पर कौन-सा मौसम आया था?",
          "as": "দুৱাৰত কোন ঋতু আহিছিল?"
        },
        "options": [
          {
            "en": "Bohag / spring Bihu",
            "hi": "बोहाग / वसंत बिहू",
            "as": "বহাগ / বসন্ত বিহু",
            "ok": true
          },
          {
            "en": "Deep winter only",
            "hi": "केवल कड़ी सर्दी",
            "as": "কেৱল কঠিন শীত",
            "ok": false
          },
          {
            "en": "A hotel New Year",
            "hi": "होटल का नया साल",
            "as": "হোটেলৰ নৱবৰ্ষ",
            "ok": false
          }
        ],
        "hint": {
          "en": "Bohag Bihu at the bamboo gate.",
          "hi": "बाँस के फाटक पर बोहाग बिहू।",
          "as": "বাঁহৰ দুৱাৰত বহাগ বিহু।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "The dhol waited in shade, skin tight like a held breath. When the first beat smiled, feet remembered before the mind did — left, right, a small jump that raised courtyard dust smelling of last night’s rain. My sister wore only a few flowers, enough for the field to notice, not enough for anyone to call it showing off.",
          "hi": "ढोल छाँव में था, चमड़ी कसी हुई जैसे साँस रोकी हो। पहली थाप मुसकुराई तो पाँव दिमाग से पहले याद कर गए — बायाँ, दायाँ, छोटी छलाँग, आंगन की धूल में कल की बारिश। बहन ने थोड़े फूल रखे, जितने में खेत देख ले, जितने में कोई अकड़ न कहे।",
          "as": "ঢোল ছাঁত আছিল, ছাল টান যেন উশাহ ৰখা। প্ৰথম চাপত হাঁহিলে ভৰিয়ে মনতকৈ আগে মনত পেলালে — বাওঁ, সোঁ, সৰু জাঁপ, চোতালৰ ধুলিত কালিৰ বৰষুণ। ভনীয়েকে অলপহে ফুল থৈছিল, যিমানত পথাৰে চায়, যিমানত কোনেও দেখুওৱা বুলি নকয়।"
        },
        "ask": {
          "en": "Which instrument waited in the shade?",
          "hi": "छाँव में कौन-सा वाद्य था?",
          "as": "ছাঁত কোন বাদ্য আছিল?"
        },
        "options": [
          {
            "en": "The dhol",
            "hi": "ढोल",
            "as": "ঢোল",
            "ok": true
          },
          {
            "en": "A piano",
            "hi": "पियानो",
            "as": "পিয়ানো",
            "ok": false
          },
          {
            "en": "An electric guitar",
            "hi": "इलेक्ट्रिक गिटार",
            "as": "ইলেক্ট্ৰিক গিটাৰ",
            "ok": false
          }
        ],
        "hint": {
          "en": "The dhol, skin tight.",
          "hi": "ढोल, चमड़ी कसी।",
          "as": "ঢোল, ছাল টান।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "On a Bihu morning the mouth often asks for a sweet folded on the tawa, sesame hiding inside like a secret that wants to be found. The steel plate was wide. Nobody counted. Counting would have been rude to joy.",
          "hi": "बिहू की सुबह मुँह तवे पर मुड़ी मिठाई माँगता है, अंदर तिल जैसे राज़ जो पकड़ा जाना चाहता है। स्टील थाली चौड़ी थी। किसी ने नहीं गिना। गिनती खुशी का अपमान होती।",
          "as": "বিহুৰ ৰাতিপুৱা মুখে তাৱাত মুৰা মিঠা বিচাৰে, ভিতৰত তিল যেন ধৰা পৰিব খোজা গোপন কথা। ষ্টীল থালী বহল আছিল। কোনেও নগণিলে। গণনা সুখৰ অপমান হ'লহেঁতেন।"
        },
        "ask": {
          "en": "What sweet was on the tawa?",
          "hi": "तवे पर कौन-सी मिठाई थी?",
          "as": "তাৱাত কোন মিঠা আছিল?"
        },
        "options": [
          {
            "en": "Pitha with sesame",
            "hi": "तिल वाला पिठा",
            "as": "তিলৰ পিঠা",
            "ok": true
          },
          {
            "en": "Chocolate cake from a box",
            "hi": "डिब्बे का चॉकलेट केक",
            "as": "বাকচৰ চকলেট কেক",
            "ok": false
          },
          {
            "en": "Only ice cubes",
            "hi": "केवल बर्फ़",
            "as": "কেৱল বৰফ",
            "ok": false
          }
        ],
        "hint": {
          "en": "Pitha, sesame inside.",
          "hi": "पिठा, अंदर तिल।",
          "as": "পিঠা, ভিতৰত তিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "Uncle shouted “Bihu kushal!” from the bamboo fence, laughing as if the fence itself were dancing. A neighbour passed black tea that tasted of smoke on purpose. Children ran the long way around the fire of last Magh, because even a remembered fire can teach the feet.",
          "hi": "चाचा बाँस की बाड़ से बिहू कुशल चिल्लाए, जैसे बाड़ नाच रही हो। पड़ोसिन ने जानबूझकर धुएँ वाली काली चाय दी। बच्चे पिछले माघ की आग की याद के लंबे रास्ते दौड़े, क्योंकि याद की आग भी पाँव सिखाती है।",
          "as": "খুড়ায় বাঁহৰ বেৰৰ পৰা বিহু কুশল চিঞৰিলে, যেন বেৰডালেই নাচিছে। চুবুৰীয়াই জানি-বুজি ধোঁৱাৰ ক'লা চাহ আগবঢ়ালে। ল'ৰা-ছোৱালীয়ে যোৱা মাঘৰ জুইৰ মনত থকা দীঘল বাটেদি দৌৰিলে, কাৰণ মনত থকা জুইয়েও ভৰিক শিকায়।"
        },
        "ask": {
          "en": "Where was uncle standing?",
          "hi": "चाचा कहाँ खड़े थे?",
          "as": "খুৰা ক'ত থিয় আছিল?"
        },
        "options": [
          {
            "en": "By the bamboo fence",
            "hi": "बाँस की बाड़ पर",
            "as": "বাঁহৰ বেৰত",
            "ok": true
          },
          {
            "en": "Inside an aeroplane",
            "hi": "हवाई जहाज़ में",
            "as": "বিমানত",
            "ok": false
          },
          {
            "en": "At a bank counter",
            "hi": "बैंक काउंटर पर",
            "as": "বেংক কাউণ্টাৰত",
            "ok": false
          }
        ],
        "hint": {
          "en": "At the bamboo fence.",
          "hi": "बाँस की बाड़ पर।",
          "as": "বাঁহৰ বেৰত।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "We ate standing because sitting would have been too slow for the dhol. Mustard oil shone on a slice of onion. Someone’s bangles kept time better than the drummer, and nobody minded. The courtyard became a small country with one law: keep moving kindly.",
          "hi": "खड़े खाया क्योंकि बैठना ढोल के लिए बहुत धीमा होता। प्याज के टुकड़े पर सरसों तेल चमका। किसी की चूड़ियाँ ढोलची से बेहतर ताल रखतीं, किसी को ऐतराज़ न था। आंगन छोटा देश बन गया, एक क़ानून: दया से चलते रहो।",
          "as": "থিয় হৈ খালোঁ কাৰণ বহাটো ঢোলৰ বাবে বৰ লাহে হ'লহেঁতেন। পিয়াজৰ টুকুৰাত সৰিয়হ তেল জিলিকিছিল। কাৰোবাৰ বালাত ঢোলীৰ সোতকৈ ভাল তাল আছিল, কাৰো আপত্তি নাছিল। চোতালখন সৰু দেশ হৈ পৰিল, এটা আইন: দয়াৰে গতি কৰি থাকক।"
        },
        "ask": {
          "en": "How did we eat?",
          "hi": "हमने कैसे खाया?",
          "as": "আমি কেনেকৈ খালোঁ?"
        },
        "options": [
          {
            "en": "Standing, because sitting was too slow",
            "hi": "खड़े, क्योंकि बैठना धीमा था",
            "as": "থিয় হৈ, কাৰণ বহা লাহে",
            "ok": true
          },
          {
            "en": "In a formal banquet hall",
            "hi": "औपचारिक भोज कक्ष में",
            "as": "আনুষ্ঠানিক ভোজ ঘৰত",
            "ok": false
          },
          {
            "en": "Only from a vending machine",
            "hi": "केवल वending मशीन से",
            "as": "কেৱল ভেণ্ডিং মেচিনৰ পৰা",
            "ok": false
          }
        ],
        "hint": {
          "en": "We ate standing.",
          "hi": "खड़े खाया।",
          "as": "থিয় হৈ খালোঁ।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "It is white with a red border, it honours a guest, it wipes a forehead after dance, and on Bihu it sits on a shoulder like a small flag of home. What cloth walked with us in the courtyard?",
          "hi": "सफ़ेद, लाल किनारी, मेहमान का सम्मान, नाच बाद माथा पोंछे, बिहू पर कंधे पर घर का छोटा झंडा। आंगन में कौन-सा कपड़ा साथ चला?",
          "as": "বগা, ৰঙা কাষ, অতিথিৰ সন্মান, নাচৰ পাছত কপাল মচে, বিহুত কান্ধত ঘৰৰ সৰু পতাকা। চোতালত কোন কাপোৰে লগত খোজ কাঢ়িলে?"
        },
        "ask": {
          "en": "Which cloth belongs to that morning?",
          "hi": "उस सुबह का कपड़ा कौन-सा?",
          "as": "সেই ৰাতিপুৱাৰ কাপোৰ কোনটো?"
        },
        "options": [
          {
            "en": "The gamosa",
            "hi": "गामोसा",
            "as": "গামোচা",
            "ok": true
          },
          {
            "en": "A necktie from an office",
            "hi": "ऑफिस की टाई",
            "as": "অফিচৰ টাই",
            "ok": false
          },
          {
            "en": "A plastic raincoat",
            "hi": "प्लास्टिक रेनकोट",
            "as": "প্লাষ্টিক ৰেইনকোট",
            "ok": false
          }
        ],
        "hint": {
          "en": "The gamosa.",
          "hi": "गामोसा।",
          "as": "গামোচা।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "When the sun climbed we rested under the mango. The dhol was laid on its side like a person asleep after honest work. A dog inspected the empty plates with the seriousness of a clerk. I kept a sesame seed on my thumb and did not wash it at once.",
          "hi": "सूरज चढ़ा तो आम के नीचे विश्राम। ढोल करवट पर रखा जैसे ईमानदार काम के बाद कोई सो गया हो। कुत्ते ने खाली थालियाँ बाबू की गंभीरता से जाँचीं। मैंने अँगूठे पर तिल रखा, तुरंत न धोया।",
          "as": "ৰ'দ উঠিল তেতিয়া আমৰ তলত জিৰণি। ঢোল কাষত থোৱা যেন সৎ কামৰ পাছত কোনোবা শুই পৰিছে। কুকুৰে খালী থালীবোৰ বাবুৰ গম্ভীৰতাৰে পৰীক্ষা কৰিলে। মই আঙুলুত তিল ৰাখিলোঁ, লগে লগে নুধুলোঁ।"
        },
        "ask": {
          "en": "Where did we rest?",
          "hi": "हम कहाँ विश्राम किए?",
          "as": "আমি ক'ত জিৰণি ললোঁ?"
        },
        "options": [
          {
            "en": "Under the mango tree",
            "hi": "आम के पेड़ तले",
            "as": "আম গছৰ তলত",
            "ok": true
          },
          {
            "en": "In a shopping mall",
            "hi": "शॉपिंग मॉल में",
            "as": "শ্বপিং মলত",
            "ok": false
          },
          {
            "en": "On a highway divider",
            "hi": "हाईवे डिवाइडर पर",
            "as": "হাইৱে ডিভাইডাৰত",
            "ok": false
          }
        ],
        "hint": {
          "en": "Under the mango.",
          "hi": "आम के नीचे।",
          "as": "আমৰ তলত।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "Evening took the flowers from my sister’s hair one by one, as evenings do. The courtyard kept the shape of our feet a little longer. Someone said next year, which is how Bihu promises without writing a contract.",
          "hi": "शाम ने बहन के बालों से फूल एक-एक कर लिए, शामें ऐसा ही करती हैं। आंगन ने पाँवों का आकार थोड़ी देर और रखा। किसी ने कहा अगला साल — बिहू बिना कागज़ वादे ऐसे ही करता है।",
          "as": "সন্ধিয়াই ভনীয়েকৰ চুলিৰ পৰা ফুল এটা এটাকৈ নিলে, সন্ধিয়াই তেনেকুৱা কৰে। চোতালে আমাৰ ভৰিৰ আকৃতি অলপ সময় ৰাখিলে। কোনোবাই ক'লে পিছৰ বছৰ — বিহুৱে কাগজ নোহোৱাকৈ প্ৰতিশ্ৰুতি তেনেকুৱা দিয়ে।"
        },
        "ask": {
          "en": "What did evening take from her hair?",
          "hi": "शाम ने बालों से क्या लिया?",
          "as": "সন্ধিয়াই চুলিৰ পৰা কি নিলে?"
        },
        "options": [
          {
            "en": "The flowers, one by one",
            "hi": "फूल, एक-एक कर",
            "as": "ফুল, এটা এটাকৈ",
            "ok": true
          },
          {
            "en": "A laptop charger",
            "hi": "लैपटॉप चार्जर",
            "as": "লেপটপ চাৰ্জাৰ",
            "ok": false
          },
          {
            "en": "A parking ticket",
            "hi": "पार्किंग टिकट",
            "as": "পাৰ্কিং টিকট",
            "ok": false
          }
        ],
        "hint": {
          "en": "Flowers, taken kindly by dusk.",
          "hi": "फूल, शाम ने दया से लिए।",
          "as": "ফুল, গধূলিয়ে দয়াৰে নিলে।"
        }
      }
    ]
  },
  {
    "id": "brahmaputra-ferry",
    "title": {
      "en": "The monsoon ferry",
      "hi": "मानसून की नाव",
      "as": "বৰষুণৰ নাও"
    },
    "close": {
      "en": "The far bank arrived slowly, as far banks do.",
      "hi": "दूसरा तट धीरे आया, दूसरे तट ऐसे ही आते हैं।",
      "as": "সিপাৰ লাহে আহিল, সিপাৰে তেনেকুৱা আহে।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "The Brahmaputra was the colour of strong tea that day, wide enough to make the sky look modest. The wooden ferry smelled of wet rope, diesel, and oranges someone was peeling too loudly. Rain stitched the river in silver thread. I held the black umbrella with one bent spoke; it still did its work, which is more than can be said of some people.",
          "hi": "उस दिन ब्रह्मपुत्र गहरी चाय जैसा था, इतना चौड़ा कि आसमान विनम्र लगे। लकड़ी की नाव में गीली रस्सी, डीज़ल, और किसी के ज़ोर से छिले संतरे। बारिश ने नदी को चाँदी के धागे से सी दिया। टेढ़ी तीली वाला काला छाता था; उसने काम किया — कुछ लोगों से ज़्यादा।",
          "as": "সেইদিন ব্ৰহ্মপুত্ৰ ডাঠ চাহৰ দৰে আছিল, ইমান বহল যে আকাশখনেই নম্ৰ দেখা গৈছিল। কাঠৰ নাওত তিতা ৰছী, ডিজেল, আৰু কাৰোবাৰ জোৰকৈ ছিলা কমলা। বৰষুণে নদীখন ৰূপৰ সূতাৰে চিলাইছিল। এডাল বেঁকা কাঁইট থকা ক'লা ছাতি ধৰিছিলোঁ; সি কাম কৰিলে — কিছুমান মানুহতকৈ বেছি।"
        },
        "ask": {
          "en": "What colour was the river that day?",
          "hi": "उस दिन नदी किस रंग की थी?",
          "as": "সেইদিন নদী কি ৰঙৰ আছিল?"
        },
        "options": [
          {
            "en": "The colour of strong tea",
            "hi": "गहरी चाय जैसा",
            "as": "ডাঠ চাহৰ দৰে",
            "ok": true
          },
          {
            "en": "Bright turquoise like a pool",
            "hi": "पूल जैसा फ़िरोज़ी",
            "as": "পুলৰ দৰে ফিৰোজা",
            "ok": false
          },
          {
            "en": "Frozen white",
            "hi": "जमी सफ़ेद",
            "as": "জমা বগা",
            "ok": false
          }
        ],
        "hint": {
          "en": "Strong tea — the Brahmaputra that monsoon.",
          "hi": "गहरी चाय — उस मानसून का ब्रह्मपुत्र।",
          "as": "ডাঠ চাহ — সেই বৰষুণৰ ব্ৰহ্মপুত্ৰ।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "A boy drew a river on the fogged window with one finger, then another river beside it, as if one were not enough. The conductor took fares into a cloth bag that had seen more weather than some houses. When the boat bumped a hidden sandbar, everybody leaned the same way, which is how strangers become a family for three seconds.",
          "hi": "एक लड़के ने धुंधली खिड़की पर उंगली से नदी खींची, फिर उसके पास दूसरी — एक काफ़ी न थी। कंडक्टर ने किराया उस कपड़े के थैले में लिया जिसे कुछ घरों से ज़्यादा मौसम देख चुका हो। छिपी रेत से टकराने पर सब एक तरफ़ झुके — तीन सेकंड के परिवार ऐसे बनते हैं।",
          "as": "এজন ল'ৰাই ধোঁৱা খিৰিকীত আঙুলিৰে নদী আঁকিলে, তাৰ কাষত আনখন — এখন যথেষ্ট নাছিল। কণ্ডাক্টৰে ভাড়া এনে কাপোৰৰ মোনাত ল'লে যি কিছু ঘৰতকৈ বেছি বতৰ দেখিছে। লুকাই থকা বালিৰ চাপত সকলোৱে এফালে হেলাল — তিনি ছেকেণ্ডৰ পৰিয়াল তেনেকুৱা হয়।"
        },
        "ask": {
          "en": "Who took the fare?",
          "hi": "किराया किसने लिया?",
          "as": "ভাড়া কোনে ল'লে?"
        },
        "options": [
          {
            "en": "The conductor",
            "hi": "कंडक्टर",
            "as": "কণ্ডাক্টৰ",
            "ok": true
          },
          {
            "en": "A cricket umpire",
            "hi": "क्रिकेट अंपायर",
            "as": "ক্ৰিকেট আম্পায়াৰ",
            "ok": false
          },
          {
            "en": "The orange itself",
            "hi": "संतरा स्वयं",
            "as": "কমলাটোৱেই",
            "ok": false
          }
        ],
        "hint": {
          "en": "The conductor with the old cloth bag.",
          "hi": "पुराने कपड़े के थैले वाला कंडक्टर।",
          "as": "পুৰণি কাপোৰৰ মোনা থকা কণ্ডাক্টৰ।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "It has no engine of its own in the old songs, yet it carries whole markets. It drinks the sky and gives it back as rain. We stood on it and still felt we were guests. What held us?",
          "hi": "पुराने गीतों में इसका अपना इंजन नहीं, फिर भी पूरे बाज़ार ले जाती है। आसमान पीती है, बारिश में लौटाती है। हम इस पर खड़े थे और मेहमान लगे। किसने थामा?",
          "as": "পুৰণি গীতত ইয়াৰ নিজৰ ইঞ্জিন নাই, তথাপি গোটেই বজাৰ কঢ়িয়ায়। আকাশ পান কৰে, বৰষুণত ঘূৰাই দিয়ে। আমি ইয়াৰ ওপৰত থিয় আছিলোঁ আৰু অতিথি যেন লাগিল। কিয়ে ধৰিছিল?"
        },
        "ask": {
          "en": "What were we standing on?",
          "hi": "हम किस पर खड़े थे?",
          "as": "আমি কিৰ ওপৰত থিয় আছিলোঁ?"
        },
        "options": [
          {
            "en": "The river, on a ferry",
            "hi": "नदी, नाव पर",
            "as": "নদী, নাওত",
            "ok": true
          },
          {
            "en": "A parked car rooftop",
            "hi": "खड़ी कार की छत",
            "as": "ৰখা কাৰৰ চাল",
            "ok": false
          },
          {
            "en": "A cinema balcony",
            "hi": "सिनेमा बालकनी",
            "as": "চিনেমা বেৰেণ্ডা",
            "ok": false
          }
        ],
        "hint": {
          "en": "The Brahmaputra under the ferry.",
          "hi": "नाव के नीचे ब्रह्मपुत्र।",
          "as": "নাওৰ তলত ব্ৰহ্মপুত্ৰ।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "A hen in a basket had opinions about every wave. The woman who owned her apologised to the hen, not to us, which seemed correct. I bought roasted gram from a tin cart when we touched the ghat steps; salt stayed on my fingers until town.",
          "hi": "डलिये की मुर्गी हर लहर पर राय रखती। मालकिन ने हमसे नहीं, मुर्गी से माफ़ी माँगी — ठीक लगा। घाट की सीढ़ियों पर टिन गाड़ी से भुने चने लिए; नमक शहर तक उंगलियों पर रहा।",
          "as": "পাচিৰ কুকুৰীটোৱে প্ৰতি ঢৌত মত দিছিল। গৰাকীগৰাকীয়ে আমাক নহয়, কুকুৰীটোক ক্ষমা খুজিলে — শুদ্ধ যেন লাগিল। ঘাটৰ খটখটিত টিন গাড়ীৰ পৰা ভজা চানা কিনিলে; নিমখ চহৰলৈকে আঙুলিত থাকিল।"
        },
        "ask": {
          "en": "What rode in the basket?",
          "hi": "डलिये में क्या सवार था?",
          "as": "পাচিত কি উঠিছিল?"
        },
        "options": [
          {
            "en": "A hen with opinions",
            "hi": "राय रखने वाली मुर्गी",
            "as": "মত থকা কুকুৰী",
            "ok": true
          },
          {
            "en": "A laptop",
            "hi": "लैपटॉप",
            "as": "লেপটপ",
            "ok": false
          },
          {
            "en": "Snow",
            "hi": "बर्फ़",
            "as": "হিম",
            "ok": false
          }
        ],
        "hint": {
          "en": "A hen, apologised to kindly.",
          "hi": "मुर्गी, जिससे माफ़ी माँगी गई।",
          "as": "কুকুৰী, যাক ক্ষমা খোজা হৈছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "Halfway, the rain thinned and the far bank showed a line of banana trees like a green letter that would not end. An old man pointed at a dolphin’s silver comma in the water and then pretended he had not, in case the river was shy.",
          "hi": "आधे रास्ते बारिश पतली हुई, दूर तट पर केलों की पंक्ति जैसे हरा पत्र जो खत्म न हो। बुजुर्ग ने पानी में डॉल्फिन का चाँदी का अल्पविराम दिखाया, फिर अनदेखा — कहीं नदी शर्मा जाए।",
          "as": "মাজভাগত বৰষুণ পাতল হ'ল, সিপাৰত কলগছৰ শাৰী যেন নোসোমা সেউজীয়া চিঠি। এজন বুঢ়াই পানীত ডলফিনৰ ৰূপৰ কমা দেখুৱালে, তাৰ পাছত নেদেখা কৰিলে — নদীখন লাজ কৰিব পাৰে।"
        },
        "ask": {
          "en": "What silver thing appeared in the water?",
          "hi": "पानी में कौन-सी चाँदी चीज़ दिखी?",
          "as": "পানীত কি ৰূপৰ বস্তু দেখা গ'ল?"
        },
        "options": [
          {
            "en": "A river dolphin’s brief shine",
            "hi": "नदी डॉल्फिन की झलक",
            "as": "নদীৰ ডলফিনৰ জिलিকনি",
            "ok": true
          },
          {
            "en": "A motorcycle",
            "hi": "मोटरसाइकिल",
            "as": "মটৰচাইকেল",
            "ok": false
          },
          {
            "en": "A fridge",
            "hi": "फ्रिज",
            "as": "ফ্ৰিজ",
            "ok": false
          }
        ],
        "hint": {
          "en": "A shy dolphin, pointed at once.",
          "hi": "शर्मीली डॉल्फिन, एक बार इशारा।",
          "as": "লাজুক ডলফিন, এবাৰ আঙুলি।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "You carry it, it becomes a roof, one spoke is honest about being bent. What kept the rain off my sleeve?",
          "hi": "उठाते हो तो छत बन जाता, एक तीली टेढ़ी होने की सच्चाई रखती है। आस्तीन पर बारिश किसने रोकी?",
          "as": "তুলিলে চাল হয়, এডাল কাঁইটে বেঁকা হোৱাৰ সত্য কয়। আস্তিনত বৰষুণ কিয়ে ৰোধ কৰিলে?"
        },
        "ask": {
          "en": "What did I carry against the rain?",
          "hi": "बारिश से क्या उठाया?",
          "as": "বৰষুণৰ বিপৰীতে কি তুলিলোঁ?"
        },
        "options": [
          {
            "en": "A bent-spoke umbrella",
            "hi": "टेढ़ी तीली वाला छाता",
            "as": "বেঁকা কাঁইটৰ ছাতি",
            "ok": true
          },
          {
            "en": "A ceiling fan",
            "hi": "सीलिंग पंखा",
            "as": "চিলিং ফেন",
            "ok": false
          },
          {
            "en": "A motorbike",
            "hi": "मोटरसाइकिल",
            "as": "মটৰচাইকেল",
            "ok": false
          }
        ],
        "hint": {
          "en": "The black umbrella, one spoke bent.",
          "hi": "काला छाता, एक तीली टेढ़ी।",
          "as": "ক'লা ছাতি, এডাল কাঁইট বেঁকা।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "At the ghat, brass pots were rinsing until they held a piece of sky. I wet my feet only; the current tugged like a grandchild who wants you farther in. We climbed with wet ankles and a quieter mind.",
          "hi": "घाट पर पीतल के लोटे धुल रहे थे जब तक उनमें आसमान का टुकड़ा न समा जाए। मैंने पाँव ही भिगोए; धारा नाती जैसी खींचती रही। गीनी एड़ियों और शांत मन संग चढ़े।",
          "as": "ঘাটত পিতলৰ লোটা ধোৱা হৈছিল যেতিয়ালৈকে তাত আকাশৰ টুকুৰা নসমায়। মই ভৰিহে তিতালোঁ; সোঁতে নাতিৰ দৰে টানিছিল। তিতা ডিঙি আৰু শান্ত মনেৰে উঠিলোঁ।"
        },
        "ask": {
          "en": "How far did I go into the water?",
          "hi": "पानी में कितनी दूर गए?",
          "as": "পানীত কিমান দূৰ গ'লোঁ?"
        },
        "options": [
          {
            "en": "Only the feet",
            "hi": "केवल पाँव",
            "as": "কেৱল ভৰি",
            "ok": true
          },
          {
            "en": "Swam to the other country",
            "hi": "दूसरे देश तक तैरे",
            "as": "আন দেশলৈ সাঁতুৰিলোঁ",
            "ok": false
          },
          {
            "en": "Took a steamer to the moon",
            "hi": "चाँद तक स्टीमर",
            "as": "জোনলৈ ষ্টিমাৰ",
            "ok": false
          }
        ],
        "hint": {
          "en": "Feet only; the current invited more.",
          "hi": "केवल पाँव; धारा और बुलाती रही।",
          "as": "কেৱল ভৰি; সোঁতে আৰু মাতিলে।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "Town announced itself with a petrol pump and a loudspeaker selling shirts. I held the bag of greens closer. The ferry behind us looked suddenly small, which is how memory treats boats once you have arrived.",
          "hi": "शहर ने खुद को पेट्रोल पंप और शर्ट बेचते लाउडस्पीकर से बताया। साग का थैला पास खींचा। पीछे नाव अचानक छोटी लगी — पहुँचने के बाद यादें नावें ऐसी ही करती हैं।",
          "as": "চহৰে নিজকে পেট্ৰল পাম্প আৰু চোলা বেচা লাউডস্পিকাৰেৰে জনালে। পাতৰ মোনা ওচৰলৈ তানিলোঁ। পিছফালে নাও হঠাতে সৰু যেন লাগিল — পোৱাৰ পাছত মনত নাও এনেকুৱা কৰে।"
        },
        "ask": {
          "en": "What was the first sign of town?",
          "hi": "शहर का पहला संकेत क्या था?",
          "as": "চহৰৰ প্ৰথম চিন কি আছিল?"
        },
        "options": [
          {
            "en": "A petrol pump",
            "hi": "पेट्रोल पंप",
            "as": "পেট্ৰল পাম্প",
            "ok": true
          },
          {
            "en": "A glacier",
            "hi": "ग्लेशियर",
            "as": "গ্লেচিয়াৰ",
            "ok": false
          },
          {
            "en": "A lighthouse in snow",
            "hi": "बर्फ़ में लाइटहाउस",
            "as": "হিমত লাইটহাউচ",
            "ok": false
          }
        ],
        "hint": {
          "en": "A petrol pump, then the loudspeaker.",
          "hi": "पहले पेट्रोल पंप।",
          "as": "প্ৰথমে পেট্ৰল পাম্প।"
        }
      }
    ]
  },
  {
    "id": "grandmother-kitchen",
    "title": {
      "en": "Grandmother’s kitchen at dusk",
      "hi": "दादी की रसोई, शाम",
      "as": "আইতাৰ ৰান্ধনি ঘৰ, গধূলি"
    },
    "close": {
      "en": "Jaggery stayed on the thumb. Some sweetness should linger.",
      "hi": "गुड़ अँगूठे पर रहा। कुछ मिठास ठहरने दो।",
      "as": "গুড় আঙুলুত থাকিল। কিছু মিঠা থাকিবলৈ দিয়ক।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "Rice batter waited in the bowl like a quiet lake. Sesame and jaggery argued softly in the other. The tawa was already hot; a drop of batter danced and settled. Smoke wrote on the beams letters that never spelled a word, only a house. My grandmother’s ladle handle was darker than the rest — a map of years.",
          "hi": "कटोरे में चावल का घोल शांत झील। दूसरे में तिल और गुड़ की धीमी बहस। तवा गरम; बूँद नाची और बैठ गई। धुआँ शहतीर पर ऐसे अक्षर लिखता जो शब्द नहीं, घर लिखते। दादी की कलछी का हैंडल बाकी से गहरा — सालों का नक्शा।",
          "as": "বাটিত চাউলৰ ঘোল শান্ত হ্ৰদৰ দৰে। আনটোত তিল আৰু গুড়ৰ লাহে তৰ্ক। তাৱা গৰম; এটোপাল ঘোলে নাচি বহিল। ধোঁৱাই বেৰত এনে আখৰ লিখিলে যি শব্দ নহয়, ঘৰ। আইতাৰ হাতাৰ মুঠা বাকীতকৈ ডাঠ — বছৰৰ মানচিত্ৰ।"
        },
        "ask": {
          "en": "What batter waited in the bowl?",
          "hi": "कटोरे में कौन-सा घोल था?",
          "as": "বাটিত কি ঘোল আছিল?"
        },
        "options": [
          {
            "en": "Rice batter",
            "hi": "चावल का घोल",
            "as": "চাউলৰ ঘোল",
            "ok": true
          },
          {
            "en": "Cement mix",
            "hi": "सीमेंट",
            "as": "চিমেণ্ট",
            "ok": false
          },
          {
            "en": "Paint",
            "hi": "पेंट",
            "as": "ৰং",
            "ok": false
          }
        ],
        "hint": {
          "en": "Rice batter, like a quiet lake.",
          "hi": "चावल का घोल, शांत झील।",
          "as": "চাউলৰ ঘোল, শান্ত হ্ৰদ।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "She folded pitha on the tawa as if folding a letter that should not be read in a hurry. Sesame hid inside like a secret that wanted to be found by teeth, not by gossip. The neighbour knew from the smell before any message could walk over the wall.",
          "hi": "उन्होंने तवे पर पिठा ऐसा मोड़ा जैसे जल्दी न पढ़े जाने वाला पत्र। तिल अंदर राज़ की तरह, दाँतों से मिलना चाहता, गप से नहीं। पड़ोसिन ने दीवार से पहले महक से जान लिया।",
          "as": "তাই তাৱাত পিঠা এনেদৰে মুৰিলে যেন খৰকৈ পঢ়িব নালাগে চিঠি। তিল ভিতৰত গোপন কথা, দাঁতে বিচাৰিব, গপে নহয়। চুবুৰীয়াই বেৰৰ আগতে গোন্ধেৰে জানিলে।"
        },
        "ask": {
          "en": "What was being folded on the tawa?",
          "hi": "तवे पर क्या मुड़ा?",
          "as": "তাৱাত কি মুৰা হৈছিল?"
        },
        "options": [
          {
            "en": "Pitha",
            "hi": "पिठा",
            "as": "পিঠা",
            "ok": true
          },
          {
            "en": "A laptop lid",
            "hi": "लैपटॉप ढक्कन",
            "as": "লেপটপৰ ঢাকনি",
            "ok": false
          },
          {
            "en": "A raincoat",
            "hi": "रेनकोट",
            "as": "ৰেইনকোট",
            "ok": false
          }
        ],
        "hint": {
          "en": "Pitha, sesame inside.",
          "hi": "पिठा, अंदर तिल।",
          "as": "পিঠা, ভিতৰত তিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "Brown on both cheeks, soft inside, stuffed with sesame and jaggery, eaten while still speaking of heat. What got a tan on the tawa?",
          "hi": "दोनों गाल भूरे, अंदर नरम, तिल-गुड़ भरा, गरमी की बात करते खाया। तवे पर किसका रंग चढ़ा?",
          "as": "দুই গাল মুগা, ভিতৰ কোমল, তিল-গুড় ভৰা, গৰমৰ কথা কৈ খোৱা। তাৱাত কাৰ ৰং উঠিল?"
        },
        "ask": {
          "en": "What browned on the tawa?",
          "hi": "तवे पर क्या भूरा हुआ?",
          "as": "তাৱাত কি মুগা হ'ল?"
        },
        "options": [
          {
            "en": "Pitha",
            "hi": "पिठा",
            "as": "পিঠা",
            "ok": true
          },
          {
            "en": "A suitcase",
            "hi": "सूटकेस",
            "as": "চুটকেছ",
            "ok": false
          },
          {
            "en": "A stone",
            "hi": "पत्थर",
            "as": "শিল",
            "ok": false
          }
        ],
        "hint": {
          "en": "Pitha browned on both sides.",
          "hi": "पिठा दोनों तरफ़ भूरा।",
          "as": "পিঠা দুয়োফালে মুগা।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "My daughter kept count: seven done, two waiting, one sacrificed to the dog who sat with excellent manners. We wrapped two in paper for the night-watch uncle at the gate. He always asked, never demanded.",
          "hi": "बेटी गिनती रखती — सात हो गए, दो बाकी, एक कुत्ते को बलि, जो बड़ी अदब से बैठा। फाटक के रात वाले अंकल के लिए दो कागज़ में। वे माँगते नहीं, पूछते हैं।",
          "as": "জীয়েকে গণিছিল — সাত হ'ল, দুটা বাকী, এটা কুকুৰক, যি ভাল আদবত বহিছিল। দুৱাৰৰ ৰাতি চোৱা দদাৰ বাবে দুটা কাগজত। সিহঁতে খোজা নাই, সুধিছে।"
        },
        "ask": {
          "en": "Who kept the count?",
          "hi": "गिनती कौन रखती थी?",
          "as": "গণনা কোনে ৰাখিছিল?"
        },
        "options": [
          {
            "en": "My daughter",
            "hi": "मेरी बेटी",
            "as": "মোৰ জীয়েক",
            "ok": true
          },
          {
            "en": "The bank manager",
            "hi": "बैंक मैनेजर",
            "as": "বেংক মেনেজাৰ",
            "ok": false
          },
          {
            "en": "Traffic police",
            "hi": "ट्रैफिक पुलिस",
            "as": "ট্ৰাফিক আৰক্ষী",
            "ok": false
          }
        ],
        "hint": {
          "en": "My daughter counted the pitha.",
          "hi": "बेटी ने पिठा गिने।",
          "as": "জীয়েকে পিঠা গণিলে।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "Dal muttered in the pot because some winters still used wood when the cylinder was late. If the wood popped, grandmother said wait. I still wait when it pops. We ate with raw onion and mustard oil because some evenings ask for a sharp friend on the plate.",
          "hi": "दाल हांडी में बड़बड़ाई — सिलेंडर देर से तो सर्दी लकड़ी लेती। लकड़ी चटके तो दादी कहतीं ठहरो। अब भी चटके तो ठहरती हूँ। कच्चा प्याज और सरसों तेल — कुछ शामें थाली में तीखा दोस्त माँगती हैं।",
          "as": "দাইল হাঁড়িত বকবকাইছিল — চিলিণ্ডাৰ পলম হ'লে শীতে কাঠ লয়। কাঠ ফুটিলে আইতাই কৈছিল ৰ'বা। এতিয়াও ফুটিলে ৰওঁ। কেঁচা পিয়াজ আৰু সৰিয়হ তেল — কিছু গধূলিয়ে থালীত চোকা বন্ধু বিচাৰে।"
        },
        "ask": {
          "en": "What was muttering in the pot?",
          "hi": "हांडी में क्या बड़बड़ा रहा था?",
          "as": "হাঁড়িত কি বকবকাইছিল?"
        },
        "options": [
          {
            "en": "Dal",
            "hi": "दाल",
            "as": "দাইল",
            "ok": true
          },
          {
            "en": "A motorbike",
            "hi": "मोटरसाइकिल",
            "as": "মটৰচাইকেল",
            "ok": false
          },
          {
            "en": "A clock",
            "hi": "घड़ी",
            "as": "ঘড়ী",
            "ok": false
          }
        ],
        "hint": {
          "en": "Dal on the wood fire.",
          "hi": "लकड़ी पर दाल।",
          "as": "কাঠত দাইল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "It is not a pencil, yet it blackens the kitchen roof. What rose from the chulha?",
          "hi": "पेंसिल नहीं, रसोई की छत काली कर दे। चूल्हे से क्या उठा?",
          "as": "পেঞ্চিল নহয়, ৰান্ধনি ঘৰৰ চাল ক'লা কৰে। চুহ্লাৰ পৰা কি উঠিল?"
        },
        "ask": {
          "en": "What rose from the chulha?",
          "hi": "चूल्हे से क्या उठा?",
          "as": "চুহ্লাৰ পৰা কি উঠিল?"
        },
        "options": [
          {
            "en": "Smoke",
            "hi": "धुआँ",
            "as": "ধোঁৱা",
            "ok": true
          },
          {
            "en": "Snow",
            "hi": "बर्फ़",
            "as": "হিম",
            "ok": false
          },
          {
            "en": "Cotton candy",
            "hi": "गुलाबी मिठाई का बादल",
            "as": "তুলা মিঠা",
            "ok": false
          }
        ],
        "hint": {
          "en": "Smoke from the chulha.",
          "hi": "चूल्हे का धुआँ।",
          "as": "চুহ্লাৰ ধোঁৱা।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I saved the last of the well-water for tea. Some water deserves a ceremony. Jaggery stayed on my thumb. I did not wash it at once.",
          "hi": "आखिरी कुएँ का पानी चाय के लिए रखा। कुछ पानी रीत माँगता है। गुड़ अँगूठे पर रहा। तुरंत नहीं धोया।",
          "as": "নাদৰ শেষ পানী চাহৰ বাবে ৰাখিলোঁ। কিছু পানীয়ে ৰীতি বিচাৰে। গুড় আঙুলুত থাকিল। লগে নুধুলোঁ।"
        },
        "ask": {
          "en": "What stayed on the thumb?",
          "hi": "अँगूठे पर क्या रह गया?",
          "as": "আঙুলুত কি থাকিল?"
        },
        "options": [
          {
            "en": "Jaggery",
            "hi": "गुड़",
            "as": "গুড়",
            "ok": true
          },
          {
            "en": "Engine oil",
            "hi": "इंजन तेल",
            "as": "ইঞ্জিন তেল",
            "ok": false
          },
          {
            "en": "Chalk only",
            "hi": "केवल खड़िया",
            "as": "কেৱল খৰি",
            "ok": false
          }
        ],
        "hint": {
          "en": "Jaggery on the thumb.",
          "hi": "अँगूठे पर गुड़।",
          "as": "আঙুলুত গুড়।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "After, she banked the fire under ash the way you tuck a child who is not fully asleep. The house smelled of new grain and patience. We ate standing, because sitting would have been too slow.",
          "hi": "बाद में आग राख के नीचे दबाई, जैसे अधसोए बच्चे को कंबल। घर में नये अनाज और सब्र की महक। खड़े खाया, बैठना बहुत धीमा होता।",
          "as": "পাছত জুই ছাইৰ তলত থ'লে, যেন সম্পূৰ্ণ নুশুই থকা শिशुক কম্বল দিয়া। ঘৰত নতুন শস্য আৰু ধৈৰ্য্যৰ গোন্ধ। থিয় হৈ খালোঁ, বহা বৰ লাহে।"
        },
        "ask": {
          "en": "Where did the fire go after cooking?",
          "hi": "पकाने के बाद आग कहाँ गई?",
          "as": "ৰন্ধাৰ পাছত জুই ক'লৈ গ'ল?"
        },
        "options": [
          {
            "en": "Banked under ash",
            "hi": "राख के नीचे",
            "as": "ছাইৰ তলত",
            "ok": true
          },
          {
            "en": "Into the fridge",
            "hi": "फ्रिज में",
            "as": "ফ্ৰিজত",
            "ok": false
          },
          {
            "en": "Onto the roof as a kite",
            "hi": "पतंग बन छत पर",
            "as": "চিলনী হৈ চালত",
            "ok": false
          }
        ],
        "hint": {
          "en": "Banked under ash, still alive.",
          "hi": "राख के नीचे, ज़िंदा।",
          "as": "ছাইৰ তলত, জীয়া।"
        }
      }
    ]
  },
  {
    "id": "jorhat-haat",
    "title": {
      "en": "Thursday haat in Jorhat",
      "hi": "जोरहाट का गुरुवार हाट",
      "as": "যোৰহাটৰ বৃহস্পতি হাট"
    },
    "close": {
      "en": "The bag was heavy with greens. Home was close.",
      "hi": "थैला साग से भारी। घर पास था।",
      "as": "মোনা পাতেৰে গধুৰ। ঘৰ ওচৰ।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see monsoon rain as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में monsoon rain अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত monsoon rain এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "monsoon rain",
            "hi": "monsoon rain",
            "as": "monsoon rain",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held monsoon rain.",
          "hi": "याद में monsoon rain था।",
          "as": "মনত monsoon rain আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see black umbrella as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में black umbrella अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত black umbrella এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "black umbrella",
            "hi": "black umbrella",
            "as": "black umbrella",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held black umbrella.",
          "hi": "याद में black umbrella था।",
          "as": "মনত black umbrella আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see leafy greens as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में leafy greens अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত leafy greens এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "leafy greens",
            "hi": "leafy greens",
            "as": "leafy greens",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held leafy greens.",
          "hi": "याद में leafy greens था।",
          "as": "মনত leafy greens আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see fish stall as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में fish stall अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত fish stall এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "fish stall",
            "hi": "fish stall",
            "as": "fish stall",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held fish stall.",
          "hi": "याद में fish stall था।",
          "as": "মনত fish stall আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see coriander as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में coriander अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত coriander এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "coriander",
            "hi": "coriander",
            "as": "coriander",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held coriander.",
          "hi": "याद में coriander था।",
          "as": "মনত coriander আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see beans in the bag as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में beans in the bag अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত beans in the bag এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "beans in the bag",
            "hi": "beans in the bag",
            "as": "beans in the bag",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held beans in the bag.",
          "hi": "याद में beans in the bag था।",
          "as": "মনত beans in the bag আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see paper-wrapped fish as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में paper-wrapped fish अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত paper-wrapped fish এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "paper-wrapped fish",
            "hi": "paper-wrapped fish",
            "as": "paper-wrapped fish",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held paper-wrapped fish.",
          "hi": "याद में paper-wrapped fish था।",
          "as": "মনত paper-wrapped fish আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see bent spoke as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में bent spoke अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত bent spoke এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "bent spoke",
            "hi": "bent spoke",
            "as": "bent spoke",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held bent spoke.",
          "hi": "याद में bent spoke था।",
          "as": "মনত bent spoke আছিল।"
        }
      }
    ]
  },
  {
    "id": "tejimala",
    "title": {
      "en": "The girl the pond remembered",
      "hi": "तालाब की याद रखी लड़की",
      "as": "পুখুৰীয়ে মনত ৰখা ছোৱালী"
    },
    "close": {
      "en": "A lotus stood where unkindness had been. The pond kept her name.",
      "hi": "कठोरता की जगह कमल। तालाब ने नाम रखा।",
      "as": "নিষ্ঠুৰতাৰ ঠাইত পদুম। পুখুৰীয়ে নাম ৰাখিলে।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see pumpkin vine as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में pumpkin vine अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত pumpkin vine এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "pumpkin vine",
            "hi": "pumpkin vine",
            "as": "pumpkin vine",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held pumpkin vine.",
          "hi": "याद में pumpkin vine था।",
          "as": "মনত pumpkin vine আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see lotus in the pond as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में lotus in the pond अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত lotus in the pond এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "lotus in the pond",
            "hi": "lotus in the pond",
            "as": "lotus in the pond",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held lotus in the pond.",
          "hi": "याद में lotus in the pond था।",
          "as": "মনত lotus in the pond আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see unkind step-voice as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में unkind step-voice अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত unkind step-voice এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "unkind step-voice",
            "hi": "unkind step-voice",
            "as": "unkind step-voice",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held unkind step-voice.",
          "hi": "याद में unkind step-voice था।",
          "as": "মনত unkind step-voice আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see kind neighbour as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में kind neighbour अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত kind neighbour এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "kind neighbour",
            "hi": "kind neighbour",
            "as": "kind neighbour",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held kind neighbour.",
          "hi": "याद में kind neighbour था।",
          "as": "মনত kind neighbour আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see river dusk as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में river dusk अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত river dusk এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "river dusk",
            "hi": "river dusk",
            "as": "river dusk",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held river dusk.",
          "hi": "याद में river dusk था।",
          "as": "মনত river dusk আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see white flower as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में white flower अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত white flower এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "white flower",
            "hi": "white flower",
            "as": "white flower",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held white flower.",
          "hi": "याद में white flower था।",
          "as": "মনত white flower আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see girl’s name spoken softly as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में girl’s name spoken softly अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত girl’s name spoken softly এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "girl’s name spoken softly",
            "hi": "girl’s name spoken softly",
            "as": "girl’s name spoken softly",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held girl’s name spoken softly.",
          "hi": "याद में girl’s name spoken softly था।",
          "as": "মনত girl’s name spoken softly আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see still water as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में still water अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত still water এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "still water",
            "hi": "still water",
            "as": "still water",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held still water.",
          "hi": "याद में still water था।",
          "as": "মনত still water আছিল।"
        }
      }
    ]
  },
  {
    "id": "kaziranga-mist",
    "title": {
      "en": "Mist in Kaziranga",
      "hi": "काज़ीरंगा की धुंध",
      "as": "কাজিৰঙাৰ কুঁৱলী"
    },
    "close": {
      "en": "The rhino was a grey hill that breathed. We did not need a photograph.",
      "hi": "गैंडा साँस लेता भूरा पहाड़। फोटो की ज़रूरत न थी।",
      "as": "গেণ্ডা উশাহ লোৱা মুগা পাহাৰ। ফটোৰ প্ৰয়োজন নাছিল।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see elephant grass as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में elephant grass अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত elephant grass এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "elephant grass",
            "hi": "elephant grass",
            "as": "elephant grass",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held elephant grass.",
          "hi": "याद में elephant grass था।",
          "as": "মনত elephant grass আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see grey rhino as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में grey rhino अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত grey rhino এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "grey rhino",
            "hi": "grey rhino",
            "as": "grey rhino",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held grey rhino.",
          "hi": "याद में grey rhino था।",
          "as": "মনত grey rhino আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see jeep track as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में jeep track अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত jeep track এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "jeep track",
            "hi": "jeep track",
            "as": "jeep track",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held jeep track.",
          "hi": "याद में jeep track था।",
          "as": "মনত jeep track আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see deer flash as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में deer flash अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত deer flash এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "deer flash",
            "hi": "deer flash",
            "as": "deer flash",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held deer flash.",
          "hi": "याद में deer flash था।",
          "as": "মনত deer flash আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see bar-headed geese as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में bar-headed geese अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত bar-headed geese এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "bar-headed geese",
            "hi": "bar-headed geese",
            "as": "bar-headed geese",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held bar-headed geese.",
          "hi": "याद में bar-headed geese था।",
          "as": "মনত bar-headed geese আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see tea in a steel glass as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में tea in a steel glass अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত tea in a steel glass এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "tea in a steel glass",
            "hi": "tea in a steel glass",
            "as": "tea in a steel glass",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held tea in a steel glass.",
          "hi": "याद में tea in a steel glass था।",
          "as": "মনত tea in a steel glass আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see guide’s whisper as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में guide’s whisper अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত guide’s whisper এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "guide’s whisper",
            "hi": "guide’s whisper",
            "as": "guide’s whisper",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held guide’s whisper.",
          "hi": "याद में guide’s whisper था।",
          "as": "মনত guide’s whisper আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see mist tearing as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में mist tearing अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত mist tearing এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "mist tearing",
            "hi": "mist tearing",
            "as": "mist tearing",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held mist tearing.",
          "hi": "याद में mist tearing था।",
          "as": "মনত mist tearing আছিল।"
        }
      }
    ]
  },
  {
    "id": "magh-meji",
    "title": {
      "en": "The Magh Bihu meji",
      "hi": "माघ बिहू की मेजी",
      "as": "মাঘ বিহুৰ মেজি"
    },
    "close": {
      "en": "Morning found a ring of ash. The field had punctuated the year.",
      "hi": "सुबह राख का घेरा। खेत ने साल को विराम दिया।",
      "as": "ৰাতিপুৱা ছাইৰ ঘেৰা। পথাৰে বছৰক ৰখা দিলে।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see community fire as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में community fire अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত community fire এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "community fire",
            "hi": "community fire",
            "as": "community fire",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held community fire.",
          "hi": "याद में community fire था।",
          "as": "মনত community fire আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see urad pitha as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में urad pitha अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত urad pitha এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "urad pitha",
            "hi": "urad pitha",
            "as": "urad pitha",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held urad pitha.",
          "hi": "याद में urad pitha था।",
          "as": "মনত urad pitha আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see harvest thanks as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में harvest thanks अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত harvest thanks এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "harvest thanks",
            "hi": "harvest thanks",
            "as": "harvest thanks",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held harvest thanks.",
          "hi": "याद में harvest thanks था।",
          "as": "মনত harvest thanks আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see children’s long path as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में children’s long path अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত children’s long path এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "children’s long path",
            "hi": "children’s long path",
            "as": "children’s long path",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held children’s long path.",
          "hi": "याद में children’s long path था।",
          "as": "মনত children’s long path আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see ash ring as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में ash ring अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত ash ring এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "ash ring",
            "hi": "ash ring",
            "as": "ash ring",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held ash ring.",
          "hi": "याद में ash ring था।",
          "as": "মনত ash ring আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see smoky tea as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में smoky tea अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত smoky tea এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "smoky tea",
            "hi": "smoky tea",
            "as": "smoky tea",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held smoky tea.",
          "hi": "याद में smoky tea था।",
          "as": "মনত smoky tea আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see warm backs as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में warm backs अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত warm backs এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "warm backs",
            "hi": "warm backs",
            "as": "warm backs",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held warm backs.",
          "hi": "याद में warm backs था।",
          "as": "মনত warm backs আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see field at dawn as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में field at dawn अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত field at dawn এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "field at dawn",
            "hi": "field at dawn",
            "as": "field at dawn",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held field at dawn.",
          "hi": "याद में field at dawn था।",
          "as": "মনত field at dawn আছিল।"
        }
      }
    ]
  },
  {
    "id": "school-verandah",
    "title": {
      "en": "The school verandah",
      "hi": "स्कूल का बरामदा",
      "as": "স্কুলৰ বাৰাণ্ডা"
    },
    "close": {
      "en": "The verandah was smaller years later. The neem was taller.",
      "hi": "सालों बाद बरामदा छोटा। नीम लंबा।",
      "as": "বছৰৰ পাছত বাৰাণ্ডা সৰু। নিম ওখ।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see wet chalk as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में wet chalk अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত wet chalk এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "wet chalk",
            "hi": "wet chalk",
            "as": "wet chalk",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held wet chalk.",
          "hi": "याद में wet chalk था।",
          "as": "মনত wet chalk আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see white sari red border as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में white sari red border अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত white sari red border এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "white sari red border",
            "hi": "white sari red border",
            "as": "white sari red border",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held white sari red border.",
          "hi": "याद में white sari red border था।",
          "as": "মনত white sari red border আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see neem shade as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में neem shade अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত neem shade এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "neem shade",
            "hi": "neem shade",
            "as": "neem shade",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held neem shade.",
          "hi": "याद में neem shade था।",
          "as": "মনত neem shade আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see puffed rice tiffin as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में puffed rice tiffin अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত puffed rice tiffin এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "puffed rice tiffin",
            "hi": "puffed rice tiffin",
            "as": "puffed rice tiffin",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held puffed rice tiffin.",
          "hi": "याद में puffed rice tiffin था।",
          "as": "মনত puffed rice tiffin আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see school bell as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में school bell अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত school bell এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "school bell",
            "hi": "school bell",
            "as": "school bell",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held school bell.",
          "hi": "याद में school bell था।",
          "as": "মনত school bell আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see sour fruit as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में sour fruit अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত sour fruit এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "sour fruit",
            "hi": "sour fruit",
            "as": "sour fruit",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held sour fruit.",
          "hi": "याद में sour fruit था।",
          "as": "মনত sour fruit আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see taller neem as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में taller neem अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত taller neem এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "taller neem",
            "hi": "taller neem",
            "as": "taller neem",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held taller neem.",
          "hi": "याद में taller neem था।",
          "as": "মনত taller neem আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see smaller verandah as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में smaller verandah अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত smaller verandah এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "smaller verandah",
            "hi": "smaller verandah",
            "as": "smaller verandah",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held smaller verandah.",
          "hi": "याद में smaller verandah था।",
          "as": "মনত smaller verandah আছিল।"
        }
      }
    ]
  },
  {
    "id": "village-wedding",
    "title": {
      "en": "A wedding under turmeric cloth",
      "hi": "हल्दी कपड़े तले शादी",
      "as": "হালধি কাপোৰৰ তলত বিয়া"
    },
    "close": {
      "en": "Lights stayed in the field after the songs grew tired.",
      "hi": "गाने थके, खेत में रोशनी रही।",
      "as": "গান ভাগিল, পথাৰত পোহৰ থাকিল।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see turmeric tent as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में turmeric tent अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত turmeric tent এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "turmeric tent",
            "hi": "turmeric tent",
            "as": "turmeric tent",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held turmeric tent.",
          "hi": "याद में turmeric tent था।",
          "as": "মনত turmeric tent আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see paan circle as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में paan circle अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত paan circle এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "paan circle",
            "hi": "paan circle",
            "as": "paan circle",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held paan circle.",
          "hi": "याद में paan circle था।",
          "as": "মনত paan circle আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see banana leaf plate as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में banana leaf plate अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত banana leaf plate এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "banana leaf plate",
            "hi": "banana leaf plate",
            "as": "banana leaf plate",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held banana leaf plate.",
          "hi": "याद में banana leaf plate था।",
          "as": "মনত banana leaf plate আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see uncle dancing early as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में uncle dancing early अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত uncle dancing early এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "uncle dancing early",
            "hi": "uncle dancing early",
            "as": "uncle dancing early",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held uncle dancing early.",
          "hi": "याद में uncle dancing early था।",
          "as": "মনত uncle dancing early আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see lost almirah keys as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में lost almirah keys अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত lost almirah keys এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "lost almirah keys",
            "hi": "lost almirah keys",
            "as": "lost almirah keys",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held lost almirah keys.",
          "hi": "याद में lost almirah keys था।",
          "as": "মনত lost almirah keys আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see generator blink as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में generator blink अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত generator blink এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "generator blink",
            "hi": "generator blink",
            "as": "generator blink",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held generator blink.",
          "hi": "याद में generator blink था।",
          "as": "মনত generator blink আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see red bride as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में red bride अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত red bride এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "red bride",
            "hi": "red bride",
            "as": "red bride",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held red bride.",
          "hi": "याद में red bride था।",
          "as": "মনত red bride আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see dust of joy as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में dust of joy अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত dust of joy এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "dust of joy",
            "hi": "dust of joy",
            "as": "dust of joy",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held dust of joy.",
          "hi": "याद में dust of joy था।",
          "as": "মনত dust of joy আছিল।"
        }
      }
    ]
  },
  {
    "id": "fishing-brother",
    "title": {
      "en": "Fishing with my brother",
      "hi": "भाई के साथ मछली",
      "as": "ভাতৃৰ সৈতে মাছ"
    },
    "close": {
      "en": "We walked home with almost nothing, which is also a catch.",
      "hi": "खाली हाथ लौटे, वह भी पकड़ है।",
      "as": "প্ৰায় খালী হাতে ঘূৰিলোঁ, সেও ধৰা।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see pre-dawn knock as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में pre-dawn knock अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত pre-dawn knock এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "pre-dawn knock",
            "hi": "pre-dawn knock",
            "as": "pre-dawn knock",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held pre-dawn knock.",
          "hi": "याद में pre-dawn knock था।",
          "as": "মনত pre-dawn knock আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see bamboo rod as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में bamboo rod अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত bamboo rod এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "bamboo rod",
            "hi": "bamboo rod",
            "as": "bamboo rod",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held bamboo rod.",
          "hi": "याद में bamboo rod था।",
          "as": "মনত bamboo rod আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see mud bank as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में mud bank अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত mud bank এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "mud bank",
            "hi": "mud bank",
            "as": "mud bank",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held mud bank.",
          "hi": "याद में mud bank था।",
          "as": "মনত mud bank আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see kingfisher as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में kingfisher अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত kingfisher এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "kingfisher",
            "hi": "kingfisher",
            "as": "kingfisher",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held kingfisher.",
          "hi": "याद में kingfisher था।",
          "as": "মনত kingfisher আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see small silver fish as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में small silver fish अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত small silver fish এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "small silver fish",
            "hi": "small silver fish",
            "as": "small silver fish",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held small silver fish.",
          "hi": "याद में small silver fish था।",
          "as": "মনত small silver fish আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see let go as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में let go अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত let go এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "let go",
            "hi": "let go",
            "as": "let go",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held let go.",
          "hi": "याद में let go था।",
          "as": "মনত let go আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see tea on the way as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में tea on the way अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত tea on the way এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "tea on the way",
            "hi": "tea on the way",
            "as": "tea on the way",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held tea on the way.",
          "hi": "याद में tea on the way था।",
          "as": "মনত tea on the way আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see empty bag as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में empty bag अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত empty bag এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "empty bag",
            "hi": "empty bag",
            "as": "empty bag",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held empty bag.",
          "hi": "याद में empty bag था।",
          "as": "মনত empty bag আছিল।"
        }
      }
    ]
  },
  {
    "id": "winter-fog-lane",
    "title": {
      "en": "Winter fog on the lane",
      "hi": "गली का शीत कोहरा",
      "as": "পথৰ শীতৰ কুঁৱলী"
    },
    "close": {
      "en": "The sun tore a hole in the white. The lane found its shape.",
      "hi": "सूरज ने सफ़ेद में छेद किया। गली ने आकार याद किया।",
      "as": "ৰ'দে বगাত ফুটা কৰিলে। পথে আকৃতি পালে।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see white cloth fog as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में white cloth fog अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত white cloth fog এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "white cloth fog",
            "hi": "white cloth fog",
            "as": "white cloth fog",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held white cloth fog.",
          "hi": "याद में white cloth fog था।",
          "as": "মনত white cloth fog আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see thick shawl as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में thick shawl अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত thick shawl এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "thick shawl",
            "hi": "thick shawl",
            "as": "thick shawl",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held thick shawl.",
          "hi": "याद में thick shawl था।",
          "as": "মনত thick shawl আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see boiling milk as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में boiling milk अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত boiling milk এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "boiling milk",
            "hi": "boiling milk",
            "as": "boiling milk",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held boiling milk.",
          "hi": "याद में boiling milk था।",
          "as": "মনত boiling milk আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see soft van horn as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में soft van horn अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত soft van horn এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "soft van horn",
            "hi": "soft van horn",
            "as": "soft van horn",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held soft van horn.",
          "hi": "याद में soft van horn था।",
          "as": "মনত soft van horn আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see neighbour’s cough as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में neighbour’s cough अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত neighbour’s cough এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "neighbour’s cough",
            "hi": "neighbour’s cough",
            "as": "neighbour’s cough",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held neighbour’s cough.",
          "hi": "याद में neighbour’s cough था।",
          "as": "মনত neighbour’s cough আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see steel tea on the wall as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में steel tea on the wall अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত steel tea on the wall এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "steel tea on the wall",
            "hi": "steel tea on the wall",
            "as": "steel tea on the wall",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held steel tea on the wall.",
          "hi": "याद में steel tea on the wall था।",
          "as": "মনত steel tea on the wall আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see well returning as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में well returning अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত well returning এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "well returning",
            "hi": "well returning",
            "as": "well returning",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held well returning.",
          "hi": "याद में well returning था।",
          "as": "মনত well returning আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see ten o’clock sun as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में ten o’clock sun अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত ten o’clock sun এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "ten o’clock sun",
            "hi": "ten o’clock sun",
            "as": "ten o’clock sun",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held ten o’clock sun.",
          "hi": "याद में ten o’clock sun था।",
          "as": "মনত ten o’clock sun আছিল।"
        }
      }
    ]
  },
  {
    "id": "railway-guwahati",
    "title": {
      "en": "Sweaters for Guwahati",
      "hi": "गुवाहाटी के लिए स्वेटर",
      "as": "গুৱাহাটীলৈ চোৱেটাৰ"
    },
    "close": {
      "en": "We did not board. The whistle sat in the chest till home.",
      "hi": "हम चढ़े नहीं। सीटी छाती में घर तक रही।",
      "as": "আমি নুঠিলোঁ। হুইচেল বুকুতে ঘৰলৈ থাকিল।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see oranges on the platform as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में oranges on the platform अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত oranges on the platform এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "oranges on the platform",
            "hi": "oranges on the platform",
            "as": "oranges on the platform",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held oranges on the platform.",
          "hi": "याद में oranges on the platform था।",
          "as": "মনত oranges on the platform আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see steel trunk as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में steel trunk अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত steel trunk এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "steel trunk",
            "hi": "steel trunk",
            "as": "steel trunk",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held steel trunk.",
          "hi": "याद में steel trunk था।",
          "as": "মনত steel trunk আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see announcer as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में announcer अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত announcer এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "announcer",
            "hi": "announcer",
            "as": "announcer",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held announcer.",
          "hi": "याद में announcer था।",
          "as": "মনত announcer আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see paper-cup tea as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में paper-cup tea अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত paper-cup tea এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "paper-cup tea",
            "hi": "paper-cup tea",
            "as": "paper-cup tea",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held paper-cup tea.",
          "hi": "याद में paper-cup tea था।",
          "as": "মনত paper-cup tea আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see steel tiffin as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में steel tiffin अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত steel tiffin এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "steel tiffin",
            "hi": "steel tiffin",
            "as": "steel tiffin",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held steel tiffin.",
          "hi": "याद में steel tiffin था।",
          "as": "মনত steel tiffin আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see only seeing off as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में only seeing off अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত only seeing off এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "only seeing off",
            "hi": "only seeing off",
            "as": "only seeing off",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held only seeing off.",
          "hi": "याद में only seeing off था।",
          "as": "মনত only seeing off আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see whistle in the chest as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में whistle in the chest अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত whistle in the chest এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "whistle in the chest",
            "hi": "whistle in the chest",
            "as": "whistle in the chest",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held whistle in the chest.",
          "hi": "याद में whistle in the chest था।",
          "as": "মনত whistle in the chest আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see rickshaw home as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में rickshaw home अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত rickshaw home এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "rickshaw home",
            "hi": "rickshaw home",
            "as": "rickshaw home",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held rickshaw home.",
          "hi": "याद में rickshaw home था।",
          "as": "মনত rickshaw home আছিল।"
        }
      }
    ]
  },
  {
    "id": "asha-courtyard",
    "title": {
      "en": "Anita-ba’s bag",
      "hi": "अनिता-बा का थैला",
      "as": "অনিতা-বাৰ মোনা"
    },
    "close": {
      "en": "She left a tick on the card and a lighter house.",
      "hi": "कार्ड पर निशान, घर हल्का।",
      "as": "কাৰ্ডত চিন, ঘৰ পাতল।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see Anita-ba’s bag as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में Anita-ba’s bag अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত Anita-ba’s bag এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "Anita-ba’s bag",
            "hi": "Anita-ba’s bag",
            "as": "Anita-ba’s bag",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held Anita-ba’s bag.",
          "hi": "याद में Anita-ba’s bag था।",
          "as": "মনত Anita-ba’s bag আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see sleep and tea questions as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में sleep and tea questions अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত sleep and tea questions এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "sleep and tea questions",
            "hi": "sleep and tea questions",
            "as": "sleep and tea questions",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held sleep and tea questions.",
          "hi": "याद में sleep and tea questions था।",
          "as": "মনত sleep and tea questions আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see BP cuff as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में BP cuff अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত BP cuff এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "BP cuff",
            "hi": "BP cuff",
            "as": "BP cuff",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held BP cuff.",
          "hi": "याद में BP cuff था।",
          "as": "মনত BP cuff আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see refused biscuits as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में refused biscuits अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত refused biscuits এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "refused biscuits",
            "hi": "refused biscuits",
            "as": "refused biscuits",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held refused biscuits.",
          "hi": "याद में refused biscuits था।",
          "as": "মনত refused biscuits আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see card behind calendar as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में card behind calendar अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত card behind calendar এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "card behind calendar",
            "hi": "card behind calendar",
            "as": "card behind calendar",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held card behind calendar.",
          "hi": "याद में card behind calendar था।",
          "as": "মনত card behind calendar আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see walk before dusk as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में walk before dusk अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত walk before dusk এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "walk before dusk",
            "hi": "walk before dusk",
            "as": "walk before dusk",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held walk before dusk.",
          "hi": "याद में walk before dusk था।",
          "as": "মনত walk before dusk আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see courtyard glasses as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में courtyard glasses अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত courtyard glasses এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "courtyard glasses",
            "hi": "courtyard glasses",
            "as": "courtyard glasses",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held courtyard glasses.",
          "hi": "याद में courtyard glasses था।",
          "as": "মনত courtyard glasses আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see tick on the card as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में tick on the card अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত tick on the card এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "tick on the card",
            "hi": "tick on the card",
            "as": "tick on the card",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held tick on the card.",
          "hi": "याद में tick on the card था।",
          "as": "মনত tick on the card আছিল।"
        }
      }
    ]
  },
  {
    "id": "tamul-verandah",
    "title": {
      "en": "Tamul on the small plate",
      "hi": "छोटी थाली पर तामुल",
      "as": "সৰু থালীত তামোল"
    },
    "close": {
      "en": "The plate went back with stems. Talk stayed in the chairs.",
      "hi": "थाली डंठल संग लौटी। बात कुर्सियों में रही।",
      "as": "থালী ডোঙালৈ ঘূৰিল। কথা চকীত থাকিল।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see tamul plate as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में tamul plate अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত tamul plate এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "tamul plate",
            "hi": "tamul plate",
            "as": "tamul plate",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held tamul plate.",
          "hi": "याद में tamul plate था।",
          "as": "মনত tamul plate আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see folded leaf as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में folded leaf अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত folded leaf এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "folded leaf",
            "hi": "folded leaf",
            "as": "folded leaf",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held folded leaf.",
          "hi": "याद में folded leaf था।",
          "as": "মনত folded leaf আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see lime like a moon as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में lime like a moon अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত lime like a moon এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "lime like a moon",
            "hi": "lime like a moon",
            "as": "lime like a moon",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held lime like a moon.",
          "hi": "याद में lime like a moon था।",
          "as": "মনত lime like a moon আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see river road talk as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में river road talk अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত river road talk এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "river road talk",
            "hi": "river road talk",
            "as": "river road talk",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held river road talk.",
          "hi": "याद में river road talk था।",
          "as": "মনত river road talk আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see younger guest’s tea as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में younger guest’s tea अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত younger guest’s tea এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "younger guest’s tea",
            "hi": "younger guest’s tea",
            "as": "younger guest’s tea",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held younger guest’s tea.",
          "hi": "याद में younger guest’s tea था।",
          "as": "মনত younger guest’s tea আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see stems left as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में stems left अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত stems left এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "stems left",
            "hi": "stems left",
            "as": "stems left",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held stems left.",
          "hi": "याद में stems left था।",
          "as": "মনত stems left আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see both hands offering as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में both hands offering अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত both hands offering এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "both hands offering",
            "hi": "both hands offering",
            "as": "both hands offering",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held both hands offering.",
          "hi": "याद में both hands offering था।",
          "as": "মনত both hands offering আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see chairs keeping shape as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में chairs keeping shape अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত chairs keeping shape এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "chairs keeping shape",
            "hi": "chairs keeping shape",
            "as": "chairs keeping shape",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held chairs keeping shape.",
          "hi": "याद में chairs keeping shape था।",
          "as": "মনত chairs keeping shape আছিল।"
        }
      }
    ]
  },
  {
    "id": "clinic-bench",
    "title": {
      "en": "The wooden clinic bench",
      "hi": "क्लिनिक की लकड़ी बेंच",
      "as": "ক্লিনিকৰ কাঠৰ বেঞ্চ"
    },
    "close": {
      "en": "We came home with a slip and no new fear.",
      "hi": "पर्ची संग घर, नया डर नहीं।",
      "as": "চিঠি লৈ ঘৰ, নতুন ভয় নাই।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see wooden bench as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में wooden bench अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত wooden bench এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "wooden bench",
            "hi": "wooden bench",
            "as": "wooden bench",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held wooden bench.",
          "hi": "याद में wooden bench था।",
          "as": "মনত wooden bench আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see Rina filling form as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में Rina filling form अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত Rina filling form এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "Rina filling form",
            "hi": "Rina filling form",
            "as": "Rina filling form",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held Rina filling form.",
          "hi": "याद में Rina filling form था।",
          "as": "মনত Rina filling form আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see doctor speaking to me as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में doctor speaking to me अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত doctor speaking to me এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "doctor speaking to me",
            "hi": "doctor speaking to me",
            "as": "doctor speaking to me",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held doctor speaking to me.",
          "hi": "याद में doctor speaking to me था।",
          "as": "মনত doctor speaking to me আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see tea still tasting like tea as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में tea still tasting like tea अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত tea still tasting like tea এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "tea still tasting like tea",
            "hi": "tea still tasting like tea",
            "as": "tea still tasting like tea",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held tea still tasting like tea.",
          "hi": "याद में tea still tasting like tea था।",
          "as": "মনত tea still tasting like tea আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see tablet with dinner as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में tablet with dinner अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত tablet with dinner এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "tablet with dinner",
            "hi": "tablet with dinner",
            "as": "tablet with dinner",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held tablet with dinner.",
          "hi": "याद में tablet with dinner था।",
          "as": "মনত tablet with dinner আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see bananas at the gate as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में bananas at the gate अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত bananas at the gate এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "bananas at the gate",
            "hi": "bananas at the gate",
            "as": "bananas at the gate",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held bananas at the gate.",
          "hi": "याद में bananas at the gate था।",
          "as": "মনত bananas at the gate আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see fan arguing heat as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में fan arguing heat अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত fan arguing heat এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "fan arguing heat",
            "hi": "fan arguing heat",
            "as": "fan arguing heat",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held fan arguing heat.",
          "hi": "याद में fan arguing heat था।",
          "as": "মনত fan arguing heat আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see no new fear as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में no new fear अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত no new fear এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "no new fear",
            "hi": "no new fear",
            "as": "no new fear",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held no new fear.",
          "hi": "याद में no new fear था।",
          "as": "মনত no new fear আছিল।"
        }
      }
    ]
  },
  {
    "id": "radio-shelf",
    "title": {
      "en": "Evening radio",
      "hi": "शाम का रेडियो",
      "as": "গধূলিৰ ৰেডিঅ'"
    },
    "close": {
      "en": "News ended. Crickets took the broadcast.",
      "hi": "खबर थमी। झींगुर प्रसारण बने।",
      "as": "খবৰ শেষ। উই প্ৰসাৰণ হ'ল।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see wooden shelf radio as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में wooden shelf radio अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত wooden shelf radio এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "wooden shelf radio",
            "hi": "wooden shelf radio",
            "as": "wooden shelf radio",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held wooden shelf radio.",
          "hi": "याद में wooden shelf radio था।",
          "as": "মনত wooden shelf radio আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see knob like a person as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में knob like a person अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত knob like a person এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "knob like a person",
            "hi": "knob like a person",
            "as": "knob like a person",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held knob like a person.",
          "hi": "याद में knob like a person था।",
          "as": "মনত knob like a person আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see onion prices as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में onion prices अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত onion prices এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "onion prices",
            "hi": "onion prices",
            "as": "onion prices",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held onion prices.",
          "hi": "याद में onion prices था।",
          "as": "মনত onion prices আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see shelling peas as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में shelling peas अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত shelling peas এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "shelling peas",
            "hi": "shelling peas",
            "as": "shelling peas",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held shelling peas.",
          "hi": "याद में shelling peas था।",
          "as": "মনত shelling peas আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see power blink as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में power blink अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত power blink এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "power blink",
            "hi": "power blink",
            "as": "power blink",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held power blink.",
          "hi": "याद में power blink था।",
          "as": "মনত power blink আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see cricket commentary as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में cricket commentary अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত cricket commentary এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "cricket commentary",
            "hi": "cricket commentary",
            "as": "cricket commentary",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held cricket commentary.",
          "hi": "याद में cricket commentary था।",
          "as": "মনত cricket commentary আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see walls leaning in as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में walls leaning in अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত walls leaning in এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "walls leaning in",
            "hi": "walls leaning in",
            "as": "walls leaning in",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held walls leaning in.",
          "hi": "याद में walls leaning in था।",
          "as": "মনত walls leaning in আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see crickets after as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में crickets after अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত crickets after এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "crickets after",
            "hi": "crickets after",
            "as": "crickets after",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held crickets after.",
          "hi": "याद में crickets after था।",
          "as": "মনত crickets after আছিল।"
        }
      }
    ]
  },
  {
    "id": "neighbour-well",
    "title": {
      "en": "The neighbour’s well",
      "hi": "पड़ोस का कुआँ",
      "as": "চুবুৰীয়াৰ নাদ"
    },
    "close": {
      "en": "The last water was saved for tea.",
      "hi": "आखिरी पानी चाय के लिए।",
      "as": "শেষ পানী চাহৰ বাবে।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see sulking tap as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में sulking tap अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত sulking tap এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "sulking tap",
            "hi": "sulking tap",
            "as": "sulking tap",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held sulking tap.",
          "hi": "याद में sulking tap था।",
          "as": "মনত sulking tap আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see squeaking pulley as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में squeaking pulley अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত squeaking pulley এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "squeaking pulley",
            "hi": "squeaking pulley",
            "as": "squeaking pulley",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held squeaking pulley.",
          "hi": "याद में squeaking pulley था।",
          "as": "মনত squeaking pulley আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see news not coins as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में news not coins अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত news not coins এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "news not coins",
            "hi": "news not coins",
            "as": "news not coins",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held news not coins.",
          "hi": "याद में news not coins था।",
          "as": "মনত news not coins আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see colder water as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में colder water अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত colder water এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "colder water",
            "hi": "colder water",
            "as": "colder water",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held colder water.",
          "hi": "याद में colder water था।",
          "as": "মনত colder water আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see two buckets as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में two buckets अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত two buckets এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "two buckets",
            "hi": "two buckets",
            "as": "two buckets",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held two buckets.",
          "hi": "याद में two buckets था।",
          "as": "মনত two buckets আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see dog escort as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में dog escort अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত dog escort এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "dog escort",
            "hi": "dog escort",
            "as": "dog escort",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held dog escort.",
          "hi": "याद में dog escort था।",
          "as": "মনত dog escort আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see last for tea as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में last for tea अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত last for tea এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "last for tea",
            "hi": "last for tea",
            "as": "last for tea",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held last for tea.",
          "hi": "याद में last for tea था।",
          "as": "মনত last for tea আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see stone smell as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में stone smell अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত stone smell এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "stone smell",
            "hi": "stone smell",
            "as": "stone smell",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held stone smell.",
          "hi": "याद में stone smell था।",
          "as": "মনত stone smell আছিল।"
        }
      }
    ]
  },
  {
    "id": "tin-roof",
    "title": {
      "en": "Rain on tin",
      "hi": "टिन पर बारिश",
      "as": "টিনত বৰষুণ"
    },
    "close": {
      "en": "When it stopped the house sounded unplugged.",
      "hi": "रुकी तो घर अनप्लग लगा।",
      "as": "ৰখিলে ঘৰ আনপ্লাগ যেন।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see first drops like a mic test as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में first drops like a mic test अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত first drops like a mic test এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "first drops like a mic test",
            "hi": "first drops like a mic test",
            "as": "first drops like a mic test",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held first drops like a mic test.",
          "hi": "याद में first drops like a mic test था।",
          "as": "মনত first drops like a mic test আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see bed from the leak as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में bed from the leak अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত bed from the leak এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "bed from the leak",
            "hi": "bed from the leak",
            "as": "bed from the leak",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held bed from the leak.",
          "hi": "याद में bed from the leak था।",
          "as": "মনত bed from the leak আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see offended cat as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में offended cat अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত offended cat এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "offended cat",
            "hi": "offended cat",
            "as": "offended cat",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held offended cat.",
          "hi": "याद में offended cat था।",
          "as": "মনত offended cat আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see ginger tea as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में ginger tea अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত ginger tea এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "ginger tea",
            "hi": "ginger tea",
            "as": "ginger tea",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held ginger tea.",
          "hi": "याद में ginger tea था।",
          "as": "মনত ginger tea আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see Doom’s phone as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में Doom’s phone अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত Doom’s phone এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "Doom’s phone",
            "hi": "Doom’s phone",
            "as": "Doom’s phone",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held Doom’s phone.",
          "hi": "याद में Doom’s phone था।",
          "as": "মনত Doom’s phone আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see frogs in the drain as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में frogs in the drain अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত frogs in the drain এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "frogs in the drain",
            "hi": "frogs in the drain",
            "as": "frogs in the drain",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held frogs in the drain.",
          "hi": "याद में frogs in the drain था।",
          "as": "মনত frogs in the drain আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see bucket winning as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में bucket winning अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত bucket winning এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "bucket winning",
            "hi": "bucket winning",
            "as": "bucket winning",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held bucket winning.",
          "hi": "याद में bucket winning था।",
          "as": "মনত bucket winning আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see empty after rain as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में empty after rain अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত empty after rain এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "empty after rain",
            "hi": "empty after rain",
            "as": "empty after rain",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held empty after rain.",
          "hi": "याद में empty after rain था।",
          "as": "মনত empty after rain আছিল।"
        }
      }
    ]
  },
  {
    "id": "gamosa-nephew",
    "title": {
      "en": "A gamosa on a Tuesday",
      "hi": "मंगलवार का गामोसा",
      "as": "মঙলবাৰৰ গামোচা"
    },
    "close": {
      "en": "Folded on the high shelf, it still smelled of that sun.",
      "hi": "ऊपरी शेल्फ पर तह, उस धूप की महक।",
      "as": "ওপৰৰ তাকত মুৰা, সেই ৰ'দৰ গোন্ধ।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see folded red-border cloth as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में folded red-border cloth अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত folded red-border cloth এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "folded red-border cloth",
            "hi": "folded red-border cloth",
            "as": "folded red-border cloth",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held folded red-border cloth.",
          "hi": "याद में folded red-border cloth था।",
          "as": "মনত folded red-border cloth আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see nephew from town as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में nephew from town अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত nephew from town এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "nephew from town",
            "hi": "nephew from town",
            "as": "nephew from town",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held nephew from town.",
          "hi": "याद में nephew from town था।",
          "as": "মনত nephew from town আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see tea and biscuits as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में tea and biscuits अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত tea and biscuits এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "tea and biscuits",
            "hi": "tea and biscuits",
            "as": "tea and biscuits",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held tea and biscuits.",
          "hi": "याद में tea and biscuits था।",
          "as": "মনত tea and biscuits আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see Guwahati traffic as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में Guwahati traffic अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত Guwahati traffic এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "Guwahati traffic",
            "hi": "Guwahati traffic",
            "as": "Guwahati traffic",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held Guwahati traffic.",
          "hi": "याद में Guwahati traffic था।",
          "as": "মনত Guwahati traffic আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see high shelf as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में high shelf अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত high shelf এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "high shelf",
            "hi": "high shelf",
            "as": "high shelf",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held high shelf.",
          "hi": "याद में high shelf था।",
          "as": "মনত high shelf আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see awkward almost-hug as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में awkward almost-hug अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত awkward almost-hug এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "awkward almost-hug",
            "hi": "awkward almost-hug",
            "as": "awkward almost-hug",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held awkward almost-hug.",
          "hi": "याद में awkward almost-hug था।",
          "as": "মনত awkward almost-hug আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see Tuesday honour as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में Tuesday honour अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত Tuesday honour এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "Tuesday honour",
            "hi": "Tuesday honour",
            "as": "Tuesday honour",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held Tuesday honour.",
          "hi": "याद में Tuesday honour था।",
          "as": "মনত Tuesday honour আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see sun smell as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में sun smell अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত sun smell এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "sun smell",
            "hi": "sun smell",
            "as": "sun smell",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held sun smell.",
          "hi": "याद में sun smell था।",
          "as": "মনত sun smell আছিল।"
        }
      }
    ]
  },
  {
    "id": "rice-harvest",
    "title": {
      "en": "Gold that feeds a year",
      "hi": "सोना जो साल पाले",
      "as": "বছৰ পোহা সোণ"
    },
    "close": {
      "en": "The house smelled of new grain. Numbers felt like prayer.",
      "hi": "घर में नये अनाज। गिनती प्रार्थना जैसी।",
      "as": "ঘৰত নতুন শস্য। গণনা প্ৰাৰ্থনা।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see bent backs gold field as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में bent backs gold field अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত bent backs gold field এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "bent backs gold field",
            "hi": "bent backs gold field",
            "as": "bent backs gold field",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held bent backs gold field.",
          "hi": "याद में bent backs gold field था।",
          "as": "মনত bent backs gold field আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see mud as wage as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में mud as wage अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত mud as wage এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "mud as wage",
            "hi": "mud as wage",
            "as": "mud as wage",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held mud as wage.",
          "hi": "याद में mud as wage था।",
          "as": "মনত mud as wage আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see sickle flash as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में sickle flash अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত sickle flash এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "sickle flash",
            "hi": "sickle flash",
            "as": "sickle flash",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held sickle flash.",
          "hi": "याद में sickle flash था।",
          "as": "মনত sickle flash আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see noon under the cart as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में noon under the cart अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত noon under the cart এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "noon under the cart",
            "hi": "noon under the cart",
            "as": "noon under the cart",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held noon under the cart.",
          "hi": "याद में noon under the cart था।",
          "as": "মনত noon under the cart আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see bullock cart as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में bullock cart अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত bullock cart এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "bullock cart",
            "hi": "bullock cart",
            "as": "bullock cart",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held bullock cart.",
          "hi": "याद में bullock cart था।",
          "as": "মনত bullock cart আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see oil-tin measures as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में oil-tin measures अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত oil-tin measures এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "oil-tin measures",
            "hi": "oil-tin measures",
            "as": "oil-tin measures",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held oil-tin measures.",
          "hi": "याद में oil-tin measures था।",
          "as": "মনত oil-tin measures আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see sparrows’ plan as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में sparrows’ plan अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত sparrows’ plan এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "sparrows’ plan",
            "hi": "sparrows’ plan",
            "as": "sparrows’ plan",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held sparrows’ plan.",
          "hi": "याद में sparrows’ plan था।",
          "as": "মনত sparrows’ plan আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see shaved field as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में shaved field अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত shaved field এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "shaved field",
            "hi": "shaved field",
            "as": "shaved field",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held shaved field.",
          "hi": "याद में shaved field था।",
          "as": "মনত shaved field আছিল।"
        }
      }
    ]
  },
  {
    "id": "kerosene-lamp",
    "title": {
      "en": "The lamp behind the tins",
      "hi": "डिब्बों पीछे दिया",
      "as": "টিনৰ পিছত চাকি"
    },
    "close": {
      "en": "Current returned. Nobody hurried the lamp off.",
      "hi": "करंट आया। दिया कोई जल्दी न बुझाया।",
      "as": "কাৰেণ্ট আহিল। চাকি কোনেও খৰকৈ নুনুইলে।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see current leaving as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में current leaving अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত current leaving এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "current leaving",
            "hi": "current leaving",
            "as": "current leaving",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held current leaving.",
          "hi": "याद में current leaving था।",
          "as": "মনত current leaving আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see lamp behind tins as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में lamp behind tins अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত lamp behind tins এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "lamp behind tins",
            "hi": "lamp behind tins",
            "as": "lamp behind tins",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held lamp behind tins.",
          "hi": "याद में lamp behind tins था।",
          "as": "মনত lamp behind tins আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see soot moustache as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में soot moustache अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত soot moustache এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "soot moustache",
            "hi": "soot moustache",
            "as": "soot moustache",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held soot moustache.",
          "hi": "याद में soot moustache था।",
          "as": "মনত soot moustache আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see yellow circle as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में yellow circle अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত yellow circle এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "yellow circle",
            "hi": "yellow circle",
            "as": "yellow circle",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held yellow circle.",
          "hi": "याद में yellow circle था।",
          "as": "মনত yellow circle আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see moth poems as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में moth poems अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত moth poems এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "moth poems",
            "hi": "moth poems",
            "as": "moth poems",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held moth poems.",
          "hi": "याद में moth poems था।",
          "as": "মনত moth poems আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see slow repeated story as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में slow repeated story अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত slow repeated story এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "slow repeated story",
            "hi": "slow repeated story",
            "as": "slow repeated story",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held slow repeated story.",
          "hi": "याद में slow repeated story था।",
          "as": "মনত slow repeated story আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see newspaper wipe as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में newspaper wipe अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত newspaper wipe এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "newspaper wipe",
            "hi": "newspaper wipe",
            "as": "newspaper wipe",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held newspaper wipe.",
          "hi": "याद में newspaper wipe था।",
          "as": "মনত newspaper wipe আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see slow goodbye as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में slow goodbye अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত slow goodbye এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "slow goodbye",
            "hi": "slow goodbye",
            "as": "slow goodbye",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held slow goodbye.",
          "hi": "याद में slow goodbye था।",
          "as": "মনত slow goodbye আছিল।"
        }
      }
    ]
  },
  {
    "id": "weaver-river",
    "title": {
      "en": "The weaver and the river",
      "hi": "जुलाहा और नदी",
      "as": "তাঁতী আৰु নদী"
    },
    "close": {
      "en": "Cloth held water-light. That was enough pattern.",
      "hi": "कपड़े में पानी की रोशनी। बस वही बेल।",
      "as": "কাপোৰত পানীৰ পোহৰ। সেই গোটেই ফুল।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see loom by the window as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में loom by the window अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত loom by the window এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "loom by the window",
            "hi": "loom by the window",
            "as": "loom by the window",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held loom by the window.",
          "hi": "याद में loom by the window था।",
          "as": "মনত loom by the window আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see thread the colour of dusk as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में thread the colour of dusk अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত thread the colour of dusk এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "thread the colour of dusk",
            "hi": "thread the colour of dusk",
            "as": "thread the colour of dusk",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held thread the colour of dusk.",
          "hi": "याद में thread the colour of dusk था।",
          "as": "মনত thread the colour of dusk আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see river in the cloth as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में river in the cloth अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত river in the cloth এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "river in the cloth",
            "hi": "river in the cloth",
            "as": "river in the cloth",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held river in the cloth.",
          "hi": "याद में river in the cloth था।",
          "as": "মনত river in the cloth আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see shuttle click as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में shuttle click अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত shuttle click এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "shuttle click",
            "hi": "shuttle click",
            "as": "shuttle click",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held shuttle click.",
          "hi": "याद में shuttle click था।",
          "as": "মনত shuttle click আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see fish motif as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में fish motif अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত fish motif এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "fish motif",
            "hi": "fish motif",
            "as": "fish motif",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held fish motif.",
          "hi": "याद में fish motif था।",
          "as": "মনত fish motif আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see gift for a guest as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में gift for a guest अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত gift for a guest এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "gift for a guest",
            "hi": "gift for a guest",
            "as": "gift for a guest",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held gift for a guest.",
          "hi": "याद में gift for a guest था।",
          "as": "মনত gift for a guest আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see water-light as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में water-light अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত water-light এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "water-light",
            "hi": "water-light",
            "as": "water-light",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held water-light.",
          "hi": "याद में water-light था।",
          "as": "মনত water-light আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see pattern enough as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में pattern enough अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত pattern enough এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "pattern enough",
            "hi": "pattern enough",
            "as": "pattern enough",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held pattern enough.",
          "hi": "याद में pattern enough था।",
          "as": "মনত pattern enough আছিল।"
        }
      }
    ]
  },
  {
    "id": "tortoise-jackal",
    "title": {
      "en": "The tortoise who would not hurry",
      "hi": "कछुआ जो जल्दी न करे",
      "as": "কচ্ছপ যি নখৰকে"
    },
    "close": {
      "en": "The jackal went hungry for haste. The tortoise ate at dusk.",
      "hi": "गीदड़ जल्दी से भूखा। कछुआ शाम को खाया।",
      "as": "শিয়াল খৰত ভোকাতুৰ। কচ্ছপে গধূলিত খালে।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see slow tortoise as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में slow tortoise अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত slow tortoise এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "slow tortoise",
            "hi": "slow tortoise",
            "as": "slow tortoise",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held slow tortoise.",
          "hi": "याद में slow tortoise था।",
          "as": "মনত slow tortoise আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see hurrying jackal as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में hurrying jackal अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত hurrying jackal এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "hurrying jackal",
            "hi": "hurrying jackal",
            "as": "hurrying jackal",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held hurrying jackal.",
          "hi": "याद में hurrying jackal था।",
          "as": "মনত hurrying jackal আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see mango on the path as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में mango on the path अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত mango on the path এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "mango on the path",
            "hi": "mango on the path",
            "as": "mango on the path",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held mango on the path.",
          "hi": "याद में mango on the path था।",
          "as": "মনত mango on the path আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see waited shade as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में waited shade अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত waited shade এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "waited shade",
            "hi": "waited shade",
            "as": "waited shade",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held waited shade.",
          "hi": "याद में waited shade था।",
          "as": "মনত waited shade আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see jackal empty-handed as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में jackal empty-handed अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত jackal empty-handed এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "jackal empty-handed",
            "hi": "jackal empty-handed",
            "as": "jackal empty-handed",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held jackal empty-handed.",
          "hi": "याद में jackal empty-handed था।",
          "as": "মনত jackal empty-handed আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see dusk meal as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में dusk meal अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত dusk meal এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "dusk meal",
            "hi": "dusk meal",
            "as": "dusk meal",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held dusk meal.",
          "hi": "याद में dusk meal था।",
          "as": "মনত dusk meal আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see kind slowness as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में kind slowness अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত kind slowness এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "kind slowness",
            "hi": "kind slowness",
            "as": "kind slowness",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held kind slowness.",
          "hi": "याद में kind slowness था।",
          "as": "মনত kind slowness আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see forest listening as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में forest listening अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত forest listening এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "forest listening",
            "hi": "forest listening",
            "as": "forest listening",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held forest listening.",
          "hi": "याद में forest listening था।",
          "as": "মনত forest listening আছিল।"
        }
      }
    ]
  },
  {
    "id": "star-pitha-girl",
    "title": {
      "en": "The girl who carried a star",
      "hi": "सितारा लिए लड़की",
      "as": "তৰা কঢ়িয়াই নিয়া ছোৱালী"
    },
    "close": {
      "en": "The star became jaggery in a pitha. She fed the hungry first.",
      "hi": "सितारा पिठा में गुड़ बना। पहले भूखे को खिलाया।",
      "as": "তৰা পিঠাত গুড় হ'ল। প্ৰথমে ভোকাতুৰক খুৱালে।"
    },
    "beats": [
      {
        "kind": "memory",
        "say": {
          "en": "I still see star in a clay bowl as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में star in a clay bowl अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত star in a clay bowl এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "star in a clay bowl",
            "hi": "star in a clay bowl",
            "as": "star in a clay bowl",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held star in a clay bowl.",
          "hi": "याद में star in a clay bowl था।",
          "as": "মনত star in a clay bowl আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see ashes of a hard house as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में ashes of a hard house अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত ashes of a hard house এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "ashes of a hard house",
            "hi": "ashes of a hard house",
            "as": "ashes of a hard house",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held ashes of a hard house.",
          "hi": "याद में ashes of a hard house था।",
          "as": "মনত ashes of a hard house আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see pitha for a hungry aunt as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में pitha for a hungry aunt अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত pitha for a hungry aunt এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "pitha for a hungry aunt",
            "hi": "pitha for a hungry aunt",
            "as": "pitha for a hungry aunt",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held pitha for a hungry aunt.",
          "hi": "याद में pitha for a hungry aunt था।",
          "as": "মনত pitha for a hungry aunt আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see no glass slipper as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में no glass slipper अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত no glass slipper এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "no glass slipper",
            "hi": "no glass slipper",
            "as": "no glass slipper",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held no glass slipper.",
          "hi": "याद में no glass slipper था।",
          "as": "মনত no glass slipper আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see jaggery star as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में jaggery star अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত jaggery star এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "jaggery star",
            "hi": "jaggery star",
            "as": "jaggery star",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held jaggery star.",
          "hi": "याद में jaggery star था।",
          "as": "মনত jaggery star আছিল।"
        }
      },
      {
        "kind": "riddle",
        "say": {
          "en": "I still see kind kitchen as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में kind kitchen अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত kind kitchen এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "kind kitchen",
            "hi": "kind kitchen",
            "as": "kind kitchen",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held kind kitchen.",
          "hi": "याद में kind kitchen था।",
          "as": "মনত kind kitchen আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see shared plate as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में shared plate अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত shared plate এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "shared plate",
            "hi": "shared plate",
            "as": "shared plate",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held shared plate.",
          "hi": "याद में shared plate था।",
          "as": "মনত shared plate আছিল।"
        }
      },
      {
        "kind": "memory",
        "say": {
          "en": "I still see morning without cruelty as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
          "hi": "उस घंटे में morning without cruelty अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
          "as": "সেই ঘণ্টাত morning without cruelty এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।"
        },
        "ask": {
          "en": "What belongs to this memory?",
          "hi": "इस याद में क्या है?",
          "as": "এই মনত কি আছে?"
        },
        "options": [
          {
            "en": "morning without cruelty",
            "hi": "morning without cruelty",
            "as": "morning without cruelty",
            "ok": true
          },
          {
            "en": "A parking ticket from a mall",
            "hi": "मॉल की पार्किंग पर्ची",
            "as": "মলৰ পাৰ্কিং টিকট",
            "ok": false
          },
          {
            "en": "A snowmobile",
            "hi": "स्नोमोबाइल",
            "as": "স্নোমোবাইল",
            "ok": false
          }
        ],
        "hint": {
          "en": "It held morning without cruelty.",
          "hi": "याद में morning without cruelty था।",
          "as": "মনত morning without cruelty আছিল।"
        }
      }
    ]
  }
];

export const STORY_COUNT = STORY_SCENARIOS.length;

export function pickStory() {
  let last = '';
  try { last = localStorage.getItem(LAST_KEY) || ''; } catch { last = ''; }
  const pool = STORY_SCENARIOS.filter((item) => item.id !== last);
  const next = pool[Math.floor(Math.random() * pool.length)] || STORY_SCENARIOS[0];
  try { localStorage.setItem(LAST_KEY, next.id); } catch { /* ignore */ }
  return next;
}
