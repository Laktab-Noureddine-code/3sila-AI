<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { confirm } from "../stores/confirm";

// Check if on mobile
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// Swipe to dismiss on mobile
const sheetRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const dragY = ref(0);
const startY = ref(0);

const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0];
  if (!touch) return;
  isDragging.value = true;
  startY.value = touch.clientY;
  dragY.value = 0;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  const touch = e.touches[0];
  if (!touch) return;
  const deltaY = touch.clientY - startY.value;
  if (deltaY > 0) {
    dragY.value = deltaY;
  }
};

const handleTouchEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  if (dragY.value > 100) {
    handleCancel();
  }
  dragY.value = 0;
};

const backdropOpacity = computed(() => {
  if (isDragging.value && dragY.value > 0) {
    return Math.max(0.2, 1 - dragY.value / 300);
  }
  return 1;
});

const getConfirmButtonClasses = () => {
  const baseClasses =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer";

  const typeClasses = {
    danger: "bg-red-500 text-white hover:bg-red-600",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    info: "bg-cyan-500 text-white hover:bg-cyan-600",
  };

  return `${baseClasses} ${typeClasses[confirm.type]}`;
};

const getIcon = () => {
  const icons = {
    danger: "🗑️",
    warning: "⚠️",
    info: "ℹ️",
  };
  return icons[confirm.type];
};

const handleConfirm = () => {
  confirm.close(true);
};

const handleCancel = () => {
  confirm.close(false);
};

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    handleCancel();
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="confirm.isOpen"
        class="fixed inset-0 z-50"
        :class="{ 'flex items-center justify-center p-4': !isMobile }"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          :class="{ 'transition-opacity duration-300': !isDragging }"
          :style="{ opacity: backdropOpacity }"
        ></div>

        <!-- Mobile Bottom Sheet -->
        <Transition name="slide-up">
          <div
            v-if="isMobile && confirm.isOpen"
            ref="sheetRef"
            class="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1e1e1e] rounded-t-3xl shadow-2xl"
            :class="{
              'transition-transform duration-300 ease-out': !isDragging,
            }"
            :style="{
              transform:
                isDragging && dragY > 0
                  ? `translateY(${dragY}px)`
                  : 'translateY(0)',
            }"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            @click.stop
          >
            <!-- Drag Handle -->
            <div class="flex justify-center pt-3 pb-2">
              <div
                class="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600"
              ></div>
            </div>

            <div class="p-6 pt-2">
              <!-- Icon -->
              <div class="flex justify-center mb-4">
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  :class="{
                    'bg-red-100 dark:bg-red-900/30': confirm.type === 'danger',
                    'bg-yellow-100 dark:bg-yellow-900/30':
                      confirm.type === 'warning',
                    'bg-cyan-100 dark:bg-cyan-900/30': confirm.type === 'info',
                  }"
                >
                  {{ getIcon() }}
                </div>
              </div>

              <!-- Title -->
              <h3
                class="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2"
              >
                {{ confirm.title }}
              </h3>

              <!-- Message -->
              <p class="text-center text-gray-600 dark:text-gray-400 mb-6">
                {{ confirm.message }}
              </p>

              <!-- Actions -->
              <div class="flex flex-col gap-3">
                <button
                  @click="handleConfirm"
                  :class="getConfirmButtonClasses()"
                  class="w-full py-3"
                >
                  {{ confirm.confirmText }}
                </button>
                <button
                  @click="handleCancel"
                  class="w-full px-4 py-3 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  {{ confirm.cancelText }}
                </button>
              </div>
            </div>

            <!-- Safe area padding for iOS -->
            <div class="pb-safe"></div>
          </div>
        </Transition>

        <!-- Desktop Dialog -->
        <Transition name="scale">
          <div
            v-if="!isMobile && confirm.isOpen"
            class="relative bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
            @click.stop
          >
            <!-- Icon -->
            <div class="flex justify-center mb-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                :class="{
                  'bg-red-100 dark:bg-red-900/30': confirm.type === 'danger',
                  'bg-yellow-100 dark:bg-yellow-900/30':
                    confirm.type === 'warning',
                  'bg-cyan-100 dark:bg-cyan-900/30': confirm.type === 'info',
                }"
              >
                {{ getIcon() }}
              </div>
            </div>

            <!-- Title -->
            <h3
              class="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2"
            >
              {{ confirm.title }}
            </h3>

            <!-- Message -->
            <p class="text-center text-gray-600 dark:text-gray-400 mb-6">
              {{ confirm.message }}
            </p>

            <!-- Actions -->
            <div class="flex gap-3 justify-center">
              <button
                @click="handleCancel"
                class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                {{ confirm.cancelText }}
              </button>
              <button @click="handleConfirm" :class="getConfirmButtonClasses()">
                {{ confirm.confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* Safe area padding for iOS */
.pb-safe {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
</style>
