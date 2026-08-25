import { SCHEME_HI_NAMES } from './schemeHiNames.js';
import { SCHEME_TRANSLATIONS } from './schemeTranslations.js';

const CAT_KEY = {
  pension: 'services.catPension',
  legal: 'services.catLegal',
  housing: 'services.catHousing',
  education: 'services.catEducation',
  employment: 'services.catEmployment',
  health: 'services.catHealth',
  childcare: 'services.catChildcare',
  family: 'services.catFamily',
  mental: 'services.catMental',
  elderly: 'services.catElderly',
  assistive: 'services.catAssistive',
  telehealth: 'services.catTelehealth',
  caregiver: 'services.catCaregiver',
};

const SUBCATEGORY = {
  'Monthly Pension': { hi: 'मासिक पेंशन', bn: 'মাসিক পেনশন', ta: 'மாதாந்திர ஓய்வூதியம்', te: 'నెలవారీ పెన్షన్', mr: 'मासिक पेन्शन', gu: 'માસિક પેન્શન', kn: 'ಮಾಸಿಕ ಪಿಂಚಣಿ', ml: 'മാസിക പെൻഷൻ', pa: 'ਮਹੀਨਾਵਾਰ ਪੈਨਸ਼ਨ' },
  'Housing / Infrastructure': { hi: 'आवास / आधारभूत संरचना', bn: 'আবাসন / অবকাঠামো', ta: 'வீடு / உள்கட்டமைப்பு', te: 'గృహ / మౌలిక సదుపాయాలు', mr: 'निवास / पायाभूत सुविधा', gu: 'આવાસ / માળખું', kn: 'ವಸತಿ / ಮೂಲಸೌಕರ್ಯ', ml: 'ഭവനം / അടിസ്ഥാന സൗകര്യം', pa: 'ਰਿਹਾਇਸ਼ / ਢਾਂਚਾ' },
  'One-Time Financial Grant': { hi: 'एकमुश्त वित्तीय अनुदान', bn: 'এককালীন আর্থিক অনুদান', ta: 'ஒருமுறை நிதி மானியம்', te: 'ఒకేసారి ఆర్థిక గ్రాంట్', mr: 'एकवेळ आर्थिक अनुदान', gu: 'એકવારની નાણાકીય અનુદાન', kn: 'ಒಂದು ಬಾರಿ ಆರ್ಥಿಕ ಅನುದಾನ', ml: 'ഒറ്റത്തവണ ധനസഹായം', pa: 'ਇੱਕ ਵਾਰੀ ਵਿੱਤੀ ਗ੍ਰਾਂਟ' },
  'Skill & Livelihood': { hi: 'कौशल और आजीविका', bn: 'দক্ষতা ও জীবিকা', ta: 'திறன் மற்றும் வாழ்வாதாரம்', te: 'నైపుణ్యం & జీవనోపాధి', mr: 'कौशल्य आणि उपजीविका', gu: 'કૌશલ્ય અને આજીવિકા', kn: 'ಕೌಶಲ್ಯ ಮತ್ತು ಜೀವನೋಪಾಯ', ml: 'കഴിവും ഉപജീവനവും', pa: 'ਹੁਨਰ ਅਤੇ ਰੋਜ਼ੀ' },
  'Maternity Benefit': { hi: 'मातृत्व लाभ', bn: 'মাতৃত্ব সুবিধা', ta: 'மகப்பேறு நன்மை', te: 'మాతృత్వ ప్రయోజనం', mr: 'मातृत्व लाभ', gu: 'માતૃત્વ લાભ', kn: 'ಪ್ರಸೂತಿ ಪ್ರಯೋಜನ', ml: 'പ്രസവ ആനുകൂല്യം', pa: 'ਮਾਤਰੀ ਲਾਭ' },
  'Education Grant': { hi: 'शिक्षा अनुदान', bn: 'শিক্ষা অনুদান', ta: 'கல்வி மானியம்', te: 'విద్యా గ్రాంట్', mr: 'शिक्षण अनुदान', gu: 'શિક્ષણ અનુદાન', kn: 'ಶಿಕ್ಷಣ ಅನುದಾನ', ml: 'വിദ്യാഭ്യാസ ഗ്രാന്റ്', pa: 'ਸਿੱਖਿਆ ਗ੍ਰਾਂਟ' },
  'Free Legal Aid': { hi: 'निःशुल्क कानूनी सहायता', bn: 'বিনামূল্যে আইনি সহায়তা', ta: 'இலவச சட்ட உதவி', te: 'ఉచిత న్యాయ సహాయం', mr: 'मोफत कायदेशीर मदत', gu: 'મફત કાનૂની સહાય', kn: 'ಉಚಿತ ಕಾನೂನು ನೆರವು', ml: 'സൗജന്യ നിയമസഹായം', pa: 'ਮੁਫ਼ਤ ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ' },
  'Shelter & Rehabilitation': { hi: 'आश्रय और पुनर्वास', bn: 'আশ্রয় ও পুনর্বাসন', ta: 'தங்குமிடம் மற்றும் மறுவாழ்வு', te: 'ఆశ్రయం & పునరావాసం', mr: 'निवारा आणि पुनर्वसन', gu: 'આશ્રય અને પુનર્વસન', kn: 'ಆಶ್ರಯ ಮತ್ತು ಪುನರ್ವಸತಿ', ml: 'അഭയവും പുനരധിവാസവും', pa: 'ਪਨਾਹ ਅਤੇ ਪੁਨਰਵਾਸ' },
  'Microfinance / Livelihood': { hi: 'माइक्रोफाइनेंस / आजीविका', bn: 'মাইক্রোফাইন্যান্স / জীবিকা', ta: 'நுண்ணிய நிதி / வாழ்வாதாரம்', te: 'మైక్రోఫైనాన్స్ / జీవనోపాధి', mr: 'सूक्ष्मवित्त / उपजीविका', gu: 'માઇક્રોફાઇનાન્સ / આજીવિકા', kn: 'ಸೂಕ್ಷ್ಮ ಹಣಕಾಸು / ಜೀವನೋಪಾಯ', ml: 'മൈക്രോഫിനാൻസ് / ഉപജീവനം', pa: 'ਮਾਈਕ੍ਰੋਫਾਈਨੈਂਸ / ਰੋਜ਼ੀ' },
  'Subsidized Loan': { hi: 'सब्सिडीयुक्त ऋण', bn: 'ভর্তুকি ঋণ', ta: 'மானியக் கடன்', te: 'సబ్సిడీ రుణం', mr: 'अनुदानित कर्ज', gu: 'સબસિડી લોન', kn: 'ಸಬ್ಸಿಡಿ ಸಾಲ', ml: 'സബ്‌സിഡി വായ്പ', pa: 'ਸਬਸਿਡੀ ਲੋਨ' },
  'Remarriage Grant': { hi: 'पुनर्विवाह अनुदान', bn: 'পুনর্বিবাহ অনুদান', ta: 'மறுமண மானியம்', te: 'పునర్వివాహ గ్రాంట్', mr: 'पुनर्विवाह अनुदान', gu: 'પુનર્વિવાહ અનુદાન', kn: 'ಪುನರ್ವಿವಾಹ ಅನುದಾನ', ml: 'പുനർവിവാഹ ഗ്രാന്റ്', pa: 'ਮੁੜ-ਵਿਆਹ ਗ੍ਰਾਂਟ' },
  'Marriage Grant': { hi: 'विवाह अनुदान', bn: 'বিবাহ অনুদান', ta: 'திருமண மானியம்', te: 'వివాహ గ్రాంట్', mr: 'विवाह अनुदान', gu: 'લગ્ન અનુદાન', kn: 'ವಿವಾಹ ಅನುದಾನ', ml: 'വിവാഹ ഗ്രാന്റ്', pa: 'ਵਿਆਹ ਗ੍ਰਾਂਟ' },
  'Livelihood / SHG': { hi: 'आजीविका / स्वयं सहायता समूह', bn: 'জীবিকা / এসএইচজি', ta: 'வாழ்வாதாரம் / சுய உதவிக் குழு', te: 'జీవనోపాధి / SHG', mr: 'उपजीविका / स्वयंसाहाय्यता गट', gu: 'આજીવિકા / એસએચજી', kn: 'ಜೀವನೋಪಾಯ / ಸ್ವಸಹಾಯ ಗುಂಪು', ml: 'ഉപജീവനം / എസ്‌എച്ച്‌ജി', pa: 'ਰੋਜ਼ੀ / ਸਵੈ-ਸਹਾਇਤਾ ਗਰੁੱਪ' },
  'Micro-enterprise Loan': { hi: 'सूक्ष्म उद्यम ऋण', bn: 'ক্ষুদ্র উদ্যোগ ঋণ', ta: 'சிறு தொழில் கடன்', te: 'సూక్ష్మ పరిశ్రమ రుణం', mr: 'सूक्ष्म उद्योग कर्ज', gu: 'સૂક્ષ્મ ઉદ્યોગ લોન', kn: 'ಸೂಕ್ಷ್ಮ ಉದ್ಯಮ ಸಾಲ', ml: 'സൂക്ഷ്മസംരംഭ വായ്പ', pa: 'ਛੋਟਾ ਉੱਦਮ ਲੋਨ' },
  'Business Loan Subsidy': { hi: 'व्यापार ऋण सब्सिडी', bn: 'ব্যবসা ঋণ ভর্তুকি', ta: 'வணிகக் கடன் மானியம்', te: 'వ్యాపార రుణ సబ్సిడీ', mr: 'व्यवसाय कर्ज अनुदान', gu: 'વ્યવસાય લોન સબસિડી', kn: 'ವ್ಯಾಪಾರ ಸಾಲ ಸಬ್ಸಿಡಿ', ml: 'ബിസിനസ് വായ്പ സബ്‌സിഡി', pa: 'ਕਾਰੋਬਾਰੀ ਲੋਨ ਸਬਸਿਡੀ' },
  'Skill & Equipment': { hi: 'कौशल और उपकरण', bn: 'দক্ষতা ও সরঞ্জাম', ta: 'திறன் மற்றும் உபகரணம்', te: 'నైపుణ్యం & పరికరాలు', mr: 'कौशल्य आणि उपकरणे', gu: 'કૌશલ્ય અને સાધનો', kn: 'ಕೌಶಲ್ಯ ಮತ್ತು ಉಪಕರಣ', ml: 'കഴിവും ഉപകരണവും', pa: 'ਹੁਨਰ ਅਤੇ ਉਪਕਰਣ' },
  'Livelihood Kit': { hi: 'आजीविका किट', bn: 'জীবিকা কিট', ta: 'வாழ்வாதாரக் கருவித்தொகுப்பு', te: 'జీవనోపాధి కిట్', mr: 'उपजीविका किट', gu: 'આજીવિકા કિટ', kn: 'ಜೀವನೋಪಾಯ ಕಿಟ್', ml: 'ഉപജീവന കിറ്റ്', pa: 'ਰੋਜ਼ੀ ਕਿੱਟ' },
  'Direct Financial Aid': { hi: 'सीधी वित्तीय सहायता', bn: 'সরাসরি আর্থিক সহায়তা', ta: 'நேரடி நிதி உதவி', te: 'నేరుగా ఆర్థిక సహాయం', mr: 'थेट आर्थिक मदत', gu: 'સીધી નાણાકીય સહાય', kn: 'ನೇರ ಆರ್ಥಿಕ ನೆರವು', ml: 'നേരിട്ടുള്ള ധനസഹായം', pa: 'ਸਿੱਧੀ ਵਿੱਤੀ ਮਦਦ' },
  'Education Loan Subsidy': { hi: 'शिक्षा ऋण सब्सिडी', bn: 'শিক্ষা ঋণ ভর্তুকি', ta: 'கல்விக் கடன் மானியம்', te: 'విద్యా రుణ సబ్సిడీ', mr: 'शिक्षण कर्ज अनुदान', gu: 'શિક્ષણ લોન સબસિડી', kn: 'ಶಿಕ್ಷಣ ಸಾಲ ಸಬ್ಸಿಡಿ', ml: 'വിദ്യാഭ്യാസ വായ്പ സബ്‌സിഡി', pa: 'ਸਿੱਖਿਆ ਲੋਨ ਸਬਸਿਡੀ' },
  'Micro-Credit': { hi: 'सूक्ष्म ऋण', bn: 'ক্ষুদ্র ঋণ', ta: 'நுண் கடன்', te: 'సూక్ష్మ రుణం', mr: 'सूक्ष्म कर्ज', gu: 'સૂક્ષ્મ ધિરાણ', kn: 'ಸೂಕ್ಷ್ಮ ಸಾಲ', ml: 'സൂക്ഷ്മ വായ്പ', pa: 'ਛੋਟਾ ਕਰਜ਼ਾ' },
  'Rehabilitation & Loan': { hi: 'पुनर्वास और ऋण', bn: 'পুনর্বাসন ও ঋণ', ta: 'மறுவாழ்வு மற்றும் கடன்', te: 'పునరావాసం & రుణం', mr: 'पुनर्वसन आणि कर्ज', gu: 'પુનર્વસન અને લોન', kn: 'ಪುನರ್ವಸತಿ ಮತ್ತು ಸಾಲ', ml: 'പുനരധിവാസവും വായ്പയും', pa: 'ਪੁਨਰਵਾਸ ਅਤੇ ਲੋਨ' },
  'Self-Employment Loan': { hi: 'स्वरोज़गार ऋण', bn: 'স্বনিযুক্তি ঋণ', ta: 'சுயதொழில் கடன்', te: 'స్వయం ఉపాధి రుణం', mr: 'स्वरोजगार कर्ज', gu: 'સ્વરોજગાર લોન', kn: 'ಸ್ವಯಂ ಉದ್ಯೋಗ ಸಾಲ', ml: 'സ്വയംതൊഴിൽ വായ്പ', pa: 'ਸਵੈ-ਰੁਜ਼ਗਾਰ ਲੋਨ' },
  'Livelihood Grant': { hi: 'आजीविका अनुदान', bn: 'জীবিকা অনুদান', ta: 'வாழ்வாதார மானியம்', te: 'జీవనోపాధి గ్రాంట్', mr: 'उपजीविका अनुदान', gu: 'આજીવિકા અનુદાન', kn: 'ಜೀವನೋಪಾಯ ಅನುದಾನ', ml: 'ഉപജീവന ഗ്രാന്റ്', pa: 'ਰੋਜ਼ੀ ਗ੍ਰਾਂਟ' },
  'Micro-credit Loan': { hi: 'सूक्ष्म ऋण', bn: 'ক্ষুদ্রঋণ', ta: 'நுண் கடன்', te: 'సూక్ష్మ రుణం', mr: 'सूक्ष्म कर्ज', gu: 'સૂક્ષ્મ ધિરાણ લોન', kn: 'ಸೂಕ್ಷ್ಮ ಸಾಲ', ml: 'സൂക്ഷ്മ വായ്പ', pa: 'ਛੋਟਾ ਕਰਜ਼ਾ' },
  Scholarship: { hi: 'छात्रवृत्ति', bn: 'বৃত্তি', ta: 'உதவித்தொகை', te: 'స్కాలర్‌షిప్', mr: 'शिष्यवृत्ती', gu: 'શિષ્યવૃત્તિ', kn: 'ವಿದ್ಯಾರ್ಥಿವೇತನ', ml: 'സ്കോളർഷിപ്പ്', pa: 'ਸਕਾਲਰਸ਼ਿਪ' },
  'Child Welfare Aid': { hi: 'बाल कल्याण सहायता', bn: 'শিশু কল্যাণ সহায়তা', ta: 'குழந்தை நல உதவி', te: 'శిశు సంక్షేమ సహాయం', mr: 'बालकल्याण मदत', gu: 'બાળ કલ્યાણ સહાય', kn: 'ಮಕ್ಕಳ ಕಲ್ಯಾಣ ನೆರವು', ml: 'ശിശുക്ഷേമ സഹായം', pa: 'ਬਾਲ ਕਲਿਆਣ ਮਦਦ' },
  'Market Linkage': { hi: 'बाज़ार संपर्क', bn: 'বাজার সংযোগ', ta: 'சந்தை இணைப்பு', te: 'మార్కెట్ లింకేజ్', mr: 'बाजार जोडणी', gu: 'બજાર જોડાણ', kn: 'ಮಾರುಕಟ್ಟೆ ಸಂಪರ್ಕ', ml: 'വിപണി ബന്ധം', pa: 'ਬਾਜ਼ਾਰ ਜੋੜ' },
  'Entrepreneurship Grant': { hi: 'उद्यमिता अनुदान', bn: 'উদ্যোক্তা অনুদান', ta: 'தொழில்முனைவு மானியம்', te: 'వ్యవస్థాపక గ్రాంట్', mr: 'उद्योजकता अनुदान', gu: 'ઉદ્યોગસાહસિકતા અનુદાન', kn: 'ಉದ್ಯಮಶೀಲತೆ ಅನುದಾನ', ml: 'സംരംഭകത്വ ഗ്രാന്റ്', pa: 'ਉੱਦਮੀ ਗ੍ਰਾਂਟ' },
  'Child Care Allowance': { hi: 'बाल देखभाल भत्ता', bn: 'শিশু পরিচর্যা ভাতা', ta: 'குழந்தை பராமரிப்பு படி', te: 'శిశు సంరక్షణ అలవెన్స్', mr: 'बालसंगोपन भत्ता', gu: 'બાળ સંભાળ ભથ્થું', kn: 'ಮಕ್ಕಳ ಆರೈಕೆ ಭತ್ಯೆ', ml: 'ശിശുപരിപാലന അലവൻസ്', pa: 'ਬੱਚੇ ਦੀ ਦੇਖਭਾਲ ਭੱਤਾ' },
  'Skill Development': { hi: 'कौशल विकास', bn: 'দক্ষতা উন্নয়ন', ta: 'திறன் மேம்பாடு', te: 'నైపుణ్యాభివృద్ధి', mr: 'कौशल्य विकास', gu: 'કૌશલ્ય વિકાસ', kn: 'ಕೌಶಲ್ಯ ಅಭಿವೃದ್ಧಿ', ml: 'കഴിവ് വികസനം', pa: 'ਹੁਨਰ ਵਿਕਾਸ' },
  'Health Insurance': { hi: 'स्वास्थ्य बीमा', bn: 'স্বাস্থ্য বিমা', ta: 'சுகாதார காப்பீடு', te: 'ఆరోగ్య బీమా', mr: 'आरोग्य विमा', gu: 'આરોગ્ય વીમો', kn: 'ಆರೋಗ್ಯ ವಿಮೆ', ml: 'ആരോഗ്യ ഇൻഷുറൻസ്', pa: 'ਸਿਹਤ ਬੀਮਾ' },
  'Food Security': { hi: 'खाद्य सुरक्षा', bn: 'খাদ্য নিরাপত্তা', ta: 'உணவுப் பாதுகாப்பு', te: 'ఆహార భద్రత', mr: 'अन्न सुरक्षा', gu: 'અન્ન સુરક્ષા', kn: 'ಆಹಾರ ಭದ್ರತೆ', ml: 'ഭക്ഷ്യ സുരക്ഷ', pa: 'ਭੋਜਨ ਸੁਰੱਖਿਆ' },
  'Social Security / EPF': { hi: 'सामाजिक सुरक्षा / ईपीएफ', bn: 'সামাজিক নিরাপত্তা / ইপিএফ', ta: 'சமூகப் பாதுகாப்பு / EPF', te: 'సామాజిక భద్రత / EPF', mr: 'सामाजिक सुरक्षा / ईपीएफ', gu: 'સામાજિક સુરક્ષા / EPF', kn: 'ಸಾಮಾಜಿಕ ಭದ್ರತೆ / EPF', ml: 'സാമൂഹിക സുരക്ഷ / EPF', pa: 'ਸਮਾਜਿਕ ਸੁਰੱਖਿਆ / EPF' },
  'Health & Compensation': { hi: 'स्वास्थ्य और मुआवजा', bn: 'স্বাস্থ্য ও ক্ষতিপূরণ', ta: 'சுகாதாரம் மற்றும் இழப்பீடு', te: 'ఆరోగ్యం & పరిహారం', mr: 'आरोग्य आणि नुकसानभरपाई', gu: 'આરોગ્ય અને વળતર', kn: 'ಆರೋಗ್ಯ ಮತ್ತು ಪರಿಹಾರ', ml: 'ആരോഗ്യവും നഷ്ടപരിഹാരവും', pa: 'ਸਿਹਤ ਅਤੇ ਮੁਆਵਜ਼ਾ' },
  'Ex-Gratia Grant': { hi: 'अनुग्रह अनुदान', bn: 'অনুগ্রহ অনুদান', ta: 'அனுக்கிரக மானியம்', te: 'అనుగ్రహ గ్రాంట్', mr: 'अनुग्रह अनुदान', gu: 'અનુગ્રહ અનુદાન', kn: 'ಅನುಗ್ರಹ ಅನುದಾನ', ml: 'അനുഗ്രഹ ഗ്രാന്റ്', pa: 'ਅਨੁਗ੍ਰਹਿ ਗ੍ਰਾਂਟ' },
  'Monthly Relief': { hi: 'मासिक राहत', bn: 'মাসিক ত্রাণ', ta: 'மாதாந்திர நிவாரணம்', te: 'నెలవారీ సహాయం', mr: 'मासिक मदत', gu: 'માસિક રાહત', kn: 'ಮಾಸಿಕ ಪರಿಹಾರ', ml: 'മാസിക ആശ്വാസം', pa: 'ਮਹੀਨਾਵਾਰ ਰਾਹਤ' },
  'Housing Grant': { hi: 'आवास अनुदान', bn: 'আবাসন অনুদান', ta: 'வீட்டு மானியம்', te: 'గృహ గ్రాంట్', mr: 'निवास अनुदान', gu: 'આવાસ અનુદાન', kn: 'ವಸತಿ ಅನುದಾನ', ml: 'ഭവന ഗ്രാന്റ്', pa: 'ਰਿਹਾਇਸ਼ ਗ੍ਰਾਂਟ' },
  'Child Maintenance': { hi: 'बाल भरण-पोषण', bn: 'শিশু ভরণপোষণ', ta: 'குழந்தை பராமரிப்பு', te: 'శిశు పోషణ', mr: 'बाल सांभाळ', gu: 'બાળ નિર્વાહ', kn: 'ಮಕ್ಕಳ ನಿರ್ವಹಣೆ', ml: 'ശിശു പരിപാലനം', pa: 'ਬਾਲ ਭਰਣ-ਪੋਸ਼ਣ' },
  'Public Transport': { hi: 'सार्वजनिक परिवहन', bn: 'গণপরিবহন', ta: 'பொதுப் போக்குவரத்து', te: 'ప్రజా రవాణా', mr: 'सार्वजनिक वाहतूक', gu: 'જાહેર પરિવહન', kn: 'ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆ', ml: 'പൊതു ഗതാഗതം', pa: 'ਜਨਤਕ ਆਵਾਜਾਈ' },
  'Legal Aid Subsidy': { hi: 'कानूनी सहायता सब्सिडी', bn: 'আইনি সহায়তা ভর্তুকি', ta: 'சட்ட உதவி மானியம்', te: 'న్యాయ సహాయ సబ్సిడీ', mr: 'कायदेशीर मदत अनुदान', gu: 'કાનૂની સહાય સબસિડી', kn: 'ಕಾನೂನು ನೆರವು ಸಬ್ಸಿಡಿ', ml: 'നിയമസഹായ സബ്‌സിഡി', pa: 'ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ ਸਬਸਿਡੀ' },
  'Caregiver Pension': { hi: 'देखभालकर्ता पेंशन', bn: 'পরিচর্যাকারী পেনশন', ta: 'பராமரிப்பாளர் ஓய்வூதியம்', te: 'సంరక్షక పెన్షన్', mr: 'काळजीवाहू पेन्शन', gu: 'સંભાળક પેન્શન', kn: 'ಆರೈಕೆದಾರ ಪಿಂಚಣಿ', ml: 'പരിചാരക പെൻഷൻ', pa: 'ਦੇਖਭਾਲਕ ਪੈਨਸ਼ਨ' },
  'Food Subsidy': { hi: 'खाद्य सब्सिडी', bn: 'খাদ্য ভর্তুকি', ta: 'உணவு மானியம்', te: 'ఆహార సబ్సిడీ', mr: 'अन्न अनुदान', gu: 'અન્ન સબસિડી', kn: 'ಆಹಾರ ಸಬ್ಸಿಡಿ', ml: 'ഭക്ഷ്യ സബ്‌സിഡി', pa: 'ਭੋਜਨ ਸਬਸਿਡੀ' },
  'Interest Subvention': { hi: 'ब्याज छूट', bn: 'সুদ মওকুফ', ta: 'வட்டி மானியம்', te: 'వడ్డీ రాయితీ', mr: 'व्याज सवलत', gu: 'વ્યાજ છૂટ', kn: 'ಬಡ್ಡಿ ರಿಯಾಯಿತಿ', ml: 'പലിശ ഇളവ്', pa: 'ਵਿਆਜ ਛੋਟ' },
  'Enterprise Loan Subsidy': { hi: 'उद्यम ऋण सब्सिडी', bn: 'উদ্যোগ ঋণ ভর্তুকি', ta: 'தொழில் கடன் மானியம்', te: 'ఎంటర్‌ప్రైజ్ రుణ సబ్సిడీ', mr: 'उद्यम कर्ज अनुदान', gu: 'ઉદ્યોગ લોન સબસિડી', kn: 'ಉದ್ಯಮ ಸಾಲ ಸಬ್ಸಿಡಿ', ml: 'സംരംഭ വായ്പ സബ്‌സിഡി', pa: 'ਉੱਦਮ ਲੋਨ ਸਬਸਿਡੀ' },
  'Child Bond': { hi: 'बाल बॉन्ड', bn: 'শিশু বন্ড', ta: 'குழந்தை பத்திரம்', te: 'శిశు బాండ్', mr: 'बाल बॉंड', gu: 'બાળ બોન્ડ', kn: 'ಮಕ್ಕಳ ಬಾಂಡ್', ml: 'ശിശു ബോണ്ട്', pa: 'ਬਾਲ ਬਾਂਡ' },
  'Honorarium & Pension': { hi: 'मानदेय और पेंशन', bn: 'সম্মানি ও পেনশন', ta: 'கௌரவ ஊதியம் மற்றும் ஓய்வூதியம்', te: 'గౌరవ వేతనం & పెన్షన్', mr: 'मानधन आणि पेन्शन', gu: 'માનદેય અને પેન્શન', kn: 'ಗೌರವಧನ ಮತ್ತು ಪಿಂಚಣಿ', ml: 'ഓണറേറിയവും പെൻഷനും', pa: 'ਮਾਨਦੰਡ ਅਤੇ ਪੈਨਸ਼ਨ' },
  'Child Grant': { hi: 'बाल अनुदान', bn: 'শিশু অনুদান', ta: 'குழந்தை மானியம்', te: 'శిశు గ్రాంట్', mr: 'बाल अनुदान', gu: 'બાળ અનુદાન', kn: 'ಮಕ್ಕಳ ಅನುದಾನ', ml: 'ശിശു ഗ്രാന്റ്', pa: 'ਬਾਲ ਗ੍ਰਾਂਟ' },
  'Monthly Sustenance': { hi: 'मासिक निर्वाह', bn: 'মাসিক জীবিকা', ta: 'மாதாந்திர வாழ்வாதாரம்', te: 'నెలవారీ జీవనం', mr: 'मासिक निर्वाह', gu: 'માસિક નિર્વાહ', kn: 'ಮಾಸಿಕ ಜೀವನಾಧಾರ', ml: 'മാസിക ജീവനോപാധി', pa: 'ਮਹੀਨਾਵਾਰ ਗੁਜ਼ਾਰਾ' },
  'Technical Education Aid': { hi: 'तकनीकी शिक्षा सहायता', bn: 'কারিগরি শিক্ষা সহায়তা', ta: 'தொழில்நுட்பக் கல்வி உதவி', te: 'సాంకేతిక విద్య సహాయం', mr: 'तांत्रिक शिक्षण मदत', gu: 'તકનીકી શિક્ષણ સહાય', kn: 'ತಾಂತ್ರಿಕ ಶಿಕ್ಷಣ ನೆರವು', ml: 'സാങ്കേതിക വിദ്യാഭ്യാസ സഹായം', pa: 'ਤਕਨੀਕੀ ਸਿੱਖਿਆ ਮਦਦ' },
  Pension: { hi: 'पेंशन', bn: 'পেনশন', ta: 'ஓய்வூதியம்', te: 'పెన్షన్', mr: 'पेन्शन', gu: 'પેન્શન', kn: 'ಪಿಂಚಣಿ', ml: 'പെൻഷൻ', pa: 'ਪੈਨਸ਼ਨ' },
  'Property Rights': { hi: 'संपत्ति अधिकार', bn: 'সম্পত্তির অধিকার', ta: 'சொத்துரிமை', te: 'ఆస్తి హక్కులు', mr: 'मालमत्ता हक्क', gu: 'મિલકત અધિકાર', kn: 'ಆಸ್ತಿ ಹಕ್ಕುಗಳು', ml: 'സ്വത്തവകാശം', pa: 'ਜਾਇਦਾਦ ਹੱਕ' },
};

const STATES = {
  'Central / All India': { hi: 'केंद्र / अखिल भारत', bn: 'কেন্দ্র / সারা ভারত', ta: 'மையம் / அகில இந்தியா', te: 'కేంద్రం / అఖిల భారత్', mr: 'केंद्र / अखिल भारत', gu: 'કેન્દ્ર / અખિલ ભારત', kn: 'ಕೇಂದ್ರ / ಅಖಿಲ ಭಾರತ', ml: 'കേന്ദ്രം / അഖില ഭാരതം', pa: 'ਕੇਂਦਰ / ਅਖਿਲ ਭਾਰਤ' },
  'Uttar Pradesh': { hi: 'उत्तर प्रदेश' },
  Maharashtra: { hi: 'महाराष्ट्र' },
  'Tamil Nadu': { hi: 'तमिल नाडु' },
  Delhi: { hi: 'दिल्ली' },
  Haryana: { hi: 'हरियाणा' },
  Punjab: { hi: 'पंजाब' },
  Rajasthan: { hi: 'राजस्थान' },
  Karnataka: { hi: 'कर्नाटक' },
  'Andhra Pradesh': { hi: 'आंध्र प्रदेश' },
  'andhra pradesh': { hi: 'आंध्र प्रदेश' },
  Telangana: { hi: 'तेलंगाना' },
  Kerala: { hi: 'केरल' },
  Gujarat: { hi: 'गुजरात' },
  'Madhya Pradesh': { hi: 'मध्य प्रदेश' },
  Bihar: { hi: 'बिहार' },
  'West Bengal': { hi: 'पश्चिम बंगाल' },
  Odisha: { hi: 'ओडिशा' },
  Assam: { hi: 'असम' },
  'Himachal Pradesh': { hi: 'हिमाचल प्रदेश' },
  Uttarakhand: { hi: 'उत्तराखंड' },
  Jharkhand: { hi: 'झारखंड' },
  Chhattisgarh: { hi: 'छत्तीसगढ़' },
  Goa: { hi: 'गोवा' },
  'Jammu & Kashmir': { hi: 'जम्मू और कश्मीर' },
  Ladakh: { hi: 'लद्दाख' },
  Tripura: { hi: 'त्रिपुरा' },
  Manipur: { hi: 'मणिपुर' },
  Meghalaya: { hi: 'मेघालय' },
  Mizoram: { hi: 'मिजोरम' },
  Nagaland: { hi: 'नागालैंड' },
  Sikkim: { hi: 'सिक्किम' },
  'Arunachal Pradesh': { hi: 'अरुणाचल प्रदेश' },
  Chandigarh: { hi: 'चंडीगढ़' },
  Puducherry: { hi: 'पुदुचेरी' },
  'Andaman and Nicobar': { hi: 'अंडमान और निकोबार' },
  'Dadra & Nagar Haveli & Daman & Diu': { hi: 'दादरा और नगर हवेली और दमन और दीव' },
  Lakshadweep: { hi: 'लक्षद्वीप' },
  'Every State/UT': { hi: 'प्रत्येक राज्य / केंद्र शासित प्रदेश', bn: 'প্রতিটি রাজ্য/কেন্দ্রশাসিত অঞ্চল', ta: 'ஒவ்வொரு மாநிலம்/யூடி', te: 'ప్రతి రాష్ట్రం/యూటీ', mr: 'प्रत्येक राज्य/केंद्रशासित प्रदेश', gu: 'દરેક રાજ્ય/કેન્દ્રશાસિત પ્રદેશ', kn: 'ಪ್ರತಿ ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ', ml: 'ഓരോ സംസ്ഥാനം/കേന്ദ്രഭരണ പ്രദേശം', pa: 'ਹਰ ਰਾਜ/ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼' },
  'India / personal law': { hi: 'भारत / व्यक्तिगत कानून', bn: 'ভারত / ব্যক্তিগত আইন', ta: 'இந்தியா / தனிநபர் சட்டம்', te: 'భారత్ / వ్యక్తిగత చట్టం', mr: 'भारत / वैयक्तिक कायदा', gu: 'ભારત / વ્યક્તિગત કાયદો', kn: 'ಭಾರತ / ವೈಯಕ್ತಿಕ ಕಾನೂನು', ml: 'ഇന്ത്യ / വ്യക്തിഗത നിയമം', pa: 'ਭਾਰਤ / ਨਿੱਜੀ ਕਾਨੂੰਨ' },
};

const DOCS = {
  Aadhaar: { hi: 'आधार', bn: 'আধার', ta: 'ஆதார்', te: 'ఆధార్', mr: 'आधार', gu: 'આધાર', kn: 'ಆಧಾರ್', ml: 'ആധാർ', pa: 'ਆਧਾਰ' },
  'Aadhaar Card': { hi: 'आधार कार्ड' },
  'Aadhaar / ID proof': { hi: 'आधार / पहचान प्रमाण' },
  'ID proof': { hi: 'पहचान प्रमाण' },
  'Death Certificate': { hi: 'मृत्यु प्रमाण पत्र', bn: 'মৃত্যু সনদ', ta: 'இறப்புச் சான்றிதழ்', te: 'మరణ ధృవీకరణ పత్రం', mr: 'मृत्यु प्रमाणपत्र', gu: 'મૃત્યુ પ્રમાણપત્ર', kn: 'ಮರಣ ಪ್ರಮಾಣಪತ್ರ', ml: 'മരണ സർട്ടിഫിക്കറ്റ്', pa: 'ਮੌਤ ਸਰਟੀਫਿਕੇਟ' },
  'Death certificate': { hi: 'मृत्यु प्रमाण पत्र' },
  'Death Cert': { hi: 'मृत्यु प्रमाण पत्र' },
  'BPL Card': { hi: 'बीपीएल कार्ड' },
  'Bank Passbook': { hi: 'बैंक पासबुक' },
  'Bank Account': { hi: 'बैंक खाता' },
  'Bank Details': { hi: 'बैंक विवरण' },
  'Bank Account Details': { hi: 'बैंक खाता विवरण' },
  'Bank Info': { hi: 'बैंक जानकारी' },
  'Income Certificate': { hi: 'आय प्रमाण पत्र' },
  'income certificate': { hi: 'आय प्रमाण पत्र' },
  'Income Proof': { hi: 'आय प्रमाण' },
  'Income Cert': { hi: 'आय प्रमाण पत्र' },
  'residence proof': { hi: 'निवास प्रमाण' },
  'Residence Proof': { hi: 'निवास प्रमाण' },
  Domicile: { hi: 'अधिवास प्रमाण' },
  'Domicile Certificate': { hi: 'अधिवास प्रमाण पत्र' },
  'Ration Card': { hi: 'राशन कार्ड' },
  'Marriage Certificate': { hi: 'विवाह प्रमाण पत्र' },
  'Marriage certificate': { hi: 'विवाह प्रमाण पत्र' },
  'Marriage Registration': { hi: 'विवाह पंजीकरण' },
  'Age Proof': { hi: 'आयु प्रमाण' },
  'Caste Certificate': { hi: 'जाति प्रमाण पत्र' },
  'Self-declaration': { hi: 'स्व-घोषणा' },
  'case application form': { hi: 'मामला आवेदन पत्र' },
  'Case application': { hi: 'मामला आवेदन' },
  'Property documents': { hi: 'संपत्ति दस्तावेज़' },
  'BPL Proof': { hi: 'बीपीएल प्रमाण' },
  'No card needed / Standard ID proof': { hi: 'कार्ड आवश्यक नहीं / सामान्य पहचान प्रमाण' },
};

const HI_PHRASES = [
  ['Direct monthly financial pension assistance disbursed to verified eligible widows across ', 'सत्यापित पात्र विधवाओं को मासिक पेंशन सहायता — '],
  ['Targeted welfare grant providing financial security during remarriage or marriage of daughters in ', 'पुनर्विवाह या पुत्री के विवाह हेतु वित्तीय सहायता — '],
  ['Empowerment, education and enterprise support mechanism tailored for widows and their families in ', 'विधवाओं और उनके परिवारों के लिए सशक्तिकरण, शिक्षा और उद्यम सहायता — '],
  ['Direct monthly financial support under NSAP for destitute widows.', 'NSAP के अंतर्गत निराश्रित विधवाओं को मासिक वित्तीय सहायता।'],
  ['Rs 300/month from Centre (states top up).', 'केंद्र से ₹300/माह (राज्य अतिरिक्त जोड़ते हैं)।'],
  ['Base national scheme under NSAP; most states add a top-up on this.', 'NSAP की आधार राष्ट्रीय योजना; अधिकांश राज्य इसमें टॉप-अप जोड़ते हैं।'],
  ['(auto-shifts to Old Age Pension at 80)', '(80 वर्ष पर वृद्धावस्था पेंशन में स्वतः स्थानांतरण)'],
  ['BPL household', 'बीपीएल परिवार'],
  ['Priority housing financial assistance for constructing a permanent pucca house.', 'स्थायी पक्का मकान बनाने हेतु प्राथमिकता आवास सहायता।'],
  ['Immediate lump-sum survival grant to widow on sudden demise of the primary breadwinner.', 'मुख्य कमाने वाले की अचानक मृत्यु पर विधवा को तत्काल एकमुश्त अनुदान।'],
  ['Skill training in sectors like agriculture, handicrafts, tailoring to ensure self-reliance.', 'कृषि, हस्तशिल्प, सिलाई जैसे क्षेत्रों में आत्मनिर्भरता हेतु कौशल प्रशिक्षण।'],
  ['Cash incentive for nutritional support and health checkups.', 'पोषण सहायता और स्वास्थ्य जाँच हेतु नकद प्रोत्साहन।'],
  ['Monthly financial scholarship covering professional degree education tuition.', 'व्यावसायिक डिग्री शिक्षा शुल्क हेतु मासिक छात्रवृत्ति।'],
  ['Complete free litigation support, maintenance claim filing, and property succession aid.', 'मुकदमेबाजी, भरण-पोषण दावा और संपत्ति उत्तराधिकार हेतु पूर्ण निःशुल्क सहायता।'],
  ['Institutional rehabilitation providing safe shelter and psychosocial counseling.', 'सुरक्षित आश्रय और मनोसामाजिक परामर्श के साथ संस्थागत पुनर्वास।'],
  ['Revolving funds and low-interest credit for launching micro-enterprises and dairy/farming.', 'सूक्ष्म उद्यम और डेयरी/कृषि हेतु चक्रीय निधि और कम ब्याज ऋण।'],
  ['Term loans for enterprise setup and small business creation.', 'उद्यम स्थापना और छोटे व्यवसाय हेतु सावधि ऋण।'],
  ['Comprehensive secondary and tertiary cashless hospitalization coverage in all empaneled hospitals.', 'सभी पैनल अस्पतालों में द्वितीयक और तृतीयक कैशलेस अस्पताल कवरेज।'],
  ['Guaranteed monthly food basket ensuring complete household nutritional security.', 'परिवार की पोषण सुरक्षा हेतु सुनिश्चित मासिक खाद्यान्न टोकरी।'],
  ['Lifelong monthly statutory family pension under EPFO.', 'ईपीएफओ के अंतर्गत आजीवन मासिक वैधानिक पारिवारिक पेंशन।'],
  ['Lifetime compensation and free medical care in ESIC hospitals.', 'ईएसआईसी अस्पतालों में आजीवन मुआवजा और निःशुल्क चिकित्सा।'],
  ['Lump-sum national defense welfare grant honoring fallen defense personnel\'s spouse.', 'शहीद रक्षा कर्मी की पत्नी हेतु एकमुश्त राष्ट्रीय रक्षा कल्याण अनुदान।'],
  ['Monthly financial relief funded by Kendriya Sainik Board.', 'केंद्रीय सैनिक बोर्ड द्वारा वित्तपोषित मासिक वित्तीय राहत।'],
  ['State housing scheme giving first allotment priority to destitute widows.', 'निराश्रित विधवाओं को प्रथम आवंटन प्राथमिकता देने वाली राज्य आवास योजना।'],
  ['Comprehensive rural shelter rehabilitation package.', 'व्यापक ग्रामीण आश्रय पुनर्वास पैकेज।'],
  ['Substantial monthly child welfare allowance to prevent school dropouts.', 'स्कूल छोड़ने से रोकने हेतु मासिक बाल कल्याण भत्ता।'],
  ['Free urban and semi-urban transit mobility facilitating commute to workplaces.', 'कार्यस्थल आने-जाने हेतु निःशुल्क शहरी/अर्ध-शहरी बस यात्रा।'],
  ['Financial reimbursement for litigation costs, documentation, and lawyer fees.', 'मुकदमे, दस्तावेज़ और वकील शुल्क हेतु वित्तीय प्रतिपूर्ति।'],
  ['State social pension covering marginalized women outside standard widow pension norms.', 'सामान्य विधवा पेंशन से बाहर हाशिए की महिलाओं हेतु राज्य सामाजिक पेंशन।'],
  ['Special allowance compensating widows who cannot take jobs due to caregiving duties.', 'देखभाल के कारण काम न कर पाने वाली विधवाओं हेतु विशेष भत्ता।'],
  ['State-backed cashless health coverage for hospitalization and surgeries.', 'अस्पताल और शल्य चिकित्सा हेतु राज्य-समर्थित कैशलेस स्वास्थ्य कवर।'],
  ['PDS entitlement securing food grains for single female headed families.', 'एकल महिला मुखिया परिवारों हेतु पीडीएस खाद्यान्न पात्रता।'],
  ['Complete interest waiver reducing debt burden on women entrepreneurs.', 'महिला उद्यमियों के ऋण भार को घटाने हेतु पूर्ण ब्याज माफी।'],
  ['Cashless medical management in government and private network hospitals.', 'सरकारी और निजी नेटवर्क अस्पतालों में कैशलेस चिकित्सा।'],
  ['Low cost credit facilitation for setting up shops, tailoring, or dairy ventures.', 'दुकान, सिलाई या डेयरी हेतु सस्ता ऋण।'],
  ['High-value immediate statutory insurance payout for unorganized laborers\' families.', 'असंगठित श्रमिक परिवारों हेतु तत्काल वैधानिक बीमा राशि।'],
  ['Long-term financial assurance saving daughters from child marriage and illiteracy.', 'बाल विवाह और निरक्षरता से बचाने हेतु पुत्रियों की दीर्घकालिक वित्तीय सुरक्षा।'],
  ['Targeted hill welfare initiative assisting vulnerable women in remote valleys.', 'दूरस्थ घाटियों की संवेदनशील महिलाओं हेतु पहाड़ी कल्याण पहल।'],
  ['Financial security promoting higher education for daughters of single mothers.', 'एकल माताओं की पुत्रियों की उच्च शिक्षा हेतु वित्तीय सुरक्षा।'],
  ['Monthly direct kitchen support fund shielding families from consumer price inflation.', 'मूल्य वृद्धि से परिवारों को बचाने हेतु मासिक रसोई सहायता।'],
  ['Direct financial grant safeguarding underprivileged daughters\' marriage dignity.', 'वंचित पुत्रियों के विवाह सम्मान हेतु प्रत्यक्ष वित्तीय अनुदान।'],
  ['Full tuition and living stipend support for job-oriented technical education.', 'रोज़गारपरक तकनीकी शिक्षा हेतु पूर्ण शुल्क और निर्वाह छात्रवृत्ति।'],
  ['Provides free legal aid to women, SC/ST, disabled, and other eligible categories nationwide; toll-free helpline 15100.', 'महिलाओं, SC/ST, दिव्यांग और अन्य पात्र वर्गों को राष्ट्रव्यापी निःशुल्क कानूनी सहायता; टोल-फ्री 15100।'],
  ['Each state has its own SLSA under NALSA; District Legal Services Authorities (DLSA) operate at district level - widows are eligible for free legal aid as a matter of right in most cases.', 'प्रत्येक राज्य में NALSA के अंतर्गत SLSA है; जिला विधिक सेवा प्राधिकरण जिला स्तर पर काम करते हैं — अधिकांश मामलों में विधवाएँ निःशुल्क कानूनी सहायता की हकदार हैं।'],
  ['Widow is a Class I legal heir - equal share with children in husband\'s property. 2005 amendment also gave daughters equal coparcenary rights; widow\'s share is independent of this.', 'विधवा वर्ग I कानूनी उत्तराधिकारी है — पति की संपत्ति में बच्चों के साथ समान हिस्सा। 2005 संशोधन ने पुत्रियों को समान सहदायिकी अधिकार दिए; विधवा का हिस्सा इससे स्वतंत्र है।'],
  ['Widow gets a fixed fractional share (1/8th if there are children, 1/4th if none) under Islamic inheritance rules. Shares are fixed by religious law, not equal division - differs significantly from Hindu law.', 'इस्लामी उत्तराधिकार में विधवा को निश्चित अंश मिलता है (संतान होने पर 1/8, अन्यथा 1/4)। हिस्से धार्मिक कानून से तय होते हैं, समान विभाजन नहीं — हिंदू कानून से भिन्न।'],
  ['Widow gets 1/3rd of property if children survive, 1/2 if no lineal descendants but other kin survive. Applies to Christians; Parsis have a separate schedule under the same Act.', 'संतान होने पर विधवा को संपत्ति का 1/3, वंशज न होने पर निकट संबंधियों के रहते 1/2। ईसाइयों पर लागू; पारसियों का अलग अनुसूची है।'],
  ['Governed by Indian Succession Act regardless of religion. Applies when marriage was registered under the Special Marriage Act, 1954.', 'धर्म निरपेक्ष भारतीय उत्तराधिकार अधिनियम लागू। विशेष विवाह अधिनियम, 1954 के अंतर्गत पंजीकृत विवाह पर।'],
  ['Widow, family below poverty line (BPL), not remarried, not receiving another govt pension', 'विधवा, बीपीएल परिवार, पुनर्विवाह नहीं, अन्य सरकारी पेंशन नहीं'],
  ['Widow / divorced / separated / destitute / abandoned women resident in Delhi', 'दिल्ली की निवासी विधवा / तलाकशुदा / अलग / निराश्रित / परित्यक्त महिलाएँ'],
  ['Women and widows; NALSA / SLSA eligible categories', 'महिलाएँ और विधवाएँ; NALSA / SLSA पात्र वर्ग'],
  ['To be verified on state portal', 'राज्य पोर्टल पर सत्यापित करें'],
  ['Check current amount on state portal', 'वर्तमान राशि राज्य पोर्टल पर देखें'],
  ['Widow, income-eligible', 'विधवा, आय-पात्र'],
  ['Widow, BPL or income-eligible household', 'विधवा, बीपीएल या आय-पात्र परिवार'],
  ['Hindus, Buddhists, Jains, Sikhs', 'हिंदू, बौद्ध, जैन, सिख'],
  ['Muslims', 'मुसलमान'],
  ['Christians', 'ईसाई'],
  ['All communities (special marriage)', 'सभी समुदाय (विशेष विवाह)'],
  ['Free legal aid', 'निःशुल्क कानूनी सहायता'],
  ['Age range:', 'आयु सीमा:'],
  ['Income limit:', 'आय सीमा:'],
  ['Verify amount on nsap.nic.in before demo.', 'डेमो से पहले nsap.nic.in पर राशि सत्यापित करें।'],
  ['NEEDS VERIFICATION.', 'सत्यापन आवश्यक।'],
  ['Not fully verified in this pass.', 'इस पास में पूर्ण सत्यापित नहीं।'],
  ['See application portal', 'आवेदन पोर्टल देखें'],
  ['Online', 'ऑनलाइन'],
];

function pick(map, key, lang) {
  if (!key) return key;
  const row = map[key];
  if (!row) return key;
  if (!lang || lang === 'en') return key;
  return row[lang] || key;
}

function applyPhrases(text, lang) {
  if (!text || lang === 'en') return text;
  if (lang !== 'hi') return text;
  let out = String(text);
  for (const [en, hi] of HI_PHRASES) {
    if (out.includes(en)) out = out.split(en).join(hi);
  }
  return out;
}

function translateList(items, lang) {
  if (!Array.isArray(items)) return items;
  return items.map((item) => pick(DOCS, item, lang) || applyPhrases(item, lang));
}

/**
 * Returns scheme fields in the active UI language.
 * en → original Excel English (never Hindi).
 * Other langs → generated maps; missing keys stay English, never Hindi leak.
 */
export function translateScheme(scheme, lang, t) {
  if (!scheme) return scheme;
  const code = lang || 'en';
  const categoryLabel = t && CAT_KEY[scheme.category] ? t(CAT_KEY[scheme.category]) : scheme.category;
  if (code === 'en') {
    return { ...scheme, categoryLabel, subcategory: scheme.subcategory, state: scheme.state };
  }

  const pack = SCHEME_TRANSLATIONS[scheme.id]?.[code];
  const hiName = code === 'hi' ? SCHEME_HI_NAMES[scheme.id] : null;
  const name = pack?.name || hiName || scheme.name;
  const subcategory = pick(SUBCATEGORY, scheme.subcategory, code);
  const state = pack?.state || pick(STATES, scheme.state, code);
  const description = pack?.description || applyPhrases(scheme.description, code);
  const eligibility = pack?.eligibility || applyPhrases(scheme.eligibility, code);
  const benefit = pack?.benefit || applyPhrases(scheme.benefit, code);
  const documents = pack?.documents || translateList(scheme.documents, code);
  const processingTime = pack?.processingTime || applyPhrases(scheme.processingTime, code);

  return {
    ...scheme,
    name,
    categoryLabel,
    subcategory,
    state,
    description,
    eligibility,
    benefit,
    documents,
    processingTime,
  };
}

export { CAT_KEY };
