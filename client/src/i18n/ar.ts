export default {
  // Common
  common: {
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجاح",
    cancel: "إلغاء",
    confirm: "تأكيد",
    save: "حفظ",
    delete: "حذف",
    edit: "تعديل",
    close: "إغلاق",
    search: "بحث",
    noResults: "لم يتم العثور على نتائج",
    copiedToClipboard: "تم النسخ إلى الحافظة!",
    addedToFavorites: "تمت الإضافة إلى المفضلة!",
    removedFromFavorites: "تمت الإزالة من المفضلة",
  },

  // Navigation
  nav: {
    home: "الرئيسية",
    history: "السجل",
    favorites: "المفضلة",
    about: "حول",
    contact: "اتصل بنا",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    logout: "تسجيل الخروج",
    getStarted: "ابدأ الآن",
    getStartedFree: "ابدأ الآن — مجاناً",
  },

  // Theme
  theme: {
    switchToLight: "التبديل إلى الوضع الفاتح",
    switchToDark: "التبديل إلى الوضع الداكن",
  },

  // Home Page
  home: {
    // Mode tabs
    translate: "ترجمة",
    summarize: "تلخيص",

    // Input section
    inputPlaceholder: "أدخل أو الصق النص هنا...",
    characters: "حرف",
    characterLimit: "الحد الأقصى للأحرف",

    // Target language
    targetLanguage: "اللغة الهدف",
    selectLanguage: "اختر اللغة",
    searchLanguages: "البحث عن اللغات...",

    // Actions
    translateButton: "ترجمة",
    summarizeButton: "تلخيص",
    translating: "جاري الترجمة...",
    summarizing: "جاري التلخيص...",

    // Voice & File
    voiceInput: "إدخال صوتي",
    uploadFile: "رفع ملف",
    uploadFileHint: "PDF، DOCX، PNG، JPEG (الحد الأقصى 1 ميجابايت)",
    dragAndDrop: "اسحب وأفلت ملفاً هنا",
    extracting: "جاري استخراج النص...",

    // Speech modal
    speechLanguage: "لغة الكلام",
    startRecording: "بدء التسجيل",
    stopRecording: "إيقاف التسجيل",
    listening: "جاري الاستماع...",
    processing: "جاري المعالجة...",
    speakNow: "تحدث الآن...",

    // Result section
    result: "النتيجة",
    translation: "الترجمة",
    summary: "الملخص",
    noResult: "لا توجد نتيجة بعد",
    enterTextAndClick: "أدخل النص وانقر على",
    toGetStarted: "للبدء",

    // Result actions
    copy: "نسخ",
    listen: "استماع",
    stopListening: "إيقاف",
    export: "تصدير",
    exportAs: "تصدير كـ",
    addToFavorites: "إضافة إلى المفضلة",
    removeFromFavorites: "إزالة من المفضلة",

    // Guest banner
    guestTitle: "احفظ سجلك",
    guestDescription: "أنشئ حساباً مجانياً لحفظ ترجماتك وملخصاتك.",
    signUpNow: "سجل الآن",

    // Errors
    enterText: "الرجاء إدخال بعض النص",
    errorProcessing: "خطأ: تعذر معالجة النص. الرجاء المحاولة مرة أخرى.",
    fileTooLarge: "حجم الملف يتجاوز الحد المسموح (1 ميجابايت)",
    invalidFileType: "نوع ملف غير صالح. الرجاء رفع PDF أو DOCX أو PNG أو JPEG.",
    failedExtract: "فشل استخراج النص من الملف.",

    // Login required messages
    loginRequired: "يجب تسجيل الدخول",
    loginForSpeechToText:
      "الرجاء تسجيل الدخول لاستخدام ميزة تحويل الصوت إلى نص.",
    loginForTextToSpeech:
      "الرجاء تسجيل الدخول لاستخدام ميزة تحويل النص إلى صوت.",
    loginForFavorites: "الرجاء تسجيل الدخول لحفظ المفضلة.",
    loginForFileUpload: "الرجاء تسجيل الدخول لرفع الملفات.",
  },

  // History Page
  history: {
    title: "السجل",
    description: "اعرض وأدر سجل ترجماتك وملخصاتك",
    empty: "لا يوجد سجل بعد",
    emptyDescription: "ستظهر ترجماتك وملخصاتك هنا",
    startTranslating: "ابدأ الترجمة",
    clearAll: "مسح الكل",
    clearAllConfirm: "هل أنت متأكد أنك تريد مسح كل السجل؟",
    deleteConfirm: "هل أنت متأكد أنك تريد حذف هذا العنصر؟",
    original: "الأصلي",
    translatedTo: "مترجم إلى",
    summary: "ملخص",
    translation: "ترجمة",
    all: "كل السجل",
    summaries: "الملخصات",
    translations: "الترجمات",
    deleteSelected: "حذف المحدد",
    selectAll: "تحديد الكل",
    deselectAll: "إلغاء تحديد الكل",
    noHistory: "لا يوجد سجل",
    startCreating: "ابدأ بإنشاء",
    input: "الإدخال",
    result: "النتيجة",
    showMore: "عرض المزيد",
    showLess: "عرض أقل",
    useInTranslator: "استخدم في المترجم",
    copyResult: "نسخ النتيجة",
    saveToFavorites: "حفظ في المفضلة",
    removeFromFavorites: "إزالة من المفضلة",
    delete: "حذف",
    deleteItem: "حذف العنصر",
    deleteItems: "حذف العناصر",
    confirmDeleteItem:
      "هل أنت متأكد أنك تريد حذف هذا {type}؟ لا يمكن التراجع عن هذا الإجراء.",
    confirmDeleteItems:
      "هل أنت متأكد أنك تريد حذف {count} عنصر(عناصر)؟ لا يمكن التراجع عن هذا الإجراء.",
    previous: "السابق",
    next: "التالي",
    pageOf: "صفحة {current} من {total} ({items} عنصر)",
  },

  // Favorites Page
  favorites: {
    title: "المفضلة",
    description: "ترجماتك وملخصاتك المحفوظة للوصول السريع",
    empty: "لا توجد مفضلات بعد",
    emptyDescription: "ضع نجمة على ترجماتك وملخصاتك لحفظها هنا",
    browseTranslations: "تصفح الترجمات",
    translation: "ترجمة",
    summary: "ملخص",
    useAgain: "استخدم مرة أخرى",
    all: "جميع المفضلات",
    summaries: "الملخصات",
    translations: "الترجمات",
    removeSelected: "إزالة المحدد",
    selectAll: "تحديد الكل",
    deselectAll: "إلغاء تحديد الكل",
    favorite: "مفضل",
    favorites_count: "مفضلات",
    noSavedYet: "لم يتم حفظ {type} بعد",
    saveForQuickAccess: "احفظ {type} المفضلة للوصول السريع.",
    startTranslating: "ابدأ الترجمة",
    removeFavorite: "إزالة من المفضلة",
    removeFavorites: "إزالة المفضلات",
    confirmRemove: "هل أنت متأكد أنك تريد إزالة هذا {type} من المفضلة؟",
    confirmRemoveMultiple:
      "هل أنت متأكد أنك تريد إزالة {count} عنصر(عناصر) من المفضلة؟",
    remove: "إزالة",
    saved: "محفوظ",
    input: "الإدخال",
    result: "النتيجة",
    showMore: "عرض المزيد",
    showLess: "عرض أقل",
    useInTranslator: "استخدم في المترجم",
    copyResult: "نسخ النتيجة",
    removeFromFavorites: "إزالة من المفضلة",
  },

  // About Page
  about: {
    title: "حول 3ssila AI",
    subtitle:
      "حوّل محتواك فوراً باستخدام الترجمة والتلخيص المدعوم بالذكاء الاصطناعي",
    features: "المميزات",
    translateFeature: "ترجمة بالذكاء الاصطناعي",
    translateFeatureDesc: "ترجم النصوص بين أكثر من 30 لغة بدقة عالية",
    summarizeFeature: "تلخيص ذكي",
    summarizeFeatureDesc: "احصل على ملخصات موجزة للنصوص الطويلة فوراً",
    voiceFeature: "إدخال صوتي",
    voiceFeatureDesc: "تحدث للترجمة باستخدام التعرف على الصوت",
    exportFeature: "خيارات التصدير",
    exportFeatureDesc: "صدّر النتائج إلى PDF أو DOCX أو ملفات نصية",
    // Hero section
    aboutUs: "من نحن",
    heroTitle: "كسر حواجز اللغة مع",
    heroDescription:
      "3ssila AI هو رفيقك الذكي للترجمة والتلخيص الفوري للنصوص. مهمتنا جعل التواصل العالمي سهلاً للجميع.",
    // Mission section
    ourMission: "مهمتنا",
    missionText1:
      "في عالم اليوم المترابط، لا ينبغي أن تكون اللغة عائقاً أبداً. بنينا 3ssila AI لتمكين الأفراد والطلاب والمحترفين والشركات من التواصل بسلاسة عبر اللغات.",
    missionText2:
      "سواء كنت تترجم مستندات مهمة، أو تلخص مقالات طويلة، أو تحاول ببساطة فهم محتوى بلغة أخرى - نحن نوفر لك السرعة والدقة والبساطة.",
    missionQuote: "تمكين التواصل السلس عبر كل لغة.",
    // Stats
    translationsCompleted: "ترجمة مكتملة",
    languagesSupported: "لغة مدعومة",
    uptimeGuarantee: "ضمان التشغيل",
    averageResponseTime: "متوسط وقت الاستجابة",
    // Values section
    whatWeStandFor: "ما نؤمن به",
    valuesSubtitle: "قيمنا الأساسية توجه كل ميزة نبنيها وكل قرار نتخذه.",
    speedFirst: "السرعة أولاً",
    speedDesc: "نؤمن بأن وقتك ثمين. ذكاؤنا الاصطناعي يعالج النص في ثوانٍ.",
    precisionMatters: "الدقة مهمة",
    precisionDesc:
      "مدعوم بنماذج لغوية متقدمة لتقديم نتائج دقيقة وواعية بالسياق.",
    effortlessExperience: "تجربة سهلة",
    effortlessDesc: "بدون إعدادات معقدة. فقط الصق نصك واحصل على نتائج فورية.",
    privacyFocused: "التركيز على الخصوصية",
    privacyDesc: "محتواك يبقى لك. لا نخزن أو نشارك بياناتك النصية.",
    // Team section
    meetTheTeam: "تعرف على الفريق",
    teamSubtitle:
      "المطورون المتحمسون وراء 3ssila AI، ملتزمون بجعل اللغة متاحة للجميع.",
    coFounderDeveloper: "مؤسس مشارك ومطور",
    // CTA section
    readyToBreakBarriers: "مستعد لكسر حواجز اللغة؟",
    ctaDescription:
      "لديك أسئلة أو ملاحظات أو أفكار للشراكة؟ يسعدنا سماعك. تواصل مع فريقنا اليوم.",
    contactUs: "اتصل بنا",
    try3ssilaAI: "جرب 3ssila AI",
  },

  // Auth Pages
  auth: {
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    name: "الاسم",
    forgotPassword: "نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟",
    haveAccount: "لديك حساب بالفعل؟",
    loginButton: "تسجيل الدخول",
    signupButton: "إنشاء حساب",
    orContinueWith: "أو تابع باستخدام",
    emailPlaceholder: "اكتب بريدك الإلكتروني",
    passwordPlaceholder: "أدخل كلمة المرور",
    namePlaceholder: "اكتب اسمك",
    createPassword: "أنشئ كلمة مرور",
    loggingIn: "جاري تسجيل الدخول...",
    creatingAccount: "جاري إنشاء الحساب...",
    termsAgree: "بالتسجيل، أنت توافق على",
    termsOfService: "شروط الخدمة",
    and: "و",
    privacyPolicy: "سياسة الخصوصية",
    createAccount: "إنشاء حساب",
    startHumanizing: "ابدأ بأنسنة نصك اليوم",
  },

  // Footer
  footer: {
    description:
      "حوّل محتواك فوراً باستخدام الترجمة والتلخيص المدعوم بالذكاء الاصطناعي. سريع ودقيق وسهل.",
    product: "المنتج",
    translate: "ترجمة",
    summarize: "تلخيص",
    company: "الشركة",
    about: "حول",
    contact: "اتصل بنا",
    legal: "قانوني",
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    developers: "المطورون",
    allRightsReserved: "جميع الحقوق محفوظة.",
  },

  // Language selector
  languageSelector: {
    selectLanguage: "اختر لغة الموقع",
    english: "الإنجليزية",
    french: "الفرنسية",
    arabic: "العربية",
  },

  // Contact page
  contact: {
    title: "اتصل بنا",
    subtitle: "هل لديك سؤال أو ملاحظات؟ نحب أن نسمع منك.",
    nameLabel: "الاسم",
    namePlaceholder: "اسمك",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "your.email@example.com",
    messageLabel: "الرسالة",
    messagePlaceholder: "كيف يمكننا مساعدتك؟",
    sendButton: "إرسال الرسالة",
    sending: "جاري الإرسال...",
    successMessage: "تم إرسال الرسالة بنجاح! سنرد عليك قريباً.",
    errorMessage: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    responseTime: "نرد عادةً خلال 24-48 ساعة.",
  },
};
