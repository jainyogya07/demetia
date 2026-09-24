#!/usr/bin/env python3
"""Replace template stories 5–25 with unique literary NER/folk beats. Keep first 4."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "data" / "storyScenarios.js"


def T(en, hi, as_):
    return {"en": en, "hi": hi, "as": as_}


def opt(en, hi, as_, ok=False):
    return {"en": en, "hi": hi, "as": as_, "ok": ok}


def beat(kind, say, ask, options, hint):
    return {"kind": kind, "say": say, "ask": ask, "options": options, "hint": hint}


def story(sid, title, close, beats):
    return {"id": sid, "title": title, "close": close, "beats": beats}


EXTRA = []

EXTRA.append(story(
    "jorhat-haat",
    T("Thursday haat in Jorhat", "जोरहाट का गुरुवार हाट", "যোৰহাটৰ বৃহস্পতি হাট"),
    T("The bag was heavy with mustard greens. Rain still ticked on the bicycle seat.",
      "थैला सरसों साग से भारी। बारिश साइकिल की सीट पर टिक-टिक कर रही थी।",
      "মোনাত সৰিয়হ পাত গধুৰ। বৰষুণে চাইকেলৰ আসনত টিক্‌টিক্‌ কৰি আছিল।"),
    [
        beat("memory",
             T("Thursday haat in Jorhat did not wait for the rain to finish. Mud climbed the ankles of anyone who bargained. A black umbrella with one honest bent spoke kept a circle of dry on my mother's hair while the rest of the lane shone like wet slate. Someone was frying dal pitha on a tin sheet; the oil popped in Assamese, which is to say it argued and then fed you anyway.",
               "जोरहाट का गुरुवार हाट बारिश खत्म होने का इंतज़ार नहीं करता। कीचड़ सौदा करने वाले हर टखने पर चढ़ आता। एक काला छाता — एक तीली ईमानदारी से टेढ़ी — माँ के बालों पर सूखा घेरा रखता, बाकी गली गीली स्लेट की तरह चमकती। कोई टिन पर दाल पिठा तल रहा था; तेल असमिया में चटका — यानी झगड़ा किया, फिर भी खिला दिया।",
               "যোৰহাটৰ বৃহস্পতি হাটে বৰষুণ শেষ হোৱাৰ বাবে নৰয়। কাদাই দৰদাম কৰা সকলোৰে গাঁঠিত উঠে। এখন ক'লা ছাতি — এডাল কাঁইট সততে বেঁকা — মাকৰ চুলিত শুকান ঘেৰা ৰাখে, বাকী পথ তিতা শ্লেটৰ দৰে জিলিকে। কোনোবাই টিনত দাইল পিঠা ভাজি আছিল; তেলে অসমীয়াত ফুটিছিল — অৰ্থাৎ তৰ্ক কৰিও খুৱাইছিল।"),
             T("What kept a dry circle over her hair?", "बालों पर सूखा घेरा किसने रखा?", "চুলিত শুকান ঘেৰা কিয়ে ৰাখিলে?"),
             [opt("A black umbrella, one spoke bent", "काला छाता, एक तीली टेढ़ी", "ক'লা ছাতি, এডাল কাঁইট বেঁকা", True),
              opt("A bus shelter ad", "बस शेल्टर का विज्ञापन", "বাস শেল্টাৰৰ বিজ্ঞাপন"),
              opt("A glass roof", "कांच की छत", "কাঁচৰ চাল")],
             T("The black umbrella, bent spoke and all.", "काला छाता, टेढ़ी तीली सहित।", "ক'লা ছাতি, বেঁকা কাঁইটসহ।")),
        beat("memory",
             T("Fish lay on banana leaves as if they had only just decided to be still. The seller slapped ice that was already losing the argument with August. I wanted the small ones with yellow eyes; my mother wanted the ones that would feed four and still leave a head for gravy. We compromised, which in a haat means she won kindly.",
               "केला पत्ते पर मछलियाँ ऐसी पड़ीं जैसे अभी-अभी थमने का फैसला किया हो। विक्रेता बर्फ़ थपथपा रहा था जो अगस्त से पहले ही हार रही थी। मुझे पीली आँख वाली छोटी चाहिए थीं; माँ को वो जो चार को खिलाएँ और सिर ग्रेवी के लिए बचे। समझौता हुआ, हाट में जिसका मतलब है वे दया से जीतीं।",
               "কলপাতত মাছবোৰ এনেদৰে পৰি আছিল যেন এইমাত্ৰ স্থিৰ হ'বলৈ সিদ্ধান্ত ল'লে। বেচাজনে বৰফ চাপৰিয়াইছিল যি আগষ্টৰ ওচৰত ইতিমধ্যে হাৰি গৈছিল। মোক হালধীয়া চকুৰ সৰুবোৰ লাগিছিল; মাকক সেইবোৰ যি চাৰিক খুৱাই মুৰটো জোলৰ বাবে থয়। আপোচ হ'ল, হাটত যাৰ অৰ্থ তেওঁ দয়াৰে জিকিলে।"),
             T("Where did the fish rest?", "मछलियाँ कहाँ पड़ी थीं?", "মাছবোৰ ক'ত পৰি আছিল?"),
             [opt("On banana leaves", "केले के पत्तों पर", "কলপাতত", True),
              opt("In plastic sushi boxes", "सुशी के प्लास्टिक डब्बों में", "চুচিৰ প্লাষ্টিক বাকচত"),
              opt("On a marble counter", "संगमरमर काउंटर पर", "মাৰ্বল কাউণ্টাৰত")],
             T("Banana leaves, still green enough to smell.", "केले के पत्ते, अभी हरे कि महकें।", "কলপাত, এতিয়াও সেউজীয়া গোন্ধ।")),
        beat("riddle",
             T("It is green, it stings the nose before it stings the tongue, and in this lane it is sold in bunches tied with a strip of the same plant. Women tuck it into the bag last, because coriander forgives being crushed if you remember it exists.",
               "हरा है, जीभ से पहले नाक को तीखा करे, इस गली में उसी पौधे की पट्टी से बँधे गट्ठर में बिकता है। औरतें इसे थैले में सबसे बाद रखती हैं — धनिया कुचलना माफ़ करता है अगर याद रहे कि वह है।",
               "সেউজীয়া, জিভাৰ আগতে নাকত জোকাৰে, এই পথত একে গছৰ পাতৰ ফিতাৰে বন্ধা মুঠিত বেচা হয়। তিৰোতাসকলে মোনাত শেষত থয় — ধনিয়াই চেপা মাফ কৰে যদি মনত থাকে যে সি আছে।"),
             T("Which bunch went into the bag last?", "थैले में सबसे बाद कौन-सा गट्ठर गया?", "মোনাত শেষত কোন মুঠি সোমাল?"),
             [opt("Coriander", "धनिया", "ধনিয়া", True),
              opt("Coal", "कोयला", "কয়লা"),
              opt("Soap bars", "साबुन की टिकिया", "চাবোনৰ টিকী")],
             T("Coriander, tucked last so it would not vanish.", "धनिया, सबसे बाद ताकि गायब न हो।", "ধনিয়া, শেষত যাতে হেৰাই নাযায়।")),
        beat("memory",
             T("A man weighed mustard greens on a rusted scale that had learned to lie by half a leaf. He winked as if the lie were rent. I paid with a note that had seen too many pockets; he tucked it into a tin that once held glucose biscuits, which is how money and childhood share furniture in this town.",
               "एक आदमी ने जंग खाए तराजू पर सरसों साग तौला जिसे आधी पत्ती झूठ बोलना आ गया था। उसने आँख मारी जैसे झूठ किराया हो। मैंने नोट दिया जो बहुत जेबें देख चुका; उसने उसे टिन में रखा जो कभी ग्लूकोज बिस्कुट का था — इस शहर में पैसे और बचपन एक ही फर्नीचर बाँटते हैं।",
               "এজন মানুহে মৰিচা খোৱা তৰাজুত সৰিয়হ পাত তুলিলে যি আধা পাত মিছা ক'বলৈ শিকিছিল। সি চকু টিপিলে যেন মিছাটো ভাৰা। মই এনে নোট দিলোঁ যি বহু জেব দেখিছে; সি সেইটো এটা টিনত থ'লে যি এসময়ত গ্লুকোজ বিস্কুটৰ আছিল — এই চহৰত টকা আৰু শিশুকালে একে আচবাব ভাগ কৰে।"),
             T("What greens were weighed?", "कौन-सा साग तौला गया?", "কোন পাত তোলা হ'ল?"),
             [opt("Mustard greens", "सरसों साग", "সৰিয়হ পাত", True),
              opt("Iceberg lettuce", "आइसबर्ग सलाद", "আইচবাৰ্গ লেটুচ"),
              opt("Cactus pads", "कैक्टस", "কেকটাছ")],
             T("Mustard greens on the rusted scale.", "जंग खाए तराजू पर सरसों साग।", "মৰিচা তৰাজুত সৰিয়হ পাত।")),
        beat("memory",
             T("We bought beans that clicked in the bag like a quiet abacus. A child ran past with a paper cone of steamed chickpeas, lemon dripping onto his wrist, and nobody told him to be careful because the haat teaches care by letting you sting once.",
               "सेम खरीदे जो थैले में शांत अबेकस की तरह खटखटाए। एक बच्चा भागा, कागज़ की कुनो में भापे चने, नींबू कलाई पर टपका, किसी ने सावधान न कहा — हाट सावधानी सिखाता है एक बार चुभने देकर।",
               "বীন কিনিলে যি মোনাত শান্ত এবাকাসৰ দৰে খটখটালে। এটা ল'ৰা দৌৰি গ'ল, কাগজৰ কোনাত ভাপত সিজোৱা চানা, নেবুৰ ৰস ডিঙিত পৰিল, কোনেও সাৱধান নক'লে — হাটে সাৱধানতা শিকায় এবাৰ চোকাই দি।"),
             T("What clicked in the bag like an abacus?", "थैले में अबेकस की तरह क्या खटखटाया?", "মোনাত এবাকাসৰ দৰে কি খটখটালে?"),
             [opt("Beans", "सेम", "বীন", True),
              opt("Marbles of glass only", "केवल कांच के कंचे", "কেৱল কাঁচৰ কঞ্চা"),
              opt("Typewriter keys", "टाइपराइटर की कुंजियाँ", "টাইপৰাইটাৰৰ চাবি")],
             T("Beans, counting themselves.", "सेम, खुद गिनती करते।", "বীন, নিজে গণি।")),
        beat("riddle",
             T("Wrapped in yesterday’s newspaper, it still smelled of river. The print transferred a minister’s chin onto the scales. We would eat it by lamp if the current failed, which it often did, politely, after the news.",
               "कल के अखबार में लिपटी, फिर भी नदी की महक। छपाई ने मंत्री की ठोड़ी शल्कों पर छाप दी। करंट गया तो दिया लेकर खाएँगे — वह अकसर खबर के बाद विनम्रता से चला जाता।",
               "কালিৰ বাতৰি কাকতত মেৰাই, তথাপি নদীৰ গোন্ধ। ছপाहে মন্ত্ৰীৰ চিবুক আইসত তুলিলে। কাৰেণ্ট গ'লে চাকিৰে খাম — সি খবৰৰ পাছত সঘনাই নম্ৰভাৱে যায়।"),
             T("What was wrapped in newspaper?", "अखबार में क्या लिपटा था?", "বাতৰি কাকতত কি মেৰাই আছিল?"),
             [opt("The fish we bought", "जो मछली हमने खरीदी", "আমি কিনা মাছ", True),
              opt("A laptop", "लैपटॉप", "লেপটপ"),
              opt("Wedding cake", "शादी का केक", "বিয়াৰ কেক")],
             T("Fish in yesterday's paper.", "कल के कागज़ में मछली।", "কালিৰ কাকতত মাছ।")),
        beat("memory",
             T("On the way out my cycle chain wore a necklace of mud. The bent spoke of the umbrella ticked against a stall pole like a clock that only worked on market days. Home was three lanes and one stubborn puddle away.",
               "बाहर जाते साइकिल की चेन पर कीचड़ का हार। छाते की टेढ़ी तीली स्टॉल के खंभे से टिक-टिक — घड़ी जो केवल हाट के दिन चलती। घर तीन गलियाँ और एक ज़िद्दी गड्ढा दूर।",
               "বাহিৰলৈ যাওঁতে চাইকেলৰ চেইনত কাদাৰ হাৰ। ছাতিৰ বেঁকা কাঁইটে ষ্টলৰ খুঁটাত টিক্‌টিক্‌ — ঘড়ী যি কেৱল হাটৰ দিনা চলে। ঘৰ তিনি পথ আৰু এটা জেদী পানীৰ গাঁত আঁতৰ।"),
             T("What ticked like a market-day clock?", "हाट वाली घड़ी की तरह क्या टिका?", "হাটৰ ঘড়ীৰ দৰে কি টিক্‌টিক্‌ কৰিলে?"),
             [opt("The bent umbrella spoke", "छाते की टेढ़ी तीली", "ছাতিৰ বেঁকা কাঁইট", True),
              opt("A station announcement", "स्टेशन की घोषणा", "ষ্টেচনৰ ঘোষণা"),
              opt("A microwave", "माइक्रोवेव", "মাইক্ৰ'ৱেভ")],
             T("The bent spoke on the stall pole.", "टेढ़ी तीली, स्टॉल के खंभे पर।", "বেঁকা কাঁইট, ষ্টলৰ খুঁটাত।")),
        beat("memory",
             T("Mother hung the greens from a nail in the verandah so the last rain could leave them. The fish waited in the bowl like a promise. Thursday had done its work. We had not become rich. We had become specific.",
               "माँ ने साग बरामदे की कील पर टाँगा ताकि आखिरी बारिश उतर जाए। मछली कटोरे में वादे की तरह बाकी। गुरुवार ने काम कर दिया। हम अमीर न हुए। हम विशिष्ट हो गए।",
               "মাকে পাতবোৰ বাৰাণ্ডাৰ পेंকত ওলোমাইলে যাতে শেষ বৰষুণ নামি যায়। মাছ বাটিত প্ৰতিশ্ৰুতিৰ দৰে ৰ'ল। বৃহস্পতিয়ে কাম কৰিলে। আমি ধনী নহ'লোঁ। আমি নিৰ্দিষ্ট হ'লোঁ।"),
             T("Where were the greens hung?", "साग कहाँ टाँगा गया?", "পাত ক'ত ওলোমাইলে?"),
             [opt("From a verandah nail", "बरामदे की कील पर", "বাৰাণ্ডাৰ পेंকত", True),
              opt("In a hotel freezer", "होटल के फ्रीजर में", "হোটেলৰ ফ্ৰিজত"),
              opt("On a bus rack", "बस की रैक पर", "বাসৰ ৰেকত")],
             T("A nail in the verandah.", "बरामदे की कील।", "বাৰাণ্ডাৰ পेंক।")),
    ],
))


def dump_extra():
    """Remaining extras are unique scene packs with 8 full literary beats each."""
    packs = [
        ("tejimala", "The girl the pond kept", "तालाब की रखी लड़की", "পুখুৰীয়ে ৰখা ছোৱালী",
         "A lotus stood where cruelty had been. The pond did not forget her name.",
         "कठोरता की जगह कमल। तालाब ने नाम नहीं भुलाया।",
         "নিষ্ঠুৰতাৰ ঠাইত পদুম। পুখুৰীয়ে নাম পাহৰা নাই।",
         [
            ("memory", "They told Tejimola as if she were a neighbour, not a lesson. The pumpkin vine in the yard had a stubborn green that would not be trained. At dusk the pond held a lotus as if it were keeping a girl company. The stepmother’s voice could curdle milk; the father’s absence could too. We children sat on the steps and did not dare finish the story too quickly.",
             "तेजीमोला पड़ोसन की तरह सुनाई, पाठ की तरह नहीं। आंगन की कद्दू की बेल ऐसी ज़िद्दी हरी जो सधती न थी। शाम को तालाब में कमल जैसे किसी लड़की की संगत रखता हो। सौतेली माँ की आवाज़ दूध फाड़ दे; पिता की अनुपस्थिति भी। हम सीढ़ियों पर बैठे, कहानी जल्दी खत्म करने की हिम्मत न की।",
             "তেজিমোলাক চুবুৰীয়াৰ দৰে কোৱা হ'ল, পাঠৰ দৰে নহয়। চোতালৰ কোমোৰা লতা ইমান জেদী সেউজ যে নধৰে। গধূলিত পুখুৰীত পদুম যেন কোনো ছোৱালীক সংগত কৰি আছে। মাহীমাকৰ মাতে গাখীৰ কাটিব; দেউতাৰ অনুপস্থিতিয়েও। আমি খটখটিত বহিছিলোঁ, কাহিনী সোনকালে শেষ কৰাৰ সাহস নাছিল।",
             "Who was the story about?", "कहानी किसकी थी?", "কাহিনী কাৰ আছিল?",
             "Tejimola", "तेजीमोला", "তেজিমোলা", "A cricket captain", "क्रिकेट कप्तान", "ক্ৰিকেট কেপ্টেন", "A bank clerk", "बैंक बाबू", "বেংক বাবু",
             "Tejimola, told like a neighbour.", "तेजीमोला, पड़ोसन जैसी।", "তেজিমোলা, চুবুৰীয়াৰ দৰে।"),
            ("memory", "The vine was accused of stealing space. In the telling, a girl is buried and the plant keeps speaking in leaves. I watched our own pumpkin and wondered which silences in a house grow tendrils. Grandmother said, without raising her voice, that unkindness is a weather that needs no cloud.",
             "बेल पर जगह चुराने का आरोप। कहानी में लड़की दफन, पौधा पत्तों में बोलता रहता। हमारे कद्दू को देख सोचती — घर की कौन-सी खामोशी लता बनती है। दादी ने आवाज़ उठाए बिना कहा, क्रूरता मौसम है जिसे बादल की ज़रूरत नहीं।",
             "লতাক ঠাই চোৰাৰ অভিযোগ। কথাত ছোৱালী পুতি থোৱা, গছে পাতত কৈ থাকে। আমাৰ কোমোৰা চাই ভাবিছিলোঁ ঘৰৰ কোন নিমাত লতা হয়। আইতাই মাত নুতোৱাকৈ ক'লে, নিষ্ঠুৰতা বতৰ যাৰ ডাৱৰৰ প্ৰয়োজন নাই।",
             "What plant kept speaking in the tale?", "कहानी में कौन-सा पौधा बोलता रहा?", "কাহিনীত কোন গছে কৈ থাকিল?",
             "A pumpkin vine", "कद्दू की बेल", "কোমোৰা লতা", "A cactus", "कैक्टस", "কেকটাছ", "A Christmas tree", "क्रिसमस ट्री", "ক্ৰিছমাছ গছ",
             "The pumpkin vine.", "कद्दू की बेल।", "কোমোৰা লতা।"),
            ("riddle", "It opens at dusk without a lock, sits on water without swimming, and in this telling it is a girl’s second body. What kept her company when the house would not?",
             "ताला बिना शाम को खिलता, तैर बिना पानी पर बैठता, इस कहानी में लड़की का दूसरा शरीर। घर ने साथ न दिया तो किसने संगत की?",
             "তলা নোহোৱাকৈ গধূলিত ফুলে, সাঁতুৰি নোহোৱাকৈ পানীত বহে, এই কথাত ছোৱালীৰ দ্বিতীয় শৰীৰ। ঘৰে সংগত নিদিলে কিয়ে সংগত কৰিলে?",
             "What sat on the pond?", "तालाब पर क्या बैठा?", "পুখুৰীত কি বহিছিল?",
             "A lotus", "कमल", "পদুম", "A scooter", "स्कूटर", "স্কুটাৰ", "A fridge", "फ्रिज", "ফ্ৰিজ",
             "A lotus on the pond.", "तालाब पर कमल।", "পুখুৰীত পদুম।"),
            ("memory", "We were not to say the stepmother was only a story. Grandmother looked at the kitchen beam when she said some houses have weather inside them. I held a white flower from the hedge and did not pick another. One was enough honour.",
             "सौतेली माँ को केवल कहानी न कहें। दादी ने रसोई की शहतीर देख कर कहा, कुछ घरों के अंदर मौसम होता है। मैंने बाड़ से एक सफ़ेद फूल पकड़ा, दूसरा न तोड़ा। एक सम्मान काफी।",
             "মাহীমাকক কেৱল কাহিনী বুলি নক'ব। আইতাই ৰান্ধনি ঘৰৰ বেৰ চাই ক'লে, কিছু ঘৰৰ ভিতৰত বতৰ থাকে। মই বেৰৰ পৰা এপাহ বগা ফুল ধৰিলোঁ, আনটো নোলালোঁ। এপাহ সন্মান যথেষ্ট।",
             "How many flowers did I take?", "मैंने कितने फूल लिए?", "মই কিমান ফুল ল'লোঁ?",
             "One white flower", "एक सफ़ेद फूल", "এপাহ বগা ফুল", "A bouquet of fifty", "पचास का गुलदस्ता", "পঞ্চাশৰ তোৰা", "None; I stole mangoes", "कोई नहीं; आम चुराए", "একো নহয়; আম চুৰ কৰিলোঁ",
             "One white flower from the hedge.", "बाड़ से एक सफ़ेद फूल।", "বেৰৰ পৰা এপাহ বগা ফুল।"),
            ("memory", "A kind neighbour in the tale brought water and did not ask the girl to be grateful out loud. Our neighbour did the same with extra rice. Gratitude that is demanded is just another chore. The pond understood this; ponds are older than manners.",
             "कहानी की दयालु पड़ोसन पानी लाई, लड़की से ज़ोर से शुक्रिया न माँगा। हमारी पड़ोसन ने अतिरिक्त भात से वही किया। माँगा गया आभार एक और काम है। तालाब समझता है; तालाब अदब से पुराने हैं।",
             "কাহিনীৰ দয়ালু চুবুৰীয়াই পানী আনিলে, ছোৱালীক জোৰকৈ ধন্যবাদ নিবিচাৰিলে। আমাৰ চুবুৰীয়াই অতিৰিক্ত ভাতৰে একে কৰিলে। খোজা কৃতজ্ঞতা আন এটা কাম। পুখুৰীয়ে বুজে; পুখুৰী আদবতকৈ পুৰণি।",
             "What did the kind neighbour bring in the tale?", "कहानी में दयालु पड़ोसन क्या लाई?", "কাহিনীত দয়ালু চুবুৰীয়াই কি আনিলে?",
             "Water", "पानी", "পানী", "A parking fine", "पार्किंग जुर्माना", "পাৰ্কিং জৰিমনা", "Concert tickets", "कॉन्सर्ट टिकट", "কনচাৰ্ট টিকট",
             "Water, without demanding thanks.", "पानी, शुक्रिया माँगे बिना।", "পানী, ধন্যবাদ নোখোজাকৈ।"),
            ("riddle", "I am not a grave and not a mirror, yet I keep faces. Cattle drink from me. A lotus uses me as a stage. In Assam I am often square, brick-lipped, full of sky.",
             "मैं कब्र नहीं, आईना नहीं, फिर भी चेहरे रखती हूँ। मवेशी मुझसे पीते। कमल मुझे मंच बनाता। असम में मैं अक्सर चौकोर, ईंट-होठों वाली, आसमान से भरी।",
             "মই মৈদাম নহয়, আ inversion নহয়, তথাপি মুখ ৰাখোঁ। গৰু-ম'হে মোৰ পৰা পান কৰে। পদুমে মোক মঞ্চ কৰে। অসমত মই সঘনাই চাৰিচুকীয়া, ইটাৰ ওঁঠ, আকাশেৰে ভৰা।",
             "What kept her name?", "किसने उसका नाम रखा?", "কাৰে তাইৰ নাম ৰাখিলে?",
             "The pond", "तालाब", "পুখুৰী", "A SIM card", "सिम कार्ड", "চিম কাৰ্ড", "A billboard", "बिलबोर्ड", "বিলব'ৰ্ড",
             "The pond kept her name.", "तालाब ने नाम रखा।", "পুখুৰীয়ে নাম ৰাখিলে।"),
            ("memory", "When the story ended, nobody clapped. Clapping would have been for a theatre. We sat until the mosquitoes made a thin music. Grandmother folded the tale back into her mouth like betel, to be brought out again when a child needed warning without a slap.",
             "कहानी खत्म हुई, ताली न पड़ी। ताली थिएटर के लिए होती। हम बैठे रहे जब तक मच्छरों ने पतली संगीत न बनाई। दादी ने कथा मुँह में पान की तरह तह की, जब किसी बच्चे को थप्पड़ बिना चेतावनी चाहिए हो।",
             "কাহিনী শেষ, তালি নপৰিল। তালি থিয়েটাৰৰ বাবে। আমি বহি থাকিলোঁ যেতিয়ালৈকে মহে পাতল সংগীত নকৰে। আইতাই কথা মুখত পানৰ দৰে মুৰি থ'লে, যেতিয়া কোনো শिशুক চৰ নোহোৱাকৈ সতৰ্কবাণী লাগে।",
             "How did the telling end?", "बयान कैसे खत्म हुआ?", "কথা কেনেকৈ শেষ হ'ল?",
             "Without clapping, in mosquito dusk", "बिना ताली, मच्छर वाली शाम", "তালি নোহোৱাকৈ, মহৰ গধূলি", "With fireworks", "आतिशबाजी से", "আতচবাজীৰে", "With a quiz buzzer", "क्विज़ बज़र से", "কুইজ বজাৰেৰে",
             "Quiet dusk, no applause.", "शांत शाम, बिना ताली।", "নিমাত গধূলি, তালি নাই।"),
            ("memory", "I still say her name softly when I pass a lotus, not because I think a plant is a girl, but because cruelty should not get the last word in any language we speak at home.",
             "कमल के पास अब भी नाम धीरे कहती हूँ — यह सोचकर नहीं कि पौधा लड़की है, बल्कि इसलिए कि क्रूरता को घर की किसी भाषा में आखिरी बात न मिले।",
             "পদুমৰ কাষেৰে গ'লে এতিয়াও নাম লাহি কওঁ — গছক ছোৱালী ভাবি নহয়, নিষ্ঠুৰতাক ঘৰৰ কোনো ভাষাত শেষ কথা দিব নালাগে বাবে।",
             "How do I say her name by the lotus?", "कमल के पास नाम कैसे कहती हूँ?", "পদুমৰ কাষত নাম কেনেকৈ কওঁ?",
             "Softly", "धीरे", "লাহি", "Through a megaphone", "मेगाफोन से", "মেগাফোনৰে", "In a courtroom shout", "अदालत की चीख में", "আদালতৰ চিঞৰত",
             "Softly, so cruelty is not last.", "धीरे, ताकि क्रूरता आखिरी न हो।", "লাহি, যাতে নিষ্ঠুৰতা শেষ নহয়।"),
         ]),
    ]
    # packs currently only has tejimala fully specified in this compact helper;
    # remaining stories are appended below as full EXTRA.append blocks in the same file.
    return packs


def beats_from_pack(rows):
    out = []
    for row in rows:
        kind, en, hi, as_, qe, qh, qa, oe, oh, oa, w1e, w1h, w1a, w2e, w2h, w2a, he, hh, ha = row
        out.append(beat(
            kind,
            T(en, hi, as_),
            T(qe, qh, qa),
            [opt(oe, oh, oa, True), opt(w1e, w1h, w1a), opt(w2e, w2h, w2a)],
            T(he, hh, ha),
        ))
    return out


def add_pack(sid, te, th, ta, ce, ch, ca, rows):
    EXTRA.append(story(sid, T(te, th, ta), T(ce, ch, ca), beats_from_pack(rows)))


# Fill remaining 20 from compact unique rows (already added jorhat + will add tejimala via pack)
add_pack(*[
    "tejimala",
    "The girl the pond kept", "तालाब की रखी लड़की", "পুখুৰীয়ে ৰখা ছোৱালী",
    "A lotus stood where cruelty had been. The pond did not forget her name.",
    "कठोरता की जगह कमल। तालाब ने नाम नहीं भुलाया।",
    "নিষ্ঠুৰতাৰ ঠাইত পদুম। পুখুৰীয়ে নাম পাহৰা নাই।",
    dump_extra()[0][7],
])


MORE = [
("kaziranga-mist", "Mist in Kaziranga", "काज़ीरंगा की धुंध", "কাজিৰঙাৰ কুঁৱলী",
 "The rhino was a grey hill that breathed. Nobody needed a photograph.",
 "गैंडा साँस लेता भूरा पहाड़। फोटो की ज़रूरत न थी।",
 "গেণ্ডা উশাহ লোৱা মুগা পাহাৰ। ফটোৰ প্ৰয়োজন নাছিল।",
 [
    ("memory", "Elephant grass stood taller than worry. The jeep track was two wet lines through a country that did not belong to engines. Mist tore slowly, like cloth a careful hand did not want to ruin. Somewhere a deer made a brief brown sentence and closed it.",
     "हाथी घास चिंता से ऊँची। जीप पगडंडी इंजनों की न होने वाली दुनिया में दो गीली रेखाएँ। धुंध धीरे फटी, जैसे कोई सावधान हाथ कपड़ा न बिगाड़ना चाहे। कहीं हिरन ने भूरा वाक्य कहा और बंद कर दिया।",
     "হাতীঘাঁহ চিন্তাতকৈ ওখ। জিপৰ পথ ইঞ্জিনৰ নোহোৱা দেশত দুডাল তিতা ৰেখা। কুঁৱলী লাহে ফাটিল, যেন কোনো সাৱধান হাতে কাপোৰ নষ্ট কৰিব নিবিচাৰে। ক'ৰবাত হৰিণে মুগা বাক্য কৈ বন্ধ কৰিলে।",
     "What stood taller than worry?", "चिंता से ऊँचा क्या था?", "চিন্তাতকৈ ওখ কি আছিল?",
     "Elephant grass", "हाथी घास", "হাতীঘাঁহ", "A shopping mall", "शॉपिंग मॉल", "শ্বপিং মল", "A radio tower only", "केवल रेडियो टावर", "কেৱল ৰেডিঅ' টাৱাৰ",
     "Elephant grass, taller than worry.", "हाथी घास, चिंता से ऊँची।", "হাতীঘাঁহ, চিন্তাতকৈ ওখ।"),
    ("memory", "Then the grey hill breathed. A rhino, uninterested in our awe, cropped grass with the seriousness of a clerk. The guide did not raise his voice. Wonder is cheaper when it is shouted; we paid in silence.",
     "फिर भूरा पहाड़ साँस लेता दिखा। गैंडा, हमारे विस्मय से बेपरवाह, बाबू की गंभीरता से घास चरता। गाइड ने आवाज़ न बढ़ाई। चीखने पर अचंभा सस्ता पड़ता है; हमने खामोशी में दाम दिया।",
     "তাৰ পাছত মুগা পাহাৰে উশাহ ল'লে। গেণ্ডা, আমাৰ আচম্বিত নোলোৱাকৈ, বাবুৰ গম্ভীৰতাৰে ঘাঁহ খাইছিল। গাইডে মাত নুতোৱালে। চিঞৰিলে আচৰিত সস্তা; আমি নিমাতত দাম দিলোঁ।",
     "What grey hill breathed?", "कौन-सा भूरा पहाड़ साँस ले रहा था?", "কোন মুগা পাহাৰে উশাহ লৈছিল?",
     "A rhino", "गैंडा", "গেণ্ডা", "A parked truck", "खड़ा ट्रक", "ৰখা ট্ৰাক", "A cloud only", "केवल बादल", "কেৱল ডাৱৰ",
     "A rhino cropping grass.", "घास चरता गैंडा।", "ঘাঁহ খোৱা গেণ্ডা।"),
    ("riddle", "I wear armour I did not buy. I am older than this road. Tourists want my profile; I want grass. What walked out of the mist?",
     "कवच पहना है खरीदा नहीं। इस सड़क से पुराना। पर्यटक मेरी पार्श्व चाहते हैं; मैं घास। धुंध से क्या निकला?",
     "বৰ্ম পিন্ধিছোঁ কিনা নাই। এই পথতকৈ পুৰণি। পৰ্যটকে মোৰ পাশ্ব চায়; মই ঘাঁহ। কুঁৱলীৰ পৰা কি ওলাল?",
     "What walked out of the mist?", "धुंध से क्या निकला?", "কুঁৱলীৰ পৰা কি ওলাল?",
     "The rhino", "गैंडा", "গেণ্ডা", "A fashion model", "फैशन मॉडल", "ফেশ্বন মডেল", "A metro train", "मेट्रो ट्रेन", "মেট্ৰো ৰেল",
     "The rhino, uninterested in us.", "गैंडा, हमसे बेपरवाह।", "গেণ্ডা, আমাক নোলোৱা।"),
    ("memory", "Bar-headed geese stitched a line across a sky that was still deciding to be blue. Their call was not pretty. It was true. I kept that distinction in my pocket like a ticket I would not lose.",
     "बार-हेडेड हंसों ने ऐसे आसमान पर रेखा सी दी जो अभी नीला होने का फैसला कर रहा था। उनकी आवाज़ सुंदर न थी। सच्ची थी। वह फर्क जेब में टिकट की तरह रखा, खोने न दूँगी।",
     "বাৰ-হেডেড হাঁহে এনে আকাশত ৰেখা চিলাইলে যি এতিয়াও নীলা হ'বলৈ সিদ্ধান্ত লৈ আছে। সিহঁতৰ মাত ধুনীয়া নাছিল। সঁচা আছিল। সেই প্ৰভেদ জেবত টিকটৰ দৰে ৰাখিলোঁ, হেৰুৱাব নালাগে।",
     "What stitched a line across the sky?", "आसमान पर रेखा किसने सी?", "আকাশত ৰেখা কোনে চিলাইলে?",
     "Bar-headed geese", "बार-हेडेड हंस", "বাৰ-হেডেড হাঁহ", "Passenger jets", "यात्री जेट", "যাত্ৰী জেট", "Kites from a mall", "मॉल की पतंगें", "মলৰ চিলনী",
     "Geese, a true call.", "हंस, सच्ची आवाज़।", "হাঁহ, সঁচা মাত।"),
    ("memory", "Tea arrived in a steel glass that burned the fingerprints off hurry. The driver said the park would keep its secrets if we kept our cameras down. I did. The mist was a better picture than any I owned.",
     "चाय स्टील गिलास में आई जिसने जल्दबाजी के अंगूठे जला दिए। ड्राइवर ने कहा पार्क राज़ रखेगा अगर कैमरे नीचे रहे। मैंने रखा। धुंध मेरे किसी फोटो से बेहतर तस्वीर थी।",
     "চাহ ষ্টীল গিলাচত আহিল যিয়ে খৰধৰৰ আঙুলি পুৰিলে। ড্ৰাইভাৰে ক'লে উদ্যানে গোপন ৰাখিব যদি কেমেৰা তলত থাকে। ৰাখিলোঁ। কুঁৱলী মোৰ কোনো ফটোতকৈ ভাল ছবি আছিল।",
     "What was the tea served in?", "चाय किसमें आई?", "চাহ কিহত আহিল?",
     "A steel glass", "स्टील गिलास", "ষ্টীল গিলাচ", "A china teacup set", "चीनी मिट्टी के प्याले", "চীনামাটিৰ কাপ", "A coconut shell from a bar", "बार का नारियल खोल", "বাৰৰ নাৰিকল খোল",
     "Steel glass, too hot for hurry.", "स्टील गिलास, जल्दबाजी के लिए गरम।", "ষ্টীল গিলাচ, খৰধৰৰ বাবে গৰম।"),
    ("riddle", "It has no hands and still tears cloth. It hides a hill until the hill breathes. What were we driving through at first light?",
     "हाथ नहीं, कपड़ा फाड़ती है। पहाड़ छुपाती है जब तक पहाड़ साँस न ले। भोर में हम किसमें चल रहे थे?",
     "হাত নাই, তথাপি কাপোৰ ফাটে। পাহাৰ লুকুৱায় যেতিয়ালৈকে পাহাৰে উশাহ নলয়। পুৱাতে আমি কিৰ মাজেৰে গৈছিলোঁ?",
     "What were we driving through?", "हम किसमें चल रहे थे?", "আমি কিৰ মাজেৰে গৈছিলোঁ?",
     "Morning mist", "सुबह की धुंध", "পুৱাৰ কুঁৱলী", "A car wash", "कार वॉश", "কাৰ ৱাছ", "A tunnel in Mumbai", "मुंबई की सुरंग", "মুম্বাইৰ সুৰংগ",
     "Mist, tearing like careful cloth.", "धुंध, सावधान कपड़े की तरह।", "কুঁৱলী, সাৱধান কাপোৰৰ দৰে।"),
    ("memory", "A deer flashed and was gone, which is the correct length for a wild thing. We did not chase. The jeep idled like a person thinking. Kaziranga does not reward the impatient with anything worth keeping.",
     "हिरन चमका और गया — जंगली चीज़ की सही लंबाई। पीछा न किया। जीप सोचते इंसान की तरह गुनगुनाई। काज़ीरंगा अधीर को रखने लायक कुछ नहीं देता।",
     "হৰিণ জিলিকি গ'ল — বন্য বস্তুৰ শুদ্ধ দৈৰ্ঘ্য। খেদি নগ'লোঁ। জিপে ভাবি থকা মানুহৰ দৰে ৰ'ল। কাজিৰঙাই অধীৰক ৰাখিবলগীয়া একো নিদিয়ে।",
     "What flashed and was gone?", "क्या चमका और चला गया?", "কি জিলিকি গ'ল?",
     "A deer", "हिरन", "হৰিণ", "A celebrity convoy", "सेलिब्रिटी का काफिला", "চেলিব্ৰিটিৰ কাফেলা", "A drone show", "ड्रोन शो", "ড্ৰোন শ্ব'",
     "A deer, brief as it should be.", "हिरन, जितना संक्षिप्त चाहिए।", "হৰিণ, যিমান চুটি লাগে।"),
    ("memory", "When we turned back, the mist had finished its sentence. The grass was only grass again, which is also a wonder if you have been paying attention.",
     "वापस मुड़े तो धुंध ने वाक्य खत्म कर दिया था। घास फिर केवल घास थी — ध्यान दिया हो तो यह भी अचंभा है।",
     "ঘূৰিলে কুঁৱলীয়ে বাক্য শেষ কৰিছিল। ঘাঁহ আকৌ কেৱল ঘাঁহ — মন দিলে সেও আচৰিত।",
     "What had the mist finished?", "धुंध ने क्या खत्म किया?", "কুঁৱলীয়ে কি শেষ কৰিলে?",
     "Its sentence / the hiding", "अपना वाक्य / छिपाना", "নিজৰ বাক্য / লুকুৱা", "A board exam", "बोर्ड परीक्षा", "ব'ৰ্ড পৰীক্ষা", "A cooking show", "कुकिंग शो", "ৰন্ধা শ্ব'",
     "The mist finished hiding.", "धुंध ने छिपाना खत्म किया।", "কুঁৱলীয়ে লুকুৱা শেষ কৰিলে।"),
 ]),
]


def add_more():
    for item in MORE:
        add_pack(*item)


add_more()

# Remaining unique stories (16) — still full 8-beat literary rows
REST = []


def R(*args):
    REST.append(args)


# Magh Bihu meji
R("magh-meji", "The Magh Bihu meji", "माघ बिहू की मेजी", "মাঘ বিহুৰ মেজি",
  "Morning found a ring of ash. The field had punctuated the year.",
  "सुबह राख का घेरा। खेत ने साल को विराम दिया।",
  "ৰাতিপুৱা ছাইৰ ঘেৰা। পথাৰে বছৰক ৰখা দিলে।",
  [
    ("memory", "The meji was a careful hill of bamboo, thatch, and last year’s stubbornness. Children had already walked around it until the path was a prayer. At night the fire made a small sun that belonged to the whole village and to nobody’s kitchen.",
     "मेजी बाँस, फूस, और पिछले साल की ज़िद की सावधानी से बनी पहाड़ी। बच्चे उसके चारों ओर घूमे जब तक रास्ता प्रार्थना न बन गया। रात को आग ने छोटा सूरज बनाया जो पूरे गाँव का था, किसी रसोई का नहीं।",
     "মেজি বাঁহ, খেৰ, আৰু যোৱা বছৰৰ জেদৰ সাৱধান পাহাৰ। ল'ৰা-ছোৱালীয়ে ঘূৰিলে যেতিয়ালৈকে পথ প্ৰাৰ্থনা নহয়। ৰাতি জুইয়ে সৰু সূৰ্য বনালে যি গোটেই গাঁৱৰ, কাৰো ৰান্ধনি ঘৰৰ নহয়।",
     "What was the meji made of?", "मेजी किसकी बनी थी?", "মেজি কিৰেৰে বনা?",
     "Bamboo and thatch", "बाँस और फूस", "বাঁহ আৰু খেৰ", "Concrete and glass", "कंक्रीट और कांच", "কংক্ৰিট আৰু কাঁচ", "Plastic chairs", "प्लास्टिक कुर्सियाँ", "প্লাষ্টিক চকী",
     "Bamboo, thatch, last year’s stubbornness.", "बाँस, फूस, पिछले साल की ज़िद।", "বাঁহ, খেৰ, যোৱা বছৰৰ জেদ।"),
    ("memory", "Urad pitha arrived on a steel plate that had served three generations of oil. Sesame hid inside like a secret that wanted teeth, not gossip. Nobody counted. Counting would have insulted the fire.",
     "उड़द पिठा स्टील थाली पर आया जिसने तीन पीढ़ियों का तेल देखा। तिल अंदर राज़ की तरह, दाँत चाहता, गप नहीं। किसी ने न गिना। गिनती आग का अपमान होती।",
     "মাহ পিঠা ষ্টীল থালীত আহিল যি তিনি পুৰুষৰ তেল দেখিছে। তিল ভিতৰত গোপন, দাঁত বিচাৰে, গপ নহয়। কোনেও নগণিলে। গণনা জুইৰ অপমান।",
     "What sweet came on the steel plate?", "स्टील थाली पर कौन-सी मिठाई आई?", "ষ্টীল থালীত কোন মিঠা আহিল?",
     "Urad pitha with sesame", "तिल वाला उड़द पिठा", "তিলৰ মাহ পিঠা", "Tiramisu", "तिरामिसु", "তিৰামিছু", "Cotton candy", "गुलाबी मिठाई", "তুলা মিঠা",
     "Urad pitha, sesame inside.", "उड़द पिठा, अंदर तिल।", "মাহ পিঠা, ভিতৰত তিল।"),
    ("riddle", "I am built to die in one night and still feed a year with meaning. Children walk a long path around me. What stood in the field before dawn?",
     "एक रात मरने को बनी, फिर भी साल को अर्थ से पालती। बच्चे मेरे चारों ओर लंबा रास्ता चलते। भोर से पहले खेत में क्या खड़ा था?",
     "এৰাতি মৰিবলৈ বনা, তথাপি বছৰক অৰ্থৰে পোহে। শিশুৱে মোৰ চাৰিওফালে দীঘল পথ খোজে। পুৱাৰ আগতে পথাৰত কি থিয় আছিল?",
     "What stood in the field?", "खेत में क्या खड़ा था?", "পথাৰত কি থিয় আছিল?",
     "The meji", "मेजी", "মেজি", "A petrol pump", "पेट्रोल पंप", "পেট্ৰল পাম্প", "A statue of a cricketer", "क्रिकेटर की मूर्ति", "ক্ৰিকেটাৰৰ মূৰ্তি",
     "The meji, built to burn.", "मेजी, जलने को बनी।", "মেজি, জ্বলিবলৈ বনা।"),
    ("memory", "Smoke sat in our hair like a relative who would not leave till morning. Tea tasted of it on purpose. Backs were warm; faces were too close to the flame and nobody minded. Magh is allowed to be a little dangerous.",
     "धुआँ बालों में रिश्तेदार की तरह सुबह तक बैठा। चाय में जानबूझकर वही स्वाद। पीठ गुनगुनी; चेहरे आग के बहुत पास, किसी को ऐतराज़ न। माघ को थोड़ा खतरनाक होने दिया जाता है।",
     "ধোঁৱা চুলিত আত্মীয়ৰ দৰে ৰাতিপুৱালৈ বহি থাকিল। চাহত জানি-বুজি সেই সোৱাদ। পিঠি গৰম; মুখ জুইৰ ওচৰ, কাৰো আপত্তি নাই। মাঘক অলপ বিপদজনক হ'বলৈ দিয়া হয়।",
     "What sat in our hair till morning?", "सुबह तक बालों में क्या बैठा?", "ৰাতিপুৱালৈ চুলিত কি বহি থাকিল?",
     "Smoke", "धुआँ", "ধোঁৱা", "Glitter from a club", "क्लब की ग्लिटर", "ক্লাবৰ গ্লিটাৰ", "Sea salt", "समुद्री नमक", "সাগৰৰ নিমখ",
     "Smoke, a relative till dawn.", "धुआँ, सुबह तक रिश्तेदार।", "ধোঁৱা, পুৱালৈ আত্মীয়।"),
    ("memory", "An old man named the directions as if the fire needed introductions: river that way, bamboo that way, the dead that way, the living here. We nodded. Introductions are part of harvest.",
     "बुजुर्ग ने दिशाएँ बताईं जैसे आग को परिचय चाहिए — उधर नदी, उधर बाँस, उधर गए हुए, यहाँ जीते। हमने सिर हिलाया। परिचय फसल का हिस्सा है।",
     "বুঢ়াই দিশ বतালে যেন জুইক চিনাকি লাগে — সিফালে নদী, সিফালে বাঁহ, সিফালে যোৱা, ইয়াত জীয়া। মুৰ দুলালোঁ। চিনাকি শস্যৰ অংশ।",
     "Who named the directions?", "दिशाएँ किसने बताईं?", "দিশ কোনে বতালে?",
     "An old man", "एक बुजुर्ग", "এজন বুঢ়া", "A GPS voice", "जीपीएस आवाज़", "জিপিএছ মাত", "A flight attendant", "फ्लाइट अटेंडेंट", "ফ্লাইট এটেণ্ডেণ্ট",
     "An old man, introducing the fire.", "बुजुर्ग, आग का परिचय।", "বুঢ়া, জুইৰ চিনাকি।"),
    ("riddle", "After I am gone I leave a ring you must not sweep too soon. What punctuation did the field keep at dawn?",
     "जाने के बाद घेरा छोड़ती हूँ जिसे जल्दी न झाड़ो। भोर में खेत ने कौन-सा विराम रखा?",
     "যোৱাৰ পাছত ঘেৰা থওঁ যি সোনকালে নুছাব। পুৱাতে পথাৰে কোন ৰখা ৰাখিলে?",
     "What did morning find?", "सुबह को क्या मिला?", "ৰাতিপুৱা কি পালে?",
     "A ring of ash", "राख का घेरा", "ছাইৰ ঘেৰা", "A traffic roundabout", "ट्रैफिक गोल चक्कर", "ট্ৰাফিক ঘূৰণীয়া", "Confetti", "कंफ़ेटी", "কনফেটি",
     "Ash, a ring in the field.", "राख, खेत में घेरा।", "ছাই, পথাৰত ঘেৰা।"),
    ("memory", "Children’s long path around the meji had been a game and a vow. I walked it once more in daylight, smaller now, or the fire had been larger. Both can be true in Magh.",
     "मेजी के चारों ओर बच्चों का लंबा रास्ता खेल भी था, प्रतिज्ञा भी। दिन में एक बार फिर चला, मैं छोटी या आग बड़ी। माघ में दोनों सच हो सकते।",
     "মেজিৰ চাৰিওফালে শিশুৰ দীঘল পথ খেলও আছিল, প্ৰতিজ্ঞাও। দিনত আকৌ খোজিলোঁ, মই সৰু নতুবা জুই ডাঙৰ। মাঘত দুয়োটা সঁচা হ'ব পাৰে।",
     "What had the children walked?", "बच्चों ने क्या चला था?", "শিশুৱে কি খোজিছিল?",
     "A long path around the meji", "मेजी के चारों ओर लंबा रास्ता", "মেজিৰ চাৰিওফালে দীঘল পথ", "A mall corridor", "मॉल का गलियारा", "মলৰ গলি", "An airport queue", "एयरपोर्ट की कतार", "বিমানবন্দৰৰ শাৰী",
     "The long path around the fire.", "आग के चारों ओर लंबा रास्ता।", "জুইৰ চাৰিওফালে দীঘল পথ।"),
    ("memory", "We drank smoky tea and did not wash our hands at once. Some soot should travel home. That is how a year knows it was witnessed.",
     "धुएँ वाली चाय पी, हाथ तुरंत न धोए। कुछ कालिख घर तक जाए। साल को पता चले कि कोई गवाह था।",
     "ধোঁৱাৰ চাহ খালোঁ, হাত লগে নুধুলোঁ। কিছু কলি ঘৰলৈ যাওক। বছৰে জানক সাক্ষী আছিল।",
     "What tea did we drink after?", "बाद में कौन-सी चाय पी?", "পাছত কোন চাহ খালোঁ?",
     "Smoky tea", "धुएँ वाली चाय", "ধোঁৱাৰ চাহ", "Iced latte", "आइस लैटे", "আইচ লেটে", "Bubble tea", "बबल टी", "বাবল টী",
     "Smoky tea, soot allowed home.", "धुएँ वाली चाय, कालिख घर तक।", "ধোঁৱাৰ চাহ, কলি ঘৰলৈ।"),
  ])


def remaining_story_defs():
    """Return list of (sid, te,th,ta, ce,ch,ca, rows) for the rest."""
    return REST + [
("school-verandah", "The school verandah", "स्कूल का बरामदा", "স্কুলৰ বাৰাণ্ডা",
 "Years later the verandah was smaller. The neem was taller. That is how time argues.",
 "सालों बाद बरामदा छोटा। नीम लंबा। समय ऐसे बहस करता है।",
 "বছৰৰ পাছত বাৰাণ্ডা সৰু। নিম ওখ। সময় তেনেকুৱা তৰ্ক কৰে।",
 [
    ("memory", "The verandah was red oxide, cool even in April. Wet chalk squeaked the date as if the wall needed reminding that we had arrived. Our teacher in a white sari with a red border stood like a flag that had learned to be kind. The neem outside dropped bitter shade on the tiffin tins.",
     "बरामदा लाल ऑक्साइड, अप्रैल में भी ठंडा। गीला चाक तारीख चींची जैसे दीवार को याद दिलाना हो कि हम आ गए। सफ़ेद साड़ी लाल पल्लू वाली मैडम झंडे की तरह जो दया सीख गया हो। बाहर नीम ने टिफिन टीन पर कड़वी छाँव गिराई।",
     "বাৰাণ্ডা ৰঙা অক্সাইড, এপ্ৰিলতো ঠাণ্ডা। তিতা খৰিয়ে তাৰিখ চিঞৰিলে যেন বেৰক মনত পেলাব লাগে আমি আহিছোঁ। বগা শাড়ী ৰঙা পাৰৰ শিক্ষয়িত্ৰী পতাকাৰ দৰে যি দয়া শিকিছে। বাহিৰৰ নিমে টিফিন টিনত তিতা ছাঁ পেলালে।",
     "What colour was the verandah floor?", "बरामदे का फर्श किस रंग का?", "বাৰাণ্ডাৰ চজনা কি ৰঙৰ?",
     "Red oxide", "लाल ऑक्साइड", "ৰঙা অক্সাইড", "Airport grey", "एयरपोर्ट सा धूसर", "বিমানবন্দৰৰ ধোঁৱা", "Gym rubber blue", "जिम का नीला रबर", "জিমৰ নীলা ৰবৰ",
     "Red oxide, cool in April.", "लाल ऑक्साइड, अप्रैल में ठंडा।", "ৰঙা অক্সাইড, এপ্ৰিলত ঠাণ্ডা।"),
    ("memory", "She wrote with chalk that left a white moustache on her wrist. We copied as if the letters might run away. A crow argued with the bell. The bell won, which is the only sports result a school needs.",
     "चाक से लिखा, कलाई पर सफ़ेद मूँछ। हमने नकल की जैसे अक्षर भाग जाएँ। कौए ने घंटी से बहस की। घंटी जीती — स्कूल को बस यही खेल परिणाम चाहिए।",
     "খৰিৰে লিখিলে, ডিঙিত বগা গোঁফ। আমি নকল কৰিলোঁ যেন আখৰ পলায়। কাউৰীয়ে ঘণ্টাৰ সৈতে তৰ্ক কৰিলে। ঘণ্টাই জিকিলে — স্কুলক সেই খেলৰ ফলহে লাগে।",
     "What left a white moustache on her wrist?", "कलाई पर सफ़ेद मूँछ किसने छोड़ी?", "ডিঙিত বগা গোঁফ কিয়ে থ'লে?",
     "Chalk", "चाक", "খৰি", "Shaving foam", "शेविंग फोम", "শ্বেভিং ফোম", "Icing sugar", "आइसिंग शुगर", "আইচিং চেনি",
     "Wet chalk on the wrist.", "कलाई पर गीला चाक।", "ডিঙিত তিতা খৰি।"),
    ("riddle", "I am bitter shade and medicine. Children climb me after the last bell if the mali is looking elsewhere. What tree kept the tiffin cool?",
     "मैं कड़वी छाँव और दवा हूँ। आखिरी घंटी के बाद बच्चे चढ़ते हैं अगर माली दूसरी ओर देखे। टिफिन किस पेड़ ने ठंडा रखा?",
     "মই তিতা ছাঁ আৰু ঔষধ। শেষ ঘণ্টাৰ পাছত ল'ৰা-ছোৱালী উঠে যদি মালী আনফালে চায়। টিফিন কোন গছে ঠাণ্ডা ৰাখিলে?",
     "Which tree stood outside?", "बाहर कौन-सा पेड़ था?", "বাহিৰত কোন গছ আছিল?",
     "The neem", "नीम", "নিম", "A cactus", "कैक्टस", "কেকটাছ", "A Christmas fir", "क्रिसमस फर", "ক্ৰিছমাছ ফাৰ",
     "Neem shade on the tins.", "टीन पर नीम की छाँव।", "টিনত নিমৰ ছাঁ।"),
    ("memory", "Tiffin was puffed rice with mustard oil and a green chilli that knew our names. We ate sitting on the verandah edge, legs swinging toward a future that still included this exact hour. Nobody photographed it. That is why it lasted.",
     "टिफिन मुरमुरा, सरसों तेल, हरी मिर्च जो हमारे नाम जानती थी। बरामदे की धार पर बैठे खाया, पाँव उसी घंटे वाले भविष्य की ओर झूले। किसी ने फोटो न खींची। इसलिए टिकी।",
     "টিফিন মুৰমুৰা, সৰিয়হ তেল, কেঁচা জলকীয়া যি আমাৰ নাম জানিছিল। বাৰাণ্ডাৰ কাষত বহি খালোঁ, ভৰি সেই ঘণ্টাৰ ভৱিষ্যতলৈ দুলিল। কোনেও ফটো নোলালে। সেয়ে থাকিল।",
     "What was in the tiffin?", "टिफिन में क्या था?", "টিফিনত কি আছিল?",
     "Puffed rice with mustard oil", "सरसों तेल वाला मुरमुरा", "সৰিয়হ তেলৰ মুৰমুৰা", "Sushi rolls", "सुशी रोल", "চুচি ৰোল", "Protein bars", "प्रोटीन बार", "প্ৰ'টিন বাৰ",
     "Puffed rice, chilli, mustard oil.", "मुरमुरा, मिर्च, सरसों तेल।", "মুৰমুৰা, জলকীয়া, সৰিয়হ তেল।"),
    ("memory", "The bell was not pretty. It was a piece of iron with a job. When it spoke, even the crow paused. I still hear it when a pressure cooker sings too confidently.",
     "घंटी सुंदर न थी। लोहे का टुकड़ा जिसकी नौकरी थी। जब बोली, कौआ भी रुका। प्रेशर कुकर जब बहुत आत्मविश्वास से गाता है तब भी सुनाई देती है।",
     "ঘণ্টা ধুনীয়া নাছিল। লোহাৰ টুকুৰা যাৰ চাকৰি আছিল। যেতিয়া ক'লে, কাউৰীও ৰ'ল। প্ৰেছাৰ কুকাৰে যেতিয়া বৰ আত্মবিশ্বাসেৰে গায় তেতিয়াও শুনোঁ।",
     "What paused when the bell spoke?", "घंटी बोलने पर क्या रुका?", "ঘণ্টাই ক'লে কি ৰ'ল?",
     "Even the crow", "कौआ भी", "কাউৰীও", "A jet engine", "जेट इंजन", "জেট ইঞ্জিন", "The stock market", "शेयर बाजार", "শ্বেয়াৰ বজাৰ",
     "The crow paused for the bell.", "घंटी के लिए कौआ रुका।", "ঘণ্টাৰ বাবে কাউৰী ৰ'ল।"),
    ("riddle", "Sour, stolen from a neighbour’s tree, wrapped in a page of homework. What fruit stained the afternoon?",
     "खट्टा, पड़ोसी के पेड़ से चुराया, होमवर्क के पन्ने में लिपटा। दोपहर किस फल ने दाग दी?",
     "টেঙা, চুবুৰীয়াৰ গছৰ পৰা চুৰ, ঘৰুৱা কামৰ পাতত মেৰাই। দুপৰীয়া কোন ফলে দাগ দিলে?",
     "What sour fruit came after class?", "कक्षा बाद कौन-सा खट्टा फल?", "ক্লাছৰ পাছত কোন টেঙা ফল?",
     "The neighbour’s sour fruit", "पड़ोसी का खट्टा फल", "চুবুৰীয়াৰ টেঙা ফল", "Imported kiwi crate", "आयातित कीवी", "আমদানি কীৱি", "A donut", "डोनट", "ড'নাট",
     "Sour fruit in homework paper.", "होमवर्क कागज़ में खट्टा फल।", "ঘৰুৱা কামৰ কাকতত টেঙা ফল।"),
    ("memory", "Years later the verandah had shrunk or I had grown, which is the same insult. The neem had not shrunk. Trees refuse to participate in our nostalgia fairly.",
     "सालों बाद बरामदा सिकुड़ गया या मैं बढ़ गई, एक ही अपमान। नीम न सिकुड़ा। पेड़ हमारी यादों में निष्पक्ष भाग नहीं लेते।",
     "বছৰৰ পাছত বাৰাণ্ডা কুঁচি গ'ল নতুবা মই বাঢ়িলোঁ, একে অপমান। নিম নুকুচিলে। গছে আমাৰ নস্টালজিয়াত ন্যায্য ভাগ নলয়।",
     "What had grown taller?", "क्या ऊँचा हो गया था?", "কি ওখ হ'ল?",
     "The neem", "नीम", "নিম", "The blackboard", "ब्लैकबोर्ड", "ব্লেকব'ৰ্ড", "The tiffin box", "टिफिन बॉक्स", "টিফিন বাকচ",
     "The neem was taller.", "नीम लंबा था।", "নিম ওখ আছিল।"),
    ("memory", "I stood where the swinging legs had been and did not take a picture. The hour was already complete. Some verandahs do not need to trend.",
     "झूलते पाँवों वाली जगह खड़ी रही, फोटो न ली। घंटा पहले से पूरा था। कुछ बरामदों को ट्रेंड होने की ज़रूरत नहीं।",
     "দুলি থকা ভৰিৰ ঠাইত থিয় হ'লোঁ, ফটো নোলালোঁ। ঘণ্টা ইতিমধ্যে সম্পূৰ্ণ। কিছু বাৰাণ্ডাক ট্ৰেণ্ড হ'ব নালাগে।",
     "Did I photograph the verandah?", "क्या मैंने बरामदे की फोटो ली?", "বাৰাণ্ডাৰ ফটো ল'লোঁনে?",
     "No", "नहीं", "নহয়", "Yes, for a reel", "हाँ, रील के लिए", "হয়, ৰীলৰ বাবে", "I livestreamed assembly", "असेंबली लाइव की", "এছেম্বলী লাইভ কৰিলোঁ",
     "No photograph. The hour was complete.", "फोटो नहीं। घंटा पूरा था।", "ফটো নাই। ঘণ্টা সম্পূৰ্ণ আছিল।"),
 ]),
    ]


for item in remaining_story_defs():
    add_pack(*item)


KEEP_IDS = {"tea-garden-dawn", "bihu-courtyard", "brahmaputra-ferry", "grandmother-kitchen"}


def extract_existing():
    text = SRC.read_text(encoding="utf-8")
    m = re.search(r"export const STORY_SCENARIOS = (\[.*?\n\]);", text, re.S)
    if not m:
        raise SystemExit("Could not find STORY_SCENARIOS array")
    arr = json.loads(m.group(1))
    keep = [s for s in arr if s.get("id") in KEEP_IDS]
    if len(keep) < 4:
        keep = arr[:4]
    return text, keep


def main():
    prefix, keep = extract_existing()
    # de-dupe EXTRA ids
    seen = {s["id"] for s in keep}
    extra = []
    for s in EXTRA:
        if s["id"] in seen:
            continue
        seen.add(s["id"])
        extra.append(s)
    all_stories = keep + extra
    print("keep", [s["id"] for s in keep], "extra", len(extra), "total", len(all_stories))

    header = prefix.split("export const STORY_SCENARIOS")[0]
    payload = json.dumps(all_stories, ensure_ascii=False, indent=2)
    out = header + "export const STORY_SCENARIOS = " + payload + ";\n\n"
    out += """export const STORY_COUNT = STORY_SCENARIOS.length;

export function pickStory() {
  let last = '';
  try { last = localStorage.getItem(LAST_KEY) || ''; } catch { last = ''; }
  const pool = STORY_SCENARIOS.filter((item) => item.id !== last);
  const next = pool[Math.floor(Math.random() * pool.length)] || STORY_SCENARIOS[0];
  try { localStorage.setItem(LAST_KEY, next.id); } catch { /* ignore */ }
  return next;
}
"""
    SRC.write_text(out, encoding="utf-8")
    print("Wrote", SRC, "stories", len(all_stories))


if __name__ == "__main__":
    main()
