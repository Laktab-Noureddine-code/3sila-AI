<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../services/api";
import { auth } from "../stores/auth";
import { toast } from "../stores/toast";
import { favorites } from "../stores/favorites";
import { useI18n } from "../composables/useI18n";
import {
  speechToText,
  stopSpeechToText,
  textToSpeech,
  stopTextToSpeech,
} from "../services/speech";
import { exportResult, type ExportFormat } from "../services/export";
import type { SpeechRecognizer } from "microsoft-cognitiveservices-speech-sdk";
import SkeletonLoader from "../components/SkeletonLoader.vue";
import BottomSheet from "../components/BottomSheet.vue";
import TiptapEditor from "../components/TiptapEditor.vue";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CloudUpload,
  Loader2,
  Mic,
  Paperclip,
  Trash2,
  Star,
  Volume2,
  Square,
  Copy,
  Download,
  FileText,
} from "lucide-vue-next";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

// --- Languages with country codes for flag icons ---
const languages = [
  { name: "French", code: "fr" },
  { name: "English", code: "gb" },
  { name: "Spanish", code: "es" },
  { name: "German", code: "de" },
  { name: "Italian", code: "it" },
  { name: "Portuguese", code: "pt" },
  { name: "Chinese", code: "cn" },
  { name: "Japanese", code: "jp" },
  { name: "Korean", code: "kr" },
  { name: "Arabic", code: "sa" },
  { name: "Hindi", code: "in" },
  { name: "Russian", code: "ru" },
  { name: "Dutch", code: "nl" },
  { name: "Polish", code: "pl" },
  { name: "Swedish", code: "se" },
  { name: "Norwegian", code: "no" },
  { name: "Danish", code: "dk" },
  { name: "Finnish", code: "fi" },
  { name: "Greek", code: "gr" },
  { name: "Turkish", code: "tr" },
  { name: "Vietnamese", code: "vn" },
  { name: "Thai", code: "th" },
  { name: "Indonesian", code: "id" },
  { name: "Malay", code: "my" },
  { name: "Czech", code: "cz" },
  { name: "Romanian", code: "ro" },
  { name: "Hungarian", code: "hu" },
  { name: "Ukrainian", code: "ua" },
  { name: "Bengali", code: "bd" },
  { name: "Urdu", code: "pk" },
  { name: "Swahili", code: "ke" },
];

// --- State ---
const inputText = ref("");
const inputPlainText = ref("");
const resultText = ref("");
const mode = ref<"translate" | "summarize">("translate");
const targetLanguage = ref("French");
const isLanguageDropdownOpen = ref(false);
const isLoading = ref(false);
const isExtracting = ref(false);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const CHARACTER_LIMIT = 250;

// LocalStorage keys for persistence
const STORAGE_KEYS = {
  inputText: "3ssila_input_text",
  resultText: "3ssila_result_text",
  mode: "3ssila_mode",
  targetLanguage: "3ssila_target_language",
};

// Helper functions for localStorage persistence
const saveToStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn("Failed to save to localStorage:", e);
  }
};

const loadFromStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn("Failed to load from localStorage:", e);
    return null;
  }
};

const clearInputStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.inputText);
    localStorage.removeItem(STORAGE_KEYS.resultText);
  } catch (e) {
    console.warn("Failed to clear localStorage:", e);
  }
};

const clearResultText = () => {
  resultText.value = "";
  try {
    localStorage.removeItem(STORAGE_KEYS.resultText);
  } catch (e) {
    console.warn("Failed to clear result from localStorage:", e);
  }
};

// Voice capabilities
const isListening = ref(false);
const isSpeaking = ref(false);
const isPlaying = ref(false);
const isProcessingSpeech = ref(false);
let azureRecognizer: SpeechRecognizer | null = null;
let azureSynthesizer: { stop: () => void } | null = null;
const baseSpeechText = ref("");
const interimTranscript = ref("");
const showMicModal = ref(false);
const speechLanguageSelection = ref("French");
const isSpeechLangDropdownOpen = ref(false);
const speechLangSearch = ref("");
const targetLangSearch = ref("");
const targetLangDropdownRef = ref<HTMLElement | null>(null);
const speechLangDropdownRef = ref<HTMLElement | null>(null);

// Export dropdown state
const isExportDropdownOpen = ref(false);
const isExporting = ref(false);
const exportDropdownRef = ref<HTMLElement | null>(null);

// Swipe to change mode on mobile
const modeContainerRef = ref<HTMLElement | null>(null);
const modeTouchStartX = ref(0);
const modeTouchEndX = ref(0);
const isModeAnimating = ref(false);
const swipeIndicatorOpacity = ref(0);
const swipeDirection = ref<"left" | "right" | null>(null);

const handleModeTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0];
  if (!touch) return;
  modeTouchStartX.value = touch.clientX;
  modeTouchEndX.value = touch.clientX;
};

const handleModeTouchMove = (e: TouchEvent) => {
  const touch = e.touches[0];
  if (!touch) return;
  modeTouchEndX.value = touch.clientX;
  const diff = modeTouchEndX.value - modeTouchStartX.value;
  swipeIndicatorOpacity.value = Math.min(Math.abs(diff) / 100, 0.5);
  swipeDirection.value = diff > 0 ? "right" : "left";
};

const handleModeTouchEnd = () => {
  const diff = modeTouchEndX.value - modeTouchStartX.value;
  const threshold = 50;

  if (Math.abs(diff) > threshold) {
    isModeAnimating.value = true;
    if (diff > 0 && mode.value === "summarize") {
      // Swipe right: go to translate
      mode.value = "translate";
    } else if (diff < 0 && mode.value === "translate") {
      // Swipe left: go to summarize
      mode.value = "summarize";
    }
    setTimeout(() => {
      isModeAnimating.value = false;
    }, 300);
  }

  swipeIndicatorOpacity.value = 0;
  swipeDirection.value = null;
};

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  if (
    targetLangDropdownRef.value &&
    !targetLangDropdownRef.value.contains(target)
  ) {
    isLanguageDropdownOpen.value = false;
    targetLangSearch.value = "";
  }
  if (
    speechLangDropdownRef.value &&
    !speechLangDropdownRef.value.contains(target)
  ) {
    isSpeechLangDropdownOpen.value = false;
    speechLangSearch.value = "";
  }
  if (exportDropdownRef.value && !exportDropdownRef.value.contains(target)) {
    isExportDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Watch for changes and persist to localStorage
watch(inputText, (newValue) => {
  if (newValue) {
    saveToStorage(STORAGE_KEYS.inputText, newValue);
  } else {
    // When input is cleared, also clear result from storage
    clearInputStorage();
  }
});

watch(resultText, (newValue) => {
  if (newValue) {
    saveToStorage(STORAGE_KEYS.resultText, newValue);
  } else {
    localStorage.removeItem(STORAGE_KEYS.resultText);
  }
});

watch(mode, (newValue) => {
  saveToStorage(STORAGE_KEYS.mode, newValue);
});

watch(targetLanguage, (newValue) => {
  saveToStorage(STORAGE_KEYS.targetLanguage, newValue);
});

// Speech capabilities are available (using Azure Cognitive Services)
const isSpeechRecognitionSupported = true;
const isSpeechSynthesisSupported = true;

// --- Computed ---
const filteredLanguages = computed(() => {
  const query = targetLangSearch.value.toLowerCase().trim();
  if (!query) return languages;
  return languages.filter((lang) => lang.name.toLowerCase().includes(query));
});

const filteredSpeechLanguages = computed(() => {
  const query = speechLangSearch.value.toLowerCase().trim();
  if (!query) return languages;
  return languages.filter((lang) => lang.name.toLowerCase().includes(query));
});

const selectedSpeechLanguage = computed(() => {
  return (
    languages.find((lang) => lang.name === speechLanguageSelection.value) ||
    languages[0]
  );
});

const selectedLanguage = computed(() => {
  return (
    languages.find((lang) => lang.name === targetLanguage.value) || languages[0]
  );
});

// RTL languages detection
const rtlLanguages = ["Arabic", "Urdu", "Hebrew", "Persian", "Farsi"];
const isRtlLanguage = computed(() => {
  return rtlLanguages.includes(targetLanguage.value);
});

// --- Lifecycle ---
onMounted(() => {
  const queryMode = route.query.mode as string;
  if (queryMode === "translate" || queryMode === "summarize") {
    mode.value = queryMode;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Pre-fill input and result text from query parameters (used by Favorites)
  const prefillText = route.query.prefill as string;
  const prefillResult = route.query.result as string;
  const prefillTargetLang = route.query.targetLang as string;

  // Query params take priority over localStorage
  if (prefillText) {
    inputText.value = prefillText;
  } else {
    // Load from localStorage if no query params
    const savedInput = loadFromStorage(STORAGE_KEYS.inputText);
    if (savedInput) {
      inputText.value = savedInput;
    }
  }
  // Sync plain text from loaded HTML
  if (inputText.value) {
    const tmp = document.createElement("div");
    tmp.innerHTML = inputText.value;
    inputPlainText.value = tmp.textContent || "";
  }

  if (prefillResult) {
    resultText.value = prefillResult;
  } else {
    // Load from localStorage if no query params
    const savedResult = loadFromStorage(STORAGE_KEYS.resultText);
    if (savedResult) {
      resultText.value = savedResult;
    }
  }

  if (prefillTargetLang) {
    targetLanguage.value = prefillTargetLang;
  } else {
    // Load saved target language from localStorage
    const savedTargetLang = loadFromStorage(STORAGE_KEYS.targetLanguage);
    if (savedTargetLang && languages.some((l) => l.name === savedTargetLang)) {
      targetLanguage.value = savedTargetLang;
    }
  }

  // Load saved mode from localStorage (if not set by query)
  if (!queryMode) {
    const savedMode = loadFromStorage(STORAGE_KEYS.mode);
    if (savedMode === "translate" || savedMode === "summarize") {
      mode.value = savedMode;
    }
  }

  // Clear the prefill query params from URL to avoid confusion on refresh
  if (prefillText || prefillResult) {
    router.replace({ path: "/", query: { mode: queryMode || undefined } });
  }
});

// --- Computed ---
const characterCount = computed(() => {
  return inputPlainText.value.length;
});

const resultCharacterCount = computed(() => {
  // Strip HTML tags for character count
  const tmp = document.createElement("div");
  tmp.innerHTML = resultText.value;
  return tmp.textContent?.length || 0;
});

const onInputTextUpdate = (text: string) => {
  inputPlainText.value = text;
};

// --- Methods ---
const handleSubmit = async () => {
  if (!inputPlainText.value.trim()) return;

  isLoading.value = true;
  resultText.value = ""; // Clear previous result

  try {
    let response;
    if (mode.value === "translate") {
      response = await api.translateText(inputText.value, targetLanguage.value);
    } else {
      response = await api.summarizeText(inputText.value);
    }

    const data = response?.data || {};
    const extracted =
      mode.value === "translate"
        ? data.translation ||
          data.translated_text ||
          data.result ||
          data.output ||
          data.response ||
          ""
        : data.summary ||
          data.summary_text ||
          data.result ||
          data.output ||
          data.response ||
          "";

    resultText.value = extracted || "No result returned.";
  } catch (error: any) {
    console.error(error);
    const detail =
      error?.response?.data?.detail ||
      error?.message ||
      "Error: Could not process text. Please try again.";
    toast.error(detail);
  } finally {
    isLoading.value = false;
  }
};

// Check if current result is favorited
const isCurrentFavorited = computed(() => {
  return favorites.isFavorited(inputText.value, resultText.value);
});

// Toggle favorite for current result
const toggleFavorite = () => {
  if (!auth.isAuthenticated()) {
    toast.warning(t.value.home.loginForFavorites);
    return;
  }
  if (!inputPlainText.value.trim() || !resultText.value) return;

  const isFav = favorites.toggle({
    type: mode.value === "translate" ? "translation" : "summary",
    inputText: inputText.value,
    resultText: resultText.value,
    targetLanguage:
      mode.value === "translate" ? targetLanguage.value : undefined,
    createdAt: new Date().toISOString(),
  });

  if (isFav) {
    toast.success("Added to favorites!");
  } else {
    toast.success("Removed from favorites");
  }
};

const copyToClipboard = () => {
  if (resultText.value) {
    // Copy plain text version
    const tmp = document.createElement("div");
    tmp.innerHTML = resultText.value;
    navigator.clipboard.writeText(tmp.textContent || resultText.value);
    toast.success("Copied to clipboard!");
  }
};

const goToSignup = () => {
  router.push("/signup");
};

const triggerFileUpload = () => {
  if (!auth.isAuthenticated()) {
    toast.warning(t.value.home.loginForFileUpload);
    return;
  }
  fileInput.value?.click();
};

const processFile = async (file: File) => {
  // Validation 1: Check file size (1MB limit)
  if (file.size > 1024 * 1024) {
    toast.error("File size exceeds 1MB limit");
    return;
  }

  // Validation 2: Check file type
  const validTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
  ];
  if (!validTypes.includes(file.type)) {
    toast.error("Invalid file type. Please upload PDF, DOCX, PNG, or JPEG.");
    return;
  }

  isExtracting.value = true;
  try {
    const response = await api.extractTextFromFile(file);
    const parsedText = response.data?.ParsedResults?.[0]?.ParsedText || "";
    inputText.value = `<p>${parsedText}</p>`;
    inputPlainText.value = parsedText;
  } catch (error: any) {
    console.error(error);
    toast.error("Failed to extract text from file.");
  } finally {
    isExtracting.value = false;
  }
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  await processFile(file);
  target.value = "";
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
};

const handleDrop = async (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
  if (!auth.isAuthenticated()) {
    toast.warning(t.value.home.loginForFileUpload);
    return;
  }
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    await processFile(file);
  }
};

// Mic modal handlers
const openMicModal = () => {
  if (!auth.isAuthenticated()) {
    toast.warning(t.value.home.loginForSpeechToText);
    return;
  }
  speechLanguageSelection.value = targetLanguage.value;
  showMicModal.value = true;
};

const closeMicModal = () => {
  if (isListening.value && azureRecognizer) {
    stopSpeechToText(azureRecognizer);
  }
  azureRecognizer = null;
  isListening.value = false;
  isProcessingSpeech.value = false;
  interimTranscript.value = "";
  baseSpeechText.value = inputPlainText.value.trim();
  showMicModal.value = false;
};

const startMicRecording = async () => {
  if (isListening.value) return;
  await toggleMicrophone(speechLanguageSelection.value);
};

const stopMicRecording = async () => {
  if (!isListening.value) return;
  isProcessingSpeech.value = true;
  showMicModal.value = false;
  await toggleMicrophone(speechLanguageSelection.value);
  // Small delay to show processing state before it completes
  setTimeout(() => {
    isProcessingSpeech.value = false;
  }, 500);
};

// Voice handler: Toggle microphone for speech recognition
const toggleMicrophone = async (languageName?: string) => {
  if (!isSpeechRecognitionSupported) {
    toast.error("Speech recognition is not supported");
    return;
  }

  // Stop if already listening
  if (isListening.value && azureRecognizer) {
    try {
      stopSpeechToText(azureRecognizer);
      azureRecognizer = null;
      isListening.value = false;
      interimTranscript.value = "";
      baseSpeechText.value = inputText.value.trim();
      toast.success("Speech recognition stopped");
    } catch (error: any) {
      console.error("Error stopping recognition:", error);
      toast.error("Failed to stop speech recognition");
    }
    return;
  }

  // Check microphone permission first
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error: any) {
    console.error("Microphone permission error:", error);
    if (error.name === "NotAllowedError") {
      toast.error(
        "Microphone access denied. Please allow microphone permissions.",
      );
    } else if (error.name === "NotFoundError") {
      toast.error("No microphone found. Please connect a microphone.");
    } else {
      toast.error("Could not access microphone: " + error.message);
    }
    return;
  }

  // Start Azure speech recognition
  try {
    baseSpeechText.value = inputPlainText.value.trim();
    interimTranscript.value = "";

    const speechLang =
      languageName || speechLanguageSelection.value || targetLanguage.value;
    azureRecognizer = speechToText(speechLang, {
      onRecognizing: (transcript: string) => {
        // Update input text with interim results without duplicating words
        if (!transcript) return;
        interimTranscript.value = transcript;
        const combined = [baseSpeechText.value, interimTranscript.value]
          .filter(Boolean)
          .join(" ")
          .trim();
        inputText.value = `<p>${combined}</p>`;
        inputPlainText.value = combined;
      },
      onRecognized: (transcript: string) => {
        // Append final recognized text
        if (!transcript) return;
        baseSpeechText.value = [baseSpeechText.value, transcript]
          .filter(Boolean)
          .join(" ")
          .trim();
        interimTranscript.value = "";
        inputText.value = `<p>${baseSpeechText.value}</p>`;
        inputPlainText.value = baseSpeechText.value;
      },
      onError: (error: string) => {
        console.error("Speech recognition error:", error);
        isListening.value = false;
        azureRecognizer = null;
        interimTranscript.value = "";
        baseSpeechText.value = inputPlainText.value.trim();
        toast.error(error);
      },
      onSessionStopped: () => {
        isListening.value = false;
        azureRecognizer = null;
        interimTranscript.value = "";
        baseSpeechText.value = inputPlainText.value.trim();
      },
    });

    if (azureRecognizer) {
      isListening.value = true;
      toast.success("Listening... (speak now)");
    } else {
      toast.error("Failed to initialize speech recognition");
    }
  } catch (error: any) {
    console.error("Failed to start recognition:", error);
    isListening.value = false;
    azureRecognizer = null;
    toast.error("Failed to start speech recognition. Please try again.");
  }
};

// Voice handler: Read result text aloud
const readResult = () => {
  // If already playing, stop the audio
  if (isPlaying.value || isSpeaking.value) {
    stopTextToSpeech();
    azureSynthesizer = null;
    isSpeaking.value = false;
    isPlaying.value = false;
    toast.info("Audio stopped");
    return;
  }

  // Check if user is authenticated
  if (!auth.isAuthenticated()) {
    toast.warning(t.value.home.loginForTextToSpeech);
    return;
  }

  // Start speaking
  if (!isSpeaking.value) {
    isSpeaking.value = true;
    // Extract plain text for speech
    const tmp = document.createElement("div");
    tmp.innerHTML = resultText.value;
    const plainResult = tmp.textContent || resultText.value;
    azureSynthesizer = textToSpeech(plainResult, targetLanguage.value, {
      onStarted: () => {
        isPlaying.value = true;
      },
      onCompleted: () => {
        isSpeaking.value = false;
        isPlaying.value = false;
        azureSynthesizer = null;
        toast.success("Done reading");
      },
      onError: (error) => {
        isSpeaking.value = false;
        isPlaying.value = false;
        azureSynthesizer = null;
        toast.error(error);
      },
    });

    if (!azureSynthesizer) {
      isSpeaking.value = false;
      isPlaying.value = false;
    }
  }
};

// Export handler
const handleExport = async (format: ExportFormat) => {
  if (!resultText.value) return;

  isExporting.value = true;
  isExportDropdownOpen.value = false;

  try {
    await exportResult(format, {
      inputText: inputText.value,
      resultText: resultText.value,
      mode: mode.value,
      targetLanguage:
        mode.value === "translate" ? targetLanguage.value : undefined,
    });
    toast.success(`Exported as ${format.toUpperCase()} successfully!`);
  } catch (error: any) {
    console.error("Export error:", error);
    toast.error(
      `Failed to export as ${format.toUpperCase()}: ${error.message}`,
    );
  } finally {
    isExporting.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff09_1px,transparent_1px),linear-gradient(to_bottom,#ffffff09_1px,transparent_1px)] bg-[size:24px_24px]"
  >
    <div class="text-center pt-12 pb-8 px-4">
      <h1
        class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight"
      >
        {{ mode === "translate" ? t.home.translate : t.home.summarize }}
      </h1>
      <p class="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
        {{ t.home.enterTextAndClick }}
        {{
          mode === "translate" ? t.home.translateButton : t.home.summarizeButton
        }}
        {{ t.home.toGetStarted }}
      </p>
    </div>

    <div class="max-w-6xl mx-auto px-4 pb-20">
      <div
        class="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col h-[600px]"
      >
        <div
          class="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#252525] px-4 py-3 gap-4 rounded-t-3xl overflow-visible relative z-20"
        >
          <!-- Mode toggle with swipe support on mobile -->
          <div
            ref="modeContainerRef"
            class="relative flex space-x-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-full select-none"
            :class="{ 'transition-transform duration-300': isModeAnimating }"
            @touchstart="handleModeTouchStart"
            @touchmove="handleModeTouchMove"
            @touchend="handleModeTouchEnd"
          >
            <!-- Swipe indicator (mobile) -->
            <div
              class="absolute inset-0 rounded-full pointer-events-none sm:hidden flex items-center justify-between px-2 overflow-hidden"
              :style="{ opacity: swipeIndicatorOpacity }"
            >
              <ChevronLeft
                v-if="swipeDirection === 'right' && mode === 'summarize'"
                class="w-4 h-4 text-cyan-500 animate-pulse"
              />
              <div class="flex-1"></div>
              <ChevronRight
                v-if="swipeDirection === 'left' && mode === 'translate'"
                class="w-4 h-4 text-cyan-500 animate-pulse"
              />
            </div>
            <button
              @click="mode = 'translate'"
              :class="
                mode === 'translate'
                  ? 'bg-white dark:bg-gray-700 shadow text-cyan-400 font-bold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              "
              class="px-6 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer"
            >
              {{ t.home.translate }}
            </button>
            <button
              @click="mode = 'summarize'"
              :class="
                mode === 'summarize'
                  ? 'bg-white dark:bg-gray-700 shadow text-cyan-400 font-bold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              "
              class="px-6 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer"
            >
              {{ t.home.summarize }}
            </button>
            <!-- Mobile swipe hint -->
            <div
              class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 whitespace-nowrap sm:hidden my-2"
            >
              Swipe to switch
            </div>
          </div>

          <div v-if="mode === 'translate'" class="flex items-center gap-2">
            <label class="text-sm text-gray-500 dark:text-gray-400 font-medium"
              >{{ t.home.targetLanguage }}:</label
            >
            <div class="relative" ref="targetLangDropdownRef">
              <button
                @click.stop="isLanguageDropdownOpen = !isLanguageDropdownOpen"
                class="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-1.5 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
              >
                <span :class="`fi fi-${selectedLanguage?.code}`"></span>
                <span>{{ selectedLanguage?.name }}</span>
              </button>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
              >
                <ChevronDown class="fill-current h-4 w-4" />
              </div>
              <!-- Dropdown -->
              <div
                v-if="isLanguageDropdownOpen"
                @click.stop
                class="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 overflow-hidden"
              >
                <!-- Search input -->
                <div class="p-2 border-b border-gray-200 dark:border-gray-700">
                  <input
                    v-model="targetLangSearch"
                    type="text"
                    :placeholder="t.home.searchLanguages"
                    class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <!-- Language list -->
                <div class="max-h-48 overflow-y-auto">
                  <button
                    v-for="lang in filteredLanguages"
                    :key="lang.code"
                    @mousedown.prevent="
                      targetLanguage = lang.name;
                      isLanguageDropdownOpen = false;
                      targetLangSearch = '';
                    "
                    class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    :class="{
                      'bg-cyan-50 dark:bg-cyan-900/30':
                        targetLanguage === lang.name,
                    }"
                  >
                    <span :class="`fi fi-${lang.code}`"></span>
                    <span>{{ lang.name }}</span>
                  </button>
                  <div
                    v-if="filteredLanguages.length === 0"
                    class="px-3 py-2 text-sm text-gray-400 italic"
                  >
                    {{ t.common.noResults }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 flex flex-col md:flex-row min-h-0">
          <div
            class="flex-1 p-6 flex flex-col relative border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] md:rounded-bl-3xl"
            :class="{
              'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-400 border-2 border-dashed':
                isDragging,
            }"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
          >
            <!-- Drag overlay -->
            <div
              v-if="isDragging"
              class="absolute inset-0 flex items-center justify-center bg-cyan-50/80 dark:bg-cyan-900/40 z-20 pointer-events-none"
            >
              <div class="text-center">
                <CloudUpload class="w-12 h-12 mx-auto text-cyan-500 mb-2" />
                <p class="text-cyan-600 dark:text-cyan-400 font-medium">
                  {{ t.home.dragAndDrop }}
                </p>
              </div>
            </div>

            <!-- Speech processing overlay -->
            <div
              v-if="isProcessingSpeech"
              class="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-[#1a1a1a]/90 z-20"
            >
              <div class="text-center">
                <Loader2
                  class="animate-spin w-10 h-10 mx-auto text-cyan-500 mb-3"
                />
                <p class="text-cyan-600 dark:text-cyan-400 font-medium">
                  {{ t.home.processing }}
                </p>
              </div>
            </div>

            <!-- Hidden file input -->
            <input
              type="file"
              ref="fileInput"
              @change="handleFileUpload"
              accept=".pdf,.docx,.jpg,.png"
              class="hidden"
            />

            <!-- Microphone button -->
            <button
              v-if="isSpeechRecognitionSupported"
              @click="openMicModal"
              :class="[
                'absolute top-4 left-16 p-2 rounded-full transition-colors cursor-pointer',
                isListening
                  ? 'bg-red-500 text-white animate-pulse hover:bg-red-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400',
              ]"
              :title="isListening ? t.home.stopRecording : t.home.voiceInput"
            >
              <Mic class="h-5 w-5" />
            </button>

            <!-- Upload button -->
            <button
              @click="triggerFileUpload"
              :disabled="isExtracting"
              class="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
              :title="t.home.uploadFileHint"
            >
              <Loader2 v-if="isExtracting" class="animate-spin h-5 w-5" />
              <!-- Paperclip icon -->
              <Paperclip v-else class="h-5 w-5" />
            </button>

            <div class="flex-1 overflow-y-auto pt-10 custom-scrollbar">
              <TiptapEditor
                v-model="inputText"
                :placeholder="t.home.inputPlaceholder"
                :editable="true"
                @update:text-content="onInputTextUpdate"
              />
            </div>

            <div class="mt-4 flex items-center justify-between relative z-10">
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-gray-400"
                  >{{ characterCount }} {{ t.home.characters }}</span
                >
                <span
                  v-if="!auth.isAuthenticated()"
                  @click="goToSignup"
                  title="Sign up to have unlimited tries"
                  class="text-xs font-medium text-orange-500 hover:text-orange-600 cursor-pointer underline decoration-dotted"
                >
                  / {{ CHARACTER_LIMIT }} limit
                </span>
                <!-- Clear input button -->
                <button
                  v-if="inputPlainText"
                  @click="
                    inputText = '';
                    inputPlainText = '';
                    resultText = '';
                    clearInputStorage();
                  "
                  class="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors cursor-pointer ml-2"
                  title="Clear input"
                >
                  <Trash2 class="w-4 h-4" />
                  Clear
                </button>
              </div>
              <button
                @click="handleSubmit"
                :disabled="isLoading || !inputPlainText.trim()"
                class="bg-cyan-400 hover:bg-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold py-2.5 px-8 rounded-full shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                <Loader2
                  v-if="isLoading"
                  class="animate-spin h-5 w-5 text-white"
                />
                <span v-else>
                  {{
                    mode === "translate"
                      ? t.home.translateButton
                      : t.home.summarizeButton
                  }}
                </span>
              </button>
            </div>
          </div>

          <div
            class="flex-1 p-6 bg-gray-50 dark:bg-[#202020] flex flex-col relative rounded-b-3xl md:rounded-bl-none md:rounded-br-3xl"
          >
            <div
              class="absolute top-4 left-6 text-xs font-bold text-gray-400 uppercase tracking-wider"
            >
              {{ t.home.result }}
            </div>

            <!-- Empty state when no loading and no result -->
            <div
              v-if="!resultText && !isLoading"
              class="flex-1 flex items-center justify-center text-gray-400 italic"
            >
              <p>{{ t.home.noResult }}</p>
            </div>

            <!-- Skeleton loader during loading state -->
            <div v-else-if="isLoading" class="flex-1 mt-6 overflow-y-auto">
              <SkeletonLoader type="result" />
            </div>

            <!-- Result text display -->
            <div v-else class="flex-1 mt-6 overflow-y-auto custom-scrollbar">
              <TiptapEditor
                :model-value="resultText"
                :editable="false"
                :dir="isRtlLanguage ? 'rtl' : 'ltr'"
              />
            </div>

            <div
              class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between"
            >
              <span class="text-xs font-medium text-gray-400"
                >{{ resultCharacterCount }} {{ t.home.characters }}</span
              >

              <div class="flex items-center gap-3">
                <!-- Speaker button -->
                <button
                  v-if="resultText && isSpeechSynthesisSupported"
                  @click="readResult"
                  :class="[
                    'flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer',
                    isPlaying
                      ? 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300'
                      : isSpeaking
                        ? 'text-cyan-600 dark:text-cyan-400'
                        : 'text-gray-500 hover:text-cyan-600',
                  ]"
                  :title="
                    isPlaying
                      ? 'Stop audio'
                      : isSpeaking
                        ? 'Generating audio...'
                        : 'Read aloud'
                  "
                  :disabled="isSpeaking && !isPlaying"
                >
                  <!-- Loading spinner when generating (not yet playing) -->
                  <Loader2
                    v-if="isSpeaking && !isPlaying"
                    class="animate-spin w-4 h-4"
                  />
                  <!-- Stop icon when playing -->
                  <Square
                    v-else-if="isPlaying"
                    class="w-4 h-4"
                    fill="currentColor"
                  />
                  <!-- Volume icon when idle -->
                  <Volume2 v-else class="w-4 h-4" />
                  {{
                    isPlaying
                      ? t.home.stopListening
                      : isSpeaking
                        ? t.home.processing
                        : t.home.listen
                  }}
                </button>

                <!-- Copy button -->
                <button
                  v-if="resultText"
                  @click="copyToClipboard"
                  class="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-cyan-600 transition-colors cursor-pointer"
                >
                  <Copy class="w-4 h-4" />
                  {{ t.home.copy }}
                </button>

                <!-- Export dropdown -->
                <div v-if="resultText" class="relative" ref="exportDropdownRef">
                  <button
                    @click.stop="isExportDropdownOpen = !isExportDropdownOpen"
                    :disabled="isExporting"
                    class="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-cyan-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    :title="t.home.export"
                  >
                    <Loader2 v-if="isExporting" class="animate-spin w-4 h-4" />
                    <Download v-else class="w-4 h-4" />
                    {{ isExporting ? t.common.loading : t.home.export }}
                    <ChevronDown v-if="!isExporting" class="w-3 h-3" />
                  </button>
                  <!-- Export dropdown menu -->
                  <div
                    v-if="isExportDropdownOpen"
                    class="absolute bottom-full left-0 mb-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 overflow-hidden"
                  >
                    <button
                      @click="handleExport('pdf')"
                      class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <FileText class="w-4 h-4 text-red-500" />
                      PDF
                    </button>
                    <button
                      @click="handleExport('docx')"
                      class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <FileText class="w-4 h-4 text-blue-500" />
                      DOCX
                    </button>
                    <button
                      @click="handleExport('txt')"
                      class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <FileText class="w-4 h-4 text-gray-500" />
                      TXT
                    </button>
                  </div>
                </div>

                <!-- Save to Favorites button -->
                <button
                  v-if="resultText"
                  @click="toggleFavorite"
                  :class="[
                    'flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer',
                    isCurrentFavorited
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-gray-500 hover:text-yellow-500',
                  ]"
                  :title="
                    isCurrentFavorited
                      ? t.home.removeFromFavorites
                      : t.home.addToFavorites
                  "
                >
                  <Star
                    class="w-4 h-4"
                    :fill="isCurrentFavorited ? 'currentColor' : 'none'"
                  />
                  {{ isCurrentFavorited ? t.common.save : t.common.save }}
                </button>

                <!-- Clear button -->
                <button
                  v-if="resultText"
                  @click="clearResultText"
                  class="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                  title="Clear result"
                >
                  <Trash2 class="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Voice recording bottom sheet / modal -->
  <BottomSheet
    v-model="showMicModal"
    :title="t.home.voiceInput"
    :subtitle="t.home.speakNow"
    @close="closeMicModal"
  >
    <div class="p-4 md:p-6 space-y-5">
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-200">{{
          t.home.speechLanguage
        }}</label>
        <div class="relative" ref="speechLangDropdownRef">
          <button
            @click.stop="isSpeechLangDropdownOpen = !isSpeechLangDropdownOpen"
            class="w-full flex items-center gap-2 bg-white dark:bg-[#161616] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 py-2.5 pl-3 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
          >
            <span :class="`fi fi-${selectedSpeechLanguage?.code}`"></span>
            <span>{{ selectedSpeechLanguage?.name }}</span>
          </button>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
          >
            <ChevronDown class="fill-current h-4 w-4" />
          </div>
          <!-- Dropdown -->
          <div
            v-if="isSpeechLangDropdownOpen"
            @click.stop
            class="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <!-- Search input -->
            <div class="p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                v-model="speechLangSearch"
                type="text"
                placeholder="Search language..."
                class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <!-- Language list -->
            <div class="max-h-48 overflow-y-auto">
              <button
                v-for="lang in filteredSpeechLanguages"
                :key="lang.code"
                @mousedown.prevent="
                  speechLanguageSelection = lang.name;
                  isSpeechLangDropdownOpen = false;
                  speechLangSearch = '';
                "
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                :class="{
                  'bg-cyan-50 dark:bg-cyan-900/30':
                    speechLanguageSelection === lang.name,
                }"
              >
                <span :class="`fi fi-${lang.code}`"></span>
                <span>{{ lang.name }}</span>
              </button>
              <div
                v-if="filteredSpeechLanguages.length === 0"
                class="px-3 py-2 text-sm text-gray-400 italic"
              >
                {{ t.common.noResults }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <div
            class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            <Loader2
              v-if="isListening"
              class="animate-spin w-4 h-4 text-red-500"
            />
            {{ isListening ? t.home.processing : t.home.startRecording }}
          </div>
          <span
            class="text-xs px-2 py-1 rounded-full"
            :class="
              isListening
                ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-200'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
            "
          >
            {{ isListening ? "LIVE" : "IDLE" }}
          </span>
        </div>

        <div class="waveform" :class="{ 'waveform-active': isListening }">
          <span v-for="bar in 12" :key="bar" class="wave-bar"></span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <button
          class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          @click="closeMicModal"
        >
          {{ t.common.cancel }}
        </button>
        <button
          v-if="!isListening"
          class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 shadow cursor-pointer"
          @click="startMicRecording"
        >
          {{ t.home.startRecording }}
        </button>
        <button
          v-else
          class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 shadow cursor-pointer"
          @click="stopMicRecording"
        >
          {{ t.home.stopRecording }}
        </button>
      </div>
    </template>
  </BottomSheet>
</template>

<style scoped>
/* Voice waveform */
.waveform {
  display: grid;
  grid-template-columns: repeat(12, minmax(4px, 1fr));
  align-items: end;
  gap: 6px;
  height: 48px;
}

.wave-bar {
  display: block;
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(180deg, #22d3ee 0%, #0ea5e9 100%);
  opacity: 0.35;
  transition:
    height 120ms ease,
    opacity 120ms ease;
}

.waveform-active .wave-bar {
  animation: wave 900ms ease-in-out infinite;
  animation-delay: calc(var(--i, 0) * 45ms);
  opacity: 0.9;
}

.wave-bar:nth-child(1) {
  --i: 1;
}
.wave-bar:nth-child(2) {
  --i: 2;
}
.wave-bar:nth-child(3) {
  --i: 3;
}
.wave-bar:nth-child(4) {
  --i: 4;
}
.wave-bar:nth-child(5) {
  --i: 5;
}
.wave-bar:nth-child(6) {
  --i: 6;
}
.wave-bar:nth-child(7) {
  --i: 7;
}
.wave-bar:nth-child(8) {
  --i: 8;
}
.wave-bar:nth-child(9) {
  --i: 9;
}
.wave-bar:nth-child(10) {
  --i: 10;
}
.wave-bar:nth-child(11) {
  --i: 11;
}
.wave-bar:nth-child(12) {
  --i: 12;
}

@keyframes wave {
  0% {
    height: 12%;
  }
  20% {
    height: 95%;
  }
  40% {
    height: 45%;
  }
  60% {
    height: 85%;
  }
  80% {
    height: 30%;
  }
  100% {
    height: 12%;
  }
}

/* Custom scrollbar for the text areas */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(14, 165, 233, 0.7) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    rgba(34, 211, 238, 0.9),
    rgba(14, 165, 233, 0.8)
  );
  border-radius: 999px;
}

:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    rgba(45, 212, 191, 0.9),
    rgba(6, 182, 212, 0.85)
  );
}

/* Cairo font for Arabic text */
.font-cairo {
  font-family: "Cairo", sans-serif;
}
</style>
