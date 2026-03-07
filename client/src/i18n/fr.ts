export default {
  // Common
  common: {
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    cancel: "Annuler",
    confirm: "Confirmer",
    save: "Enregistrer",
    delete: "Supprimer",
    edit: "Modifier",
    close: "Fermer",
    search: "Rechercher",
    noResults: "Aucun résultat trouvé",
    copiedToClipboard: "Copié dans le presse-papiers !",
    addedToFavorites: "Ajouté aux favoris !",
    removedFromFavorites: "Retiré des favoris",
  },

  // Navigation
  nav: {
    home: "Accueil",
    history: "Historique",
    favorites: "Favoris",
    about: "À propos",
    contact: "Contact",
    login: "Connexion",
    signup: "Inscription",
    logout: "Déconnexion",
    getStarted: "Commencer",
    getStartedFree: "Commencer — C'est gratuit",
  },

  // Theme
  theme: {
    switchToLight: "Passer en mode clair",
    switchToDark: "Passer en mode sombre",
  },

  // Home Page
  home: {
    // Mode tabs
    translate: "Traduire",
    summarize: "Résumer",

    // Input section
    inputPlaceholder: "Entrez ou collez votre texte ici...",
    characters: "caractères",
    characterLimit: "Limite de caractères",

    // Target language
    targetLanguage: "Langue cible",
    selectLanguage: "Sélectionner la langue",
    searchLanguages: "Rechercher des langues...",

    // Actions
    translateButton: "Traduire",
    summarizeButton: "Résumer",
    translating: "Traduction en cours...",
    summarizing: "Résumé en cours...",

    // Voice & File
    voiceInput: "Entrée vocale",
    uploadFile: "Télécharger un fichier",
    uploadFileHint: "PDF, DOCX, PNG, JPEG (max 1Mo)",
    dragAndDrop: "Glissez et déposez un fichier ici",
    extracting: "Extraction du texte...",

    // Speech modal
    speechLanguage: "Langue de parole",
    startRecording: "Commencer l'enregistrement",
    stopRecording: "Arrêter l'enregistrement",
    listening: "Écoute en cours...",
    processing: "Traitement...",
    speakNow: "Parlez maintenant...",

    // Result section
    result: "Résultat",
    translation: "Traduction",
    summary: "Résumé",
    noResult: "Pas encore de résultat",
    enterTextAndClick: "Entrez du texte et cliquez sur",
    toGetStarted: "pour commencer",

    // Result actions
    copy: "Copier",
    listen: "Écouter",
    stopListening: "Arrêter",
    export: "Exporter",
    exportAs: "Exporter en",
    addToFavorites: "Ajouter aux favoris",
    removeFromFavorites: "Retirer des favoris",

    // Guest banner
    guestTitle: "Enregistrez votre historique",
    guestDescription:
      "Créez un compte gratuit pour sauvegarder vos traductions et résumés.",
    signUpNow: "S'inscrire maintenant",

    // Errors
    enterText: "Veuillez entrer du texte",
    errorProcessing:
      "Erreur : Impossible de traiter le texte. Veuillez réessayer.",
    fileTooLarge: "La taille du fichier dépasse la limite de 1Mo",
    invalidFileType:
      "Type de fichier invalide. Veuillez télécharger un PDF, DOCX, PNG ou JPEG.",
    failedExtract: "Échec de l'extraction du texte du fichier.",

    // Login required messages
    loginRequired: "Connexion requise",
    loginForSpeechToText:
      "Veuillez vous connecter pour utiliser la reconnaissance vocale.",
    loginForTextToSpeech:
      "Veuillez vous connecter pour utiliser la synthèse vocale.",
    loginForFavorites: "Veuillez vous connecter pour enregistrer les favoris.",
    loginForFileUpload:
      "Veuillez vous connecter pour télécharger des fichiers.",
  },

  // History Page
  history: {
    title: "Historique",
    description:
      "Consultez et gérez votre historique de traductions et résumés",
    empty: "Pas encore d'historique",
    emptyDescription: "Vos traductions et résumés apparaîtront ici",
    startTranslating: "Commencer à traduire",
    clearAll: "Tout effacer",
    clearAllConfirm: "Êtes-vous sûr de vouloir effacer tout l'historique ?",
    deleteConfirm: "Êtes-vous sûr de vouloir supprimer cet élément ?",
    original: "Original",
    translatedTo: "Traduit en",
    summary: "Résumé",
    translation: "Traduction",
    all: "Tout l'historique",
    summaries: "Résumés",
    translations: "Traductions",
    deleteSelected: "Supprimer la sélection",
    selectAll: "Tout sélectionner",
    deselectAll: "Tout désélectionner",
    noHistory: "Pas d'historique",
    startCreating: "Commencez par créer un nouveau",
    input: "Entrée",
    result: "Résultat",
    showMore: "Voir plus",
    showLess: "Voir moins",
    useInTranslator: "Utiliser dans le traducteur",
    copyResult: "Copier le résultat",
    saveToFavorites: "Ajouter aux favoris",
    removeFromFavorites: "Retirer des favoris",
    delete: "Supprimer",
    deleteItem: "Supprimer l'élément",
    deleteItems: "Supprimer les éléments",
    confirmDeleteItem:
      "Êtes-vous sûr de vouloir supprimer ce {type} ? Cette action est irréversible.",
    confirmDeleteItems:
      "Êtes-vous sûr de vouloir supprimer {count} élément(s) ? Cette action est irréversible.",
    previous: "Précédent",
    next: "Suivant",
    pageOf: "Page {current} sur {total} ({items} éléments au total)",
  },

  // Favorites Page
  favorites: {
    title: "Favoris",
    description: "Vos traductions et résumés sauvegardés pour un accès rapide",
    empty: "Pas encore de favoris",
    emptyDescription:
      "Marquez vos traductions et résumés pour les sauvegarder ici",
    browseTranslations: "Parcourir les traductions",
    translation: "Traduction",
    summary: "Résumé",
    useAgain: "Réutiliser",
    all: "Tous les favoris",
    summaries: "Résumés",
    translations: "Traductions",
    removeSelected: "Supprimer la sélection",
    selectAll: "Tout sélectionner",
    deselectAll: "Tout désélectionner",
    favorite: "favori",
    favorites_count: "favoris",
    noSavedYet: "Aucun {type} sauvegardé",
    saveForQuickAccess: "Sauvegardez vos {type} favoris pour un accès rapide.",
    startTranslating: "Commencer à traduire",
    removeFavorite: "Supprimer le favori",
    removeFavorites: "Supprimer les favoris",
    confirmRemove: "Êtes-vous sûr de vouloir supprimer ce {type} des favoris ?",
    confirmRemoveMultiple:
      "Êtes-vous sûr de vouloir supprimer {count} élément(s) des favoris ?",
    remove: "Supprimer",
    saved: "Sauvegardé",
    input: "Entrée",
    result: "Résultat",
    showMore: "Voir plus",
    showLess: "Voir moins",
    useInTranslator: "Utiliser dans le traducteur",
    copyResult: "Copier le résultat",
    removeFromFavorites: "Retirer des favoris",
  },

  // About Page
  about: {
    title: "À propos de 3ssila AI",
    subtitle:
      "Transformez votre contenu instantanément avec la traduction et le résumé alimentés par l'IA",
    features: "Fonctionnalités",
    translateFeature: "Traduction IA",
    translateFeatureDesc:
      "Traduisez du texte entre plus de 30 langues avec une haute précision",
    summarizeFeature: "Résumé intelligent",
    summarizeFeatureDesc:
      "Obtenez des résumés concis de longs textes instantanément",
    voiceFeature: "Entrée vocale",
    voiceFeatureDesc: "Parlez pour traduire avec notre reconnaissance vocale",
    exportFeature: "Options d'exportation",
    exportFeatureDesc: "Exportez les résultats en PDF, DOCX ou fichiers texte",
    // Hero section
    aboutUs: "À propos de nous",
    heroTitle: "Briser les barrières linguistiques avec",
    heroDescription:
      "3ssila AI est votre compagnon intelligent pour la traduction et le résumé instantanés de texte. Notre mission est de rendre la communication mondiale simple pour tous.",
    // Mission section
    ourMission: "Notre Mission",
    missionText1:
      "Dans le monde interconnecté d'aujourd'hui, la langue ne devrait jamais être un obstacle. Nous avons créé 3ssila AI pour permettre aux individus, étudiants, professionnels et entreprises de communiquer facilement à travers les langues.",
    missionText2:
      "Que vous traduisiez des documents importants, résumiez de longs articles ou essayiez simplement de comprendre un contenu dans une autre langue, nous vous couvrons avec rapidité, précision et simplicité.",
    missionQuote: "Permettre une communication fluide dans toutes les langues.",
    // Stats
    translationsCompleted: "Traductions effectuées",
    languagesSupported: "Langues supportées",
    uptimeGuarantee: "Garantie de disponibilité",
    averageResponseTime: "Temps de réponse moyen",
    // Values section
    whatWeStandFor: "Ce que nous défendons",
    valuesSubtitle:
      "Nos valeurs fondamentales guident chaque fonctionnalité que nous construisons et chaque décision que nous prenons.",
    speedFirst: "La rapidité avant tout",
    speedDesc:
      "Nous croyons que votre temps est précieux. Notre IA traite le texte en quelques secondes.",
    precisionMatters: "La précision compte",
    precisionDesc:
      "Alimenté par des modèles de langage avancés pour des résultats précis et contextuels.",
    effortlessExperience: "Expérience sans effort",
    effortlessDesc:
      "Pas de configurations complexes. Collez simplement votre texte et obtenez des résultats instantanés.",
    privacyFocused: "Axé sur la confidentialité",
    privacyDesc:
      "Votre contenu reste le vôtre. Nous ne stockons ni ne partageons vos données textuelles.",
    // Team section
    meetTheTeam: "Rencontrez l'équipe",
    teamSubtitle:
      "Les développeurs passionnés derrière 3ssila AI, dédiés à rendre la langue accessible à tous.",
    coFounderDeveloper: "Co-Fondateur & Développeur",
    // CTA section
    readyToBreakBarriers: "Prêt à briser les barrières linguistiques ?",
    ctaDescription:
      "Vous avez des questions, des commentaires ou des idées de partenariat ? Nous serions ravis de vous entendre. Contactez notre équipe aujourd'hui.",
    contactUs: "Contactez-nous",
    try3ssilaAI: "Essayer 3ssila AI",
  },

  // Auth Pages
  auth: {
    login: "Connexion",
    signup: "Inscription",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    name: "Nom",
    forgotPassword: "Mot de passe oublié ?",
    noAccount: "Vous n'avez pas de compte ?",
    haveAccount: "Vous avez déjà un compte ?",
    loginButton: "Se connecter",
    signupButton: "S'inscrire",
    orContinueWith: "Ou continuer avec",
    emailPlaceholder: "Tapez votre email",
    passwordPlaceholder: "Entrez votre mot de passe",
    namePlaceholder: "Tapez votre nom",
    createPassword: "Créer un mot de passe",
    loggingIn: "Connexion en cours...",
    creatingAccount: "Création du compte...",
    termsAgree: "En vous inscrivant, vous acceptez nos",
    termsOfService: "Conditions d'utilisation",
    and: "et",
    privacyPolicy: "Politique de confidentialité",
    createAccount: "Créer un compte",
    startHumanizing: "Commencez à humaniser votre texte dès aujourd'hui",
  },

  // Footer
  footer: {
    description:
      "Transformez votre contenu instantanément avec la traduction et le résumé alimentés par l'IA. Rapide, précis et sans effort.",
    product: "Produit",
    translate: "Traduire",
    summarize: "Résumer",
    company: "Entreprise",
    about: "À propos",
    contact: "Contact",
    legal: "Légal",
    privacy: "Politique de confidentialité",
    terms: "Conditions d'utilisation",
    developers: "Développeurs",
    allRightsReserved: "Tous droits réservés.",
  },

  // Language selector
  languageSelector: {
    selectLanguage: "Choisir la langue du site",
    english: "Anglais",
    french: "Français",
    arabic: "Arabe",
  },

  // Contact page
  contact: {
    title: "Contactez-nous",
    subtitle:
      "Vous avez une question ou un commentaire ? Nous aimerions vous entendre.",
    nameLabel: "Nom",
    namePlaceholder: "Votre nom",
    emailLabel: "Email",
    emailPlaceholder: "votre.email@exemple.com",
    messageLabel: "Message",
    messagePlaceholder: "Comment pouvons-nous vous aider ?",
    sendButton: "Envoyer le message",
    sending: "Envoi en cours...",
    successMessage:
      "Message envoyé avec succès ! Nous vous répondrons bientôt.",
    errorMessage: "Une erreur s'est produite. Veuillez réessayer.",
    responseTime: "Nous répondons généralement dans les 24 à 48 heures.",
  },
};
