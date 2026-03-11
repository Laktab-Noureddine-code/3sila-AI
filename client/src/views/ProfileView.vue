<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { auth } from "../stores/auth";
import { toast } from "../stores/toast";
import { useI18n } from "../composables/useI18n";
import { User, Lock, Mail } from "lucide-vue-next";

const { t } = useI18n();
const router = useRouter();

// --- Email Update ---
const newEmail = ref("");
const isUpdatingProfile = ref(false);

const handleUpdateEmail = async () => {
  if (!newEmail.value) return;
  isUpdatingProfile.value = true;
  try {
    const response = await api.updateProfile({ email: newEmail.value });
    auth.setUser(response.data);
    newEmail.value = "";
    toast.success(t.value.auth.profileUpdated);
  } catch (error: any) {
    console.error("Update profile error", error);
    toast.error(error.response?.data?.detail || "Failed to update profile");
  } finally {
    isUpdatingProfile.value = false;
  }
};

// --- Change Password ---
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isChangingPassword = ref(false);

const handleChangePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value)
    return;
  if (newPassword.value !== confirmPassword.value) {
    toast.error(t.value.auth.passwordsDoNotMatch);
    return;
  }
  isChangingPassword.value = true;
  try {
    await api.changePassword(oldPassword.value, newPassword.value);
    oldPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    toast.success(t.value.auth.passwordChanged);
  } catch (error: any) {
    console.error("Change password error", error);
    toast.error(error.response?.data?.detail || "Failed to change password");
  } finally {
    isChangingPassword.value = false;
  }
};

onMounted(() => {
  if (!auth.isAuthenticated()) {
    router.push("/login");
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff09_1px,transparent_1px),linear-gradient(to_bottom,#ffffff09_1px,transparent_1px)] bg-[size:24px_24px]"
  >
    <!-- Header Section -->
    <div class="text-center pt-12 pb-8 px-4">
      <h1
        class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight"
      >
        <span class="inline-flex items-center gap-3">
          <User class="w-10 h-10 text-cyan-500" />
          {{ t.auth.profile }}
        </span>
      </h1>
      <p class="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
        {{ t.auth.profileDescription }}
      </p>
    </div>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-4 pb-20 space-y-8">
      <!-- Update Email Section -->
      <div
        class="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#252525]"
        >
          <div class="flex items-center gap-2">
            <Mail class="w-5 h-5 text-cyan-500" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t.auth.updateEmail }}
            </h2>
          </div>
        </div>
        <form class="p-6 space-y-4" @submit.prevent="handleUpdateEmail">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {{ t.auth.currentEmail }}
            </label>
            <div
              class="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400"
            >
              {{ auth.user?.email || "" }}
            </div>
          </div>
          <div>
            <label
              for="newEmail"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {{ t.auth.newEmail }}
            </label>
            <input
              id="newEmail"
              v-model="newEmail"
              type="email"
              :placeholder="t.auth.newEmailPlaceholder"
              class="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-shadow sm:text-sm"
            />
          </div>
          <button
            type="submit"
            :disabled="isUpdatingProfile || !newEmail"
            class="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-black bg-[#67e8f9] hover:bg-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            {{ isUpdatingProfile ? t.auth.updatingProfile : t.common.save }}
          </button>
        </form>
      </div>

      <!-- Change Password Section -->
      <div
        class="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#252525]"
        >
          <div class="flex items-center gap-2">
            <Lock class="w-5 h-5 text-cyan-500" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t.auth.changePassword }}
            </h2>
          </div>
        </div>
        <form class="p-6 space-y-4" @submit.prevent="handleChangePassword">
          <div>
            <label
              for="oldPassword"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {{ t.auth.oldPassword }}
            </label>
            <input
              id="oldPassword"
              v-model="oldPassword"
              type="password"
              :placeholder="t.auth.oldPasswordPlaceholder"
              class="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-shadow sm:text-sm"
            />
          </div>
          <div>
            <label
              for="changeNewPassword"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {{ t.auth.newPassword }}
            </label>
            <input
              id="changeNewPassword"
              v-model="newPassword"
              type="password"
              :placeholder="t.auth.newPasswordPlaceholder"
              class="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-shadow sm:text-sm"
            />
          </div>
          <div>
            <label
              for="changeConfirmPassword"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {{ t.auth.confirmNewPassword }}
            </label>
            <input
              id="changeConfirmPassword"
              v-model="confirmPassword"
              type="password"
              :placeholder="t.auth.confirmNewPasswordPlaceholder"
              class="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-shadow sm:text-sm"
            />
          </div>
          <button
            type="submit"
            :disabled="
              isChangingPassword ||
              !oldPassword ||
              !newPassword ||
              !confirmPassword
            "
            class="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-black bg-[#67e8f9] hover:bg-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            {{
              isChangingPassword
                ? t.auth.changingPassword
                : t.auth.changePassword
            }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
