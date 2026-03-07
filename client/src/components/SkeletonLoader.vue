<template>
  <div class="skeleton-container">
    <!-- Text skeleton - multiple lines -->
    <template v-if="type === 'text'">
      <div class="space-y-3">
        <div
          v-for="(_, index) in lines"
          :key="index"
          class="skeleton-line"
          :style="{ width: getLineWidth(index) }"
        ></div>
      </div>
    </template>

    <!-- Card skeleton for history/favorites items -->
    <template v-else-if="type === 'card'">
      <div
        v-for="n in count"
        :key="n"
        class="skeleton-card bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-3"
      >
        <div class="flex items-start gap-4">
          <!-- Checkbox placeholder -->
          <div class="skeleton-box w-5 h-5 rounded"></div>

          <div class="flex-1 space-y-3">
            <!-- Header row -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="skeleton-box w-20 h-5 rounded-full"></div>
                <div class="skeleton-box w-16 h-4 rounded"></div>
              </div>
              <div class="skeleton-box w-24 h-4 rounded"></div>
            </div>

            <!-- Content lines -->
            <div class="space-y-2">
              <div class="skeleton-line w-full"></div>
              <div class="skeleton-line w-4/5"></div>
              <div class="skeleton-line w-3/5"></div>
            </div>

            <!-- Footer row -->
            <div class="flex items-center gap-3 pt-2">
              <div class="skeleton-box w-16 h-8 rounded-lg"></div>
              <div class="skeleton-box w-20 h-8 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Result panel skeleton -->
    <template v-else-if="type === 'result'">
      <div class="space-y-4 animate-pulse">
        <div class="space-y-3">
          <div class="skeleton-line w-full h-4"></div>
          <div class="skeleton-line w-11/12 h-4"></div>
          <div class="skeleton-line w-4/5 h-4"></div>
          <div class="skeleton-line w-full h-4"></div>
          <div class="skeleton-line w-3/4 h-4"></div>
        </div>
        <div class="pt-4 space-y-3">
          <div class="skeleton-line w-5/6 h-4"></div>
          <div class="skeleton-line w-full h-4"></div>
          <div class="skeleton-line w-2/3 h-4"></div>
        </div>
      </div>
    </template>

    <!-- Simple inline skeleton -->
    <template v-else-if="type === 'inline'">
      <div class="skeleton-line inline-block" :style="{ width, height }"></div>
    </template>

    <!-- Default single box -->
    <template v-else>
      <div class="skeleton-box" :style="{ width, height }"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: "text" | "card" | "result" | "inline" | "box";
    lines?: number;
    count?: number;
    width?: string;
    height?: string;
  }>(),
  {
    type: "box",
    lines: 4,
    count: 3,
    width: "100%",
    height: "1rem",
  }
);

// Generate varying line widths for more natural look
const getLineWidth = (index: number): string => {
  const widths = ["100%", "95%", "85%", "90%", "70%", "80%", "75%", "88%"];
  return widths[index % widths.length] as string;
};
</script>

<style scoped>
.skeleton-line {
  height: 0.875rem;
  border-radius: 0.375rem;
  background: linear-gradient(
    90deg,
    rgba(156, 163, 175, 0.15) 0%,
    rgba(156, 163, 175, 0.25) 50%,
    rgba(156, 163, 175, 0.15) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-box {
  border-radius: 0.375rem;
  background: linear-gradient(
    90deg,
    rgba(156, 163, 175, 0.15) 0%,
    rgba(156, 163, 175, 0.25) 50%,
    rgba(156, 163, 175, 0.15) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-card {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Dark mode adjustments */
:root.dark .skeleton-line,
.dark .skeleton-line {
  background: linear-gradient(
    90deg,
    rgba(75, 85, 99, 0.3) 0%,
    rgba(75, 85, 99, 0.5) 50%,
    rgba(75, 85, 99, 0.3) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

:root.dark .skeleton-box,
.dark .skeleton-box {
  background: linear-gradient(
    90deg,
    rgba(75, 85, 99, 0.3) 0%,
    rgba(75, 85, 99, 0.5) 50%,
    rgba(75, 85, 99, 0.3) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
</style>
