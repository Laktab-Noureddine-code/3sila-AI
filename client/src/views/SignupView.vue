<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { toast } from "../stores/toast";
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();

const router = useRouter();

// State
const name = ref("");
const email = ref("");
const password = ref("");

const handleSignup = async () => {
  if (!email.value || !password.value || !name.value) {
    toast.warning("Please fill in all fields.");
    return;
  }

  try {
    console.log("Signing up with:", { name: name.value, email: email.value });
    const response = await api.register({
      name: name.value,
      email: email.value,
      hashed_password: password.value,
    });
    console.log("Signup response:", response);
    router.push("/login");
  } catch (error: any) {
    console.error("Signup error", error);
    toast.error(error.response?.data?.message || "Signup failed");
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
          {{ t.auth.createAccount }}
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ t.auth.startHumanizing }}
        </p>
      </div>

      <form class="mt-8 space-y-5" @submit.prevent="handleSignup">
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {{ t.auth.name }}
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            :placeholder="t.auth.namePlaceholder"
            required
            class="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-shadow sm:text-sm"
          />
        </div>

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
            required
            class="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-shadow sm:text-sm"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {{ t.auth.password }}
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            :placeholder="t.auth.createPassword"
            required
            class="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-shadow sm:text-sm"
          />
        </div>

        <div class="space-y-4 pt-2">
          <button
            type="submit"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-black bg-[#67e8f9] hover:bg-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 transition-colors cursor-pointer"
          >
            {{ t.auth.signupButton }}
          </button>

          <!-- <button 
            type="button"
            @click="handleGoogleAuth"
            class="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors cursor-pointer"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
              <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
              <path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC05"/>
              <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.0344664 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button> -->
        </div>
      </form>

      <div class="text-center mt-6">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t.auth.haveAccount }}
          <RouterLink
            to="/login"
            class="font-medium text-gray-900 dark:text-white hover:underline ml-1"
          >
            {{ t.auth.login }}
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
