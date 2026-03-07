<script setup lang="ts">
import { toast } from "../stores/toast";

const getToastClasses = (type: string) => {
  const baseClasses =
    "relative px-4 py-4 pr-12 rounded-xl shadow-2xl flex items-start gap-3 min-w-[320px] max-w-[420px] animate-slide-in backdrop-blur-sm border";

  const typeClasses = {
    success:
      "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/30 border-green-200 dark:border-green-700/50",
    error:
      "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-800/30 border-red-200 dark:border-red-700/50",
    warning:
      "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/30 border-amber-200 dark:border-amber-700/50",
    info: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/30 border-blue-200 dark:border-blue-700/50",
  };

  return `${baseClasses} ${
    typeClasses[type as keyof typeof typeClasses] || typeClasses.info
  }`;
};

const getIconBgClasses = (type: string) => {
  const classes = {
    success: "bg-green-500 dark:bg-green-600",
    error: "bg-red-500 dark:bg-red-600",
    warning: "bg-amber-500 dark:bg-amber-600",
    info: "bg-blue-500 dark:bg-blue-600",
  };
  return classes[type as keyof typeof classes] || classes.info;
};

const getTextClasses = (type: string) => {
  const classes = {
    success: "text-green-800 dark:text-green-100",
    error: "text-red-800 dark:text-red-100",
    warning: "text-amber-800 dark:text-amber-100",
    info: "text-blue-800 dark:text-blue-100",
  };
  return classes[type as keyof typeof classes] || classes.info;
};

const getCloseButtonClasses = (type: string) => {
  const classes = {
    success:
      "text-green-400 hover:text-green-600 dark:text-green-500 dark:hover:text-green-300 hover:bg-green-200/50 dark:hover:bg-green-800/50",
    error:
      "text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300 hover:bg-red-200/50 dark:hover:bg-red-800/50",
    warning:
      "text-amber-400 hover:text-amber-600 dark:text-amber-500 dark:hover:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-800/50",
    info: "text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300 hover:bg-blue-200/50 dark:hover:bg-blue-800/50",
  };
  return classes[type as keyof typeof classes] || classes.info;
};
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
    <transition-group name="toast">
      <div
        v-for="t in toast.toasts"
        :key="t.id"
        :class="getToastClasses(t.type)"
      >
        <!-- Icon -->
        <div
          :class="[
            'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md',
            getIconBgClasses(t.type),
          ]"
        >
          <!-- Success Icon -->
          <svg
            v-if="t.type === 'success'"
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <!-- Error Icon -->
          <svg
            v-else-if="t.type === 'error'"
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <!-- Warning Icon -->
          <svg
            v-else-if="t.type === 'warning'"
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <!-- Info Icon -->
          <svg
            v-else
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <!-- Message -->
        <div class="flex-1 pt-1">
          <p
            :class="[
              'text-sm font-semibold leading-tight',
              getTextClasses(t.type),
            ]"
          >
            {{ t.type.charAt(0).toUpperCase() + t.type.slice(1) }}
          </p>
          <p
            :class="[
              'text-sm mt-0.5 leading-snug opacity-90',
              getTextClasses(t.type),
            ]"
          >
            {{ t.message }}
          </p>
        </div>

        <!-- Close Button -->
        <button
          @click="toast.remove(t.id)"
          :class="[
            'absolute top-2 right-2 p-1.5 rounded-lg transition-all duration-200 cursor-pointer',
            getCloseButtonClasses(t.type),
          ]"
          aria-label="Close notification"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Progress bar -->
        <div
          class="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden bg-black/5 dark:bg-white/5"
        >
          <div
            :class="[
              'h-full animate-progress',
              t.type === 'success'
                ? 'bg-green-500'
                : t.type === 'error'
                ? 'bg-red-500'
                : t.type === 'warning'
                ? 'bg-amber-500'
                : 'bg-blue-500',
            ]"
            :style="{ animationDuration: (t.duration || 8000) + 'ms' }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-slide-in {
  animation: slide-in 0.4s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.animate-progress {
  animation: progress 8s linear forwards;
}

/* Vue transition classes */
.toast-enter-active {
  animation: slide-in 0.4s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.toast-leave-to {
  transform: translateX(100%) scale(0.95);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
