import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useI18n } from "../I18nContext";
import { detectAndResolveLang } from "../lib/regionLanguage";

const LanguageContext = createContext();

export const translations = {
  en: {
    // Sidebar
    home: "Home",
    brainGames: "Brain Games",
    talkToSmriti: "Talk to Care Agent",
    dailyRoutine: "Daily Routine",
    medicineHealth: "Medicine & Health",
    memoryProgress: "Memory Progress",
    careCircle: "My Care Circle",
    safetyLocation: "Safety & Location",
    memoryBook: "Memory Book",
    language: "Language",
    helpSupport: "Help & Support",
    settings: "Settings",

    // Topbar
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    welcomeMessage: "Let's make your day meaningful.",
    offline: "You are Offline",
    offlineMessage: "Data will sync when internet is available.",
    alerts: "Alerts",

    // Voice Companion
    voiceCompanion: "Smriti – Your Voice Companion",
    voiceDescription: "I can talk, listen and help you with your day.",
    speakLanguage: "Speak in your language.",
    tapToSpeak: "Tap to Speak",
    typeMessage: "Type a message",
    speakIn: "I speak in:",
    supportsLanguages:
      "Smriti supports Assamese, Khasi, Mizo, Manipuri, Bodo and 10+ regional languages.",

    // Daily Routine
    todaysRoutine: "Today's Routine",
    tellWhatsNext: "Tell me what's next",
    morningMedicine: "Morning Medicine",
    drinkWater: "Drink Water",
    lunchTime: "Lunch Time",
    brainActivity: "Brain Activity",
    eveningWalk: "Evening Walk",
    nightMedicine: "Night Medicine",
    completed: "Completed",
    pending: "Pending",
    viewFullRoutine: "View Full Routine",

    // Brain Activity
    todaysBrainActivity: "Today's Brain Activity",
    simpleActivities: "Simple activities for a healthy mind",
    recommendedToday: "Recommended for today",
    pictureMatch: "Picture Match",
    findPair: "Find the Pair",
    patternGame: "Pattern Game",
    memoryGame: "Memory game",
    attentionGame: "Attention game",
    thinkingGame: "Thinking game",
    easy: "Easy",
    minutes: "5 min",
    start: "Start",

    // Progress
    weeklyProgress: "This Week's Progress",
    activitiesCompleted: "Activities Completed",
    averageEngagement: "Average Engagement",
    memoryScore: "Memory Score",
    attentionLevel: "Attention Level",
    stable: "Stable",
    good: "Good",
    smritiInsight: "Smriti Insight",
    insightMessage:
      "You are doing great! Your memory game performance is stable this week. Keep staying active and happy!",
    insightHasPlay: "A game is logged today.",
    insightNoPlay: "No game logged yet today. A short past story is enough.",
    viewDetailedProgress: "View Detailed Progress",
    playsThisWeek: "Plays this week",
    accuracyLabel: "Accuracy",
    streakLabel: "Streak",

    // Safety
    safetyStatus: "Safety Status",
    safeZone: "Safe Zone",
    homeZone: "Home",
    lastCheckIn: "Last Check-in",
    minutesAgo: "20 min ago",
    allGood: "All Good",
    waitingCheckIn: "Waiting for a check-in",
    justNow: "Just now",
    notYetToday: "Not yet today",
    openSafety: "Open Safety",

    // Care Circle
    myCareCircle: "My Care Circle",
    available: "Available",
    lastSeen: "Last seen",
    visitTomorrow: "Visit tomorrow",
    daughter: "Daughter",
    son: "Son",
    communityHealthWorker: "Community Health Worker",
    viewAllMembers: "View All Members",

    // Memory Book
    myMemoryBook: "My Memory Book",
    myFamily: "My Family",
    specialMoments: "Special Moments",
    homeVillage: "My Home & Village",
    favoriteSounds: "Favorite Sounds",
    memories: "memories",
    sounds: "sounds",
    openMemoryBook: "Open Memory Book",

    // Bottom Status
    offlineMode: "Offline Mode",
    offlineAvailable: "All core features are available",
    lastSync: "Last Sync",
    needHelp: "Need Help?",
    talkToSmritiOrCaregiver: "Talk to Smriti or call your caregiver.",
    caregiversHealthWorkers: "For Caregivers & Health Workers",
    caregiverDescription: "Track, support and stay updated on your loved one's well-being.",
    openCaregiverView: "Open Caregiver View",

    // Emergency
    emergencyHelp: "Emergency Help",
    tapToCall: "Tap to call for help",
    helpline: "Helpline",
    worksOffline: "Works offline",

    // General
    dashboard: "Dashboard",
    close: "Close",
    more: "More",
    connection: "Connection",
    online: "Online",
    dataLabel: "Data",
    savedSecurely: "Saved securely",
    readyToListen: "Ready to listen",
    emergencyAvailable: "Emergency Help Available",
  },

  hi: {
    home: "होम",
    brainGames: "दिमाग के खेल",
    talkToSmriti: "स्मृति से बात करें",
    dailyRoutine: "रोज़ का काम",
    medicineHealth: "दवाई और सेहत",
    memoryProgress: "स्मृति की प्रगति",
    careCircle: "मेरा देखभाल चक्र",
    safetyLocation: "सुरक्षा और जगह",
    memoryBook: "स्मृति की किताब",
    language: "भाषा",
    helpSupport: "मदद",
    settings: "सेटिंग्स",

    goodMorning: "सुप्रभात",
    goodAfternoon: "नमस्कार",
    goodEvening: "शुभ संध्या",
    welcomeMessage: "आज का दिन सरल और शांत रखें।",
    offline: "आप ऑफलाइन हैं",
    offlineMessage: "नेट आने पर जानकारी जुड़ जाएगी।",
    alerts: "सूचनाएँ",

    voiceCompanion: "स्मृति — आपकी आवाज़ साथी",
    voiceDescription: "मैं बात कर सकती हूँ, सुन सकती हूँ, और रोज़ के काम में मदद कर सकती हूँ।",
    speakLanguage: "अपनी भाषा में बात करें।",
    tapToSpeak: "बोलने के लिए दबाएँ",
    typeMessage: "संदेश लिखें",
    speakIn: "मैं बोलती हूँ:",
    supportsLanguages:
      "स्मृति असमिया, खासी, मिज़ो, मणिपुरी, बोडो और 10+ भाषाएँ समझती है।",

    todaysRoutine: "आज का काम",
    tellWhatsNext: "आगे क्या है बताएँ",
    morningMedicine: "सुबह की दवाई",
    drinkWater: "पानी पिएँ",
    lunchTime: "दोपहर का खाना",
    brainActivity: "दिमाग का काम",
    eveningWalk: "शाम की सैर",
    nightMedicine: "रात की दवाई",
    completed: "हो गया",
    pending: "बाकी",
    viewFullRoutine: "पूरी दिनचर्या देखें",

    todaysBrainActivity: "आज दिमाग का काम",
    simpleActivities: "शांत मन के लिए आसान काम",
    recommendedToday: "आज के लिए",
    pictureMatch: "तस्वीर मिलाएँ",
    findPair: "जोड़ी खोजें",
    patternGame: "पैटर्न खेल",
    memoryGame: "याद का खेल",
    attentionGame: "ध्यान का खेल",
    thinkingGame: "सोच का खेल",
    easy: "आसान",
    minutes: "5 मिनट",
    start: "शुरू करें",

    weeklyProgress: "इस हफ्ते की प्रगति",
    activitiesCompleted: "काम पूरे",
    averageEngagement: "औसत जुड़ाव",
    memoryScore: "Memory score",
    attentionLevel: "ध्यान",
    stable: "स्थिर",
    good: "अच्छा",
    smritiInsight: "स्मृति की बात",
    insightMessage: "आप अच्छा कर रहे हैं। इस हफ्ते याद का खेल स्थिर रहा।",
    viewDetailedProgress: "पूरी प्रगति देखें",

    safetyStatus: "सुरक्षा",
    safeZone: "सुरक्षित जगह",
    homeZone: "घर",
    lastCheckIn: "आखिरी चेक-इन",
    minutesAgo: "20 मिनट पहले",
    allGood: "सब ठीक",

    myCareCircle: "मेरा चक्र",
    available: "उपलब्ध",
    lastSeen: "आखिरी बार",
    visitTomorrow: "कल मिलेंगे",
    daughter: "बेटी",
    son: "बेटा",
    communityHealthWorker: "ASHA",
    viewAllMembers: "सभी सदस्य",

    myMemoryBook: "मेरी स्मृति की किताब",
    myFamily: "मेरा परिवार",
    specialMoments: "खास पल",
    homeVillage: "मेरा घर और गाँव",
    favoriteSounds: "पसंदीदा आवाज़ें",
    memories: "यादें",
    sounds: "आवाज़ें",
    openMemoryBook: "किताब खोलें",

    offlineMode: "ऑफलाइन मोड",
    offlineAvailable: "मुख्य सुविधाएँ काम करेंगी",
    lastSync: "आखिरी सिंक",
    needHelp: "मदद चाहिए?",
    talkToSmritiOrCaregiver: "स्मृति से बात करें या परिवार को कॉल करें।",
    caregiversHealthWorkers: "परिवार और स्वास्थ्य कर्मी",
    caregiverDescription: "अपने अपने की देखभाल देखें और साथ रहें।",
    openCaregiverView: "देखभाल वाला दृश्य खोलें",

    emergencyHelp: "आपातकालीन मदद",
    tapToCall: "मदद के लिए कॉल करें",
    helpline: "Helpline",
    worksOffline: "ऑफलाइन भी चलता है",

    dashboard: "डैशबोर्ड",
    close: "बंद करें",
    more: "और",
  },

  as: {
    home: "হোম",
    brainGames: "মগজৰ খেল",
    talkToSmriti: "স্মৃতিৰ সৈতে কথা পাতক",
    dailyRoutine: "দৈনিক ৰুটিন",
    medicineHealth: "ঔষধ আৰু স্বাস্থ্য",
    memoryProgress: "স্মৃতিৰ অগ্ৰগতি",
    careCircle: "মোৰ যত্ন চক্র",
    safetyLocation: "সুৰক্ষা আৰু অৱস্থান",
    memoryBook: "স্মৃতিৰ কিতাপ",
    language: "ভাষা",
    helpSupport: "সহায় আৰু সমৰ্থন",
    settings: "ছেটিংছ",

    goodMorning: "সুপ্ৰভাত",
    goodAfternoon: "শুভ দুপৰীয়া",
    goodEvening: "শুভ সন্ধ্যা",
    welcomeMessage: "আপোনাৰ দিনটো অৰ্থপূৰ্ণ কৰি তোলোঁ।",
    offline: "আপুনি অফলাইনত আছে",
    offlineMessage: "ইণ্টাৰনেট উপলব্ধ হ'লে তথ্য ছিংক হ'ব।",
    alerts: "সতৰ্কবাণী",

    voiceCompanion: "স্মৃতি – আপোনাৰ কণ্ঠ সংগী",
    voiceDescription: "মই কথা পাতিব, শুনিব আৰু আপোনাৰ দৈনন্দিন কামত সহায় কৰিব পাৰোঁ।",
    speakLanguage: "আপোনাৰ ভাষাত কথা পাতক।",
    tapToSpeak: "কথা ক'বলৈ টিপক",
    typeMessage: "এটা বাৰ্তা লিখক",
    speakIn: "মই কওঁ:",
    supportsLanguages:
      "স্মৃতিয়ে অসমীয়া, খাছি, মিজো, মণিপুৰী, বড়ো আৰু ১০+ আঞ্চলিক ভাষা সমৰ্থন কৰে।",

    todaysRoutine: "আজিৰ ৰুটিন",
    tellWhatsNext: "পিছত কি আছে কওক",
    morningMedicine: "ৰাতিপুৱাৰ ঔষধ",
    drinkWater: "পানী খাওক",
    lunchTime: "দুপৰীয়াৰ আহাৰ",
    brainActivity: "মগজৰ কাৰ্যকলাপ",
    eveningWalk: "সন্ধিয়াৰ খোজ",
    nightMedicine: "ৰাতিৰ ঔষধ",
    completed: "সম্পূৰ্ণ",
    pending: "বাকি",
    viewFullRoutine: "সম্পূৰ্ণ ৰুটিন চাওক",

    todaysBrainActivity: "আজিৰ মগজৰ কাৰ্যকলাপ",
    simpleActivities: "সুস্থ মনৰ বাবে সহজ কাৰ্যকলাপ",
    recommendedToday: "আজিৰ বাবে পৰামৰ্শ",
    pictureMatch: "ছবি মিলাওক",
    findPair: "যোৰ বিচাৰক",
    patternGame: "নক্সাৰ খেল",
    memoryGame: "স্মৃতিৰ খেল",
    attentionGame: "মনোযোগৰ খেল",
    thinkingGame: "চিন্তাৰ খেল",
    easy: "সহজ",
    minutes: "৫ মিনিট",
    start: "আৰম্ভ কৰক",

    weeklyProgress: "এই সপ্তাহৰ অগ্ৰগতি",
    activitiesCompleted: "সম্পূৰ্ণ কাৰ্যকলাপ",
    averageEngagement: "গড় অংশগ্ৰহণ",
    memoryScore: "স্মৃতিৰ স্ক'ৰ",
    attentionLevel: "মনোযোগৰ স্তৰ",
    stable: "স্থিৰ",
    good: "ভাল",
    smritiInsight: "স্মৃতিৰ পৰামৰ্শ",
    insightMessage: "আপুনি ভাল কৰি আছে! এই সপ্তাহত আপোনাৰ স্মৃতিৰ খেলৰ প্ৰদৰ্শন স্থিৰ আছে।",
    viewDetailedProgress: "বিস্তৃত অগ্ৰগতি চাওক",

    safetyStatus: "সুৰক্ষাৰ অৱস্থা",
    safeZone: "সুৰক্ষিত স্থান",
    homeZone: "ঘৰ",
    lastCheckIn: "শেষ চেক-ইন",
    minutesAgo: "২০ মিনিট আগতে",
    allGood: "সকলো ভাল",

    myCareCircle: "মোৰ যত্ন চক্র",
    available: "উপলব্ধ",
    lastSeen: "শেষ দেখা",
    visitTomorrow: "কাইলৈ দেখা কৰিব",
    daughter: "জীয়েক",
    son: "পুত্ৰ",
    communityHealthWorker: "সামূহিক স্বাস্থ্য কৰ্মী",
    viewAllMembers: "সকলো সদস্য চাওক",

    myMemoryBook: "মোৰ স্মৃতিৰ কিতাপ",
    myFamily: "মোৰ পৰিয়াল",
    specialMoments: "বিশেষ মুহূৰ্ত",
    homeVillage: "মোৰ ঘৰ আৰু গাঁও",
    favoriteSounds: "প্ৰিয় শব্দ",
    memories: "স্মৃতি",
    sounds: "শব্দ",
    openMemoryBook: "স্মৃতিৰ কিতাপ খোলক",

    offlineMode: "অফলাইন মোড",
    offlineAvailable: "সকলো মূল সুবিধা উপলব্ধ",
    lastSync: "শেষ ছিংক",
    needHelp: "সহায় লাগে?",
    talkToSmritiOrCaregiver: "স্মৃতিৰ সৈতে কথা পাতক বা আপোনাৰ যত্নদাতাক ফোন কৰক।",
    caregiversHealthWorkers: "যত্নদাতা আৰু স্বাস্থ্য কৰ্মীৰ বাবে",
    caregiverDescription: "আপোনাৰ আপোনজনৰ অৱস্থা অনুসৰণ আৰু সহায় কৰক।",
    openCaregiverView: "যত্নদাতা ভিউ খোলক",

    emergencyHelp: "জৰুৰী সহায়",
    tapToCall: "সহায়ৰ বাবে ফোন কৰিবলৈ টিপক",
    helpline: "হেল্পলাইন",
    worksOffline: "অফলাইনত কাম কৰে",

    dashboard: "ডেশ্বব'ৰ্ড",
    close: "বন্ধ কৰক",
    more: "আৰু",
  },

  // Placeholder translations - replace later with verified native translations
  kh: {
    home: "Home",
    brainGames: "Brain Games",
    talkToSmriti: "Talk to Care Agent",
    dailyRoutine: "Daily Routine",
    medicineHealth: "Medicine & Health",
    memoryProgress: "Memory Progress",
    careCircle: "My Care Circle",
    safetyLocation: "Safety & Location",
    memoryBook: "Memory Book",
    language: "Language",
    helpSupport: "Help & Support",
    settings: "Settings",

    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    welcomeMessage: "Let's make your day meaningful.",
    offline: "You are Offline",
    offlineMessage: "Data will sync when internet is available.",
    alerts: "Alerts",

    voiceCompanion: "Smriti – Your Voice Companion",
    voiceDescription: "I can talk, listen and help you with your day.",
    speakLanguage: "Speak in your language.",
    tapToSpeak: "Tap to Speak",
    typeMessage: "Type a message",
    speakIn: "I speak in:",
    supportsLanguages:
      "Smriti supports Assamese, Khasi, Mizo, Manipuri, Bodo and 10+ regional languages.",

    todaysRoutine: "Today's Routine",
    tellWhatsNext: "Tell me what's next",
    morningMedicine: "Morning Medicine",
    drinkWater: "Drink Water",
    lunchTime: "Lunch Time",
    brainActivity: "Brain Activity",
    eveningWalk: "Evening Walk",
    nightMedicine: "Night Medicine",
    completed: "Completed",
    pending: "Pending",
    viewFullRoutine: "View Full Routine",

    todaysBrainActivity: "Today's Brain Activity",
    simpleActivities: "Simple activities for a healthy mind",
    recommendedToday: "Recommended for today",
    pictureMatch: "Picture Match",
    findPair: "Find the Pair",
    patternGame: "Pattern Game",
    memoryGame: "Memory game",
    attentionGame: "Attention game",
    thinkingGame: "Thinking game",
    easy: "Easy",
    minutes: "5 min",
    start: "Start",

    weeklyProgress: "This Week's Progress",
    activitiesCompleted: "Activities Completed",
    averageEngagement: "Average Engagement",
    memoryScore: "Memory Score",
    attentionLevel: "Attention Level",
    stable: "Stable",
    good: "Good",
    smritiInsight: "Smriti Insight",
    insightMessage:
      "You are doing great! Your memory game performance is stable this week.",
    viewDetailedProgress: "View Detailed Progress",

    safetyStatus: "Safety Status",
    safeZone: "Safe Zone",
    homeZone: "Home",
    lastCheckIn: "Last Check-in",
    minutesAgo: "20 min ago",
    allGood: "All Good",

    myCareCircle: "My Care Circle",
    available: "Available",
    lastSeen: "Last seen",
    visitTomorrow: "Visit tomorrow",
    daughter: "Daughter",
    son: "Son",
    communityHealthWorker: "Community Health Worker",
    viewAllMembers: "View All Members",

    myMemoryBook: "My Memory Book",
    myFamily: "My Family",
    specialMoments: "Special Moments",
    homeVillage: "My Home & Village",
    favoriteSounds: "Favorite Sounds",
    memories: "memories",
    sounds: "sounds",
    openMemoryBook: "Open Memory Book",

    offlineMode: "Offline Mode",
    offlineAvailable: "All core features are available",
    lastSync: "Last Sync",
    needHelp: "Need Help?",
    talkToSmritiOrCaregiver: "Talk to Smriti or call your caregiver.",
    caregiversHealthWorkers: "For Caregivers & Health Workers",
    caregiverDescription: "Track and support your loved one's well-being.",
    openCaregiverView: "Open Caregiver View",

    emergencyHelp: "Emergency Help",
    tapToCall: "Tap to call for help",
    helpline: "Helpline",
    worksOffline: "Works offline",

    dashboard: "Dashboard",
    close: "Close",
    more: "More",
  },

  mz: {
    home: "Home",
    brainGames: "Brain Games",
    talkToSmriti: "Talk to Care Agent",
    dailyRoutine: "Daily Routine",
    medicineHealth: "Medicine & Health",
    memoryProgress: "Memory Progress",
    careCircle: "My Care Circle",
    safetyLocation: "Safety & Location",
    memoryBook: "Memory Book",
    language: "Language",
    helpSupport: "Help & Support",
    settings: "Settings",

    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    welcomeMessage: "Let's make your day meaningful.",
    offline: "You are Offline",
    offlineMessage: "Data will sync when internet is available.",
    alerts: "Alerts",

    voiceCompanion: "Smriti – Your Voice Companion",
    voiceDescription: "I can talk, listen and help you with your day.",
    speakLanguage: "Speak in your language.",
    tapToSpeak: "Tap to Speak",
    typeMessage: "Type a message",
    speakIn: "I speak in:",

    todaysRoutine: "Today's Routine",
    tellWhatsNext: "Tell me what's next",
    morningMedicine: "Morning Medicine",
    drinkWater: "Drink Water",
    lunchTime: "Lunch Time",
    brainActivity: "Brain Activity",
    eveningWalk: "Evening Walk",
    nightMedicine: "Night Medicine",
    completed: "Completed",
    pending: "Pending",
    viewFullRoutine: "View Full Routine",

    todaysBrainActivity: "Today's Brain Activity",
    simpleActivities: "Simple activities for a healthy mind",
    recommendedToday: "Recommended for today",
    pictureMatch: "Picture Match",
    findPair: "Find the Pair",
    patternGame: "Pattern Game",
    memoryGame: "Memory game",
    attentionGame: "Attention game",
    thinkingGame: "Thinking game",
    easy: "Easy",
    minutes: "5 min",
    start: "Start",

    weeklyProgress: "This Week's Progress",
    activitiesCompleted: "Activities Completed",
    averageEngagement: "Average Engagement",
    memoryScore: "Memory Score",
    attentionLevel: "Attention Level",
    stable: "Stable",
    good: "Good",
    smritiInsight: "Smriti Insight",
    insightMessage: "You are doing great!",
    viewDetailedProgress: "View Detailed Progress",

    safetyStatus: "Safety Status",
    safeZone: "Safe Zone",
    homeZone: "Home",
    lastCheckIn: "Last Check-in",
    minutesAgo: "20 min ago",
    allGood: "All Good",

    myCareCircle: "My Care Circle",
    available: "Available",
    lastSeen: "Last seen",
    visitTomorrow: "Visit tomorrow",
    daughter: "Daughter",
    son: "Son",
    communityHealthWorker: "Community Health Worker",
    viewAllMembers: "View All Members",

    myMemoryBook: "My Memory Book",
    myFamily: "My Family",
    specialMoments: "Special Moments",
    homeVillage: "My Home & Village",
    favoriteSounds: "Favorite Sounds",
    memories: "memories",
    sounds: "sounds",
    openMemoryBook: "Open Memory Book",

    offlineMode: "Offline Mode",
    offlineAvailable: "All core features are available",
    lastSync: "Last Sync",
    needHelp: "Need Help?",
    talkToSmritiOrCaregiver: "Talk to Smriti or call your caregiver.",
    caregiversHealthWorkers: "For Caregivers & Health Workers",
    caregiverDescription: "Track and support your loved one's well-being.",
    openCaregiverView: "Open Caregiver View",

    emergencyHelp: "Emergency Help",
    tapToCall: "Tap to call for help",
    helpline: "Helpline",
    worksOffline: "Works offline",

    dashboard: "Dashboard",
    close: "Close",
    more: "More",
  },

  mn: {
    home: "Home",
    brainGames: "Brain Games",
    talkToSmriti: "Talk to Care Agent",
    dailyRoutine: "Daily Routine",
    medicineHealth: "Medicine & Health",
    memoryProgress: "Memory Progress",
    careCircle: "My Care Circle",
    safetyLocation: "Safety & Location",
    memoryBook: "Memory Book",
    language: "Language",
    helpSupport: "Help & Support",
    settings: "Settings",

    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    welcomeMessage: "Let's make your day meaningful.",
    offline: "You are Offline",
    offlineMessage: "Data will sync when internet is available.",
    alerts: "Alerts",

    voiceCompanion: "Smriti – Your Voice Companion",
    voiceDescription: "I can talk, listen and help you with your day.",
    speakLanguage: "Speak in your language.",
    tapToSpeak: "Tap to Speak",
    typeMessage: "Type a message",
    speakIn: "I speak in:",

    todaysRoutine: "Today's Routine",
    tellWhatsNext: "Tell me what's next",
    morningMedicine: "Morning Medicine",
    drinkWater: "Drink Water",
    lunchTime: "Lunch Time",
    brainActivity: "Brain Activity",
    eveningWalk: "Evening Walk",
    nightMedicine: "Night Medicine",
    completed: "Completed",
    pending: "Pending",
    viewFullRoutine: "View Full Routine",

    todaysBrainActivity: "Today's Brain Activity",
    simpleActivities: "Simple activities for a healthy mind",
    recommendedToday: "Recommended for today",
    pictureMatch: "Picture Match",
    findPair: "Find the Pair",
    patternGame: "Pattern Game",
    memoryGame: "Memory game",
    attentionGame: "Attention game",
    thinkingGame: "Thinking game",
    easy: "Easy",
    minutes: "5 min",
    start: "Start",

    weeklyProgress: "This Week's Progress",
    activitiesCompleted: "Activities Completed",
    averageEngagement: "Average Engagement",
    memoryScore: "Memory Score",
    attentionLevel: "Attention Level",
    stable: "Stable",
    good: "Good",
    smritiInsight: "Smriti Insight",
    insightMessage: "You are doing great!",
    viewDetailedProgress: "View Detailed Progress",

    safetyStatus: "Safety Status",
    safeZone: "Safe Zone",
    homeZone: "Home",
    lastCheckIn: "Last Check-in",
    minutesAgo: "20 min ago",
    allGood: "All Good",

    myCareCircle: "My Care Circle",
    available: "Available",
    lastSeen: "Last seen",
    visitTomorrow: "Visit tomorrow",
    daughter: "Daughter",
    son: "Son",
    communityHealthWorker: "Community Health Worker",
    viewAllMembers: "View All Members",

    myMemoryBook: "My Memory Book",
    myFamily: "My Family",
    specialMoments: "Special Moments",
    homeVillage: "My Home & Village",
    favoriteSounds: "Favorite Sounds",
    memories: "memories",
    sounds: "sounds",
    openMemoryBook: "Open Memory Book",

    offlineMode: "Offline Mode",
    offlineAvailable: "All core features are available",
    lastSync: "Last Sync",
    needHelp: "Need Help?",
    talkToSmritiOrCaregiver: "Talk to Smriti or call your caregiver.",
    caregiversHealthWorkers: "For Caregivers & Health Workers",
    caregiverDescription: "Track and support your loved one's well-being.",
    openCaregiverView: "Open Caregiver View",

    emergencyHelp: "Emergency Help",
    tapToCall: "Tap to call for help",
    helpline: "Helpline",
    worksOffline: "Works offline",

    dashboard: "Dashboard",
    close: "Close",
    more: "More",
  },

  bd: {
    home: "Home",
    brainGames: "Brain Games",
    talkToSmriti: "Talk to Care Agent",
    dailyRoutine: "Daily Routine",
    medicineHealth: "Medicine & Health",
    memoryProgress: "Memory Progress",
    careCircle: "My Care Circle",
    safetyLocation: "Safety & Location",
    memoryBook: "Memory Book",
    language: "Language",
    helpSupport: "Help & Support",
    settings: "Settings",

    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    welcomeMessage: "Let's make your day meaningful.",
    offline: "You are Offline",
    offlineMessage: "Data will sync when internet is available.",
    alerts: "Alerts",

    voiceCompanion: "Smriti – Your Voice Companion",
    voiceDescription: "I can talk, listen and help you with your day.",
    speakLanguage: "Speak in your language.",
    tapToSpeak: "Tap to Speak",
    typeMessage: "Type a message",
    speakIn: "I speak in:",

    todaysRoutine: "Today's Routine",
    tellWhatsNext: "Tell me what's next",
    morningMedicine: "Morning Medicine",
    drinkWater: "Drink Water",
    lunchTime: "Lunch Time",
    brainActivity: "Brain Activity",
    eveningWalk: "Evening Walk",
    nightMedicine: "Night Medicine",
    completed: "Completed",
    pending: "Pending",
    viewFullRoutine: "View Full Routine",

    todaysBrainActivity: "Today's Brain Activity",
    simpleActivities: "Simple activities for a healthy mind",
    recommendedToday: "Recommended for today",
    pictureMatch: "Picture Match",
    findPair: "Find the Pair",
    patternGame: "Pattern Game",
    memoryGame: "Memory game",
    attentionGame: "Attention game",
    thinkingGame: "Thinking game",
    easy: "Easy",
    minutes: "5 min",
    start: "Start",

    weeklyProgress: "This Week's Progress",
    activitiesCompleted: "Activities Completed",
    averageEngagement: "Average Engagement",
    memoryScore: "Memory Score",
    attentionLevel: "Attention Level",
    stable: "Stable",
    good: "Good",
    smritiInsight: "Smriti Insight",
    insightMessage: "You are doing great!",
    viewDetailedProgress: "View Detailed Progress",

    safetyStatus: "Safety Status",
    safeZone: "Safe Zone",
    homeZone: "Home",
    lastCheckIn: "Last Check-in",
    minutesAgo: "20 min ago",
    allGood: "All Good",

    myCareCircle: "My Care Circle",
    available: "Available",
    lastSeen: "Last seen",
    visitTomorrow: "Visit tomorrow",
    daughter: "Daughter",
    son: "Son",
    communityHealthWorker: "Community Health Worker",
    viewAllMembers: "View All Members",

    myMemoryBook: "My Memory Book",
    myFamily: "My Family",
    specialMoments: "Special Moments",
    homeVillage: "My Home & Village",
    favoriteSounds: "Favorite Sounds",
    memories: "memories",
    sounds: "sounds",
    openMemoryBook: "Open Memory Book",

    offlineMode: "Offline Mode",
    offlineAvailable: "All core features are available",
    lastSync: "Last Sync",
    needHelp: "Need Help?",
    talkToSmritiOrCaregiver: "Talk to Smriti or call your caregiver.",
    caregiversHealthWorkers: "For Caregivers & Health Workers",
    caregiverDescription: "Track and support your loved one's well-being.",
    openCaregiverView: "Open Caregiver View",

    emergencyHelp: "Emergency Help",
    tapToCall: "Tap to call for help",
    helpline: "Helpline",
    worksOffline: "Works offline",

    dashboard: "Dashboard",
    close: "Close",
    more: "More",
  },
};

function dashboardLang(i18nCode) {
  const map = { kha: "kh", lus: "mz", mni: "mn", brx: "bd" };
  const code = map[i18nCode] || i18nCode;
  return translations[code] ? code : "en";
}

translations.ta = {
  ...translations.en,
  home: "முகப்பு",
  brainGames: "மூளை விளையாட்டு",
  talkToSmriti: "ஸ்மிருதியுடன் பேசு",
  dailyRoutine: "இன்றைய பணி",
  medicineHealth: "மருந்து மற்றும் உடல்நலம்",
  memoryProgress: "நினைவு முன்னேற்றம்",
  careCircle: "பராமரிப்பு வட்டம்",
  safetyLocation: "பாதுகாப்பு மற்றும் இடம்",
  memoryBook: "நினைவுப் புத்தகம்",
  language: "மொழி",
  helpSupport: "உதவி",
  settings: "அமைப்புகள்",
  voiceCompanion: "ஸ்மிருதி — உங்கள் குரல் துணை",
  voiceDescription: "நான் பேசவும் கேட்கவும் உங்கள் நாளுக்கு உதவவும் முடியும்.",
  speakLanguage: "உங்கள் மொழியில் பேசுங்கள்.",
  tapToSpeak: "பேச அழுத்தவும்",
  typeMessage: "செய்தி எழுதவும்",
  speakIn: "நான் பேசுவது:",
  todaysRoutine: "இன்றைய பணி",
  tellWhatsNext: "அடுத்து என்ன சொல்லுங்கள்",
  brainActivity: "மூளை பயிற்சி",
  recommendedToday: "இன்றைக்கு",
  start: "தொடங்கு",
  weeklyProgress: "இந்த வார முன்னேற்றம்",
  activitiesCompleted: "முடிந்த பணிகள்",
  smritiInsight: "பராமரிப்பு குறிப்பு",
  safetyStatus: "பாதுகாப்பு",
  myCareCircle: "என் வட்டம்",
  myMemoryBook: "என் நினைவுப் புத்தகம்",
  emergencyHelp: "அவசர உதவி",
  dashboard: "முகப்பு",
  close: "மூடு",
  more: "மேலும்",
  viewDetailedProgress: "விரிவான முன்னேற்றம்",
  viewFullRoutine: "முழு பணியைப் பார்",
  simpleActivities: "ஆரோக்கியமான மனதிற்கான எளிய பயிற்சி",
  pictureMatch: "படப் பொருத்தம்",
  findPair: "இணையைக் கண்டுபிடி",
  patternGame: "வடிவ விளையாட்டு",
  easy: "எளிது",
  activitiesCompleted: "முடிந்த பணிகள்",
  playsThisWeek: "இந்த வாரம் விளையாட்டு",
  accuracyLabel: "துல்லியம்",
  streakLabel: "தொடர்ச்சி",
  insightHasPlay: "இன்று ஒரு விளையாட்டு பதிவு.",
  insightNoPlay: "இன்று விளையாட்டு இல்லை. ஒரு சிறிய கதை போதும்.",
  lastCheckIn: "கடைசி செக்-இன்",
  allGood: "எல்லாம் நன்று",
  waitingCheckIn: "செக்-இன் காத்திருக்கிறது",
  justNow: "இப்போதுதான்",
  notYetToday: "இன்று இன்னும் இல்லை",
  openSafety: "பாதுகாப்பைத் திற",
  viewAllMembers: "அனைத்து உறுப்பினர்களும்",
  openMemoryBook: "நினைவுப் புத்தகத்தைத் திற",
  memories: "நினைவுகள்",
  connection: "இணைப்பு",
  online: "ஆன்லைன்",
  lastSync: "கடைசி ஒத்திசைவு",
  readyToListen: "கேட்கத் தயார்",
  emergencyAvailable: "அவசர உதவி உள்ளது",
};
translations.te = { ...translations.en, todaysRoutine: "ఈరోజు పని", brainActivity: "మెదడు వ్యాయామం", weeklyProgress: "ఈ వారం పురోగతి", start: "ప్రారంభం", tapToSpeak: "మాట్లాడేందుకు నొక్కండి", typeMessage: "సందేశం టైప్ చేయండి", voiceDescription: "నేను మాట్లాడగలను, వినగలను, మీ రోజుకు సహాయం చేయగలను.", speakLanguage: "మీ భాషలో మాట్లాడండి.", speakIn: "నేను మాట్లాడేది:", viewFullRoutine: "పూర్తి రొటీన్", viewDetailedProgress: "వివరమైన పురోగతి", simpleActivities: "ఆరోగ్యకరమైన మనసుకు సాధన", playsThisWeek: "ఈ వారం ఆటలు", lastCheckIn: "చివరి చెక్-ఇన్", allGood: "అంతా బాగుంది", openSafety: "భద్రత తెరువు", viewAllMembers: "అందరు సభ్యులు", openMemoryBook: "మెమరీ బుక్ తెరువు" };
translations.mr = { ...translations.en, todaysRoutine: "आजची दिनचर्या", brainActivity: "मेंदूचे काम", weeklyProgress: "या आठवड्याची प्रगती", start: "सुरू करा", tapToSpeak: "बोलण्यासाठी दाबा", typeMessage: "संदेश लिहा", voiceDescription: "मी बोलू शकते, ऐकू शकते आणि तुमच्या दिवसाला मदत करू शकते.", speakLanguage: "तुमच्या भाषेत बोला.", speakIn: "मी बोलते:", viewFullRoutine: "पूर्ण दिनचर्या", viewDetailedProgress: "संपूर्ण प्रगती", simpleActivities: "निरोगी मनासाठी सराव", playsThisWeek: "या आठवड्यातील खेळ", lastCheckIn: "शेवटचे चेक-इन", allGood: "सगळं ठीक", openSafety: "सुरक्षा उघडा", viewAllMembers: "सर्व सदस्य", openMemoryBook: "स्मृती पुस्तक उघडा" };
translations.gu = { ...translations.en, todaysRoutine: "આજની દિનચર્યા", brainActivity: "મગજની કસરત", weeklyProgress: "આ અઠવાડિયાની પ્રગતિ", start: "શરૂ કરો", tapToSpeak: "બોલવા દબાવો", typeMessage: "સંદેશ લખો", voiceDescription: "હું વાત કરી શકું, સાંભળી શકું અને તમારા દિવસમાં મદદ કરી શકું.", speakLanguage: "તમારી ભાષામાં વાત કરો.", speakIn: "હું બોલું છું:", viewFullRoutine: "સંપૂર્ણ દિનચર્યા", viewDetailedProgress: "વિગતવાર પ્રગતિ", simpleActivities: "સ્વસ્થ મન માટે અભ્યાસ", playsThisWeek: "આ અઠવાડિયાની રમતો", lastCheckIn: "છેલ્લું ચેક-ઇન", allGood: "બધું સારું", openSafety: "સલામતી ખોલો", viewAllMembers: "બધા સભ્યો", openMemoryBook: "મેમરી બુક ખોલો" };
translations.kn = { ...translations.en, todaysRoutine: "ಇಂದಿನ ಕೆಲಸ", brainActivity: "ಮೆದುಳಿನ ವ್ಯಾಯಾಮ", weeklyProgress: "ಈ ವಾರದ ಪ್ರಗತಿ", start: "ಪ್ರಾರಂಭಿಸಿ", tapToSpeak: "ಮಾತನಾಡಲು ಒತ್ತಿ", typeMessage: "ಸಂದೇಶ ಬರೆಯಿರಿ", voiceDescription: "ನಾನು ಮಾತನಾಡಬಲ್ಲೆ, ಕೇಳಬಲ್ಲೆ, ನಿಮ್ಮ ದಿನಕ್ಕೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.", speakLanguage: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ.", speakIn: "ನಾನು ಮಾತನಾಡುವುದು:", viewFullRoutine: "ಪೂರ್ಣ ದಿನಚರಿ", viewDetailedProgress: "ವಿವರ ಪ್ರಗತಿ", simpleActivities: "ಆರೋಗ್ಯಕರ ಮನಸ್ಸಿಗೆ ಅಭ್ಯಾಸ", playsThisWeek: "ಈ ವಾರದ ಆಟಗಳು", lastCheckIn: "ಕೊನೆಯ ಚೆಕ್-ಇನ್", allGood: "ಎಲ್ಲವೂ ಚೆನ್ನಾಗಿದೆ", openSafety: "ಸುರಕ್ಷತೆ ತೆರೆಯಿರಿ", viewAllMembers: "ಎಲ್ಲಾ ಸದಸ್ಯರು", openMemoryBook: "ಮೆಮೊರಿ ಬುಕ್ ತೆರೆಯಿರಿ" };
translations.ml = { ...translations.en, todaysRoutine: "ഇന്നത്തെ ജോലി", brainActivity: "മസ്തിഷ്ക വ്യായാമം", weeklyProgress: "ഈ ആഴ്ചയുടെ പുരോഗതി", start: "തുടങ്ങുക", tapToSpeak: "സംസാരിക്കാൻ അമർത്തുക", typeMessage: "സന്ദേശം ടൈപ്പ് ചെയ്യുക", voiceDescription: "എനിക്ക് സംസാരിക്കാനും കേൾക്കാനും നിങ്ങളുടെ ദിവസത്തിന് സഹായിക്കാനും കഴിയും.", speakLanguage: "നിങ്ങളുടെ ഭാഷയിൽ സംസാരിക്കുക.", speakIn: "ഞാൻ സംസാരിക്കുന്നത്:", viewFullRoutine: "മുഴുവൻ ദിനചര്യ", viewDetailedProgress: "വിശദമായ പുരോഗതി", simpleActivities: "ആരോഗ്യകരമായ മനസ്സിന് പരിശീലനം", playsThisWeek: "ഈ ആഴ്ചയിലെ കളികൾ", lastCheckIn: "അവസാന ചെക്ക്-ഇൻ", allGood: "എല്ലാം നന്നായി", openSafety: "സുരക്ഷ തുറക്കുക", viewAllMembers: "എല്ലാ അംഗങ്ങളും", openMemoryBook: "മെമ്മറി ബുക്ക് തുറക്കുക" };
translations.pa = { ...translations.en, todaysRoutine: "ਅੱਜ ਦਾ ਕੰਮ", brainActivity: "ਦਿਮਾਗ ਦਾ ਕੰਮ", weeklyProgress: "ਇਸ ਹਫ਼ਤੇ ਦੀ ਤਰੱਕੀ", start: "ਸ਼ੁਰੂ ਕਰੋ", tapToSpeak: "ਬੋਲਣ ਲਈ ਦਬਾਓ", typeMessage: "ਸੁਨੇਹਾ ਲਿਖੋ", voiceDescription: "ਮੈਂ ਗੱਲ ਕਰ ਸਕਦੀ ਹਾਂ, ਸੁਣ ਸਕਦੀ ਹਾਂ ਅਤੇ ਤੁਹਾਡੇ ਦਿਨ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੀ ਹਾਂ.", speakLanguage: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਗੱਲ ਕਰੋ.", speakIn: "ਮੈਂ ਬੋਲਦੀ ਹਾਂ:", viewFullRoutine: "ਪੂਰੀ ਰੁਟੀਨ", viewDetailedProgress: "ਵਿਸਤ੍ਰਿਤ ਤਰੱਕੀ", simpleActivities: "ਸਿਹਤਮੰਦ ਮਨ ਲਈ ਅਭਿਆਸ", playsThisWeek: "ਇਸ ਹਫ਼ਤੇ ਦੀਆਂ ਖੇਡਾਂ", lastCheckIn: "ਆਖਰੀ ਚੈਕ-ਇਨ", allGood: "ਸਭ ਠੀਕ", openSafety: "ਸੁਰੱਖਿਆ ਖੋਲ੍ਹੋ", viewAllMembers: "ਸਾਰੇ ਮੈਂਬਰ", openMemoryBook: "ਯਾਦ ਪੁਸਤਕ ਖੋਲ੍ਹੋ" };
translations.bn = {
  ...translations.en,
  todaysRoutine: "আজকের কাজ",
  brainActivity: "মস্তিষ্কের অনুশীলন",
  weeklyProgress: "এই সপ্তাহের অগ্রগতি",
  start: "শুরু",
  tapToSpeak: "কথা বলতে চাপুন",
  typeMessage: "বার্তা লিখুন",
  voiceDescription: "আমি কথা বলতে, শুনতে এবং আপনার দিনে সাহায্য করতে পারি।",
  speakLanguage: "আপনার ভাষায় কথা বলুন।",
  speakIn: "আমি বলি:",
  viewFullRoutine: "পুরো রুটিন",
  viewDetailedProgress: "বিস্তারিত অগ্রগতি",
  simpleActivities: "সুস্থ মনের জন্য অনুশীলন",
  playsThisWeek: "এই সপ্তাহের খেলা",
  lastCheckIn: "শেষ চেক-ইন",
  allGood: "সব ঠিক",
  openSafety: "নিরাপত্তা খুলুন",
  viewAllMembers: "সব সদস্য",
  openMemoryBook: "স্মৃতির খাতা খুলুন",
  smritiInsight: "যত্নের নোট",
};

export const REGION_LANGUAGE_MAP = {
  Assam: "as",
  "Arunachal Pradesh": "en",
  Manipur: "mni",
  Meghalaya: "kha",
  Mizoram: "lus",
  Nagaland: "en",
  Tripura: "bn",
  Sikkim: "en",
  "West Bengal": "bn",
  "Tamil Nadu": "ta",
  Telangana: "te",
  "Andhra Pradesh": "te",
  Maharashtra: "mr",
  Gujarat: "gu",
  Karnataka: "kn",
  Kerala: "ml",
  Punjab: "pa",
  Delhi: "hi",
  "New Delhi": "hi",
};

export const DEMO_REGIONS = [
  { value: "Assam", label: "Assam → Assamese" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh → English" },
  { value: "Manipur", label: "Manipur → Manipuri" },
  { value: "Meghalaya", label: "Meghalaya → Khasi" },
  { value: "Mizoram", label: "Mizoram → Mizo" },
  { value: "Nagaland", label: "Nagaland → English" },
  { value: "Tripura", label: "Tripura → Bengali" },
  { value: "West Bengal", label: "West Bengal → Bengali" },
  { value: "Tamil Nadu", label: "Tamil Nadu → Tamil" },
  { value: "Telangana", label: "Telangana → Telugu" },
  { value: "Maharashtra", label: "Maharashtra → Marathi" },
  { value: "Gujarat", label: "Gujarat → Gujarati" },
  { value: "Karnataka", label: "Karnataka → Kannada" },
  { value: "Kerala", label: "Kerala → Malayalam" },
  { value: "Punjab", label: "Punjab → Punjabi" },
  { value: "Delhi", label: "Delhi → Hindi" },
];

export const LanguageProvider = ({ children }) => {
  const { lang: i18nLang, setLang: setI18nLang } = useI18n();
  const [language, setLanguageState] = useState(() => dashboardLang(i18nLang));
  const [detectedRegion, setDetectedRegion] = useState(() => {
    try {
      return localStorage.getItem("smriti-place") || localStorage.getItem("smriti-region") || "";
    } catch {
      return "";
    }
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [isDemoLocation, setIsDemoLocation] = useState(() => {
    try {
      return localStorage.getItem("smriti-demo-location") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    setLanguageState(dashboardLang(i18nLang));
  }, [i18nLang]);

  const setLanguage = (newLanguage, manual = true) => {
    const dash = dashboardLang(newLanguage);
    setLanguageState(dash);
    const i18nMap = { kh: "kha", mz: "lus", mn: "mni", bd: "brx" };
    setI18nLang(i18nMap[dash] || dash);
    if (manual) {
      try {
        localStorage.setItem("smriti-lang-manual", "1");
        localStorage.setItem("smriti-auto-language", "false");
      } catch {
        /* ignore */
      }
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const setDemoRegion = (region) => {
    if (!region) {
      setIsDemoLocation(false);
      try {
        localStorage.setItem("smriti-demo-location", "false");
      } catch {
        /* ignore */
      }
      return;
    }
    const demoLanguage = REGION_LANGUAGE_MAP[region] || "en";
    setIsDemoLocation(true);
    setDetectedRegion(region);
    try {
      localStorage.setItem("smriti-demo-location", "true");
      localStorage.setItem("smriti-region", region);
    } catch {
      /* ignore */
    }
    setLanguage(demoLanguage, false);
  };

  const enableAutomaticLanguage = async () => {
    setIsDemoLocation(false);
    setLocationLoading(true);
    try {
      localStorage.setItem("smriti-demo-location", "false");
      localStorage.removeItem("smriti-lang-manual");
      localStorage.setItem("smriti-auto-language", "true");
    } catch {
      /* ignore */
    }
    const found = await detectAndResolveLang();
    setLocationLoading(false);
    if (found.region) setDetectedRegion(found.region);
    if (found.lang) setLanguage(found.lang, false);
    return found;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations,
        setDemoRegion,
        isDemoLocation,
        detectedRegion,
        enableAutomaticLanguage,
        locationLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
};