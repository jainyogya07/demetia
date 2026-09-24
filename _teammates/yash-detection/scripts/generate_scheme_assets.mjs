#!/usr/bin/env node
/**
 * Generates scheme i18n maps, dataset JSON, banners JSON, and SQL seed.
 * Run from repo root: node scripts/generate_scheme_assets.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHEMES } from '../src/data/schemes.js';
import { SCHEME_HI_NAMES } from '../src/i18n/schemeHiNames.js';
import { FRAGMENTS, LANGS, NAME_FRAGMENTS, PROC, STATES, pack } from './i18n-lexicon.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const DOCS = {
  Aadhaar: pack(['आधार', 'আধার', 'ஆதார்', 'ఆధార్', 'आधार', 'આધાર', 'ಆಧಾರ್', 'ആധാർ', 'ਆਧਾਰ']),
  'Aadhaar Card': pack(['आधार कार्ड', 'আধার কার্ড', 'ஆதார் அட்டை', 'ఆధార్ కార్డు', 'आधार कार्ड', 'આધાર કાર્ડ', 'ಆಧಾರ್ ಕಾರ್ಡ್', 'ആധാർ കാർഡ്', 'ਆਧਾਰ ਕਾਰਡ']),
  'Aadhaar / ID proof': pack(['आधार / पहचान प्रमाण', 'আধার / পরিচয় প্রমাণ', 'ஆதார் / அடையாளச் சான்று', 'ఆధార్ / గుర్తింపు రుజువు', 'आधार / ओळख पुरावा', 'આધાર / ઓળખ પુરાવો', 'ಆಧಾರ್ / ಗುರುತಿನ ಪುರಾವೆ', 'ആധാർ / തിരിച്ചറിയൽ രേഖ', 'ਆਧਾਰ / ਪਛਾਣ ਸਬੂਤ']),
  'ID proof': pack(['पहचान प्रमाण', 'পরিচয় প্রমাণ', 'அடையாளச் சான்று', 'గుర్తింపు రుజువు', 'ओळख पुरावा', 'ઓળખ પુરાવો', 'ಗುರುತಿನ ಪುರಾವೆ', 'തിരിച്ചറിയൽ രേഖ', 'ਪਛਾਣ ਸਬੂਤ']),
  'Death Certificate': pack(['मृत्यु प्रमाण पत्र', 'মৃত্যু সনদ', 'இறப்புச் சான்றிதழ்', 'మరణ ధృవీకరణ పత్రం', 'मृत्यु प्रमाणपत्र', 'મૃત્યુ પ્રમાણપત્ર', 'ಮರಣ ಪ್ರಮಾಣಪತ್ರ', 'മരണ സർട്ടിഫിക്കറ്റ്', 'ਮੌਤ ਸਰਟੀਫਿਕੇਟ']),
  'Death certificate': pack(['मृत्यु प्रमाण पत्र', 'মৃত্যু সনদ', 'இறப்புச் சான்றிதழ்', 'మరణ ధృవీకరణ పత్రం', 'मृत्यु प्रमाणपत्र', 'મૃત્યુ પ્રમાણપત્ર', 'ಮರಣ ಪ್ರಮಾಣಪತ್ರ', 'മരണ സർട്ടിഫിക്കറ്റ്', 'ਮੌਤ ਸਰਟੀਫਿਕੇਟ']),
  'Death Cert': pack(['मृत्यु प्रमाण पत्र', 'মৃত্যু সনদ', 'இறப்புச் சான்றிதழ்', 'మరణ ధృవీకరణ పత్రం', 'मृत्यु प्रमाणपत्र', 'મૃત્યુ પ્રમાણપત્ર', 'ಮರಣ ಪ್ರಮಾಣಪತ್ರ', 'മരണ സർട്ടിഫിക്കറ്റ്', 'ਮੌਤ ਸਰਟੀਫਿਕੇਟ']),
  "Husband's Death Certificate": pack(['पति का मृत्यु प्रमाण पत्र', 'স্বামীর মৃত্যু সনদ', 'கணவர் இறப்புச் சான்றிதழ்', 'భర్త మరణ ధృవీకరణ పత్రం', 'पतीचे मृत्यु प्रमाणपत्र', 'પતિનું મૃત્યુ પ્રમાણપત્ર', 'ಗಂಡನ ಮರಣ ಪ್ರಮಾಣಪತ್ರ', 'ഭർത്താവിന്റെ മരണ സർട്ടിഫിക്കറ്റ്', 'ਪਤੀ ਦਾ ਮੌਤ ਸਰਟੀਫਿਕੇਟ']),
  'BPL Card': pack(['बीपीएल कार्ड', 'বিপিএল কার্ড', 'BPL அட்டை', 'BPL కార్డు', 'बीपीएल कार्ड', 'BPL કાર્ડ', 'BPL ಕಾರ್ಡ್', 'BPL കാർഡ്', 'BPL ਕਾਰਡ']),
  'BPL Certificate': pack(['बीपीएल प्रमाण पत्र', 'বিপিএল সনদ', 'BPL சான்றிதழ்', 'BPL సర్టిఫికేట్', 'बीपीएल प्रमाणपत्र', 'BPL પ્રમાણપત્ર', 'BPL ಪ್ರಮಾಣಪತ್ರ', 'BPL സർട്ടിഫിക്കറ്റ്', 'BPL ਸਰਟੀਫਿਕੇਟ']),
  'BPL Proof': pack(['बीपीएल प्रमाण', 'বিপিএল প্রমাণ', 'BPL சான்று', 'BPL రుజువు', 'बीपीएल पुरावा', 'BPL પુરાવો', 'BPL ಪುರಾವೆ', 'BPL തെളിവ്', 'BPL ਸਬੂਤ']),
  'BPL Verification': pack(['बीपीएल सत्यापन', 'বিপিএল যাচাই', 'BPL சரிபார்ப்பு', 'BPL ధృవీకరణ', 'बीपीएल सत्यापन', 'BPL ચકાસણી', 'BPL ಪರಿಶೀಲನೆ', 'BPL സ്ഥിരീകരണം', 'BPL ਤਸਦੀਕ']),
  'BPL Certificate / Income Proof': pack(['बीपीएल प्रमाण पत्र / आय प्रमाण', 'বিপিএল সনদ / আয় প্রমাণ', 'BPL சான்றிதழ் / வருமானச் சான்று', 'BPL సర్టిఫికేట్ / ఆదాయ రుజువు', 'बीपीएल प्रमाणपत्र / आय पुरावा', 'BPL પ્રમાણપત્ર / આવક પુરાવો', 'BPL ಪ್ರಮಾಣಪತ್ರ / ಆದಾಯ ಪುರಾವೆ', 'BPL സർട്ടിഫിക്കറ്റ് / വരുമാന തെളിവ്', 'BPL ਸਰਟੀਫਿਕੇਟ / ਆਮਦਨ ਸਬੂਤ']),
  'BPL/Income Proof': pack(['बीपीएल / आय प्रमाण', 'বিপিএল / আয় প্রমাণ', 'BPL / வருமானச் சான்று', 'BPL / ఆదాయ రుజువు', 'बीपीएल / आय पुरावा', 'BPL / આવક પુરાવો', 'BPL / ಆದಾಯ ಪುರಾವೆ', 'BPL / വരുമാന തെളിവ്', 'BPL / ਆਮਦਨ ਸਬੂਤ']),
  'Bank Passbook': pack(['बैंक पासबुक', 'ব্যাংক পাসবুক', 'வங்கி பாஸ்புக்', 'బ్యాంకు పాస్‌బుక్', 'बँक पासबुक', 'બેંક પાસબુક', 'ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್', 'ബാങ്ക് പാസ്‌ബുക്ക്', 'ਬੈਂਕ ਪਾਸਬੁੱਕ']),
  'Bank Account': pack(['बैंक खाता', 'ব্যাংক অ্যাকাউন্ট', 'வங்கிக் கணக்கு', 'బ్యాంకు ఖాతా', 'बँक खाते', 'બેંક ખાતું', 'ಬ್ಯಾಂಕ್ ಖಾತೆ', 'ബാങ്ക് അക്കൗണ്ട്', 'ਬੈਂਕ ਖਾਤਾ']),
  'Bank Details': pack(['बैंक विवरण', 'ব্যাংক বিবরণ', 'வங்கி விவரம்', 'బ్యాంకు వివరాలు', 'बँक तपशील', 'બેંક વિગત', 'ಬ್ಯಾಂಕ್ ವಿವರ', 'ബാങ്ക് വിവരങ്ങൾ', 'ਬੈਂਕ ਵੇਰਵੇ']),
  'Bank Info': pack(['बैंक जानकारी', 'ব্যাংক তথ্য', 'வங்கி தகவல்', 'బ్యాంకు సమాచారం', 'बँक माहिती', 'બેંક માહિતી', 'ಬ್ಯಾಂಕ್ ಮಾಹಿತಿ', 'ബാങ്ക് വിവരം', 'ਬੈਂਕ ਜਾਣਕਾਰੀ']),
  'Bank Account Details': pack(['बैंक खाता विवरण', 'ব্যাংক অ্যাকাউন্ট বিবরণ', 'வங்கிக் கணக்கு விவரம்', 'బ్యాంకు ఖాతా వివరాలు', 'बँक खाते तपशील', 'બેંક ખાતાની વિગત', 'ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರ', 'ബാങ്ക് അക്കൗണ്ട് വിവരങ്ങൾ', 'ਬੈਂਕ ਖਾਤਾ ਵੇਰਵੇ']),
  'Bank DBT enabled account': pack(['डीबीटी सक्षम बैंक खाता', 'ডিবিটি সক্ষম ব্যাংক অ্যাকাউন্ট', 'DBT வங்கிக் கணக்கு', 'DBT బ్యాంకు ఖాతా', 'डीबीटी सक्षम बँक खाते', 'DBT સક્ષમ બેંક ખાતું', 'DBT ಬ್ಯಾಂಕ್ ಖಾತೆ', 'DBT ബാങ്ക് അക്കൗണ്ട്', 'DBT ਬੈਂਕ ਖਾਤਾ']),
  'Income Certificate': pack(['आय प्रमाण पत्र', 'আয় সনদ', 'வருமானச் சான்றிதழ்', 'ఆదాయ ధృవీకరణ పత్రం', 'आय प्रमाणपत्र', 'આવક પ્રમાણપત્ર', 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ', 'വരുമാന സർട്ടിഫിക്കറ്റ്', 'ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ']),
  'income certificate': pack(['आय प्रमाण पत्र', 'আয় সনদ', 'வருமானச் சான்றிதழ்', 'ఆదాయ ధృవీకరణ పత్రం', 'आय प्रमाणपत्र', 'આવક પ્રમાણપત્ર', 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ', 'വരുമാന സർട്ടിഫിക്കറ്റ്', 'ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ']),
  'Income Proof': pack(['आय प्रमाण', 'আয় প্রমাণ', 'வருமானச் சான்று', 'ఆదాయ రుజువు', 'आय पुरावा', 'આવક પુરાવો', 'ಆದಾಯ ಪುರಾವೆ', 'വരുമാന തെളിവ്', 'ਆਮਦਨ ਸਬੂਤ']),
  'Income Cert': pack(['आय प्रमाण पत्र', 'আয় সনদ', 'வருமானச் சான்றிதழ்', 'ఆదాయ ధృవీకరణ పత్రం', 'आय प्रमाणपत्र', 'આવક પ્રમાણપત્ર', 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ', 'വരുമാന സർട്ടിഫിക്കറ്റ്', 'ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ']),
  'Residence Proof': pack(['निवास प्रमाण', 'বাসস্থান প্রমাণ', 'வசிப்பிடச் சான்று', 'నివాస రుజువు', 'निवास पुरावा', 'નિવાસ પુરાવો', 'ವಾಸಸ್ಥಳ ಪುರಾವೆ', 'താമസ തെളിവ്', 'ਰਿਹਾਇਸ਼ ਸਬੂਤ']),
  'residence proof': pack(['निवास प्रमाण', 'বাসস্থান প্রমাণ', 'வசிப்பிடச் சான்று', 'నివాస రుజువు', 'निवास पुरावा', 'નિવાસ પુરાવો', 'ವಾಸಸ್ಥಳ ಪುರಾವೆ', 'താമസ തെളിവ്', 'ਰਿਹਾਇਸ਼ ਸਬੂਤ']),
  Domicile: pack(['अधिवास प्रमाण', 'অধিবাস প্রমাণ', 'நிலைத்த இடச் சான்று', 'నివాస ధృవీకరణ', 'अधिवास पुरावा', 'અધિવાસ પુરાવો', 'ನಿವಾಸ ಪುರಾವೆ', 'ഡൊമിസൈൽ', 'ਡੋਮੀਸਾਈਲ']),
  'Domicile Certificate': pack(['अधिवास प्रमाण पत्र', 'অধিবাস সনদ', 'நிலைத்த இடச் சான்றிதழ்', 'డొమిసైల్ సర్టిఫికేట్', 'अधिवास प्रमाणपत्र', 'અધિવાસ પ્રમાણપત્ર', 'ನಿವಾಸ ಪ್ರಮಾಣಪತ್ರ', 'ഡൊമിസൈൽ സർട്ടിഫിക്കറ്റ്', 'ਡੋਮੀਸਾਈਲ ਸਰਟੀਫਿਕੇਟ']),
  'Ration Card': pack(['राशन कार्ड', 'রেশন কার্ড', 'ரேஷன் அட்டை', 'రేషన్ కార్డు', 'रेशन कार्ड', 'રેશન કાર્ડ', 'ರೇಷನ್ ಕಾರ್ಡ್', 'റേഷൻ കാർഡ്', 'ਰਾਸ਼ਨ ਕਾਰਡ']),
  'Marriage Certificate': pack(['विवाह प्रमाण पत्र', 'বিবাহ সনদ', 'திருமணச் சான்றிதழ்', 'వివాహ ధృవీకరణ పత్రం', 'विवाह प्रमाणपत्र', 'લગ્ન પ્રમાણપત્ર', 'ವಿವಾಹ ಪ್ರಮಾಣಪತ್ರ', 'വിവാഹ സർട്ടിഫിക്കറ്റ്', 'ਵਿਆਹ ਸਰਟੀਫਿਕੇਟ']),
  'Marriage certificate': pack(['विवाह प्रमाण पत्र', 'বিবাহ সনদ', 'திருமணச் சான்றிதழ்', 'వివాహ ధృవీకరణ పత్రం', 'विवाह प्रमाणपत्र', 'લગ્ન પ્રમાણપત્ર', 'ವಿವಾಹ ಪ್ರಮಾಣಪತ್ರ', 'വിവാഹ സർട്ടിഫിക്കറ്റ്', 'ਵਿਆਹ ਸਰਟੀਫਿਕੇਟ']),
  'Marriage Registration': pack(['विवाह पंजीकरण', 'বিবাহ নিবন্ধন', 'திருமணப் பதிவு', 'వివాహ నమోదు', 'विवाह नोंदणी', 'લગ્ન નોંધણી', 'ವಿವಾಹ ನೋಂದಣಿ', 'വിവാഹ രജിസ്ട്രേഷൻ', 'ਵਿਆਹ ਰਜਿਸਟਰੇਸ਼ਨ']),
  'Age Proof': pack(['आयु प्रमाण', 'বয়স প্রমাণ', 'வயதுச் சான்று', 'వయస్సు రుజువు', 'वय पुरावा', 'ઉંમર પુરાવો', 'ವಯಸ್ಸಿನ ಪುರಾವೆ', 'പ്രായ തെളിവ്', 'ਉਮਰ ਸਬੂਤ']),
  'Caste Certificate': pack(['जाति प्रमाण पत्र', 'জাতি সনদ', 'சாதிச் சான்றிதழ்', 'కుల ధృవీకరణ పత్రం', 'जात प्रमाणपत्र', 'જાતિ પ્રમાણપત્ર', 'ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ', 'ജാതി സർട്ടിഫിക്കറ്റ്', 'ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ']),
  'Self-declaration': pack(['स्व-घोषणा', 'স্বঘোষণা', 'சுய அறிவிப்பு', 'స్వీయ ప్రకటన', 'स्वघोषणा', 'સ્વઘોષણા', 'ಸ್ವಯಂ ಘೋಷಣೆ', 'സ്വയം പ്രഖ്യാപനം', 'ਸਵੈ-ਘੋਸ਼ਣਾ']),
  'case application form': pack(['मामला आवेदन पत्र', 'মামলা আবেদন ফর্ম', 'வழக்கு விண்ணப்பப் படிவம்', 'కేసు దరఖాస్తు ఫారం', 'प्रकरण अर्ज फॉर्म', 'કેસ અરજી ફોર્મ', 'ಪ್ರಕರಣ ಅರ್ಜಿ ನಮೂನೆ', 'കേസ് അപേക്ഷാ ഫോം', 'ਕੇਸ ਅਰਜ਼ੀ ਫਾਰਮ']),
  'Case application': pack(['मामला आवेदन', 'মামলা আবেদন', 'வழக்கு விண்ணப்பம்', 'కేసు దరఖాస్తు', 'प्रकरण अर्ज', 'કેસ અરજી', 'ಪ್ರಕರಣ ಅರ್ಜಿ', 'കേസ് അപേക്ഷ', 'ਕੇਸ ਅਰਜ਼ੀ']),
  'Property documents': pack(['संपत्ति दस्तावेज़', 'সম্পত্তির নথি', 'சொத்து ஆவணங்கள்', 'ఆస్తి పత్రాలు', 'मालमत्ता कागदपत्रे', 'મિલકત દસ્તાવેજો', 'ಆಸ್ತಿ ದಾಖಲೆಗಳು', 'സ്വത്ത് രേഖകൾ', 'ਜਾਇਦਾਦ ਦਸਤਾਵੇਜ਼']),
  'No card needed / Standard ID proof': pack(['कार्ड आवश्यक नहीं / सामान्य पहचान प्रमाण', 'কার্ড লাগে না / সাধারণ পরিচয় প্রমাণ', 'அட்டை தேவையில்லை / பொது அடையாளச் சான்று', 'కార్డు అవసరం లేదు / సాధారణ గుర్తింపు', 'कार्ड गरजेचे नाही / सामान्य ओळख', 'કાર્ડ જરૂરી નથી / સામાન્ય ઓળખ', 'ಕಾರ್ಡ್ ಬೇಕಿಲ್ಲ / ಸಾಮಾನ್ಯ ಗುರುತು', 'കാർഡ് വേണ്ട / സാധാരണ തിരിച്ചറിയൽ', 'ਕਾਰਡ ਲੋੜ ਨਹੀਂ / ਆਮ ਪਛਾਣ']),
  'SECC Priority ID': pack(['SECC प्राथमिकता पहचान', 'SECC অগ্রাধিকার আইডি', 'SECC முன்னுரிமை அடையாளம்', 'SECC ప్రాధాన్య ఐడి', 'SECC प्राधान्य ओळख', 'SECC પ્રાથમિકતા આઈડી', 'SECC ಆದ್ಯತೆ ಐಡಿ', 'SECC മുൻഗണന ഐഡി', 'SECC ਤਰਜੀਹ ਆਈਡੀ']),
  'Birth Certificate': pack(['जन्म प्रमाण पत्र', 'জন্ম সনদ', 'பிறப்புச் சான்றிதழ்', 'జనన ధృవీకరణ పత్రం', 'जन्म प्रमाणपत्र', 'જન્મ પ્રમાણપત્ર', 'ಜನನ ಪ್ರಮಾಣಪತ್ರ', 'ജനന സർട്ടിഫിക്കറ്റ്', 'ਜਨਮ ਸਰਟੀਫਿਕੇਟ']),
  'Cancelled Cheque': pack(['रद्द चेक', 'বাতিল চেক', 'ரத்து செக்', 'రద్దు చెక్', 'रद्द धनादेश', 'રદ ચેક', 'ರದ್ದು ಚೆಕ್', 'റദ്ദാക്കിയ ചെക്ക്', 'ਰੱਦ ਚੈੱਕ']),
  'Ration Card': pack(['राशन कार्ड', 'রেশন কার্ড', 'ரேஷன் அட்டை', 'రేషన్ కార్డు', 'रेशन कार्ड', 'રેશન કાર્ડ', 'ರೇಷನ್ ಕಾರ್ಡ್', 'റേഷൻ കാർഡ്', 'ਰਾਸ਼ਨ ਕਾਰਡ']),
  'SHG ID': pack(['एसएचजी पहचान', 'এসএইচজি আইডি', 'SHG அடையாளம்', 'SHG ఐడి', 'एसएचजी ओळख', 'SHG આઈડી', 'SHG ಐಡಿ', 'SHG ഐഡി', 'SHG ਆਈਡੀ']),
  'SHG Registration': pack(['एसएचजी पंजीकरण', 'এসএইচজি নিবন্ধন', 'SHG பதிவு', 'SHG నమోదు', 'एसएचजी नोंदणी', 'SHG નોંધણી', 'SHG ನೋಂದಣಿ', 'SHG രജിസ്ട്രേഷൻ', 'SHG ਰਜਿਸਟਰੇਸ਼ਨ']),
  'SHG membership': pack(['एसएचजी सदस्यता', 'এসএইচজি সদস্যপদ', 'SHG உறுப்பினர்', 'SHG సభ్యత్వం', 'एसएचजी सदस्यत्व', 'SHG સભ્યપદ', 'SHG ಸದಸ್ಯತ್ವ', 'SHG അംഗത്വം', 'SHG ਮੈਂਬਰਸ਼ਿਪ']),
  'SHG Bank Passbook': pack(['एसएचजी बैंक पासबुक', 'এসএইচজি ব্যাংক পাসবুক', 'SHG வங்கி பாஸ்புக்', 'SHG బ్యాంకు పాస్‌బుక్', 'एसएचजी बँक पासबुक', 'SHG બેંક પાસબુક', 'SHG ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್', 'SHG ബാങ്ക് പാസ്‌ബുക്ക്', 'SHG ਬੈਂਕ ਪਾਸਬੁੱਕ']),
};

const REL = {
  spouse: pack(['पति/पत्नी', 'স্বামী/স্ত্রী', 'கணவர்/மனைவி', 'భర్త/భార్య', 'पती/पत्नी', 'પતિ/પત્ની', 'ಗಂಡ/ಹೆಂಡತಿ', 'ഭർത്താവ്/ഭാര്യ', 'ਪਤੀ/ਪਤਨੀ']),
  'ex-spouse': pack(['पूर्व पति/पत्नी', 'প্রাক্তন স্বামী/স্ত্রী', 'முன்னாள் கணவர்/மனைவி', 'మాజీ భర్త/భార్య', 'माजी पती/पत्नी', 'ભૂતપૂર્વ પતિ/પત્ની', 'ಮಾಜಿ ಗಂಡ/ಹೆಂಡತಿ', 'മുൻ ഭർത്താവ്/ഭാര്യ', 'ਸਾਬਕਾ ਪਤੀ/ਪਤਨੀ']),
  'former spouse': pack(['पूर्व पति/पत्नी', 'প্রাক্তন স্বামী/স্ত্রী', 'முன்னாள் கணவர்/மனைவி', 'మాజీ భర్త/భార్య', 'माजी पती/पत्नी', 'ભૂતપૂર્વ પતિ/પત્ની', 'ಮಾಜಿ ಗಂಡ/ಹೆಂಡತಿ', 'മുൻ ഭർത്താവ്/ഭാര്യ', 'ਸਾਬਕਾ ਪਤੀ/ਪਤਨੀ']),
  father: pack(['पिता', 'পিতা', 'தந்தை', 'తండ్రి', 'वडील', 'પિતા', 'ತಂದೆ', 'പിതാവ്', 'ਪਿਤਾ']),
  Father: pack(['पिता', 'পিতা', 'தந்தை', 'తండ్రి', 'वडील', 'પિતા', 'ತಂದೆ', 'പിതാവ്', 'ਪਿਤਾ']),
  member: pack(['सदस्य', 'সদস্য', 'உறுப்பினர்', 'సభ్యుడు', 'सदस्य', 'સભ્ય', 'ಸದಸ్య', 'അംഗം', 'ਮੈਂਬਰ']),
  daughter: pack(['पुत्री', 'কন্যা', 'மகள்', 'కుమార్తె', 'मुलगी', 'પુત્રી', 'ಮಗಳು', 'മകൾ', 'ਧੀ']),
  deceased: pack(['मृतक', 'মৃত', 'இறந்தவர்', 'మరణించినవారు', 'मृत व्यक्ती', 'મૃતક', 'ಮೃತರು', 'മരിച്ചയാൾ', 'ਮ੍ਰਿਤਕ']),
  '1st husband': pack(['प्रथम पति', 'প্রথম স্বামী', 'முதல் கணவர்', 'మొదటి భర్త', 'पहिला पती', 'પ્રથમ પતિ', 'ಮೊದಲ ಗಂಡ', 'ആദ്യ ഭർത്താവ്', 'ਪਹਿਲਾ ਪਤੀ']),
};

function applyMap(text, lang, pairs) {
  if (!text) return text;
  let out = String(text);
  const sorted = [...pairs].sort((a, b) => b[0].length - a[0].length);
  for (const [en, row] of sorted) {
    if (!en || !row?.[lang]) continue;
    if (out.includes(en)) out = out.split(en).join(row[lang]);
  }
  return out;
}

function translateText(text, lang) {
  if (!text) return text;
  let out = applyMap(text, lang, FRAGMENTS);
  out = applyMap(out, lang, NAME_FRAGMENTS);
  for (const [en, row] of Object.entries(STATES)) {
    if (en.length > 3 && out.includes(en) && row[lang]) out = out.split(en).join(row[lang]);
  }
  return out;
}

/** Hindi title fragments → other 8 languages (proper nouns / acronyms stay). */
const HI_NAME = [
  ['इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना', pack(['', 'ইন্দিরা গান্ধী জাতীয় বিধবা পেনশন প্রকল্প', 'இந்திரா காந்தி தேசிய விதவை ஓய்வூதியத் திட்டம்', 'ఇందిరా గాంధీ జాతీయ వితంతు పెన్షన్ పథకం', 'इंदिरा गांधी राष्ट्रीय विधवा पेन्शन योजना', 'ઇન્દિરા ગાંધી રાષ્ટ્રીય વિધવા પેન્શન યોજના', 'ಇಂದಿರಾ ಗಾಂಧಿ ರಾಷ್ಟ್ರೀಯ ವಿಧವಾ ಪಿಂಚಣಿ ಯೋಜನೆ', 'ഇന്ദിരാഗാന്ധി ദേശീയ വിധവാ പെൻഷൻ പദ്ധതി', 'ਇੰਦਰਾ ਗਾਂਧੀ ਰਾਸ਼ਟਰੀ ਵਿਧਵਾ ਪੈਨਸ਼ਨ ਯੋਜਨਾ'])],
  ['प्रधानमंत्री आवास योजना — ग्रामीण (विधवा / एकल महिला प्राथमिकता)', pack(['', 'প্রধানমন্ত্রী আবাস যোজনা — গ্রামীণ (বিধবা / একক নারী অগ্রাধিকার)', 'பிரதான் மந்திரி ஆவாஸ் யோஜனா — கிராமியம் (விதவை / தனிப் பெண் முன்னுரிமை)', 'ప్రధానమంత్రి ఆవాస్ యోజన — గ్రామీణ్ (వితంతువు / ఒంటరి మహిళ ప్రాధాన్యం)', 'प्रधानमंत्री आवास योजना — ग्रामीण (विधवा / एकल महिला प्राधान्य)', 'પ્રધાનમંત્રી આવાસ યોજના — ગ્રામીણ (વિધવા / એકલ મહિલા પ્રાથમિકતા)', 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಆವಾಸ್ ಯೋಜನೆ — ಗ್ರಾಮೀಣ (ವಿಧವೆ / ಏಕ ಮಹಿಳೆ ಆದ್ಯತೆ)', 'പ്രധാനമന്ത്രി ആവാസ് യോജന — ഗ്രാമീണം (വിധവ / ഒറ്റ സ്ത്രീ മുൻഗണന)', 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਆਵਾਸ ਯੋਜਨਾ — ਗ੍ਰਾਮੀਣ (ਵਿਧਵਾ / ਇਕੱਲੀ ਔਰਤ ਤਰਜੀਹ)'])],
  ['विधवाओं और निराश्रित महिलाओं को वित्तीय सहायता', pack(['', 'বিধবা ও নিঃস্ব নারীদের আর্থিক সহায়তা', 'விதவைகள் மற்றும் ஆதரவற்ற பெண்களுக்கு நிதி உதவி', 'వితంతువులు మరియు నిరాశ్రయ మహిళలకు ఆర్థిక సహాయం', 'विधवा व निराधार महिलांना आर्थिक मदत', 'વિધવાઓ અને નિરાધાર મહિલાઓને નાણાકીય સહાય', 'ವಿಧವೆಯರು ಮತ್ತು ನಿರಾಶ್ರಿತ ಮಹಿಳೆಯರಿಗೆ ಆರ್ಥಿಕ ನೆರವು', 'വിധവകൾക്കും നിരാശ്രിത സ്ത്രീകൾക്കും ധനസഹായം', 'ਵਿਧਵਾਵਾਂ ਅਤੇ ਨਿਰਾਸ਼ਰਿਤ ਔਰਤਾਂ ਨੂੰ ਵਿੱਤੀ ਸਹਾਇਤਾ'])],
  ['निराश्रित विधवा पेंशन योजना', pack(['', 'নিঃস্ব বিধবা পেনশন প্রকল্প', 'ஆதரவற்ற விதவை ஓய்வூதியத் திட்டம்', 'నిరాశ్రయ వితంతు పెన్షన్ పథకం', 'निराधार विधवा पेन्शन योजना', 'નિરાધાર વિધવા પેન્શન યોજના', 'ನಿರಾಶ್ರಿತ ವಿಧವಾ ಪಿಂಚಣಿ ಯೋಜನೆ', 'നിരാശ്രിത വിധവാ പെൻഷൻ പദ്ധതി', 'ਨਿਰਾਸ਼ਰਿਤ ਵਿਧਵਾ ਪੈਨਸ਼ਨ ਯੋਜਨਾ'])],
  ['विधवा पेंशन योजना', pack(['', 'বিধবা পেনশন প্রকল্প', 'விதவை ஓய்வூதியத் திட்டம்', 'వితంతు పెన్షన్ పథకం', 'विधवा पेन्शन योजना', 'વિધવા પેન્શન યોજના', 'ವಿಧವಾ ಪಿಂಚಣಿ ಯೋಜನೆ', 'വിധവാ പെൻഷൻ പദ്ധതി', 'ਵਿਧਵਾ ਪੈਨਸ਼ਨ ਯੋਜਨਾ'])],
  ['विधवा पेंशन', pack(['', 'বিধবা পেনশন', 'விதவை ஓய்வூதியம்', 'వితంతు పెన్షన్', 'विधवा पेन्शन', 'વિધવા પેન્શન', 'ವಿಧವಾ ಪಿಂಚಣಿ', 'വിധവാ പെൻഷൻ', 'ਵਿਧਵਾ ਪੈਨਸ਼ਨ'])],
  ['मुख्यमंत्री', pack(['', 'মুখ্যমন্ত্রী', 'முதலமைச்சர்', 'ముఖ్యమంత్రి', 'मुख्यमंत्री', 'મુખ્યમંત્રી', 'ಮುಖ್ಯಮಂತ್ರಿ', 'മുഖ്യമന്ത്രി', 'ਮੁੱਖਮੰਤਰੀ'])],
  ['प्रधानमंत्री', pack(['', 'প্রধানমন্ত্রী', 'பிரதான் மந்திரி', 'ప్రధానమంత్రి', 'पंतप्रधान', 'પ્રધાનમંત્રી', 'ಪ್ರಧಾನ ಮಂತ್ರಿ', 'പ്രധാനമന്ത്രി', 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ'])],
  ['निराश्रित', pack(['', 'নিঃস্ব', 'ஆதரவற்ற', 'నిరాశ్రయ', 'निराधार', 'નિરાધાર', 'ನಿರಾಶ್ರಿತ', 'നിരാശ്രിത', 'ਨਿਰਾਸ਼ਰਿਤ'])],
  ['वित्तीय सहायता', pack(['', 'আর্থিক সহায়তা', 'நிதி உதவி', 'ఆర్థిక సహాయం', 'आर्थिक मदत', 'નાણાકીય સહાય', 'ಆರ್ಥಿಕ ನೆರವು', 'ധനസഹായം', 'ਵਿੱਤੀ ਸਹਾਇਤਾ'])],
  ['पुनर्विवाह', pack(['', 'পুনর্বিবাহ', 'மறுமணம்', 'పునర్వివాహం', 'पुनर्विवाह', 'પુનર્વિવાહ', 'ಪುನರ್ವಿವಾಹ', 'പുനർവിവാഹം', 'ਮੁੜ-ਵਿਆਹ'])],
  ['छात्रवृत्ति', pack(['', 'বৃত্তি', 'உதவித்தொகை', 'స్కాలర్‌షిప్', 'शिष्यवृत्ती', 'શિષ્યવૃત્તિ', 'ವಿದ್ಯಾರ್ಥಿವೇತನ', 'സ്കോളർഷിപ്പ്', 'ਸਕਾਲਰਸ਼ਿਪ'])],
  ['महिलाओं', pack(['', 'নারীদের', 'பெண்களுக்கு', 'మహిళలకు', 'महिलांना', 'મહિલાઓને', 'ಮಹಿಳೆಯರಿಗೆ', 'സ്ത്രീകൾക്ക്', 'ਔਰਤਾਂ ਨੂੰ'])],
  ['महिला', pack(['', 'নারী', 'பெண்', 'మహిళ', 'महिला', 'મહિલા', 'ಮಹಿಳೆ', 'സ്ത്രೀ', 'ਔਰਤ'])],
  ['विधवाओं', pack(['', 'বিধবাদের', 'விதவைகளுக்கு', 'వితంతువులకు', 'विधवांना', 'વિધવાઓને', 'ವಿಧವೆಯರಿಗೆ', 'വിധവകൾക്ക്', 'ਵਿਧਵਾਵਾਂ ਨੂੰ'])],
  ['विधवाएँ', pack(['', 'বিধবা', 'விதவைகள்', 'వితంతువులు', 'विधवा', 'વિધવાઓ', 'ವಿಧವೆಯರು', 'വിധവകൾ', 'ਵਿਧਵਾਵਾਂ'])],
  ['विधवा', pack(['', 'বিধবা', 'விதவை', 'వితంతువు', 'विधवा', 'વિધવા', 'ವಿಧವೆ', 'വിധവ', 'ਵਿਧਵਾ'])],
  ['पुत्रियों', pack(['', 'কন্যাদের', 'மகள்களுக்கு', 'కుమార్తెలకు', 'मुलींना', 'પુત્રીઓને', 'ಮಕ್ಕಳಿಗೆ', 'പെൺമക്കൾക്ക്', 'ਧੀਆਂ ਨੂੰ'])],
  ['पुत्री', pack(['', 'কন्या', 'மகள்', 'కుమార్తె', 'मुलगी', 'પુત્રી', 'ಮಗಳು', 'മകൾ', 'ਧੀ'])],
  ['पेंशन', pack(['', 'পেনশন', 'ஓய்வூதியம்', 'పెన్షన్', 'पेन्शन', 'પેન્શન', 'ಪಿಂಚಣಿ', 'പെൻഷൻ', 'ਪੈਨਸ਼ਨ'])],
  ['योजना', pack(['', 'যোজনা', 'யோஜனா', 'యోజన', 'योजना', 'યોજના', 'ಯೋಜನೆ', 'യോജന', 'ਯੋਜਨਾ'])],
  ['राष्ट्रीय', pack(['', 'জাতীয়', 'தேசிய', 'జాతీయ', 'राष्ट्रीय', 'રાષ્ટ્રીય', 'ರಾಷ್ಟ್ರೀಯ', 'ദേശീയ', 'ਰਾਸ਼ਟਰੀ'])],
  ['राज्य', pack(['', 'রাজ্য', 'மாநில', 'రాష్ట్ర', 'राज्य', 'રાજ્ય', 'ರಾಜ್ಯ', 'സംസ്ഥാന', 'ਰਾਜ'])],
  ['सहायता', pack(['', 'সহায়তা', 'உதவி', 'సహాయం', 'मदत', 'સહાય', 'ನೆರವು', 'സഹായം', 'ਸਹਾਇਤਾ'])],
  ['प्राथमिकता', pack(['', 'অগ্রাধিকার', 'முன்னுரிமை', 'ప్రాధాన్యం', 'प्राधान्य', 'પ્રાથમિકતા', 'ಆದ್ಯತೆ', 'മുൻഗണന', 'ਤਰਜੀਹ'])],
  ['निःशुल्क', pack(['', 'বিনামূল্যে', 'இலவச', 'ఉచిత', 'मोफत', 'મફત', 'ಉಚಿತ', 'സൗജന്യ', 'ਮੁਫ਼ਤ'])],
  ['कानूनी', pack(['', 'আইনি', 'சட்ட', 'న్యాయ', 'कायदेशीर', 'કાનૂની', 'ಕಾನೂನು', 'നിയമ', 'ਕਾਨੂੰਨੀ'])],
  ['आवास', pack(['', 'আবাস', 'வீடு', 'గృహ', 'निवास', 'આવાસ', 'ವಸತಿ', 'ഭവനം', 'ਰਿਹਾਇਸ਼'])],
  ['शिक्षा', pack(['', 'শিক্ষা', 'கல்வி', 'విద్య', 'शिक्षण', 'શિક્ષણ', 'ಶಿಕ್ಷಣ', 'വിദ്യാഭ്യാസം', 'ਸਿੱਖਿਆ'])],
  ['स्वास्थ्य', pack(['', 'স্বাস্থ্য', 'சுகாதாரம்', 'ఆరోగ్య', 'आरोग्य', 'આરોગ્ય', 'ಆರೋಗ್ಯ', 'ആരോഗ്യ', 'ਸਿਹਤ'])],
  ['बीमा', pack(['', 'বিমা', 'காப்பீடு', 'బీమా', 'विमा', 'વીમો', 'ವಿಮೆ', 'ഇൻഷുറൻസ്', 'ਬੀਮਾ'])],
  ['विवाह', pack(['', 'বিবাহ', 'திருமணம்', 'వివాహం', 'विवाह', 'લગ્ન', 'ವಿವಾಹ', 'വിവാഹം', 'ਵਿਆਹ'])],
  ['माताओं', pack(['', 'মায়েদের', 'தாய்மார்களுக்கு', 'తల్లులకు', 'मातांना', 'માતાઓને', 'ತಾಯಂದಿರಿಗೆ', 'അമ്മമാർക്ക്', 'ਮਾਵਾਂ ਨੂੰ'])],
  ['बच्चों', pack(['', 'শিশুদের', 'குழந்தைகளுக்கு', 'పిల్లలకు', 'मुलांना', 'બાળકોને', 'ಮಕ್ಕಳಿಗೆ', 'കുട്ടികൾക്ക്', 'ਬੱਚਿਆਂ ਨੂੰ'])],
  ['हेतु', pack(['', 'জন্য', 'க்கான', 'కోసం', 'साठी', 'માટે', 'ಗಾಗಿ', 'വേണ്ടി', 'ਲਈ'])],
  ['के लिए', pack(['', 'জন্য', 'க்கான', 'కోసం', 'साठी', 'માટે', 'ಗಾಗి', 'വേണ്ടി', 'ਲਈ'])],
  ['और', pack(['', 'ও', 'மற்றும்', 'మరియు', 'आणि', 'અને', 'ಮತ್ತು', 'ഒപ്പം', 'ਅਤੇ'])],
];

function fromHindiName(hi, lang) {
  if (!hi) return hi;
  if (lang === 'hi') return hi;
  let out = hi;
  const sorted = [...HI_NAME].sort((a, b) => b[0].length - a[0].length);
  for (const [src, row] of sorted) {
    const dst = row[lang];
    if (!dst) continue;
    if (out.includes(src)) out = out.split(src).join(dst);
  }
  for (const row of Object.values(STATES)) {
    if (row.hi && row[lang] && out.includes(row.hi)) out = out.split(row.hi).join(row[lang]);
  }
  return out;
}

function translateName(scheme, lang) {
  const hi = SCHEME_HI_NAMES[scheme.id];
  if (lang === 'hi') return hi || scheme.name;
  // Marathi can keep shared Devanagari. Other scripts must not leak leftover Hindi.
  const fromHi = hi ? fromHindiName(hi, lang) : '';
  const leftoverHi = (fromHi.match(/[\u0900-\u097F]/g) || []).length;
  if (fromHi && (lang === 'mr' || leftoverHi <= 4)) return fromHi;
  if (!scheme.name) return fromHi || scheme.name;
  const fromEn = applyMap(scheme.name, lang, NAME_FRAGMENTS);
  return fromEn;
}

function translateDoc(item, lang) {
  if (DOCS[item]?.[lang]) return DOCS[item][lang];
  const death = item.match(/^Death Certificate of (.+)$/i);
  if (death) {
    const who = REL[death[1]]?.[lang] || translateText(death[1], lang);
    return `${DOCS['Death Certificate'][lang]} (${who})`;
  }
  return translateText(item, lang);
}

function bannerFor(scheme) {
  const link = scheme.link || '';
  const name = (scheme.name || '').toLowerCase();
  const id = scheme.id;
  const official_link = link || null;
  let sourcePortal = link || null;
  let bannerUrl = null;
  let bannerFile = null;
  let bannerNote = 'URL only — not shown in the web UI.';

  if (/ignwps|nsap|national widow pension|national family benefit|nfbs/.test(name) || /nsap\.nic\.in/.test(link)) {
    sourcePortal = 'https://nsap.nic.in/';
    bannerUrl = 'https://nsap.nic.in/';
  } else if (/pm-jay|ayushman|pmjay/.test(name)) {
    sourcePortal = 'https://nha.gov.in/PM-JAY';
    bannerUrl = 'https://nha.gov.in/img/nha-logo.png';
  } else if (/pmay|awas yojana/.test(name)) {
    sourcePortal = 'https://pmayg.nic.in/';
    bannerUrl = 'https://pmayg.nic.in/netiay/images/logo.png';
  } else if (/nalsa|legal aid|slsa|succession act|personal law/.test(name) || /nalsa\.gov\.in/.test(link)) {
    sourcePortal = 'https://nalsa.gov.in/';
    bannerUrl = 'https://nalsa.gov.in/';
  } else if (/epfo|eps 95/.test(name)) {
    sourcePortal = 'https://www.epfindia.gov.in/';
    bannerUrl = 'https://www.epfindia.gov.in/site_en/images/logo.png';
  } else if (/\besic\b/.test(name)) {
    sourcePortal = 'https://www.esic.gov.in/';
    bannerUrl = 'https://www.esic.gov.in/';
  } else if (/myscheme\.gov\.in/.test(link)) {
    sourcePortal = link;
    bannerUrl = 'https://www.myscheme.gov.in/images/myscheme-logo.svg';
  } else if (/india\.gov\.in/.test(link)) {
    sourcePortal = link;
    bannerUrl = 'https://www.india.gov.in/sites/upload_files/npi/files/logo/logo_en.png';
  } else if (link) {
    sourcePortal = link;
    try {
      const u = new URL(link);
      bannerUrl = `${u.origin}/favicon.ico`;
    } catch {
      bannerUrl = null;
    }
  }

  return {
    id,
    officialName: scheme.name || SCHEME_HI_NAMES[id] || id,
    sourcePortal,
    officialLink: official_link,
    bannerUrl,
    bannerFile,
    bannerNote,
  };
}

function sqlEsc(val) {
  if (val == null) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

function sqlArr(arr) {
  if (!Array.isArray(arr) || !arr.length) return "'{}'";
  return `ARRAY[${arr.map((x) => sqlEsc(x)).join(', ')}]`;
}

function build() {
  const translations = {};
  for (const scheme of SCHEMES) {
    translations[scheme.id] = {};
    for (const lang of LANGS) {
      translations[scheme.id][lang] = {
        name: translateName(scheme, lang),
        description: translateText(scheme.description, lang),
        eligibility: translateText(scheme.eligibility, lang),
        benefit: translateText(scheme.benefit, lang),
        processingTime: (PROC[scheme.processingTime] && PROC[scheme.processingTime][lang])
          || translateText(scheme.processingTime, lang),
        state: (STATES[scheme.state] && STATES[scheme.state][lang]) || scheme.state,
        documents: (scheme.documents || []).map((d) => translateDoc(d, lang)),
      };
    }
  }

  const banners = SCHEMES.map(bannerFor);
  const bannerById = Object.fromEntries(banners.map((b) => [b.id, b]));

  const dataset = SCHEMES.map((s) => {
    const b = bannerById[s.id];
    return {
      ...s,
      official_link: s.link || null,
      banner_url: b.bannerUrl,
      banner_file: b.bannerFile,
      source_portal: b.sourcePortal,
    };
  });

  const i18nOut = `${root}/src/i18n/schemeTranslations.js`;
  writeFileSync(i18nOut, `/** Auto-generated by scripts/generate_scheme_assets.mjs. English lives in src/data/schemes.js. */\nexport const SCHEME_TRANSLATIONS = ${JSON.stringify(translations)};\n`);

  mkdirSync(join(root, 'data'), { recursive: true });
  writeFileSync(join(root, 'data/schemes-banners.json'), `${JSON.stringify({
    note: 'Official portal / banner URLs for 124 schemes. Do not render these images in the website UI yet.',
    count: banners.length,
    schemes: bannerById,
  }, null, 2)}\n`);
  writeFileSync(join(root, 'data/schemes-dataset.json'), `${JSON.stringify({
    generatedAt: new Date().toISOString().slice(0, 10),
    count: dataset.length,
    schemes: dataset,
  }, null, 2)}\n`);

  const inserts = SCHEMES.map((s) => {
    const b = bannerById[s.id];
    return `INSERT INTO schemes (id, name, category, subcategory, state, eligibility, description, documents, benefit, official_link, banner_url, credits, processing_time, popular, rating, reviews, status, source)
VALUES (${sqlEsc(s.id)}, ${sqlEsc(s.name)}, ${sqlEsc(s.category)}, ${sqlEsc(s.subcategory)}, ${sqlEsc(s.state)}, ${sqlEsc(s.eligibility)}, ${sqlEsc(s.description)}, ${sqlArr(s.documents)}, ${sqlEsc(s.benefit)}, ${sqlEsc(s.link || b.officialLink)}, ${sqlEsc(b.bannerUrl)}, ${Number(s.credits) || 0}, ${sqlEsc(s.processingTime)}, ${s.popular ? 'TRUE' : 'FALSE'}, ${s.rating == null ? 'NULL' : Number(s.rating)}, ${Number(s.reviews) || 0}, ${sqlEsc(s.status || 'active')}, ${sqlEsc(s.source)})
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  state = EXCLUDED.state,
  eligibility = EXCLUDED.eligibility,
  description = EXCLUDED.description,
  documents = EXCLUDED.documents,
  benefit = EXCLUDED.benefit,
  official_link = EXCLUDED.official_link,
  banner_url = EXCLUDED.banner_url,
  credits = EXCLUDED.credits,
  processing_time = EXCLUDED.processing_time,
  popular = EXCLUDED.popular,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  status = EXCLUDED.status,
  source = EXCLUDED.source;`;
  });

  writeFileSync(join(root, 'scripts/seed_schemes.sql'), `-- Seed 124 schemes from src/data/schemes.js + data/schemes-banners.json
-- English Excel text. No passwords. Run after schema.sql
-- psql "$DATABASE_URL" -f scripts/schema.sql -f scripts/seed_schemes.sql

${inserts.join('\n\n')}
`);

  console.log('Wrote', i18nOut);
  console.log('Schemes', SCHEMES.length, 'langs', LANGS.join(','));
}

build();
