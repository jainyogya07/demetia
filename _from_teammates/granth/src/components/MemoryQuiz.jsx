import { useEffect, useMemo, useRef, useState } from "react";
import "./MemoryQuiz.css";

import {
  PATIENT,
  CARE_CIRCLE,
  SAFETY,
} from "../data/patientDashboard";

const UI_TEXT = {
  en: {
    title: "Memory Check",
    chooseLanguage: "Choose your language",
    question: "QUESTION",
    hearQuestion: "Hear Question",
    tapSpeak: "Tap and Speak",
    speakNaturally: "Speak naturally. You don't need to type.",
    checkAnswer: "Check Answer",
    dontKnow: "I Don't Know",
    listening: "Listening...",
    recognized: "I heard:",
    correct: "That's correct!",
    tryAgain: "Let's try again.",
    skipped: "That's okay. Let's move on.",
    completed: "Memory Check Complete",
    score: "Your Score",
    continue: "Continue to Dashboard",
    monitoring:
      "This activity is for memory and cognitive monitoring. It is not a medical diagnosis.",
    microphoneError:
      "Microphone could not be started. Please allow microphone access and try again.",
    noSpeech: "I couldn't hear you. Please try speaking again.",
    unsupported:
      "Voice recognition is not supported by this browser. Please try Chrome or Edge.",
  },

  hi: {
    title: "स्मृति जाँच",
    chooseLanguage: "अपनी भाषा चुनें",
    question: "प्रश्न",
    hearQuestion: "प्रश्न सुनें",
    tapSpeak: "टैप करें और बोलें",
    speakNaturally:
      "स्वाभाविक रूप से बोलें। आपको टाइप करने की आवश्यकता नहीं है।",
    checkAnswer: "उत्तर जाँचें",
    dontKnow: "मुझे नहीं पता",
    listening: "सुना जा रहा है...",
    recognized: "मैंने सुना:",
    correct: "सही उत्तर!",
    tryAgain: "एक बार फिर कोशिश करें।",
    skipped: "कोई बात नहीं। चलिए आगे बढ़ते हैं।",
    completed: "स्मृति जाँच पूरी हुई",
    score: "आपका स्कोर",
    continue: "डैशबोर्ड पर जाएँ",
    monitoring:
      "यह गतिविधि स्मृति और संज्ञानात्मक निगरानी के लिए है। यह कोई चिकित्सीय निदान नहीं है।",
    microphoneError:
      "माइक्रोफ़ोन शुरू नहीं हो सका। कृपया माइक्रोफ़ोन की अनुमति दें और फिर प्रयास करें।",
    noSpeech:
      "मैं आपकी आवाज़ नहीं सुन सका। कृपया फिर से बोलें।",
    unsupported:
      "इस ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। कृपया Chrome या Edge का उपयोग करें।",
  },

  as: {
    title: "স্মৃতি পৰীক্ষা",
    chooseLanguage: "আপোনাৰ ভাষা বাছনি কৰক",
    question: "প্ৰশ্ন",
    hearQuestion: "প্ৰশ্নটো শুনক",
    tapSpeak: "টেপ কৰক আৰু কওক",
    speakNaturally:
      "স্বাভাৱিকভাৱে কওক। টাইপ কৰাৰ প্ৰয়োজন নাই।",
    checkAnswer: "উত্তৰ পৰীক্ষা কৰক",
    dontKnow: "মই নাজানো",
    listening: "শুনি থকা হৈছে...",
    recognized: "মই শুনিলোঁ:",
    correct: "শুদ্ধ উত্তৰ!",
    tryAgain: "আকৌ এবাৰ চেষ্টা কৰক।",
    skipped: "কোনো কথা নাই। আহক আগবাঢ়ো।",
    completed: "স্মৃতি পৰীক্ষা সম্পূৰ্ণ",
    score: "আপোনাৰ স্ক'ৰ",
    continue: "ডেশ্বব'ৰ্ডলৈ যাওক",
    monitoring:
      "এই কাৰ্যকলাপটো স্মৃতি আৰু জ্ঞানীয় পৰ্যবেক্ষণৰ বাবে। ই কোনো চিকিৎসা নিৰ্ণয় নহয়।",
    microphoneError:
      "মাইক্ৰ'ফোন আৰম্ভ কৰিব পৰা নগ'ল। অনুগ্ৰহ কৰি মাইক্ৰ'ফোনৰ অনুমতি দিয়ক আৰু পুনৰ চেষ্টা কৰক।",
    noSpeech:
      "মই আপোনাৰ কথা শুনিব নোৱাৰিলোঁ। অনুগ্ৰহ কৰি আকৌ কওক।",
    unsupported:
      "এই ব্ৰাউজাৰত কণ্ঠ চিনাক্তকৰণ সমৰ্থিত নহয়। অনুগ্ৰহ কৰি Chrome বা Edge ব্যৱহাৰ কৰক।",
  },

  bn: {
    title: "স্মৃতি পরীক্ষা",
    chooseLanguage: "আপনার ভাষা নির্বাচন করুন",
    question: "প্রশ্ন",
    hearQuestion: "প্রশ্ন শুনুন",
    tapSpeak: "ট্যাপ করুন এবং বলুন",
    speakNaturally:
      "স্বাভাবিকভাবে বলুন। টাইপ করার দরকার নেই।",
    checkAnswer: "উত্তর পরীক্ষা করুন",
    dontKnow: "আমি জানি না",
    listening: "শোনা হচ্ছে...",
    recognized: "আমি শুনেছি:",
    correct: "সঠিক উত্তর!",
    tryAgain: "আবার চেষ্টা করুন।",
    skipped: "কোনো সমস্যা নেই। চলুন এগিয়ে যাই।",
    completed: "স্মৃতি পরীক্ষা সম্পূর্ণ",
    score: "আপনার স্কোর",
    continue: "ড্যাশবোর্ডে যান",
    monitoring:
      "এই কার্যকলাপটি স্মৃতি এবং জ্ঞানীয় পর্যবেক্ষণের জন্য। এটি কোনো চিকিৎসা নির্ণয় নয়।",
    microphoneError:
      "মাইক্রোফোন শুরু করা যায়নি। অনুগ্রহ করে মাইক্রোফোনের অনুমতি দিন এবং আবার চেষ্টা করুন।",
    noSpeech:
      "আমি আপনার কথা শুনতে পারিনি। অনুগ্রহ করে আবার বলুন।",
    unsupported:
      "এই ব্রাউজারে ভয়েস রিকগনিশন সমর্থিত নয়। অনুগ্রহ করে Chrome বা Edge ব্যবহার করুন।",
  },

  mni: {
    title: "মেম'রি চেক",
    chooseLanguage: "নহাক্কী লোল শেমজিনবিয়ু",
    question: "ৱাহং",
    hearQuestion: "ৱাহং তাবিয়ু",
    tapSpeak: "টেপ তৌরগা হায়বিয়ু",
    speakNaturally:
      "স্বাভাবিকভাবে হায়বিয়ু। টাইপ তৌবগী দরকার লৈতে।",
    checkAnswer: "খুমজিনবা শেমজিনবিয়ু",
    dontKnow: "ঐ নত্তে খঙদে",
    listening: "তাবা লৈরে...",
    recognized: "ঐনা তাবা:",
    correct: "খুদোল সায়!",
    tryAgain: "অমুক হন্না শেমজিনবিয়ু।",
    skipped: "চিন্তা তৌদনা। হায়দুনা চৎলসি।",
    completed: "মেম'রি চেক লোইরে",
    score: "নহাক্কী স্কোর",
    continue: "ড্যাশবোর্ডদা চৎলু",
    monitoring:
      "মসিগী থৌরম অসি মেম'রি অমসুং জ্ঞানীয় পর্যবেক্ষণগীদমক্তা। মসি চিকিৎসাগী নির্ণয় নত্তে।",
    microphoneError:
      "মাইক্ৰ'ফোন হাংদোকপা য়ারোই। মাইক্ৰ'ফোনগী অনুমতি পীয়ু অমসুং হন্না নাজরো।",
    noSpeech:
      "নহাক্কী ৱা তাবা য়ারোই। হন্না হায়বিয়ু।",
    unsupported:
      "ব্রাউজর অসিদা ভয়েস রিকগনিশন সমর্থিত নত্তে। Chrome নত্রগা Edge শিজিন্নবিয়ু।",
  },

  brx: {
    title: "सोदोब फिननाय",
    chooseLanguage: "नोंथांनि राव सायख",
    question: "सोंनाय",
    hearQuestion: "सोंनाय खोनास",
    tapSpeak: "टेप खालाम नोंथां बुं",
    speakNaturally:
      "स्वाभाविकै बुं। टाइप खालामनाय नांगौ।",
    checkAnswer: "फिननाय सायख",
    dontKnow: "आं नाजानाय",
    listening: "खोनासिगोन...",
    recognized: "आं खोनासोन:",
    correct: "थिक फिननाय!",
    tryAgain: "फिनसे नाजान।",
    skipped: "जेबो जाया। दा जाबाय।",
    completed: "सोदोब फिननाय जोबबाय",
    score: "नोंथांनि स्कोर",
    continue: "डैशबोर्डआव थां",
    monitoring:
      "बे थाखोआ सोदोब आरो बुद्धिमत्ता नायगिरिनि थाखाय। बेयो चिकित्सा रोग नायगिरि नङा।",
    microphoneError:
      "माइक्रोफोन जागायनो हायाखै। अनुग्रह खालाम माइक्रोफोननि अनुमति हो आरो फिन नाजा।",
    noSpeech:
      "आं नोंथांनि बुंनाय खोनासनो हायाखै। फिन बुं।",
    unsupported:
      "बे ब्राउजरआव आवाज सायखो समर्थित नङा। Chrome एबा Edge बाहाय।",
  },

  kha: {
    title: "Ka Jingpyrkhat",
    chooseLanguage: "Jied ia ka ktien jong phi",
    question: "KYLLA",
    hearQuestion: "Sngap ia ka jingkylli",
    tapSpeak: "Pynkhih bad kren",
    speakNaturally:
      "Kren kumba phi ju kren. Ym donkam ban type.",
    checkAnswer: "Peit ia ka jubab",
    dontKnow: "Ngam tip",
    listening: "Sngap...",
    recognized: "Nga la iohsngew:",
    correct: "Ka jubab ka dei!",
    tryAgain: "Pyrshang biang.",
    skipped:
      "Ym don jingeh. Ngin leit shakhmat.",
    completed: "Ka jingpyrkhat ka la dep",
    score: "Ka score jong phi",
    continue: "Leit sha Dashboard",
    monitoring:
      "Kane ka kam ka long na ka bynta ka jingpyrkhat bad ka jingpeitngor. Kam dei ka jingdiagnosis jong ka jingshitom.",
    microphoneError:
      "Ym lah ban sdang ia ka microphone. Sngewbha ai jingbit bad pyrshang biang.",
    noSpeech:
      "Ngam lah ban iohsngew ia phi. Sngewbha kren biang.",
    unsupported:
      "Ka voice recognition kam treikam ha kane ka browser. Sngewbha pyndonkam Chrome ne Edge.",
  },

  lus: {
    title: "Hriatna",
    chooseLanguage: "I tawng i thlang",
    question: "ZAWNH",
    hearQuestion: "Zawhna chu ngai rawh",
    tapSpeak: "Tap la, sa rawng rawh",
    speakNaturally:
      "Dik taka sa rawng rawh. Type ngai lo.",
    checkAnswer: "Chhanna en rawh",
    dontKnow: "Ka hre lo",
    listening: "Ngaihtuah...",
    recognized: "Ka hria:",
    correct: "Chhanna dik!",
    tryAgain: "Pher leh rawh.",
    skipped:
      "A buai lo. Kan kal zel ang.",
    completed: "Hriatna check zawh",
    score: "I score",
    continue: "Dashboard-ah kal rawh",
    monitoring:
      "He thil hi hriatna leh ngaihtuahna thlithlai nan a ni. Doctor diagnosis a ni lo.",
    microphoneError:
      "Microphone hi tan theih a ni lo. Microphone phalna pe la, pher leh rawh.",
    noSpeech:
      "I thusawi ka hre lo. Pher leh rawh.",
    unsupported:
      "He browser-ah voice recognition hi a support lo. Chrome emaw Edge emaw hmang rawh.",
  },
};

const SPEECH_LANGUAGES = {
  en: "en-IN",
  hi: "hi-IN",
  as: "as-IN",
  bn: "bn-IN",
  mni: "mni-IN",
  brx: "brx-IN",
  kha: "kha-IN",
  lus: "lus-IN",
};

const LANGUAGE_NAMES = {
  en: "English",
  hi: "हिन्दी",
  as: "অসমীয়া",
  bn: "বাংলা",
  mni: "মৈতৈলোন / Manipuri",
  brx: "बड़ो / Bodo",
  kha: "Khasi",
  lus: "Mizo",
};

function normalizeText(value = "") {
  return value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[।,!?;:'"’“”()\-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function answerMatches(spokenAnswer, acceptedAnswers = []) {
  const spoken = normalizeText(spokenAnswer);

  if (!spoken) {
    return false;
  }

  return acceptedAnswers.some((answer) => {
    const expected = normalizeText(answer);

    if (!expected) {
      return false;
    }

    if (spoken === expected) {
      return true;
    }

    if (spoken.includes(expected)) {
      return true;
    }

    if (expected.includes(spoken) && spoken.length >= 2) {
      return true;
    }

    const spokenWords = spoken.split(" ").filter(Boolean);
    const expectedWords = expected.split(" ").filter(Boolean);

    if (expectedWords.length === 1) {
      return spokenWords.includes(expectedWords[0]);
    }

    const matchingWords = expectedWords.filter((word) =>
      spokenWords.includes(word)
    );

    return (
      matchingWords.length >=
      Math.ceil(expectedWords.length / 2)
    );
  });
}
function MemoryQuiz({ onComplete }) {
  const [language, setLanguage] = useState("hi");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [spokenAnswer, setSpokenAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [microphoneError, setMicrophoneError] = useState("");

  const recognitionRef = useRef(null);

  const patientName = PATIENT?.name || "";

  const daughterName =
    CARE_CIRCLE?.find(
      (member) =>
        member?.relation?.toLowerCase() === "daughter"
    )?.name || "";

  const sonName =
    CARE_CIRCLE?.find(
      (member) =>
        member?.relation?.toLowerCase() === "son"
    )?.name || "";

  const location = SAFETY?.zone || "Home";

  const t = UI_TEXT[language] || UI_TEXT.en;

  const questions = useMemo(() => {
    const questionSets = {
      en: [
        {
          text: "What is your name?",
          answers: [patientName],
        },
        {
          text: daughterName
            ? "What is your daughter's name?"
            : "Who is someone in your family?",
          answers: daughterName
            ? [daughterName]
            : ["family", "mother", "father", "daughter", "son"],
        },
        {
          text: sonName
            ? "What is your son's name?"
            : "Who is someone in your family?",
          answers: sonName
            ? [sonName]
            : ["family", "mother", "father", "daughter", "son"],
        },
        {
          text: "Where are you right now?",
          answers: [
            location,
            "home",
            "at home",
            "safe zone",
          ],
        },
        {
          text:
            "Which one can you eat: an apple or a chair?",
          answers: ["apple", "an apple"],
        },
        {
          text:
            "What do we use for sleeping: a bed or a table?",
          answers: ["bed", "a bed"],
        },
        {
          text:
            "How many fingers are on one hand?",
          answers: ["five", "5"],
        },
        {
          text:
            "Please remember this word: mango.",
          answers: ["mango"],
        },
        {
          text:
            "What was the word I asked you to remember?",
          answers: ["mango"],
        },
      ],

      hi: [
        {
          text: "आपका नाम क्या है?",
          answers: [patientName],
        },
        {
          text: "आपकी बेटी का नाम क्या है?",
          answers: daughterName
            ? [daughterName]
            : ["परिवार", "माँ", "पिता", "बेटी", "बेटा"],
        },
        {
          text: "आपके बेटे का नाम क्या है?",
          answers: sonName
            ? [sonName]
            : ["परिवार", "माँ", "पिता", "बेटी", "बेटा"],
        },
        {
          text: "आप अभी कहाँ हैं?",
          answers: [
            location,
            "घर",
            "अपने घर",
            "होम",
          ],
        },
        {
          text: "आप क्या खा सकते हैं: सेब या कुर्सी?",
          answers: ["सेब"],
        },
        {
          text:
            "सोने के लिए हम किसका उपयोग करते हैं: बिस्तर या मेज़?",
          answers: ["बिस्तर", "बेड"],
        },
        {
          text:
            "एक हाथ में कितनी उंगलियाँ होती हैं?",
          answers: ["पाँच", "5", "पांच"],
        },
        {
          text: "इस शब्द को याद रखिए: आम।",
          answers: ["आम"],
        },
        {
          text:
            "मैंने आपको कौन-सा शब्द याद रखने के लिए कहा था?",
          answers: ["आम"],
        },
      ],

      as: [
        {
          text: "আপোনাৰ নাম কি?",
          answers: [patientName],
        },
        {
          text: "আপোনাৰ ছোৱালীৰ নাম কি?",
          answers: [daughterName],
        },
        {
          text: "আপোনাৰ ল'ৰাৰ নাম কি?",
          answers: [sonName],
        },
        {
          text: "আপুনি এতিয়া ক'ত আছে?",
          answers: [location, "ঘৰ", "home"],
        },
        {
          text:
            "আপুনি কি খাব পাৰে: আপেল নে চকী?",
          answers: ["আপেল"],
        },
        {
          text:
            "আমি শুবলৈ কি ব্যৱহাৰ কৰোঁ: বিচনা নে টেবুল?",
          answers: ["বিচনা"],
        },
        {
          text:
            "এখন হাতত কিমানটা আঙুলি থাকে?",
          answers: ["পাঁচ", "5"],
        },
        {
          text: "এই শব্দটো মনত ৰাখক: আম।",
          answers: ["আম"],
        },
        {
          text:
            "মই আপোনাক কোনটো শব্দ মনত ৰাখিবলৈ কৈছিলোঁ?",
          answers: ["আম"],
        },
      ],

      bn: [
        {
          text: "আপনার নাম কী?",
          answers: [patientName],
        },
        {
          text: "আপনার মেয়ের নাম কী?",
          answers: [daughterName],
        },
        {
          text: "আপনার ছেলের নাম কী?",
          answers: [sonName],
        },
        {
          text: "আপনি এখন কোথায় আছেন?",
          answers: [
            location,
            "বাড়ি",
            "বাড়ি",
            "home",
          ],
        },
        {
          text:
            "আপনি কী খেতে পারেন: আপেল না চেয়ার?",
          answers: ["আপেল"],
        },
        {
          text:
            "ঘুমানোর জন্য আমরা কী ব্যবহার করি: বিছানা না টেবিল?",
          answers: ["বিছানা"],
        },
        {
          text:
            "এক হাতে কয়টি আঙুল থাকে?",
          answers: ["পাঁচ", "5"],
        },
        {
          text:
            "এই শব্দটি মনে রাখুন: আম।",
          answers: ["আম"],
        },
        {
          text:
            "আমি আপনাকে কোন শব্দটি মনে রাখতে বলেছিলাম?",
          answers: ["আম"],
        },
      ],

      mni: [
        {
          text: "নহাক্কী মিং করিনো?",
          answers: [patientName],
        },
        {
          text: "নহাক্কী মচা মিং করিনো?",
          answers: [daughterName],
        },
        {
          text: "নহাক্কী মচা মিং করিনো?",
          answers: [sonName],
        },
        {
          text: "নহাক্না নুংসি কৰাম্বদা লৈবগে?",
          answers: [location, "home"],
        },
        {
          text:
            "আপেল নত্রগা চেয়ার, করিগুম্বা শিজিনবদা চাবা য়াবগে?",
          answers: ["আপেল"],
        },
        {
          text:
            "নুংথিল নোংমা নুমিত্তা করিগা শিজিনবগে: বেড নত্রগা টেবুল?",
          answers: ["বেড"],
        },
        {
          text:
            "অমা মাইদা কয়া ফিঙ্গল লৈবগে?",
          answers: ["5", "পাঁচ"],
        },
        {
          text:
            "মসিগী মিং অসি মপুংফম খঙজিনবিয়ু: আম।",
          answers: ["আম"],
        },
        {
          text:
            "করিগী মিং মপুংফম খঙজিনবিয়ু?",
          answers: ["আম"],
        },
      ],

      brx: [
        {
          text: "नोंथांनि मुं मा?",
          answers: [patientName],
        },
        {
          text: "नोंथांनि बिलाइनि मुं मा?",
          answers: [daughterName],
        },
        {
          text: "नोंथांनि फिसानि मुं मा?",
          answers: [sonName],
        },
        {
          text: "नोंथां दा सोरायाव दं?",
          answers: [
            location,
            "नोङो",
            "होम",
          ],
        },
        {
          text:
            "नोंथां मा जानो हायो: सेव नङा आसन?",
          answers: ["सेव"],
        },
        {
          text:
            "हुइनायनि थाखाय मा बाहायो: बेड नङा टेबल?",
          answers: ["बेड"],
        },
        {
          text:
            "मोनसे हाथआव सोरबा आंगुलि दं?",
          answers: ["5", "पांच"],
        },
        {
          text:
            "बे सोदोबखौ गोसोआव लाखि: आम।",
          answers: ["आम"],
        },
        {
          text:
            "आं नोंखौ मा सोदोब गोसोआव लाखिनो बुंदों?",
          answers: ["आम"],
        },
      ],

      kha: [
        {
          text: "Kae ka kyrteng jong phi?",
          answers: [patientName],
        },
        {
          text:
            "Kae ka kyrteng jong ka khun kynthei jong phi?",
          answers: [daughterName],
        },
        {
          text:
            "Kae ka kyrteng jong u khun shynrang jong phi?",
          answers: [sonName],
        },
        {
          text: "Phi don hangno mynta?",
          answers: [
            location,
            "home",
            "ka iing",
          ],
        },
        {
          text:
            "Phi lah ban bam aiu: apple ne ka chair?",
          answers: ["apple"],
        },
        {
          text:
            "Na ka bynta thiah, ngi pyndonkam aiu: bed ne table?",
          answers: ["bed"],
        },
        {
          text:
            "Katno tylli ki shyieng kti ha kawei ka kti?",
          answers: ["5", "san"],
        },
        {
          text:
            "Pynkynmaw ia kane ka ktien: mango.",
          answers: ["mango"],
        },
        {
          text:
            "Kae ka ktien nga la ong ba phi dei ban kynmaw?",
          answers: ["mango"],
        },
      ],

      lus: [
        {
          text: "I hming chu eng nge?",
          answers: [patientName],
        },
        {
          text:
            "I fanu daughter hming chu eng nge?",
          answers: [daughterName],
        },
        {
          text:
            "I fanu/son hming chu eng nge?",
          answers: [sonName],
        },
        {
          text:
            "Tunah khawi ah nge i awm?",
          answers: [
            location,
            "home",
            "in",
          ],
        },
        {
          text:
            "Apple emaw chair emaw, eng nge i ei theih?",
          answers: ["apple"],
        },
        {
          text:
            "I mu turin eng nge kan hmang: bed emaw table emaw?",
          answers: ["bed"],
        },
        {
          text:
            "Kut khatah finger engzat nge awm?",
          answers: ["5", "panga"],
        },
        {
          text:
            "He thumal hi hre reng rawh: mango.",
          answers: ["mango"],
        },
        {
          text:
            "Eng thumal nge ka hre reng turin ka sawi?",
          answers: ["mango"],
        },
      ],
    };

    return questionSets[language] || questionSets.en;
  }, [
    language,
    patientName,
    daughterName,
    sonName,
    location,
  ]);

  const question = questions[currentQuestion];
  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch (error) {
      // Already stopped
    }

    setIsListening(false);
  };

const speakQuestion = () => {
  if (!question?.text) return;

  if (!("speechSynthesis" in window)) {
    setMicrophoneError(
      "Speech is not supported in this browser."
    );
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(
    question.text
  );

  utterance.lang =
    SPEECH_LANGUAGES[language] || "en-IN";

  utterance.rate = 0.82;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices =
    window.speechSynthesis.getVoices();

  // 1. Try exact language
  let selectedVoice = voices.find(
    (voice) =>
      voice.lang.toLowerCase() ===
      utterance.lang.toLowerCase()
  );

  // 2. Try same language family
  if (!selectedVoice) {
    const languagePrefix =
      utterance.lang.split("-")[0].toLowerCase();

    selectedVoice = voices.find(
      (voice) =>
        voice.lang
          .toLowerCase()
          .startsWith(languagePrefix)
    );
  }

  // 3. Use the matching voice if available
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.onstart = () => {
    console.log(
      "Speaking:",
      question.text,
      "Language:",
      utterance.lang,
      "Voice:",
      selectedVoice?.name || "Browser default"
    );
  };

  utterance.onerror = (event) => {
    console.error(
      "Speech synthesis error:",
      event
    );
  };

  window.speechSynthesis.speak(utterance);
};

  const startListening = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "Speech recognition is not supported in this browser. Please use Google Chrome."
    );
    return;
  }

  const recognition = new SpeechRecognition();

  // IMPORTANT:
  // Browser SpeechRecognition needs BCP-47 language codes,
  // NOT "English", "Hindi", etc.
  const languageMap = {
    en: "en-IN",
    hi: "hi-IN",
    as: "as-IN",
    bn: "bn-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    ta: "ta-IN",
    te: "te-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    pa: "pa-IN",
  };

  const selectedLanguage =
    languageMap[language] ||
    languageMap[language?.split("-")[0]] ||
    "en-IN";

  recognition.lang = selectedLanguage;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  recognition.onstart = () => {
    console.log("🎤 Speech recognition started");
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();

    console.log("🎤 User said:", transcript);

    setSpokenAnswer(transcript);
    setMicrophoneError("");
    setIsListening(false);
  };

  recognition.onerror = (event) => {
    console.error(
      "Speech recognition error:",
      event.error,
      event.message || ""
    );

    setIsListening(false);

    if (event.error === "not-allowed") {
      alert(
        "Microphone permission was denied. Please allow microphone access for this website."
      );
    } else if (event.error === "no-speech") {
      console.log("No speech detected.");
    } else if (event.error === "network") {
      alert(
        "Speech recognition could not connect to the browser speech service. Please check your internet connection and try again in Google Chrome."
      );
    } else if (event.error === "audio-capture") {
      alert(
        "No microphone was detected. Please check your microphone settings."
      );
    }
  };

  recognition.onend = () => {
    console.log("🎤 Speech recognition ended");
    setIsListening(false);
  };

  try {
    recognition.start();
  } catch (error) {
    console.error("Could not start speech recognition:", error);
    setIsListening(false);
  }
};

  const checkAnswer = () => {
    if (!spokenAnswer.trim()) {
      setFeedback(t.noSpeech);
      setFeedbackType("warning");
      return;
    }

    const correct = answerMatches(
      spokenAnswer,
      question.answers
    );

    if (correct) {
      setScore(
        (previousScore) => previousScore + 1
      );

      setFeedback(t.correct);
      setFeedbackType("correct");
    } else {
      setFeedback(t.tryAgain);
      setFeedbackType("wrong");
    }
  };

  const finishQuiz = () => {
    stopListening();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setFinished(true);
  };

  const goToNextQuestion = () => {
    stopListening();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpokenAnswer("");
    setFeedback("");
    setFeedbackType("");
    setMicrophoneError("");

    if (currentQuestion + 1 >= questions.length) {
      finishQuiz();
      return;
    }

    setCurrentQuestion(
      (previousQuestion) =>
        previousQuestion + 1
    );
  };

  const skipQuestion = () => {
    stopListening();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setFeedback(t.skipped);
    setFeedbackType("skipped");

    setTimeout(() => {
      setSpokenAnswer("");
      setFeedback("");
      setFeedbackType("");

      if (currentQuestion + 1 >= questions.length) {
        finishQuiz();
      } else {
        setCurrentQuestion(
          (previousQuestion) =>
            previousQuestion + 1
        );
      }
    }, 700);
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;

    stopListening();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setLanguage(newLanguage);
    setSpokenAnswer("");
    setFeedback("");
    setFeedbackType("");
    setMicrophoneError("");
  };

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch (error) {
        // Ignore
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!finished) {
      return;
    }

    const today = new Date().toDateString();

    const result = {
      score,
      totalQuestions: questions.length,
      percentage: Math.round(
        (score / questions.length) * 100
      ),
      language,
      patientId: PATIENT?.id || null,
      patientName: PATIENT?.name || "",
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "smritiSaarthiMemoryResult",
      JSON.stringify(result)
    );

    localStorage.setItem(
      "smritiSaarthiMemoryQuizDate",
      today
    );
  }, [
    finished,
    score,
    questions.length,
    language,
  ]);
  if (finished) {
    return (
      <div className="memory-quiz-overlay">
        <div className="memory-quiz-card memory-quiz-complete">
          <div className="memory-quiz-brand">
            <span className="brand-dot"></span>
            SMRITI SAARTHI
          </div>

          <h1>{t.completed}</h1>

          <div className="memory-score-circle">
            <strong>
              {score}/{questions.length}
            </strong>

            <span>
              {Math.round(
                (score / questions.length) * 100
              )}
              %
            </span>
          </div>

          <h2>{t.score}</h2>

          <p className="memory-monitoring-text">
            {t.monitoring}
          </p>

          <button
            className="memory-continue-button"
            onClick={() => {
              if (onComplete) {
                onComplete({
                  score,
                  totalQuestions: questions.length,
                  percentage: Math.round(
                    (score / questions.length) * 100
                  ),
                  language,
                  patientId: PATIENT?.id || null,
                  patientName: PATIENT?.name || "",
                  completedAt: new Date().toISOString(),
                });
              }
            }}
          >
            {t.continue}
          </button>
        </div>
      </div>
    );
  }

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="memory-quiz-overlay">
      <div className="memory-quiz-card">

        {/* HEADER */}
        <div className="memory-quiz-header">
          <div>
            <div className="memory-quiz-brand">
              <span className="brand-dot"></span>
              SMRITI SAARTHI
            </div>

            <h1>{t.title}</h1>
          </div>

          <div className="memory-question-count">
            {currentQuestion + 1}/{questions.length}
          </div>
        </div>

        {/* LANGUAGE */}
        <div className="memory-language-section">
          <label htmlFor="memory-language">
            {t.chooseLanguage}
          </label>

          <select
            id="memory-language"
            value={language}
            onChange={handleLanguageChange}
          >
            {Object.entries(LANGUAGE_NAMES).map(
              ([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              )
            )}
          </select>
        </div>

        {/* PROGRESS */}
        <div className="memory-progress-track">
          <div
            className="memory-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>

        {/* QUESTION */}
        <div className="memory-question-area">
          <div className="memory-question-label">
            {t.question} {currentQuestion + 1}
          </div>

          <h2>{question.text}</h2>

          <button
            className="hear-question-button"
            onClick={speakQuestion}
            type="button"
          >
            🔊 {t.hearQuestion}
          </button>
        </div>

        {/* SPEAK */}
        <div className="memory-speaking-area">
          <button
            type="button"
            className={`memory-mic-button ${
              isListening ? "listening" : ""
            }`}
            onClick={startListening}
            disabled={isListening}
            aria-label={t.tapSpeak}
          >
            🎤
          </button>

          <h3>
            {isListening
              ? t.listening
              : t.tapSpeak}
          </h3>

          <p>{t.speakNaturally}</p>
        </div>

        {/* RECOGNIZED ANSWER */}
        {spokenAnswer && (
          <div className="recognized-answer">
            <span>{t.recognized}</span>

            <strong>{spokenAnswer}</strong>
          </div>
        )}

        {/* MICROPHONE ERROR */}
        {microphoneError && (
          <div className="memory-error">
            {microphoneError}
          </div>
        )}

        {/* FEEDBACK */}
        {feedback && (
          <div
            className={`memory-feedback ${feedbackType}`}
          >
            {feedback}
          </div>
        )}

        {/* BUTTONS */}
        <div className="memory-action-row">

          {feedbackType === "correct" ? (
            <button
              type="button"
              className="memory-check-button"
              onClick={goToNextQuestion}
            >
              {currentQuestion + 1 >= questions.length
                ? t.continue
                : "→"}
            </button>
          ) : (
            <button
              type="button"
              className="memory-check-button"
              onClick={checkAnswer}
              disabled={!spokenAnswer.trim()}
            >
              {t.checkAnswer}
            </button>
          )}

          <button
            type="button"
            className="memory-dont-know-button"
            onClick={skipQuestion}
          >
            {t.dontKnow}
          </button>
        </div>

        {/* DISCLAIMER */}
        <p className="memory-disclaimer">
          {t.monitoring}
        </p>
      </div>
    </div>
  );
}

export default MemoryQuiz;