<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { toast } from "../stores/toast";
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();
const router = useRouter();

const email = ref("");
const isLoading = ref(false);

const handleSendCode = async () => {
  if (!email.value) {
    toast.warning(t.value.auth.emailPlaceholder);
    return;
  }
  isLoading.value = true;
  try {
    await api.sendResetCode(email.value);
    toast.success(t.value.auth.codeSent);
    router.push({ path: "/reset-password", query: { email: email.value } });
  } catch (error: any) {
    console.error("Send reset code error", error);
    // Still show success for security (backend doesn't reveal if email exists)
    toast.success(t.value.auth.codeSent);
    router.push({ path: "/reset-password", query: { email: email.value } });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff09_1px,transparent_1px),linear-gradient(to_bottom,#ffffff09_1px,transparent_1px)] bg-[size:24px_24px] px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-[400px] w-full space-y-8 bg-white dark:bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800"
    >
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ t.auth.forgotPasswordTitle }}
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {{ t.auth.forgotPasswordDescription }}
        </p>
      </div>

      <form class="mt-8 space-y-5" @submit.prevent="handleSendCode">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {{ t.auth.email }}
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            :placeholder="t.auth.emailPlaceholder"
            class="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-shadow sm:text-sm"
          />
        </div>

        <div class="space-y-4 pt-2">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-black bg-[#67e8f9] hover:bg-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            {{ isLoading ? t.auth.sendingCode : t.auth.sendResetCode }}
          </button>
        </div>
      </form>

      <div class="text-center mt-6">
        <button
          @click="router.push('/login')"
          class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline cursor-pointer"
        >
          {{ t.auth.backToLogin }}
        </button>
      </div>
    </div>
  </div>
</template>
