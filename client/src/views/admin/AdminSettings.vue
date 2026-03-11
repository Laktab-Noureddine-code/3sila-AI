<script setup lang="ts">
import { ref } from "vue";
import api from "../../services/api";
import { useI18n } from "../../composables/useI18n";
import { toast } from "../../stores/toast";
import { confirm } from "../../stores/confirm";
import { KeyRound, EyeOff, Eye, Info } from "lucide-vue-next";

const { t } = useI18n();

const geminiKey = ref("");
const saving = ref(false);
const showKey = ref(false);

const saveGeminiKey = async () => {
  if (!geminiKey.value.trim()) return;
  const confirmed = await confirm.show({
    title: t.value.admin.apiKeyConfig,
    message: t.value.admin.confirmApiKeyChange,
    confirmText: t.value.common.confirm,
    type: "warning",
  });
  if (!confirmed) return;
  saving.value = true;
  try {
    await api.updateAdminConfig(
      "gemini_api_key",
      geminiKey.value.trim(),
      "Gemini API Key for AI translation and summarization",
    );
    toast.success(t.value.admin.configSaved);
    geminiKey.value = "";
    showKey.value = false;
  } catch {
    toast.error(t.value.admin.configError);
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <!-- API Key Config Card -->
    <div
      class="rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center"
          >
            <KeyRound class="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              {{ t.admin.apiKeyConfig }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t.admin.apiKeyDescription }}
            </p>
          </div>
        </div>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {{ t.admin.geminiApiKey }}
          </label>
          <div class="relative">
            <input
              v-model="geminiKey"
              :type="showKey ? 'text' : 'password'"
              :placeholder="t.admin.apiKeyPlaceholder"
              class="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
            />
            <button
              type="button"
              @click="showKey = !showKey"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
            >
              <EyeOff v-if="showKey" class="w-5 h-5" />
              <Eye v-else class="w-5 h-5" />
            </button>
          </div>
          <p class="mt-2 text-xs text-gray-400">
            {{ t.admin.apiKeyDescription }}
          </p>
        </div>
        <button
          @click="saveGeminiKey"
          :disabled="saving || !geminiKey.trim()"
          class="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-400 hover:to-cyan-500 shadow-lg shadow-cyan-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ saving ? t.admin.saving : t.admin.saveConfig }}
        </button>
      </div>
    </div>

    <!-- Info card -->
    <div
      class="rounded-2xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-200 dark:border-cyan-800/30 p-5"
    >
      <div class="flex gap-3">
        <Info
          class="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5"
        />
        <div class="text-sm text-cyan-800 dark:text-cyan-300">
          <p class="font-medium mb-1">Secure Storage</p>
          <p class="text-cyan-700 dark:text-cyan-400">
            API keys are encrypted using Fernet symmetric encryption before
            being stored in the database. They are decrypted only when needed by
            the AI service.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
