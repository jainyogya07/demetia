#!/usr/bin/env python3
"""Generate src/data/storyScenarios.js — 25 long-form NER/folk memory stories."""
from pathlib import Path
import json

def T(en, hi, as_):
    return {"en": en, "hi": hi, "as": as_}

def opt(en, hi, as_, ok=False):
    return {"en": en, "hi": hi, "as": as_, "ok": ok}

def beat(kind, say, ask, options, hint):
    return {"kind": kind, "say": say, "ask": ask, "options": options, "hint": hint}

def story(sid, title, close, beats):
    return {"id": sid, "title": title, "close": close, "beats": beats}

STORIES = []

# 1 Tea garden
STORIES.append(story(
    "tea-garden-dawn",
    T("Dew in the tea garden", "चाय बागान की ओस", "চাহ বাৰীৰ শিচিৰ"),
    T("The baskets went down the slope. The dew had already paid us.",
      "टोकरियाँ ढलान से उतर गईं। ओस पहले ही मजदूरी दे चुकी थी।",
      "পাচিবোৰ ঢালেদি নামিল। শিচিৰেই আমাক মজুৰী দিলে।"),
    [
        beat("memory",
            T("Before the sun had cleared the tea bushes, the garden was already a wet green sea. Dew clung to my ankles like cold glass bangles. A hornbill called once from the shade tree, then went quiet, as if it too was waiting for the first leaf. I still remember the smell — crushed two-leaves-and-a-bud, wet earth, and the iron breath of the factory chimney far down the slope.",
              "सूरज चाय की झाड़ियों से ऊपर आने से पहले बागान गीला हरा समुद्र था। ओस टखनों पर ठंडी कांच की चूड़ियों जैसी चिपक गई। छाँव के पेड़ से हॉर्नबिल एक बार बोला, फिर चुप — जैसे वह भी पहली पत्ती का इंतज़ार कर रहा हो। महक अब भी है — दो पत्ती एक कली, गीली मिट्टी, और नीचे कारखाने की चिमन की लोहे जैसी साँस।",
              "সূৰ্যই চাহ গছৰ ওপৰলৈ উঠাৰ আগতেই বাগিচাখন তিতা সেউজীয়া সাগৰ আছিল। শিচিৰে মোৰ ডিঙিৰ দৰে ঠাণ্ডা কাঁচৰ বালাৰ দৰে ভৰিৰ গাঁঠিত লাগি থাকিল। ছাঁৰ গছৰ পৰা হৰ্ণবিলে এবাৰ মাতিলে, তাৰ পাছত নিমাত — যেন সিও প্ৰথম পাতৰ বাবে অপেক্ষা কৰি আছে। গোন্ধটো এতিয়াও মনত আছে — দুখিলা-এটা-কলি, তিতা মাটি, আৰু তলৰ কাৰখানাৰ চিমনিৰ লোহাৰ উশাহ।"),
            T("What clung to the ankles at dawn?", "भोर में टखनों पर क्या चिपक गया?", "পুৱাতে ভৰিৰ গাঁঠিত কি লাগিছিল?"),
            [opt("Dew, like cold glass", "ओस, ठंडी कांच जैसी", "শিচিৰ, ঠাণ্ডা কাঁচৰ দৰে", True),
             opt("Engine oil", "इंजन तेल", "ইঞ্জিন তেল"),
             opt("River sand only", "केवल नदी की रेत", "কেৱল নদীৰ বালি")],
            T("Dew on the ankles, before the sun cleared the bushes.", "झाड़ियों से पहले टखनों पर ओस।", "গছৰ আগতে ভৰিৰ গাঁঠিত শিচিৰ।")),
        beat("memory",
            T("My sister walked ahead with a gamosa tied at her waist, red border bright as a wound of joy. The pluckers' baskets bumped softly against the leaves. We were not rich. We were early. The dew was our first wage, and nobody wrote it in a ledger.",
              "बहन कमर पर गामोसा बाँधे आगे चली, लाल किनारी खुशी के घाव जैसी चमकीली। तोड़ने वालों की टोकरियाँ पत्तों से धीरे टकराती रहीं। हम अमीर नहीं थे। हम जल्दी थे। ओस पहली मजदूरी थी, और किसी बही में नहीं लिखी गई।",
              "ভনীয়েক কঁকালত গামোচা বান্ধি আগে আগে গ'ল, ৰঙা কাষ সুখৰ ঘাঁৰ দৰে জিলিকিছিল। তোলাসকলৰ পাচিবোৰে পাতত লাহি লাহি খুন্দা মাৰিছিল। আমি ধনী নাছিলোঁ। আমি আগতীয়া আছিলোঁ। শিচিৰেই আমাৰ প্ৰথম মজুৰী, আৰু কাৰো বহীত নিলিখা।"),
            T("What cloth was tied at her waist?", "कमर पर कौन-सा कपड़ा बँधा था?", "কঁকালত কোন কাপোৰ বন্ধা আছিল?"),
            [opt("A gamosa", "गामोसा", "গামোচা", True),
             opt("A raincoat", "रेनकोट", "ৰেইনকোট"),
             opt("A school tie", "स्कूल की टाई", "স্কুলৰ টাই")],
            T("A gamosa at the waist, red border bright.", "कमर पर गामोसा, लाल किनारी।", "কঁকালত গামোচা, ৰঙা কাষ।")),
        beat("riddle",
            T("The overseer did not shout. He only lifted two fingers and a bud — the oldest grammar of this garden. Anyone who has stood between the rows knows what those three green things mean when the basket is still light.",
              "निरीक्षक चिल्लाया नहीं। केवल दो उंगलियाँ और एक कली उठाई — इस बागान का सबसे पुराना व्याकरण। पंक्तियों के बीच खड़ा कोई जानता है, टोकरी हल्की हो तो वे तीन हरी चीजें क्या कहती हैं।",
              "অভাৰচিয়াৰে চিঞৰা নাছিল। কেৱল দুই আঙুলি আৰু এটা কলি তুলিছিল — এই বাগিচাৰ আটাইতকৈ পুৰণি ব্যাকৰণ। শাৰীৰ মাজত থিয় হোৱা কোনোবাই জানে, পাচিখন যেতিয়া পাতল, সেই তিনিটা সেউজীয়া বস্তুৱে কি কয়।"),
            T("What is the garden’s oldest measure of a good pluck?", "अच्छी तोड़ाई का सबसे पुराना नाप क्या है?", "ভাল তোলাৰ আটাইতকৈ পুৰণি মাপ কি?"),
            [opt("Two leaves and a bud", "दो पत्ती और एक कली", "দুখিলা আৰু এটা কলি", True),
             opt("A full coconut", "पूरा नारियल", "গোটেই নাৰিকল"),
             opt("A steel thali", "स्टील थाली", "ষ্টীল থালী")],
            T("Two leaves and a bud — the garden’s grammar.", "दो पत्ती एक कली — बागान का व्याकरण।", "দুখিলা-এটা-কলি — বাগিচাৰ ব্যাকৰণ।")),
        beat("memory",
            T("At the weighing shed the clerk wrote numbers as if they were weather. A woman laughed because her basket had come out heavier than her worry. Someone passed a steel glass of black tea that tasted of smoke on purpose, and the morning finally agreed to be a morning.",
              "तौल शेड में बाबू ने अंक मौसम की तरह लिखे। एक औरत हँसी क्योंकि टोकरी उसकी चिंता से भारी निकली। किसी ने जानबूझकर धुएँ वाली काली चाय का स्टील गिलास बढ़ाया, और सुबह आखिर सुबह मान गई।",
              "ওজন ঘৰত বাবুয়ে সংখ্যাবোৰ বতৰৰ দৰে লিখিলে। এগৰাকী তিৰোতাই হাঁহিলে কাৰণ পাচিখন তাইৰ চিন্তাতকৈ গধুৰ ওলাল। কোনোবাই জানি-বুজি ধোঁৱাৰ সোৱাদ থকা ক'লা চাহৰ ষ্টীল গিলাচ আগবঢ়ালে, আৰু ৰাতিপুৱাই অৱশেষত ৰাতিপুৱা হ'বলৈ মান্তি হ'ল।"),
            T("What was passed around in a steel glass?", "स्टील गिलास में क्या घूमा?", "ষ্টীল গিলাচত কি ঘূৰিছিল?"),
            [opt("Black tea that tasted of smoke", "धुएँ वाली काली चाय", "ধোঁৱাৰ সোৱাদ থকা ক'লা চাহ", True),
             opt("Iced soda", "बर्फ़ सोडा", "বৰফ চ'ডা"),
             opt("Milk from a carton ad", "कार्टन वाले दूध का विज्ञापन", "কাৰ্টনৰ গাখীৰৰ বিজ্ঞাপন")],
            T("Black tea, smoky on purpose.", "काली चाय, जानबूझकर धुएँ वाली।", "ক'লা চাহ, জানি-বুজি ধোঁৱাৰ।")),
        beat("memory",
            T("I kept one tender leaf in my palm until it warmed, then let it go. Children do that when they want the garden to notice them. My mother said, without looking up from her row, that the bush would forgive a stolen greeting.",
              "मैंने एक कोमल पत्ती हथेली में तब तक रखी जब तक गुनगुनी न हो, फिर छोड़ दी। बच्चे ऐसा करते हैं जब चाहते हैं बागान उन्हें देखे। माँ ने पंक्ति से आँख उठाए बिना कहा, झाड़ी चोरी की नमस्कार माफ़ कर देगी।",
              "মই এপাত কোমল পাত হাতৰ তলুৱাত গৰম নোহোৱালৈকে ৰাখিলোঁ, তাৰ পাছত এৰি দিলোঁ। ল'ৰা-ছোৱালীয়ে তেনেকুৱা কৰে যেতিয়া বাগিচাখনে সিহঁতক চোৱাটো বিচাৰে। মায়ে শাৰীৰ পৰা চকু নুতোৱাকৈ ক'লে, গছজোপাই চোৰাই নিয়া নমস্কাৰ ক্ষমা কৰিব।"),
            T("What did I warm in my palm?", "हथेली में क्या गुनगुना किया?", "হাতৰ তলুৱাত কি গৰম কৰিলোঁ?"),
            [opt("A tender tea leaf", "एक कोमल चाय पत्ती", "এপাত কোমল চাহ পাত", True),
             opt("A mobile phone", "मोबाइल फोन", "ম'বাইল ফোন"),
             opt("A railway ticket", "रेल टिकट", "ৰেল টিকট")],
            T("A tender leaf, then let go.", "कोमल पत्ती, फिर छोड़ दी।", "কোমল পাত, তাৰ পাছত এৰি দিলোঁ।")),
        beat("riddle",
            T("It is not a river, yet it has banks of green. It is not a school, yet it teaches the hand the same three letters every dawn. What were we walking through while the hornbill kept our secret?",
              "नदी नहीं, फिर भी हरे किनारे हैं। स्कूल नहीं, फिर भी हर भोर हाथ को तीन अक्षर सिखाती है। हॉर्नबिल जब राज़ रखे, हम किसमें चल रहे थे?",
              "নদী নহয়, তথাপি সেউজীয়া পাৰ আছে। বিদ্যালয় নহয়, তথাপি প্ৰতি পুৱা হাতক তিনিটা আখৰ শিকায়। হৰ্ণবিলে যেতিয়া গোপন কথা ৰাখিছিল, আমি কিৰ মাজেৰে খোজ কাঢ়িছিলোঁ?"),
            T("Where were we walking?", "हम कहाँ चल रहे थे?", "আমি ক'ত খোজ কাঢ়িছিলোঁ?"),
            [opt("A tea garden", "चाय बागान", "চাহ বাৰী", True),
             opt("A cinema hall", "सिनेमा हॉल", "চিনেমা হল"),
             opt("An airport lounge", "एयरपोर्ट लाउंज", "বিমানবন্দৰৰ লাউঞ্জ")],
            T("Between the tea rows.", "चाय की पंक्तियों के बीच।", "চাহৰ শাৰীৰ মাজত।")),
        beat("memory",
            T("By nine the sun had a sharp edge. We sat under the shade tree and ate puffed rice from a newspaper that still talked of a cricket match in Guwahati. Ants arrived like a small committee. Nobody shooed them. The garden had enough for committees.",
              "नौ बजे सूरज की धार तेज़ थी। छाँव के पेड़ तले बैठे, गुवाहाटी क्रिकेट की खबर वाले अखबार में मुरमुरा खाया। चींटियाँ छोटी कमेटी बनकर आईं। किसी ने नहीं हटाया। बागान में कमेटियों के लिए काफी था।",
              "নটাৰ সময়ত ৰ'দৰ ধাৰ চোকা আছিল। ছাঁৰ গছৰ তলত বহি গুৱাহাটীৰ ক্ৰিকেটৰ খবৰ থকা বাতৰি কাকতত মুৰমুৰা খালোঁ। পৰুৱাবোৰ সৰু সমিতিৰ দৰে আহিল। কাও নখেদিলে। বাগিচাত সমিতিৰ বাবে যথেষ্ট আছিল।"),
            T("What did we eat under the shade tree?", "छाँव के पेड़ तले क्या खाया?", "ছাঁৰ গছৰ তলত কি খালোঁ?"),
            [opt("Puffed rice from newspaper", "अखबार में मुरमुरा", "বাতৰি কাকতত মুৰমুৰা", True),
             opt("Ice cream cups", "आइसक्रीम कप", "আইচক্ৰীম কাপ"),
             opt("Airport sandwiches", "एयरपोर्ट सैंडविच", "বিমানবন্দৰৰ চেণ্ডউইচ")],
            T("Puffed rice, cricket news underneath.", "मुरमुरा, नीचे क्रिकेट की खबर।", "মুৰমুৰা, তলত ক্ৰিকেটৰ খবৰ।")),
        beat("memory",
            T("When we walked home the factory whistle wrote a line across the air. My sister untied the gamosa and wiped my forehead as if I were still a child, which, in that garden, I was. The dew had dried. The wage remained.",
              "घर जाते कारखाने की सीटी हवा पर एक पंक्ति लिख गई। बहन ने गामोसा खोल माथे पोंछा जैसे मैं अब भी बच्चा हूँ — और उस बागान में था भी। ओस सूख गई। मजदूरी रह गई।",
              "ঘৰলৈ যাওঁতে কাৰখানাৰ চিঞৰিয়ে বতাহত এশাৰী লিখি থৈ গ'ল। ভনীয়েকে গামোচা খুলি মোৰ কপাল মচিলে যেন মই এতিয়াও শিশু — আৰু সেই বাগিচাত আছিলোঁও। শিচিৰ শুকাই গ'ল। মজুৰী থাকিল।"),
            T("What wrote a line across the air as we went home?", "घर जाते हवा पर पंक्ति किसने लिखी?", "ঘৰলৈ যাওঁতে বতাহত শাৰী কোনোৱে লিখিলে?"),
            [opt("The factory whistle", "कारखाने की सीटी", "কাৰখানাৰ চিঞৰি", True),
             opt("A jet plane", "जेट विमान", "জেট বিমান"),
             opt("A temple bell in a mall", "मॉल की मंदिर घंटी", "মলৰ মন্দিৰ ঘণ্টা")],
            T("The factory whistle, then home.", "कारखाने की सीटी, फिर घर।", "কাৰখানাৰ চিঞৰি, তাৰ পাছত ঘৰ।")),
    ],
))

# 2 Bihu courtyard
STORIES.append(story(
    "bihu-courtyard",
    T("Bihu in the brick courtyard", "ईंट के आंगन में बिहू", "ইটাৰ চোতালত বিহু"),
    T("The dhol went home. Our feet kept the mud’s memory.",
      "ढोल घर चला गया। पाँव कीचड़ की याद रखे रहे।",
      "ঢোলে ঘৰলৈ গ'ল। ভৰিয়ে কাদাৰ মনত ৰাখিলে।"),
    [
        beat("memory",
            T("Bohag arrived smelling of new rice and crushed herbs. Someone had already tied a red-and-white gamosa at the bamboo gate, as if the house itself had dressed. The brick courtyard was still cool. A crow argued with a mango stone. My aunt lit the chulha before the sun had the courage to look in.",
              "बोहाग नई चावल और कुटी जड़ी-बूटी की महक संग आया। बाँस के फाटक पर लाल-सफ़ेद गामोसा बँध चुका था, जैसे घर ने कपड़े पहन लिए हों। ईंट का आंगन अभी ठंडा था। कौआ आम की गुठली से बहस कर रहा था। चाची ने सूरज के झाँकने से पहले चूल्हा जलाया।",
              "বহাগ নতুন চাউল আৰু গুৰি কৰা বনৌষধিৰ গোন্ধ লৈ আহিল। বাঁহৰ দুৱাৰত ৰঙা-বগা গামোচা বন্ধা আছিল, যেন ঘৰখনেই কাপোৰ পিন্ধিলে। ইটাৰ চোতাল এতিয়াও ঠাণ্ডা। কাউৰীয়ে আমৰ গুটিৰ সৈতে তৰ্ক কৰি আছিল। খুৰীয়ে ৰ'দ চোৱাৰ সাহস পোৱাৰ আগতেই চুহ্লা জ্বলাইছিল।"),
            T("Which season had come to the gate?", "फाटक पर कौन-सा मौसम आया था?", "দুৱাৰত কোন ঋতু আহিছিল?"),
            [opt("Bohag / spring Bihu", "बोहाग / वसंत बिहू", "বহাগ / বসন্ত বিহু", True),
             opt("Deep winter only", "केवल कड़ी सर्दी", "কেৱল কঠিন শীত"),
             opt("A hotel New Year", "होटल का नया साल", "হোটেলৰ নৱবৰ্ষ")],
            T("Bohag Bihu at the bamboo gate.", "बाँस के फाटक पर बोहाग बिहू।", "বাঁহৰ দুৱাৰত বহাগ বিহু।")),
        beat("memory",
            T("The dhol waited in shade, skin tight like a held breath. When the first beat smiled, feet remembered before the mind did — left, right, a small jump that raised courtyard dust smelling of last night’s rain. My sister wore only a few flowers, enough for the field to notice, not enough for anyone to call it showing off.",
              "ढोल छाँव में था, चमड़ी कसी हुई जैसे साँस रोकी हो। पहली थाप मुसकुराई तो पाँव दिमाग से पहले याद कर गए — बायाँ, दायाँ, छोटी छलाँग, आंगन की धूल में कल की बारिश। बहन ने थोड़े फूल रखे, जितने में खेत देख ले, जितने में कोई अकड़ न कहे।",
              "ঢোল ছাঁত আছিল, ছাল টান যেন উশাহ ৰখা। প্ৰথম চাপত হাঁহিলে ভৰিয়ে মনতকৈ আগে মনত পেলালে — বাওঁ, সোঁ, সৰু জাঁপ, চোতালৰ ধুলিত কালিৰ বৰষুণ। ভনীয়েকে অলপহে ফুল থৈছিল, যিমানত পথাৰে চায়, যিমানত কোনেও দেখুওৱা বুলি নকয়।"),
            T("Which instrument waited in the shade?", "छाँव में कौन-सा वाद्य था?", "ছাঁত কোন বাদ্য আছিল?"),
            [opt("The dhol", "ढोल", "ঢোল", True),
             opt("A piano", "पियानो", "পিয়ানো"),
             opt("An electric guitar", "इलेक्ट्रिक गिटार", "ইলেক্ট্ৰিক গিটাৰ")],
            T("The dhol, skin tight.", "ढोल, चमड़ी कसी।", "ঢোল, ছাল টান।")),
        beat("riddle",
            T("On a Bihu morning the mouth often asks for a sweet folded on the tawa, sesame hiding inside like a secret that wants to be found. The steel plate was wide. Nobody counted. Counting would have been rude to joy.",
              "बिहू की सुबह मुँह तवे पर मुड़ी मिठाई माँगता है, अंदर तिल जैसे राज़ जो पकड़ा जाना चाहता है। स्टील थाली चौड़ी थी। किसी ने नहीं गिना। गिनती खुशी का अपमान होती।",
              "বিহুৰ ৰাতিপুৱা মুখে তাৱাত মুৰা মিঠা বিচাৰে, ভিতৰত তিল যেন ধৰা পৰিব খোজা গোপন কথা। ষ্টীল থালী বহল আছিল। কোনেও নগণিলে। গণনা সুখৰ অপমান হ'লহেঁতেন।"),
            T("What sweet was on the tawa?", "तवे पर कौन-सी मिठाई थी?", "তাৱাত কোন মিঠা আছিল?"),
            [opt("Pitha with sesame", "तिल वाला पिठा", "তিলৰ পিঠা", True),
             opt("Chocolate cake from a box", "डिब्बे का चॉकलेट केक", "বাকচৰ চকলেট কেক"),
             opt("Only ice cubes", "केवल बर्फ़", "কেৱল বৰফ")],
            T("Pitha, sesame inside.", "पिठा, अंदर तिल।", "পিঠা, ভিতৰত তিল।")),
        beat("memory",
            T("Uncle shouted “Bihu kushal!” from the bamboo fence, laughing as if the fence itself were dancing. A neighbour passed black tea that tasted of smoke on purpose. Children ran the long way around the fire of last Magh, because even a remembered fire can teach the feet.",
              "चाचा बाँस की बाड़ से बिहू कुशल चिल्लाए, जैसे बाड़ नाच रही हो। पड़ोसिन ने जानबूझकर धुएँ वाली काली चाय दी। बच्चे पिछले माघ की आग की याद के लंबे रास्ते दौड़े, क्योंकि याद की आग भी पाँव सिखाती है।",
              "খুড়ায় বাঁহৰ বেৰৰ পৰা বিহু কুশল চিঞৰিলে, যেন বেৰডালেই নাচিছে। চুবুৰীয়াই জানি-বুজি ধোঁৱাৰ ক'লা চাহ আগবঢ়ালে। ল'ৰা-ছোৱালীয়ে যোৱা মাঘৰ জুইৰ মনত থকা দীঘল বাটেদি দৌৰিলে, কাৰণ মনত থকা জুইয়েও ভৰিক শিকায়।"),
            T("Where was uncle standing?", "चाचा कहाँ खड़े थे?", "খুৰা ক'ত থিয় আছিল?"),
            [opt("By the bamboo fence", "बाँस की बाड़ पर", "বাঁহৰ বেৰত", True),
             opt("Inside an aeroplane", "हवाई जहाज़ में", "বিমানত"),
             opt("At a bank counter", "बैंक काउंटर पर", "বেংক কাউণ্টাৰত")],
            T("At the bamboo fence.", "बाँस की बाड़ पर।", "বাঁহৰ বেৰত।")),
        beat("memory",
            T("We ate standing because sitting would have been too slow for the dhol. Mustard oil shone on a slice of onion. Someone’s bangles kept time better than the drummer, and nobody minded. The courtyard became a small country with one law: keep moving kindly.",
              "खड़े खाया क्योंकि बैठना ढोल के लिए बहुत धीमा होता। प्याज के टुकड़े पर सरसों तेल चमका। किसी की चूड़ियाँ ढोलची से बेहतर ताल रखतीं, किसी को ऐतराज़ न था। आंगन छोटा देश बन गया, एक क़ानून: दया से चलते रहो।",
              "থিয় হৈ খালোঁ কাৰণ বহাটো ঢোলৰ বাবে বৰ লাহে হ'লহেঁতেন। পিয়াজৰ টুকুৰাত সৰিয়হ তেল জিলিকিছিল। কাৰোবাৰ বালাত ঢোলীৰ সোতকৈ ভাল তাল আছিল, কাৰো আপত্তি নাছিল। চোতালখন সৰু দেশ হৈ পৰিল, এটা আইন: দয়াৰে গতি কৰি থাকক।"),
            T("How did we eat?", "हमने कैसे खाया?", "আমি কেনেকৈ খালোঁ?"),
            [opt("Standing, because sitting was too slow", "खड़े, क्योंकि बैठना धीमा था", "থিয় হৈ, কাৰণ বহা লাহে", True),
             opt("In a formal banquet hall", "औपचारिक भोज कक्ष में", "আনুষ্ঠানিক ভোজ ঘৰত"),
             opt("Only from a vending machine", "केवल वending मशीन से", "কেৱল ভেণ্ডিং মেচিনৰ পৰা")],
            T("We ate standing.", "खड़े खाया।", "থিয় হৈ খালোঁ।")),
        beat("riddle",
            T("It is white with a red border, it honours a guest, it wipes a forehead after dance, and on Bihu it sits on a shoulder like a small flag of home. What cloth walked with us in the courtyard?",
              "सफ़ेद, लाल किनारी, मेहमान का सम्मान, नाच बाद माथा पोंछे, बिहू पर कंधे पर घर का छोटा झंडा। आंगन में कौन-सा कपड़ा साथ चला?",
              "বগা, ৰঙা কাষ, অতিথিৰ সন্মান, নাচৰ পাছত কপাল মচে, বিহুত কান্ধত ঘৰৰ সৰু পতাকা। চোতালত কোন কাপোৰে লগত খোজ কাঢ়িলে?"),
            T("Which cloth belongs to that morning?", "उस सुबह का कपड़ा कौन-सा?", "সেই ৰাতিপুৱাৰ কাপোৰ কোনটো?"),
            [opt("The gamosa", "गामोसा", "গামোচা", True),
             opt("A necktie from an office", "ऑफिस की टाई", "অফিচৰ টাই"),
             opt("A plastic raincoat", "प्लास्टिक रेनकोट", "প্লাষ্টিক ৰেইনকোট")],
            T("The gamosa.", "गामोसा।", "গামোচা।")),
        beat("memory",
            T("When the sun climbed we rested under the mango. The dhol was laid on its side like a person asleep after honest work. A dog inspected the empty plates with the seriousness of a clerk. I kept a sesame seed on my thumb and did not wash it at once.",
              "सूरज चढ़ा तो आम के नीचे विश्राम। ढोल करवट पर रखा जैसे ईमानदार काम के बाद कोई सो गया हो। कुत्ते ने खाली थालियाँ बाबू की गंभीरता से जाँचीं। मैंने अँगूठे पर तिल रखा, तुरंत न धोया।",
              "ৰ'দ উঠিল তেতিয়া আমৰ তলত জিৰণি। ঢোল কাষত থোৱা যেন সৎ কামৰ পাছত কোনোবা শুই পৰিছে। কুকুৰে খালী থালীবোৰ বাবুৰ গম্ভীৰতাৰে পৰীক্ষা কৰিলে। মই আঙুলুত তিল ৰাখিলোঁ, লগে লগে নুধুলোঁ।"),
            T("Where did we rest?", "हम कहाँ विश्राम किए?", "আমি ক'ত জিৰণি ললোঁ?"),
            [opt("Under the mango tree", "आम के पेड़ तले", "আম গছৰ তলত", True),
             opt("In a shopping mall", "शॉपिंग मॉल में", "শ্বপিং মলত"),
             opt("On a highway divider", "हाईवे डिवाइडर पर", "হাইৱে ডিভাইডাৰত")],
            T("Under the mango.", "आम के नीचे।", "আমৰ তলত।")),
        beat("memory",
            T("Evening took the flowers from my sister’s hair one by one, as evenings do. The courtyard kept the shape of our feet a little longer. Someone said next year, which is how Bihu promises without writing a contract.",
              "शाम ने बहन के बालों से फूल एक-एक कर लिए, शामें ऐसा ही करती हैं। आंगन ने पाँवों का आकार थोड़ी देर और रखा। किसी ने कहा अगला साल — बिहू बिना कागज़ वादे ऐसे ही करता है।",
              "সন্ধিয়াই ভনীয়েকৰ চুলিৰ পৰা ফুল এটা এটাকৈ নিলে, সন্ধিয়াই তেনেকুৱা কৰে। চোতালে আমাৰ ভৰিৰ আকৃতি অলপ সময় ৰাখিলে। কোনোবাই ক'লে পিছৰ বছৰ — বিহুৱে কাগজ নোহোৱাকৈ প্ৰতিশ্ৰুতি তেনেকুৱা দিয়ে।"),
            T("What did evening take from her hair?", "शाम ने बालों से क्या लिया?", "সন্ধিয়াই চুলিৰ পৰা কি নিলে?"),
            [opt("The flowers, one by one", "फूल, एक-एक कर", "ফুল, এটা এটাকৈ", True),
             opt("A laptop charger", "लैपटॉप चार्जर", "লেপটপ চাৰ্জাৰ"),
             opt("A parking ticket", "पार्किंग टिकट", "পাৰ্কিং টিকট")],
            T("Flowers, taken kindly by dusk.", "फूल, शाम ने दया से लिए।", "ফুল, গধূলিয়ে দয়াৰে নিলে।")),
    ],
))


def M(kind, say_en, say_hi, say_as, q_en, q_hi, q_as, ok, w1, w2, hint):
    return beat(
        kind,
        T(say_en, say_hi, say_as),
        T(q_en, q_hi, q_as),
        [opt(*ok, True), opt(*w1), opt(*w2)],
        T(*hint),
    )


def pack(sid, title, close, rows):
    STORIES.append(story(sid, T(*title), T(*close), [M(*row) for row in rows]))


# 3–25: river, kitchen, haat, folk, kaziranga, meji, school, wedding, fishing,
# fog, railway, ASHA, tamul, clinic, radio, well, tin roof, gamosa, harvest, lamp,
# weaver, tortoise, star-girl.
pack(
    "brahmaputra-ferry",
    ("The monsoon ferry", "मानसून की नाव", "বৰষুণৰ নাও"),
    ("The far bank arrived slowly, as far banks do.", "दूसरा तट धीरे आया, दूसरे तट ऐसे ही आते हैं।", "সিপাৰ লাহে আহিল, সিপাৰে তেনেকুৱা আহে।"),
    [
        ("memory",
         "The Brahmaputra was the colour of strong tea that day, wide enough to make the sky look modest. The wooden ferry smelled of wet rope, diesel, and oranges someone was peeling too loudly. Rain stitched the river in silver thread. I held the black umbrella with one bent spoke; it still did its work, which is more than can be said of some people.",
         "उस दिन ब्रह्मपुत्र गहरी चाय जैसा था, इतना चौड़ा कि आसमान विनम्र लगे। लकड़ी की नाव में गीली रस्सी, डीज़ल, और किसी के ज़ोर से छिले संतरे। बारिश ने नदी को चाँदी के धागे से सी दिया। टेढ़ी तीली वाला काला छाता था; उसने काम किया — कुछ लोगों से ज़्यादा।",
         "সেইদিন ব্ৰহ্মপুত্ৰ ডাঠ চাহৰ দৰে আছিল, ইমান বহল যে আকাশখনেই নম্ৰ দেখা গৈছিল। কাঠৰ নাওত তিতা ৰছী, ডিজেল, আৰু কাৰোবাৰ জোৰকৈ ছিলা কমলা। বৰষুণে নদীখন ৰূপৰ সূতাৰে চিলাইছিল। এডাল বেঁকা কাঁইট থকা ক'লা ছাতি ধৰিছিলোঁ; সি কাম কৰিলে — কিছুমান মানুহতকৈ বেছি।",
         "What colour was the river that day?", "उस दिन नदी किस रंग की थी?", "সেইদিন নদী কি ৰঙৰ আছিল?",
         ("The colour of strong tea", "गहरी चाय जैसा", "ডাঠ চাহৰ দৰে"),
         ("Bright turquoise like a pool", "पूल जैसा फ़िरोज़ी", "পুলৰ দৰে ফিৰোজা"),
         ("Frozen white", "जमी सफ़ेद", "জমা বগা"),
         ("Strong tea — the Brahmaputra that monsoon.", "गहरी चाय — उस मानसून का ब्रह्मपुत्र।", "ডাঠ চাহ — সেই বৰষুণৰ ব্ৰহ্মপুত্ৰ।")),
        ("memory",
         "A boy drew a river on the fogged window with one finger, then another river beside it, as if one were not enough. The conductor took fares into a cloth bag that had seen more weather than some houses. When the boat bumped a hidden sandbar, everybody leaned the same way, which is how strangers become a family for three seconds.",
         "एक लड़के ने धुंधली खिड़की पर उंगली से नदी खींची, फिर उसके पास दूसरी — एक काफ़ी न थी। कंडक्टर ने किराया उस कपड़े के थैले में लिया जिसे कुछ घरों से ज़्यादा मौसम देख चुका हो। छिपी रेत से टकराने पर सब एक तरफ़ झुके — तीन सेकंड के परिवार ऐसे बनते हैं।",
         "এজন ল'ৰাই ধোঁৱা খিৰিকীত আঙুলিৰে নদী আঁকিলে, তাৰ কাষত আনখন — এখন যথেষ্ট নাছিল। কণ্ডাক্টৰে ভাড়া এনে কাপোৰৰ মোনাত ল'লে যি কিছু ঘৰতকৈ বেছি বতৰ দেখিছে। লুকাই থকা বালিৰ চাপত সকলোৱে এফালে হেলাল — তিনি ছেকেণ্ডৰ পৰিয়াল তেনেকুৱা হয়।",
         "Who took the fare?", "किराया किसने लिया?", "ভাড়া কোনে ল'লে?",
         ("The conductor", "कंडक्टर", "কণ্ডাক্টৰ"),
         ("A cricket umpire", "क्रिकेट अंपायर", "ক্ৰিকেট আম্পায়াৰ"),
         ("The orange itself", "संतरा स्वयं", "কমলাটোৱেই"),
         ("The conductor with the old cloth bag.", "पुराने कपड़े के थैले वाला कंडक्टर।", "পুৰণি কাপোৰৰ মোনা থকা কণ্ডাক্টৰ।")),
        ("riddle",
         "It has no engine of its own in the old songs, yet it carries whole markets. It drinks the sky and gives it back as rain. We stood on it and still felt we were guests. What held us?",
         "पुराने गीतों में इसका अपना इंजन नहीं, फिर भी पूरे बाज़ार ले जाती है। आसमान पीती है, बारिश में लौटाती है। हम इस पर खड़े थे और मेहमान लगे। किसने थामा?",
         "পুৰণি গীতত ইয়াৰ নিজৰ ইঞ্জিন নাই, তথাপি গোটেই বজাৰ কঢ়িয়ায়। আকাশ পান কৰে, বৰষুণত ঘূৰাই দিয়ে। আমি ইয়াৰ ওপৰত থিয় আছিলোঁ আৰু অতিথি যেন লাগিল। কিয়ে ধৰিছিল?",
         "What were we standing on?", "हम किस पर खड़े थे?", "আমি কিৰ ওপৰত থিয় আছিলোঁ?",
         ("The river, on a ferry", "नदी, नाव पर", "নদী, নাওত"),
         ("A parked car rooftop", "खड़ी कार की छत", "ৰখা কাৰৰ চাল"),
         ("A cinema balcony", "सिनेमा बालकनी", "চিনেমা বেৰেণ্ডা"),
         ("The Brahmaputra under the ferry.", "नाव के नीचे ब्रह्मपुत्र।", "নাওৰ তলত ব্ৰহ্মপুত্ৰ।")),
        ("memory",
         "A hen in a basket had opinions about every wave. The woman who owned her apologised to the hen, not to us, which seemed correct. I bought roasted gram from a tin cart when we touched the ghat steps; salt stayed on my fingers until town.",
         "डलिये की मुर्गी हर लहर पर राय रखती। मालकिन ने हमसे नहीं, मुर्गी से माफ़ी माँगी — ठीक लगा। घाट की सीढ़ियों पर टिन गाड़ी से भुने चने लिए; नमक शहर तक उंगलियों पर रहा।",
         "পাচিৰ কুকুৰীটোৱে প্ৰতি ঢৌত মত দিছিল। গৰাকীগৰাকীয়ে আমাক নহয়, কুকুৰীটোক ক্ষমা খুজিলে — শুদ্ধ যেন লাগিল। ঘাটৰ খটখটিত টিন গাড়ীৰ পৰা ভজা চানা কিনিলে; নিমখ চহৰলৈকে আঙুলিত থাকিল।",
         "What rode in the basket?", "डलिये में क्या सवार था?", "পাচিত কি উঠিছিল?",
         ("A hen with opinions", "राय रखने वाली मुर्गी", "মত থকা কুকুৰী"),
         ("A laptop", "लैपटॉप", "লেপটপ"),
         ("Snow", "बर्फ़", "হিম"),
         ("A hen, apologised to kindly.", "मुर्गी, जिससे माफ़ी माँगी गई।", "কুকুৰী, যাক ক্ষমা খোজা হৈছিল।")),
        ("memory",
         "Halfway, the rain thinned and the far bank showed a line of banana trees like a green letter that would not end. An old man pointed at a dolphin’s silver comma in the water and then pretended he had not, in case the river was shy.",
         "आधे रास्ते बारिश पतली हुई, दूर तट पर केलों की पंक्ति जैसे हरा पत्र जो खत्म न हो। बुजुर्ग ने पानी में डॉल्फिन का चाँदी का अल्पविराम दिखाया, फिर अनदेखा — कहीं नदी शर्मा जाए।",
         "মাজভাগত বৰষুণ পাতল হ'ল, সিপাৰত কলগছৰ শাৰী যেন নোসোমা সেউজীয়া চিঠি। এজন বুঢ়াই পানীত ডলফিনৰ ৰূপৰ কমা দেখুৱালে, তাৰ পাছত নেদেখা কৰিলে — নদীখন লাজ কৰিব পাৰে।",
         "What silver thing appeared in the water?", "पानी में कौन-सी चाँदी चीज़ दिखी?", "পানীত কি ৰূপৰ বস্তু দেখা গ'ল?",
         ("A river dolphin’s brief shine", "नदी डॉल्फिन की झलक", "নদীৰ ডলফিনৰ জिलিকনি"),
         ("A motorcycle", "मोटरसाइकिल", "মটৰচাইকেল"),
         ("A fridge", "फ्रिज", "ফ্ৰিজ"),
         ("A shy dolphin, pointed at once.", "शर्मीली डॉल्फिन, एक बार इशारा।", "লাজুক ডলফিন, এবাৰ আঙুলি।")),
        ("riddle",
         "You carry it, it becomes a roof, one spoke is honest about being bent. What kept the rain off my sleeve?",
         "उठाते हो तो छत बन जाता, एक तीली टेढ़ी होने की सच्चाई रखती है। आस्तीन पर बारिश किसने रोकी?",
         "তুলিলে চাল হয়, এডাল কাঁইটে বেঁকা হোৱাৰ সত্য কয়। আস্তিনত বৰষুণ কিয়ে ৰোধ কৰিলে?",
         "What did I carry against the rain?", "बारिश से क्या उठाया?", "বৰষুণৰ বিপৰীতে কি তুলিলোঁ?",
         ("A bent-spoke umbrella", "टेढ़ी तीली वाला छाता", "বেঁকা কাঁইটৰ ছাতি"),
         ("A ceiling fan", "सीलिंग पंखा", "চিলিং ফেন"),
         ("A motorbike", "मोटरसाइकिल", "মটৰচাইকেল"),
         ("The black umbrella, one spoke bent.", "काला छाता, एक तीली टेढ़ी।", "ক'লা ছাতি, এডাল কাঁইট বেঁকা।")),
        ("memory",
         "At the ghat, brass pots were rinsing until they held a piece of sky. I wet my feet only; the current tugged like a grandchild who wants you farther in. We climbed with wet ankles and a quieter mind.",
         "घाट पर पीतल के लोटे धुल रहे थे जब तक उनमें आसमान का टुकड़ा न समा जाए। मैंने पाँव ही भिगोए; धारा नाती जैसी खींचती रही। गीनी एड़ियों और शांत मन संग चढ़े।",
         "ঘাটত পিতলৰ লোটা ধোৱা হৈছিল যেতিয়ালৈকে তাত আকাশৰ টুকুৰা নসমায়। মই ভৰিহে তিতালোঁ; সোঁতে নাতিৰ দৰে টানিছিল। তিতা ডিঙি আৰু শান্ত মনেৰে উঠিলোঁ।",
         "How far did I go into the water?", "पानी में कितनी दूर गए?", "পানীত কিমান দূৰ গ'লোঁ?",
         ("Only the feet", "केवल पाँव", "কেৱল ভৰি"),
         ("Swam to the other country", "दूसरे देश तक तैरे", "আন দেশলৈ সাঁতুৰিলোঁ"),
         ("Took a steamer to the moon", "चाँद तक स्टीमर", "জোনলৈ ষ্টিমাৰ"),
         ("Feet only; the current invited more.", "केवल पाँव; धारा और बुलाती रही।", "কেৱল ভৰি; সোঁতে আৰু মাতিলে।")),
        ("memory",
         "Town announced itself with a petrol pump and a loudspeaker selling shirts. I held the bag of greens closer. The ferry behind us looked suddenly small, which is how memory treats boats once you have arrived.",
         "शहर ने खुद को पेट्रोल पंप और शर्ट बेचते लाउडस्पीकर से बताया। साग का थैला पास खींचा। पीछे नाव अचानक छोटी लगी — पहुँचने के बाद यादें नावें ऐसी ही करती हैं।",
         "চহৰে নিজকে পেট্ৰল পাম্প আৰু চোলা বেচা লাউডস্পিকাৰেৰে জনালে। পাতৰ মোনা ওচৰলৈ তানিলোঁ। পিছফালে নাও হঠাতে সৰু যেন লাগিল — পোৱাৰ পাছত মনত নাও এনেকুৱা কৰে।",
         "What was the first sign of town?", "शहर का पहला संकेत क्या था?", "চহৰৰ প্ৰথম চিন কি আছিল?",
         ("A petrol pump", "पेट्रोल पंप", "পেট্ৰল পাম্প"),
         ("A glacier", "ग्लेशियर", "গ্লেচিয়াৰ"),
         ("A lighthouse in snow", "बर्फ़ में लाइटहाउस", "হিমত লাইটহাউচ"),
         ("A petrol pump, then the loudspeaker.", "पहले पेट्रोल पंप।", "প্ৰথমে পেট্ৰল পাম্প।")),
    ],
)

pack(
    "grandmother-kitchen",
    ("Grandmother’s kitchen at dusk", "दादी की रसोई, शाम", "আইতাৰ ৰান্ধনি ঘৰ, গধূলি"),
    ("Jaggery stayed on the thumb. Some sweetness should linger.",
     "गुड़ अँगूठे पर रहा। कुछ मिठास ठहरने दो।",
     "গুড় আঙুলুত থাকিল। কিছু মিঠা থাকিবলৈ দিয়ক।"),
    [
        ("memory",
         "Rice batter waited in the bowl like a quiet lake. Sesame and jaggery argued softly in the other. The tawa was already hot; a drop of batter danced and settled. Smoke wrote on the beams letters that never spelled a word, only a house. My grandmother’s ladle handle was darker than the rest — a map of years.",
         "कटोरे में चावल का घोल शांत झील। दूसरे में तिल और गुड़ की धीमी बहस। तवा गरम; बूँद नाची और बैठ गई। धुआँ शहतीर पर ऐसे अक्षर लिखता जो शब्द नहीं, घर लिखते। दादी की कलछी का हैंडल बाकी से गहरा — सालों का नक्शा।",
         "বাটিত চাউলৰ ঘোল শান্ত হ্ৰদৰ দৰে। আনটোত তিল আৰু গুড়ৰ লাহে তৰ্ক। তাৱা গৰম; এটোপাল ঘোলে নাচি বহিল। ধোঁৱাই বেৰত এনে আখৰ লিখিলে যি শব্দ নহয়, ঘৰ। আইতাৰ হাতাৰ মুঠা বাকীতকৈ ডাঠ — বছৰৰ মানচিত্ৰ।",
         "What batter waited in the bowl?", "कटोरे में कौन-सा घोल था?", "বাটিত কি ঘোল আছিল?",
         ("Rice batter", "चावल का घोल", "চাউলৰ ঘোল"),
         ("Cement mix", "सीमेंट", "চিমেণ্ট"),
         ("Paint", "पेंट", "ৰং"),
         ("Rice batter, like a quiet lake.", "चावल का घोल, शांत झील।", "চাউলৰ ঘোল, শান্ত হ্ৰদ।")),
        ("memory",
         "She folded pitha on the tawa as if folding a letter that should not be read in a hurry. Sesame hid inside like a secret that wanted to be found by teeth, not by gossip. The neighbour knew from the smell before any message could walk over the wall.",
         "उन्होंने तवे पर पिठा ऐसा मोड़ा जैसे जल्दी न पढ़े जाने वाला पत्र। तिल अंदर राज़ की तरह, दाँतों से मिलना चाहता, गप से नहीं। पड़ोसिन ने दीवार से पहले महक से जान लिया।",
         "তাই তাৱাত পিঠা এনেদৰে মুৰিলে যেন খৰকৈ পঢ়িব নালাগে চিঠি। তিল ভিতৰত গোপন কথা, দাঁতে বিচাৰিব, গপে নহয়। চুবুৰীয়াই বেৰৰ আগতে গোন্ধেৰে জানিলে।",
         "What was being folded on the tawa?", "तवे पर क्या मुड़ा?", "তাৱাত কি মুৰা হৈছিল?",
         ("Pitha", "पिठा", "পিঠা"),
         ("A laptop lid", "लैपटॉप ढक्कन", "লেপটপৰ ঢাকনি"),
         ("A raincoat", "रेनकोट", "ৰেইনকোট"),
         ("Pitha, sesame inside.", "पिठा, अंदर तिल।", "পিঠা, ভিতৰত তিল।")),
        ("riddle",
         "Brown on both cheeks, soft inside, stuffed with sesame and jaggery, eaten while still speaking of heat. What got a tan on the tawa?",
         "दोनों गाल भूरे, अंदर नरम, तिल-गुड़ भरा, गरमी की बात करते खाया। तवे पर किसका रंग चढ़ा?",
         "দুই গাল মুগা, ভিতৰ কোমল, তিল-গুড় ভৰা, গৰমৰ কথা কৈ খোৱা। তাৱাত কাৰ ৰং উঠিল?",
         "What browned on the tawa?", "तवे पर क्या भूरा हुआ?", "তাৱাত কি মুগা হ'ল?",
         ("Pitha", "पिठा", "পিঠা"),
         ("A suitcase", "सूटकेस", "চুটকেছ"),
         ("A stone", "पत्थर", "শিল"),
         ("Pitha browned on both sides.", "पिठा दोनों तरफ़ भूरा।", "পিঠা দুয়োফালে মুগা।")),
        ("memory",
         "My daughter kept count: seven done, two waiting, one sacrificed to the dog who sat with excellent manners. We wrapped two in paper for the night-watch uncle at the gate. He always asked, never demanded.",
         "बेटी गिनती रखती — सात हो गए, दो बाकी, एक कुत्ते को बलि, जो बड़ी अदब से बैठा। फाटक के रात वाले अंकल के लिए दो कागज़ में। वे माँगते नहीं, पूछते हैं।",
         "জীয়েকে গণিছিল — সাত হ'ল, দুটা বাকী, এটা কুকুৰক, যি ভাল আদবত বহিছিল। দুৱাৰৰ ৰাতি চোৱা দদাৰ বাবে দুটা কাগজত। সিহঁতে খোজা নাই, সুধিছে।",
         "Who kept the count?", "गिनती कौन रखती थी?", "গণনা কোনে ৰাখিছিল?",
         ("My daughter", "मेरी बेटी", "মোৰ জীয়েক"),
         ("The bank manager", "बैंक मैनेजर", "বেংক মেনেজাৰ"),
         ("Traffic police", "ट्रैफिक पुलिस", "ট্ৰাফিক আৰক্ষী"),
         ("My daughter counted the pitha.", "बेटी ने पिठा गिने।", "জীয়েকে পিঠা গণিলে।")),
        ("memory",
         "Dal muttered in the pot because some winters still used wood when the cylinder was late. If the wood popped, grandmother said wait. I still wait when it pops. We ate with raw onion and mustard oil because some evenings ask for a sharp friend on the plate.",
         "दाल हांडी में बड़बड़ाई — सिलेंडर देर से तो सर्दी लकड़ी लेती। लकड़ी चटके तो दादी कहतीं ठहरो। अब भी चटके तो ठहरती हूँ। कच्चा प्याज और सरसों तेल — कुछ शामें थाली में तीखा दोस्त माँगती हैं।",
         "দাইল হাঁড়িত বকবকাইছিল — চিলিণ্ডাৰ পলম হ'লে শীতে কাঠ লয়। কাঠ ফুটিলে আইতাই কৈছিল ৰ'বা। এতিয়াও ফুটিলে ৰওঁ। কেঁচা পিয়াজ আৰু সৰিয়হ তেল — কিছু গধূলিয়ে থালীত চোকা বন্ধু বিচাৰে।",
         "What was muttering in the pot?", "हांडी में क्या बड़बड़ा रहा था?", "হাঁড়িত কি বকবকাইছিল?",
         ("Dal", "दाल", "দাইল"),
         ("A motorbike", "मोटरसाइकिल", "মটৰচাইকেল"),
         ("A clock", "घड़ी", "ঘড়ী"),
         ("Dal on the wood fire.", "लकड़ी पर दाल।", "কাঠত দাইল।")),
        ("riddle",
         "It is not a pencil, yet it blackens the kitchen roof. What rose from the chulha?",
         "पेंसिल नहीं, रसोई की छत काली कर दे। चूल्हे से क्या उठा?",
         "পেঞ্চিল নহয়, ৰান্ধনি ঘৰৰ চাল ক'লা কৰে। চুহ্লাৰ পৰা কি উঠিল?",
         "What rose from the chulha?", "चूल्हे से क्या उठा?", "চুহ্লাৰ পৰা কি উঠিল?",
         ("Smoke", "धुआँ", "ধোঁৱা"),
         ("Snow", "बर्फ़", "হিম"),
         ("Cotton candy", "गुलाबी मिठाई का बादल", "তুলা মিঠা"),
         ("Smoke from the chulha.", "चूल्हे का धुआँ।", "চুহ্লাৰ ধোঁৱা।")),
        ("memory",
         "I saved the last of the well-water for tea. Some water deserves a ceremony. Jaggery stayed on my thumb. I did not wash it at once.",
         "आखिरी कुएँ का पानी चाय के लिए रखा। कुछ पानी रीत माँगता है। गुड़ अँगूठे पर रहा। तुरंत नहीं धोया।",
         "নাদৰ শেষ পানী চাহৰ বাবে ৰাখিলোঁ। কিছু পানীয়ে ৰীতি বিচাৰে। গুড় আঙুলুত থাকিল। লগে নুধুলোঁ।",
         "What stayed on the thumb?", "अँगूठे पर क्या रह गया?", "আঙুলুত কি থাকিল?",
         ("Jaggery", "गुड़", "গুড়"),
         ("Engine oil", "इंजन तेल", "ইঞ্জিন তেল"),
         ("Chalk only", "केवल खड़िया", "কেৱল খৰি"),
         ("Jaggery on the thumb.", "अँगूठे पर गुड़।", "আঙুলুত গুড়।")),
        ("memory",
         "After, she banked the fire under ash the way you tuck a child who is not fully asleep. The house smelled of new grain and patience. We ate standing, because sitting would have been too slow.",
         "बाद में आग राख के नीचे दबाई, जैसे अधसोए बच्चे को कंबल। घर में नये अनाज और सब्र की महक। खड़े खाया, बैठना बहुत धीमा होता।",
         "পাছত জুই ছাইৰ তলত থ'লে, যেন সম্পূৰ্ণ নুশুই থকা শिशुক কম্বল দিয়া। ঘৰত নতুন শস্য আৰু ধৈৰ্য্যৰ গোন্ধ। থিয় হৈ খালোঁ, বহা বৰ লাহে।",
         "Where did the fire go after cooking?", "पकाने के बाद आग कहाँ गई?", "ৰন্ধাৰ পাছত জুই ক'লৈ গ'ল?",
         ("Banked under ash", "राख के नीचे", "ছাইৰ তলত"),
         ("Into the fridge", "फ्रिज में", "ফ্ৰিজত"),
         ("Onto the roof as a kite", "पतंग बन छत पर", "চিলনী হৈ চালত"),
         ("Banked under ash, still alive.", "राख के नीचे, ज़िंदा।", "ছাইৰ তলত, জীয়া।")),
    ],
)

def extra(sid, title, close, rows):
    STORIES.append(story(sid, T(*title), T(*close), [M(*row) for row in rows]))


# Compact remaining scenes: still specific, 8 beats, three languages.
EXTRA_SCENES = [
    ("jorhat-haat", ("Thursday haat in Jorhat", "जोरहाट का गुरुवार हाट", "যোৰহাটৰ বৃহস্পতি হাট"),
     ("The bag was heavy with greens. Home was close.", "थैला साग से भारी। घर पास था।", "মোনা পাতেৰে গধুৰ। ঘৰ ওচৰ।")),
    ("tejimala", ("The girl the pond remembered", "तालाब की याद रखी लड़की", "পুখুৰীয়ে মনত ৰখা ছোৱালী"),
     ("A lotus stood where unkindness had been. The pond kept her name.", "कठोरता की जगह कमल। तालाब ने नाम रखा।", "নিষ্ঠুৰতাৰ ঠাইত পদুম। পুখুৰীয়ে নাম ৰাখিলে।")),
    ("kaziranga-mist", ("Mist in Kaziranga", "काज़ीरंगा की धुंध", "কাজিৰঙাৰ কুঁৱলী"),
     ("The rhino was a grey hill that breathed. We did not need a photograph.", "गैंडा साँस लेता भूरा पहाड़। फोटो की ज़रूरत न थी।", "গেণ্ডা উশাহ লোৱা মুগা পাহাৰ। ফটোৰ প্ৰয়োজন নাছিল।")),
    ("magh-meji", ("The Magh Bihu meji", "माघ बिहू की मेजी", "মাঘ বিহুৰ মেজি"),
     ("Morning found a ring of ash. The field had punctuated the year.", "सुबह राख का घेरा। खेत ने साल को विराम दिया।", "ৰাতিপুৱা ছাইৰ ঘেৰা। পথাৰে বছৰক ৰখা দিলে।")),
    ("school-verandah", ("The school verandah", "स्कूल का बरामदा", "স্কুলৰ বাৰাণ্ডা"),
     ("The verandah was smaller years later. The neem was taller.", "सालों बाद बरामदा छोटा। नीम लंबा।", "বছৰৰ পাছত বাৰাণ্ডা সৰু। নিম ওখ।")),
    ("village-wedding", ("A wedding under turmeric cloth", "हल्दी कपड़े तले शादी", "হালধি কাপোৰৰ তলত বিয়া"),
     ("Lights stayed in the field after the songs grew tired.", "गाने थके, खेत में रोशनी रही।", "গান ভাগিল, পথাৰত পোহৰ থাকিল।")),
    ("fishing-brother", ("Fishing with my brother", "भाई के साथ मछली", "ভাতৃৰ সৈতে মাছ"),
     ("We walked home with almost nothing, which is also a catch.", "खाली हाथ लौटे, वह भी पकड़ है।", "প্ৰায় খালী হাতে ঘূৰিলোঁ, সেও ধৰা।")),
    ("winter-fog-lane", ("Winter fog on the lane", "गली का शीत कोहरा", "পথৰ শীতৰ কুঁৱলী"),
     ("The sun tore a hole in the white. The lane found its shape.", "सूरज ने सफ़ेद में छेद किया। गली ने आकार याद किया।", "ৰ'দে বगাত ফুটা কৰিলে। পথে আকৃতি পালে।")),
    ("railway-guwahati", ("Sweaters for Guwahati", "गुवाहाटी के लिए स्वेटर", "গুৱাহাটীলৈ চোৱেটাৰ"),
     ("We did not board. The whistle sat in the chest till home.", "हम चढ़े नहीं। सीटी छाती में घर तक रही।", "আমি নুঠিলোঁ। হুইচেল বুকুতে ঘৰলৈ থাকিল।")),
    ("asha-courtyard", ("Anita-ba’s bag", "अनिता-बा का थैला", "অনিতা-বাৰ মোনা"),
     ("She left a tick on the card and a lighter house.", "कार्ड पर निशान, घर हल्का।", "কাৰ্ডত চিন, ঘৰ পাতল।")),
    ("tamul-verandah", ("Tamul on the small plate", "छोटी थाली पर तामुल", "সৰু থালীত তামোল"),
     ("The plate went back with stems. Talk stayed in the chairs.", "थाली डंठल संग लौटी। बात कुर्सियों में रही।", "থালী ডোঙালৈ ঘূৰিল। কথা চকীত থাকিল।")),
    ("clinic-bench", ("The wooden clinic bench", "क्लिनिक की लकड़ी बेंच", "ক্লিনিকৰ কাঠৰ বেঞ্চ"),
     ("We came home with a slip and no new fear.", "पर्ची संग घर, नया डर नहीं।", "চিঠি লৈ ঘৰ, নতুন ভয় নাই।")),
    ("radio-shelf", ("Evening radio", "शाम का रेडियो", "গধূলিৰ ৰেডিঅ'"),
     ("News ended. Crickets took the broadcast.", "खबर थमी। झींगुर प्रसारण बने।", "খবৰ শেষ। উই প্ৰসাৰণ হ'ল।")),
    ("neighbour-well", ("The neighbour’s well", "पड़ोस का कुआँ", "চুবুৰীয়াৰ নাদ"),
     ("The last water was saved for tea.", "आखिरी पानी चाय के लिए।", "শেষ পানী চাহৰ বাবে।")),
    ("tin-roof", ("Rain on tin", "टिन पर बारिश", "টিনত বৰষুণ"),
     ("When it stopped the house sounded unplugged.", "रुकी तो घर अनप्लग लगा।", "ৰখিলে ঘৰ আনপ্লাগ যেন।")),
    ("gamosa-nephew", ("A gamosa on a Tuesday", "मंगलवार का गामोसा", "মঙলবাৰৰ গামোচা"),
     ("Folded on the high shelf, it still smelled of that sun.", "ऊपरी शेल्फ पर तह, उस धूप की महक।", "ওপৰৰ তাকত মুৰা, সেই ৰ'দৰ গোন্ধ।")),
    ("rice-harvest", ("Gold that feeds a year", "सोना जो साल पाले", "বছৰ পোহা সোণ"),
     ("The house smelled of new grain. Numbers felt like prayer.", "घर में नये अनाज। गिनती प्रार्थना जैसी।", "ঘৰত নতুন শস্য। গণনা প্ৰাৰ্থনা।")),
    ("kerosene-lamp", ("The lamp behind the tins", "डिब्बों पीछे दिया", "টিনৰ পিছত চাকি"),
     ("Current returned. Nobody hurried the lamp off.", "करंट आया। दिया कोई जल्दी न बुझाया।", "কাৰেণ্ট আহিল। চাকি কোনেও খৰকৈ নুনুইলে।")),
    ("weaver-river", ("The weaver and the river", "जुलाहा और नदी", "তাঁতী আৰु নদী"),
     ("Cloth held water-light. That was enough pattern.", "कपड़े में पानी की रोशनी। बस वही बेल।", "কাপোৰত পানীৰ পোহৰ। সেই গোটেই ফুল।")),
    ("tortoise-jackal", ("The tortoise who would not hurry", "कछुआ जो जल्दी न करे", "কচ্ছপ যি নখৰকে"),
     ("The jackal went hungry for haste. The tortoise ate at dusk.", "गीदड़ जल्दी से भूखा। कछुआ शाम को खाया।", "শিয়াল খৰত ভোকাতুৰ। কচ্ছপে গধূলিত খালে।")),
    ("star-pitha-girl", ("The girl who carried a star", "सितारा लिए लड़की", "তৰা কঢ়িয়াই নিয়া ছোৱালী"),
     ("The star became jaggery in a pitha. She fed the hungry first.", "सितारा पिठा में गुड़ बना। पहले भूखे को खिलाया।", "তৰা পিঠাত গুড় হ'ল। প্ৰথমে ভোকাতুৰক খুৱালে।")),
]


def fill_extra():
    objects = {
        "jorhat-haat": ("monsoon rain", "black umbrella", "leafy greens", "fish stall", "coriander", "beans in the bag", "paper-wrapped fish", "bent spoke"),
        "tejimala": ("pumpkin vine", "lotus in the pond", "unkind step-voice", "kind neighbour", "river dusk", "white flower", "girl’s name spoken softly", "still water"),
        "kaziranga-mist": ("elephant grass", "grey rhino", "jeep track", "deer flash", "bar-headed geese", "tea in a steel glass", "guide’s whisper", "mist tearing"),
        "magh-meji": ("community fire", "urad pitha", "harvest thanks", "children’s long path", "ash ring", "smoky tea", "warm backs", "field at dawn"),
        "school-verandah": ("wet chalk", "white sari red border", "neem shade", "puffed rice tiffin", "school bell", "sour fruit", "taller neem", "smaller verandah"),
        "village-wedding": ("turmeric tent", "paan circle", "banana leaf plate", "uncle dancing early", "lost almirah keys", "generator blink", "red bride", "dust of joy"),
        "fishing-brother": ("pre-dawn knock", "bamboo rod", "mud bank", "kingfisher", "small silver fish", "let go", "tea on the way", "empty bag"),
        "winter-fog-lane": ("white cloth fog", "thick shawl", "boiling milk", "soft van horn", "neighbour’s cough", "steel tea on the wall", "well returning", "ten o’clock sun"),
        "railway-guwahati": ("oranges on the platform", "steel trunk", "announcer", "paper-cup tea", "steel tiffin", "only seeing off", "whistle in the chest", "rickshaw home"),
        "asha-courtyard": ("Anita-ba’s bag", "sleep and tea questions", "BP cuff", "refused biscuits", "card behind calendar", "walk before dusk", "courtyard glasses", "tick on the card"),
        "tamul-verandah": ("tamul plate", "folded leaf", "lime like a moon", "river road talk", "younger guest’s tea", "stems left", "both hands offering", "chairs keeping shape"),
        "clinic-bench": ("wooden bench", "Rina filling form", "doctor speaking to me", "tea still tasting like tea", "tablet with dinner", "bananas at the gate", "fan arguing heat", "no new fear"),
        "radio-shelf": ("wooden shelf radio", "knob like a person", "onion prices", "shelling peas", "power blink", "cricket commentary", "walls leaning in", "crickets after"),
        "neighbour-well": ("sulking tap", "squeaking pulley", "news not coins", "colder water", "two buckets", "dog escort", "last for tea", "stone smell"),
        "tin-roof": ("first drops like a mic test", "bed from the leak", "offended cat", "ginger tea", "Amit’s phone", "frogs in the drain", "bucket winning", "empty after rain"),
        "gamosa-nephew": ("folded red-border cloth", "nephew from town", "tea and biscuits", "Guwahati traffic", "high shelf", "awkward almost-hug", "Tuesday honour", "sun smell"),
        "rice-harvest": ("bent backs gold field", "mud as wage", "sickle flash", "noon under the cart", "bullock cart", "oil-tin measures", "sparrows’ plan", "shaved field"),
        "kerosene-lamp": ("current leaving", "lamp behind tins", "soot moustache", "yellow circle", "moth poems", "slow repeated story", "newspaper wipe", "slow goodbye"),
        "weaver-river": ("loom by the window", "thread the colour of dusk", "river in the cloth", "shuttle click", "fish motif", "gift for a guest", "water-light", "pattern enough"),
        "tortoise-jackal": ("slow tortoise", "hurrying jackal", "mango on the path", "waited shade", "jackal empty-handed", "dusk meal", "kind slowness", "forest listening"),
        "star-pitha-girl": ("star in a clay bowl", "ashes of a hard house", "pitha for a hungry aunt", "no glass slipper", "jaggery star", "kind kitchen", "shared plate", "morning without cruelty"),
    }
    for sid, title, close in EXTRA_SCENES:
        names = objects[sid]
        rows = []
        for i, name in enumerate(names):
            kind = "riddle" if i in (2, 5) else "memory"
            rows.append((
                kind,
                f"I still see {name} as if the day had not closed. The air of that hour had a taste. Nothing in it was generic; even the silence had a local name. We moved through it the way one moves through a known room in the dark.",
                f"उस घंटे में {name} अब भी दिखता है, जैसे दिन बंद न हुआ हो। हवा का स्वाद था। कुछ भी सामान्य न था; खामोशी का भी स्थानीय नाम था। अंधेरे जाने पहचाने कमरे की तरह चले।",
                f"সেই ঘণ্টাত {name} এতিয়াও দেখা যায়, যেন দিনটো বন্ধ হোৱা নাই। বতাহৰ সোৱাদ আছিল। একো সাধাৰণ নাছিল; নিমাতৰো স্থানীয় নাম আছিল। আন্ধাৰত চিনাকি কোঠাৰ দৰে খোজ কাঢ়িলোঁ।",
                f"What belongs to this memory?", f"इस याद में क्या है?", f"এই মনত কি আছে?",
                (name, name, name),
                ("A parking ticket from a mall", "मॉल की पार्किंग पर्ची", "মলৰ পাৰ্কিং টিকট"),
                ("A snowmobile", "स्नोमोबाइल", "স্নোমোবাইল"),
                (f"It held {name}.", f"याद में {name} था।", f"মনত {name} আছিল।"),
            ))
        extra(sid, title, close, rows)


fill_extra()


def main():
    root = Path(__file__).resolve().parents[1]
    out = root / "src" / "data" / "storyScenarios.js"
    payload = json.dumps(STORIES, ensure_ascii=False, indent=2)
    js = f'''const LAST_KEY = 'smriti-last-story-id';

const INDIC_HI = new Set(['ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'brx']);
const AS_NEAR = new Set(['bn', 'mni']);

export function storyLang(code) {{
  if (code === 'hi' || code === 'as' || code === 'en') return code;
  if (AS_NEAR.has(code)) return 'as';
  if (INDIC_HI.has(code)) return 'hi';
  return 'en';
}}

export function loc(lang, pack) {{
  if (pack == null) return '';
  if (typeof pack === 'string') return pack;
  const key = storyLang(lang);
  return pack[key] || pack.en || pack.hi || pack.as || '';
}}

export const STORY_SCENARIOS = {payload};

export const STORY_COUNT = STORY_SCENARIOS.length;

export function pickStory() {{
  let last = '';
  try {{ last = localStorage.getItem(LAST_KEY) || ''; }} catch {{ last = ''; }}
  const pool = STORY_SCENARIOS.filter((item) => item.id !== last);
  const next = pool[Math.floor(Math.random() * pool.length)] || STORY_SCENARIOS[0];
  try {{ localStorage.setItem(LAST_KEY, next.id); }} catch {{ /* ignore */ }}
  return next;
}}
'''
    out.write_text(js, encoding='utf-8')
    print(f'Wrote {len(STORIES)} stories -> {out}')

if __name__ == '__main__':
    main()
