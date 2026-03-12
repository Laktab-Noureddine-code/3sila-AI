<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../services/api";
import { toast } from "../stores/toast";
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const email = ref("");
const code = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);

onMounted(() => {
  email.value = (route.query.email as string) || "";
  if (!email.value) {
    router.push("/forgot-password");
  }
});

const handleResetPassword = async () => {
  if (!code.value || !newPassword.value || !confirmPassword.value) {
    toast.warning(t.value.auth.emailPlaceholder);
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    toast.error(t.value.auth.passwordsDoNotMatch);
    return;
  }
  isLoading.value = true;
  try {
    await api.resetPasswordWithCode(email.value, code.value, newPassword.value);
    toast.success(t.value.auth.passwordResetSuccess);
    router.push("/login");
  } catch (error: any) {
    console.error("Reset password error", error);
    toast.error(error.response?.data?.detail || "Failed to reset password");
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
          {{ t.auth.resetPasswordTitle }}
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {{ t.auth.resetPasswordDescription }}
        </p>
      </div>

      <form class="mt-8 space-y-5" @submit.prevent="handleResetPassword">
        <!-- Email (read-only) -->
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
            readonly
            class="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg bg-gray-50 sm:text-sm opacity-70"
          />
        </div>

        <!-- Verification Code -->
        <div>
          <label
            for="code"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {{ t.auth.verificationCode }}
          </label>
          <input
            id="code"
            v-model="code"
            type="text"
            maxlength="6"
            :placeholder="t.auth.codePlaceholder"
            class="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-shadow sm:text-sm text-center text-2xl tracking-[0.5em] font-mono"
          />
        </div>

        <!-- New Password -->
        <div>
          <label
            for="newPassword"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {{ t.auth.newPassword }}
          </label>
          <input
            id="newPassword"
            v-model="newPassword"
            type="password"
            :placeholder="t.auth.newPasswordPlaceholder"
            class="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-shadow sm:text-sm"
          />
        </div>

        <!-- Confirm Password -->
        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {{ t.auth.confirmNewPassword }}
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            :placeholder="t.auth.confirmNewPasswordPlaceholder"
            class="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-shadow sm:text-sm"
          />
        </div>

        <div class="space-y-4 pt-2">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-black bg-[#67e8f9] hover:bg-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            {{ isLoading ? t.auth.resetting : t.auth.resetPassword }}
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
