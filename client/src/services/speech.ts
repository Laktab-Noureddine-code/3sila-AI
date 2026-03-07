import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const speechKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
const speechRegion = import.meta.env.VITE_AZURE_SPEECH_REGION;

// Language code mapping for speech recognition
const languageCodeMap: { [key: string]: string } = {
  French: "fr-FR",
  English: "en-US",
  Spanish: "es-ES",
  German: "de-DE",
  Italian: "it-IT",
  Portuguese: "pt-PT",
  Chinese: "zh-CN",
  Japanese: "ja-JP",
  Korean: "ko-KR",
  Arabic: "ar-SA",
  Hindi: "hi-IN",
  Russian: "ru-RU",
  Dutch: "nl-NL",
  Polish: "pl-PL",
  Swedish: "sv-SE",
  Norwegian: "nb-NO",
  Danish: "da-DK",
  Finnish: "fi-FI",
  Greek: "el-GR",
  Turkish: "tr-TR",
  Vietnamese: "vi-VN",
  Thai: "th-TH",
  Indonesian: "id-ID",
  Malay: "ms-MY",
  Czech: "cs-CZ",
  Romanian: "ro-RO",
  Hungarian: "hu-HU",
  Ukrainian: "uk-UA",
  Bengali: "bn-IN",
  Urdu: "ur-PK",
  Swahili: "sw-KE",
};

// Voice name mapping for text-to-speech
const voiceNameMap: { [key: string]: string } = {
  French: "fr-FR-DeniseNeural",
  English: "en-US-JennyNeural",
  Spanish: "es-ES-ElviraNeural",
  German: "de-DE-AmalaNeural",
  Italian: "it-IT-IsabellaNeural",
  Portuguese: "pt-PT-FernandaNeural",
  Chinese: "zh-CN-XiaoxiaoNeural",
  Japanese: "ja-JP-NanomiNeural",
  Korean: "ko-KR-SunHiNeural",
  Arabic: "ar-SA-ZariyahNeural",
  Hindi: "hi-IN-SwaraNeural",
  Russian: "ru-RU-SvetlanaNeural",
  Dutch: "nl-NL-ColetteNeural",
  Polish: "pl-PL-AgnieszkaNeural",
  Swedish: "sv-SE-SofieNeural",
  Norwegian: "nb-NO-IselinNeural",
  Danish: "da-DK-ChristelNeural",
  Finnish: "fi-FI-NooraNeural",
  Greek: "el-GR-AthinaNeural",
  Turkish: "tr-TR-EmelNeural",
  Vietnamese: "vi-VN-HoaiMyNeural",
  Thai: "th-TH-AcharaNeural",
  Indonesian: "id-ID-GadisNeural",
  Malay: "ms-MY-YasminNeural",
  Czech: "cs-CZ-VlastaNeural",
  Romanian: "ro-RO-AmoraNeural",
  Hungarian: "hu-HU-NoemiNeural",
  Ukrainian: "uk-UA-OksanaNeural",
  Bengali: "bn-IN-TanayaNeural",
  Urdu: "ur-PK-UzmaNeural",
  Swahili: "sw-KE-ZumaNeural",
};

export interface SpeechToTextCallbacks {
  onRecognizing?: (transcript: string) => void;
  onRecognized?: (transcript: string) => void;
  onError?: (error: string) => void;
  onSessionStopped?: () => void;
}

/**
 * Initialize and start speech-to-text recognition
 * @param languageName - Language name (e.g., "French", "English")
 * @param callbacks - Callback functions for recognition events
 * @returns SpeechRecognizer instance
 */
export function speechToText(
  languageName: string,
  callbacks: SpeechToTextCallbacks
): sdk.SpeechRecognizer | null {
  try {
    if (!speechKey || speechKey === "your_azure_speech_key_here") {
      throw new Error("Azure Speech API key is not configured");
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      speechKey,
      speechRegion
    );

    // Get language code
    const languageCode = languageCodeMap[languageName] || "en-US";
    speechConfig.speechRecognitionLanguage = languageCode;

    // Create audio configuration from default microphone
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

    // Create speech recognizer
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    // Handle recognizing (interim results)
    recognizer.recognizing = (_s, e) => {
      console.log("Recognizing:", e.result.text);
      if (callbacks.onRecognizing) {
        callbacks.onRecognizing(e.result.text);
      }
    };

    // Handle recognized (final result)
    recognizer.recognized = (_s, e) => {
      console.log(
        "Recognized - Reason:",
        e.result.reason,
        "Text:",
        e.result.text
      );
      if (
        e.result.reason === sdk.ResultReason.RecognizedSpeech &&
        e.result.text
      ) {
        if (callbacks.onRecognized) {
          callbacks.onRecognized(e.result.text);
        }
      } else if (e.result.reason === sdk.ResultReason.NoMatch) {
        if (callbacks.onError) {
          callbacks.onError("No speech could be recognized. Please try again.");
        }
      }
    };

    // Handle errors
    recognizer.canceled = (_s, e) => {
      console.error("Canceled - Reason:", e.reason, "Error:", e.errorDetails);
      if (callbacks.onError) {
        const errorMessage =
          e.reason === sdk.CancellationReason.Error
            ? `Error: ${e.errorDetails}`
            : "Speech recognition was cancelled.";
        callbacks.onError(errorMessage);
      }
    };

    // Handle session events
    recognizer.sessionStarted = (_s, _e) => {
      console.log("Session started");
    };

    recognizer.sessionStopped = (_s, _e) => {
      console.log("Session stopped");
      if (callbacks.onSessionStopped) {
        callbacks.onSessionStopped();
      }
    };

    // Start continuous recognition
    recognizer.startContinuousRecognitionAsync(
      () => {
        console.log("Speech recognition started successfully");
      },
      (error: string) => {
        console.error("Failed to start continuous recognition:", error);
        if (callbacks.onError) {
          callbacks.onError("Failed to start speech recognition: " + error);
        }
      }
    );

    return recognizer;
  } catch (error: any) {
    if (callbacks.onError) {
      callbacks.onError(
        error.message || "Failed to initialize speech recognition"
      );
    }
    return null;
  }
}

/**
 * Stop speech recognition
 * @param recognizer - The SpeechRecognizer instance
 */
export function stopSpeechToText(recognizer: sdk.SpeechRecognizer): void {
  if (recognizer) {
    recognizer.stopContinuousRecognitionAsync(
      () => {
        console.log("Speech recognition stopped");
      },
      (error: string) => {
        console.error("Failed to stop recognition:", error);
      }
    );
  }
}

export interface TextToSpeechCallbacks {
  onError?: (error: string) => void;
  onStarted?: () => void;
  onCompleted?: () => void;
}

// Store for the current audio playback so it can be stopped
let currentAudioContext: AudioContext | null = null;
let currentAudioSource: AudioBufferSourceNode | null = null;

/**
 * Initialize and perform text-to-speech
 * @param text - Text to be spoken
 * @param languageName - Language name (e.g., "French", "English")
 * @param callbacks - Callback functions for synthesis events
 * @returns Object with stop method to cancel playback
 */
export function textToSpeech(
  text: string,
  languageName: string,
  callbacks?: TextToSpeechCallbacks
): { stop: () => void } | null {
  try {
    if (!speechKey || speechKey === "your_azure_speech_key_here") {
      throw new Error("Azure Speech API key is not configured");
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      speechKey,
      speechRegion
    );

    // Get voice name
    const voiceName =
      voiceNameMap[languageName] ||
      voiceNameMap["English"] ||
      "en-US-JennyNeural";
    speechConfig.speechSynthesisVoiceName = voiceName;

    // Use null audio config to get raw audio data instead of playing directly
    const audioConfig = sdk.AudioConfig.fromStreamOutput(
      sdk.AudioOutputStream.createPullStream()
    );
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    // Notify when synthesis starts
    synthesizer.synthesisStarted = () => {
      if (callbacks?.onStarted) callbacks.onStarted();
    };

    synthesizer.speakTextAsync(
      text,
      async (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          try {
            // Get the audio data
            const audioData = result.audioData;

            // Create audio context and play the audio
            currentAudioContext = new AudioContext();
            const audioBuffer = await currentAudioContext.decodeAudioData(
              audioData.slice(0)
            );

            currentAudioSource = currentAudioContext.createBufferSource();
            currentAudioSource.buffer = audioBuffer;
            currentAudioSource.connect(currentAudioContext.destination);

            // Set up completion callback
            currentAudioSource.onended = () => {
              if (callbacks?.onCompleted) callbacks.onCompleted();
              currentAudioSource = null;
              if (currentAudioContext) {
                currentAudioContext.close();
                currentAudioContext = null;
              }
            };

            // Start playback
            currentAudioSource.start(0);
          } catch (playError) {
            console.error("Audio playback error:", playError);
            if (callbacks?.onError) callbacks.onError("Failed to play audio");
          }
        } else if (result.reason === sdk.ResultReason.Canceled) {
          const cancellation = sdk.CancellationDetails.fromResult(result);
          const error = `Speech synthesis cancelled: ${cancellation.errorDetails}`;
          if (callbacks?.onError) callbacks.onError(error);
        }
        synthesizer.close();
      },
      (error) => {
        const errorMessage =
          error || "Failed to perform text-to-speech synthesis";
        if (callbacks?.onError) callbacks.onError(errorMessage);
        synthesizer.close();
      }
    );

    // Return an object with a stop method
    return {
      stop: () => {
        stopTextToSpeech();
      },
    };
  } catch (error: any) {
    const errorMessage =
      error.message || "Failed to perform text-to-speech synthesis";
    if (callbacks?.onError) callbacks.onError(errorMessage);
    return null;
  }
}

/**
 * Stop text-to-speech playback
 */
export function stopTextToSpeech(): void {
  try {
    if (currentAudioSource) {
      currentAudioSource.stop();
      currentAudioSource.disconnect();
      currentAudioSource = null;
    }
    if (currentAudioContext) {
      currentAudioContext.close();
      currentAudioContext = null;
    }
  } catch (error) {
    console.error("Failed to stop speech synthesis:", error);
  }
}
