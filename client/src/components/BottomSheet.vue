<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    subtitle?: string;
    snapPoints?: number[];
    initialSnap?: number;
    showHandle?: boolean;
    closeOnBackdrop?: boolean;
    closeOnSwipeDown?: boolean;
  }>(),
  {
    title: "",
    subtitle: "",
    snapPoints: () => [0.5, 0.9],
    initialSnap: 0,
    showHandle: true,
    closeOnBackdrop: true,
    closeOnSwipeDown: true,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
}>();

const sheetRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const startY = ref(0);
const currentY = ref(0);
const sheetHeight = ref(0);
const currentSnapIndex = ref(props.initialSnap);

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

const close = () => {
  emit("update:modelValue", false);
  emit("close");
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close();
  }
};

// Touch handling for swipe-to-dismiss
const handleTouchStart = (e: TouchEvent) => {
  if (!props.closeOnSwipeDown) return;
  const touch = e.touches[0];
  if (!touch) return;
  isDragging.value = true;
  startY.value = touch.clientY;
  currentY.value = 0;
  if (sheetRef.value) {
    sheetHeight.value = sheetRef.value.offsetHeight;
  }
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  const touch = e.touches[0];
  if (!touch) return;
  const deltaY = touch.clientY - startY.value;
  // Only allow dragging down (positive delta)
  if (deltaY > 0) {
    currentY.value = deltaY;
  }
};

const handleTouchEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;

  // If dragged more than 100px down, close the sheet
  if (currentY.value > 100) {
    close();
  }
  currentY.value = 0;
};

// Lock body scroll when open
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      currentSnapIndex.value = props.initialSnap;
    }
  }
);
</script>

<template>
  <Teleport to="body">
    <Transition name="bottom-sheet">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50"
        :class="{ 'md:flex md:items-center md:justify-center': !isMobile }"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          :class="{ 'transition-opacity duration-300': !isDragging }"
          :style="{
            opacity: isDragging ? Math.max(0.2, 1 - currentY / 300) : 1,
          }"
          @click="handleBackdropClick"
        ></div>

        <!-- Sheet / Modal -->
        <div
          v-if="isMobile"
          ref="sheetRef"
          class="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1e1e1e] rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col"
          :class="{ 'transition-transform duration-300 ease-out': !isDragging }"
          :style="{
            transform: `translateY(${
              isDragging && currentY > 0 ? currentY + 'px' : '0'
            })`,
          }"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <!-- Drag Handle -->
          <div v-if="showHandle" class="flex justify-center pt-3 pb-2">
            <div
              class="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600"
            ></div>
          </div>

          <!-- Header -->
          <div
            v-if="title || subtitle"
            class="px-6 pb-4 border-b border-gray-200 dark:border-gray-700"
          >
            <h3
              v-if="title"
              class="text-lg font-semibold text-gray-900 dark:text-white"
            >
              {{ title }}
            </h3>
            <p
              v-if="subtitle"
              class="text-sm text-gray-500 dark:text-gray-400 mt-1"
            >
              {{ subtitle }}
            </p>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto overscroll-contain">
            <slot></slot>
          </div>

          <!-- Footer slot -->
          <div
            v-if="$slots.footer"
            class="border-t border-gray-200 dark:border-gray-700 p-4 pb-safe"
          >
            <slot name="footer"></slot>
          </div>
        </div>

        <!-- Desktop Modal fallback -->
        <Transition name="scale" appear>
          <div
            v-if="!isMobile && modelValue"
            class="relative bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[85vh] flex flex-col border border-gray-200 dark:border-gray-700"
          >
            <!-- Header -->
            <div
              v-if="title || subtitle"
              class="px-6 py-4 border-b border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3
                    v-if="title"
                    class="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    {{ title }}
                  </h3>
                  <p
                    v-if="subtitle"
                    class="text-sm text-gray-500 dark:text-gray-400 mt-1"
                  >
                    {{ subtitle }}
                  </p>
                </div>
                <button
                  @click="close"
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 cursor-pointer -mt-1 -mr-2"
                  aria-label="Close"
                >
                  <svg
                    class="w-5 h-5"
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
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto">
              <slot></slot>
            </div>

            <!-- Footer slot -->
            <div
              v-if="$slots.footer"
              class="border-t border-gray-200 dark:border-gray-700 p-4"
            >
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Bottom sheet transitions */
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  transition: opacity 0.3s ease;
}

.bottom-sheet-enter-active > div:last-child,
.bottom-sheet-leave-active > div:last-child {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  opacity: 0;
}

.bottom-sheet-enter-from > div:last-child,
.bottom-sheet-leave-to > div:last-child {
  transform: translateY(100%);
}

/* Scale transition for desktop modal */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Safe area padding for iOS */
.pb-safe {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
</style>
