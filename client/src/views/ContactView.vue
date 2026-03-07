<script setup lang="ts">
import { ref, reactive } from "vue";
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();

// Form data
const formData = reactive({
  name: "",
  email: "",
  message: "",
  botcheck: false,
});

// UI state
const isSubmitting = ref(false);
const resultMessage = ref("");
const isSuccess = ref(false);

// Handle form submission
const handleSubmit = async () => {
  isSubmitting.value = true;
  resultMessage.value = "";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: import.meta.env.VITE_WEB3FORMS_KEY,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        botcheck: formData.botcheck,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      isSuccess.value = true;
      resultMessage.value =
        t.value.contact?.successMessage ||
        "Message sent successfully! We'll get back to you soon.";
      // Clear form
      formData.name = "";
      formData.email = "";
      formData.message = "";
    } else {
      isSuccess.value = false;
      resultMessage.value =
        data.message ||
        t.value.contact?.errorMessage ||
        "Something went wrong. Please try again.";
    }
  } catch (error) {
    isSuccess.value = false;
    resultMessage.value =
      t.value.contact?.errorMessage ||
      "Something went wrong. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <main
    class="min-h-screen bg-gray-50 dark:bg-[#121212] bg-[radial-gradient(circle_at_1px_1px,rgb(209_213_219/0.5)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgb(55_65_81/0.4)_1px,transparent_0)] bg-[length:24px_24px] py-12 px-4"
  >
    <div class="max-w-lg mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1
          class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3"
        >
          {{ t.contact?.title || "Contact Us" }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{
            t.contact?.subtitle ||
            "Have a question or feedback? We'd love to hear from you."
          }}
        </p>
      </div>

      <!-- Contact Card -->
      <div
        class="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 md:p-8"
      >
        <!-- Result Message -->
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="resultMessage"
            class="mb-6 p-4 rounded-xl text-sm font-medium"
            :class="
              isSuccess
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            "
          >
            <div class="flex items-center gap-2">
              <svg
                v-if="isSuccess"
                class="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{{ resultMessage }}</span>
            </div>
          </div>
        </Transition>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Name Field -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ t.contact?.nameLabel || "Name" }}
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
              :placeholder="t.contact?.namePlaceholder || 'Your name'"
            />
          </div>

          <!-- Email Field -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ t.contact?.emailLabel || "Email" }}
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
              :placeholder="
                t.contact?.emailPlaceholder || 'your.email@example.com'
              "
            />
          </div>

          <!-- Message Field -->
          <div>
            <label
              for="message"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ t.contact?.messageLabel || "Message" }}
            </label>
            <textarea
              id="message"
              v-model="formData.message"
              required
              rows="5"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 resize-none"
              :placeholder="
                t.contact?.messagePlaceholder || 'How can we help you?'
              "
            ></textarea>
          </div>

          <!-- Honeypot field for spam protection (hidden) -->
          <input
            type="checkbox"
            name="botcheck"
            v-model="formData.botcheck"
            class="hidden"
            style="display: none"
            tabindex="-1"
            autocomplete="off"
          />

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 dark:focus:ring-offset-[#1a1a1a] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{
              isSubmitting
                ? t.contact?.sending || "Sending..."
                : t.contact?.sendButton || "Send Message"
            }}</span>
          </button>
        </form>
      </div>

      <!-- Additional Info -->
      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        {{
          t.contact?.responseTime || "We typically respond within 24-48 hours."
        }}
      </p>
    </div>
  </main>
</template>
