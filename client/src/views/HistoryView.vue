<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { auth } from "../stores/auth";
import { toast } from "../stores/toast";
import { confirm } from "../stores/confirm";
import { favorites } from "../stores/favorites";
import SkeletonLoader from "../components/SkeletonLoader.vue";
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();

const router = useRouter();

// --- State ---
const activeTab = ref<"all" | "summaries" | "translations">("all");
const history = ref<any[]>([]);
const isLoading = ref(false);
const currentPage = ref(1);
const perPage = ref(20);
const totalPages = ref(1);
const totalItems = ref(0);
const isDark = ref(true);
const selectedItems = ref<Set<string>>(new Set());
const isDeleting = ref(false);
const expandedItems = ref<Set<string>>(new Set());

// --- Computed ---
const displayedHistory = computed(() => {
  if (!history.value) return [];
  return history.value.map((item) => {
    const isTranslation = item.action_type === "translate";
    const isSummary = item.action_type === "summarize";

    return {
      ...item,
      isSelected: selectedItems.value.has(item.id),
      type: isTranslation ? "translation" : isSummary ? "summary" : item.type,
      displayDate: new Date(
        item.created_at || item.timestamp
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      // Map fields based on action_type
      input_text: item.original_text || item.input_text,
      result: isTranslation
        ? item.translated_text
        : isSummary
        ? item.summary_text
        : item.result,
    };
  });
});

const selectedCount = computed(() => selectedItems.value.size);
const allSelected = computed(
  () =>
    displayedHistory.value.length > 0 &&
    displayedHistory.value.length === selectedCount.value
);

// --- Methods ---
const fetchHistory = async () => {
  if (!auth.isAuthenticated()) {
    router.push("/login");
    return;
  }

  isLoading.value = true;
  try {
    let response;

    switch (activeTab.value) {
      case "summaries":
        response = await api.getHistorySummaries(
          currentPage.value,
          perPage.value
        );
        break;
      case "translations":
        response = await api.getHistoryTranslations(
          currentPage.value,
          perPage.value
        );
        break;
      default:
        response = await api.getHistory(currentPage.value, perPage.value);
    }

    // Handle paginated response
    if (response.data.items) {
      history.value = response.data.items;
      totalPages.value = response.data.pages || 1;
      totalItems.value = response.data.total || 0;
    } else if (Array.isArray(response.data)) {
      history.value = response.data;
      totalPages.value = 1;
      totalItems.value = response.data.length;
    } else {
      history.value = response.data.data || [];
      totalPages.value = response.data.pages || 1;
      totalItems.value = response.data.total || 0;
    }

    selectedItems.value.clear();
  } catch (error) {
    console.error("Error fetching history:", error);
    history.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleTabChange = (tab: "all" | "summaries" | "translations") => {
  activeTab.value = tab;
  currentPage.value = 1;
  selectedItems.value.clear();
  fetchHistory();
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value.clear();
  } else {
    displayedHistory.value.forEach((item) => {
      selectedItems.value.add(item.id);
    });
  }
};

const toggleSelect = (itemId: string) => {
  if (selectedItems.value.has(itemId)) {
    selectedItems.value.delete(itemId);
  } else {
    selectedItems.value.add(itemId);
  }
};

const toggleExpand = (itemId: string) => {
  if (expandedItems.value.has(itemId)) {
    expandedItems.value.delete(itemId);
  } else {
    expandedItems.value.add(itemId);
  }
};

const isExpanded = (itemId: string): boolean => {
  return expandedItems.value.has(itemId);
};

const deleteItem = async (itemId: string) => {
  const item = history.value.find((h) => h.id === itemId);
  const isSummary = item?.action_type === "summarize";
  const itemType = isSummary ? "summary" : "translation";

  const confirmed = await confirm.show({
    title: "Delete Item",
    message: `Are you sure you want to delete this ${itemType}? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    type: "danger",
  });

  if (!confirmed) return;

  isDeleting.value = true;
  try {
    if (isSummary) {
      await api.deleteSummary(itemId);
    } else {
      await api.deleteTranslation(itemId);
    }
    await fetchHistory();
  } catch (error) {
    console.error("Error deleting item:", error);
    toast.error("Failed to delete item. Please try again.");
  } finally {
    isDeleting.value = false;
  }
};

const deleteSelected = async () => {
  if (selectedItems.value.size === 0) return;

  const confirmed = await confirm.show({
    title: "Delete Items",
    message: `Are you sure you want to delete ${selectedItems.value.size} item(s)? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    type: "danger",
  });
  if (!confirmed) return;

  isDeleting.value = true;
  const itemsToDelete = Array.from(selectedItems.value);

  try {
    await Promise.all(
      itemsToDelete.map((id) => {
        const item = history.value.find((h) => h.id === id);
        const isSummary = item?.action_type === "summarize";
        return isSummary ? api.deleteSummary(id) : api.deleteTranslation(id);
      })
    );
    selectedItems.value.clear();
    await fetchHistory();
  } catch (error) {
    console.error("Error deleting items:", error);
    toast.error("Failed to delete some items. Please try again.");
  } finally {
    isDeleting.value = false;
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard!");
};

// Check if a history item is favorited
const isItemFavorited = (item: any): boolean => {
  const inputText = item.input_text || item.original_text || "";
  const resultText =
    item.result || item.output_text || item.translated_text || "";
  return favorites.isFavorited(inputText, resultText);
};

// Toggle favorite for a history item
const toggleItemFavorite = (item: any) => {
  const inputText = item.input_text || item.original_text || "";
  const resultText =
    item.result || item.output_text || item.translated_text || "";
  const isSummary = item.action_type === "summarize";

  if (!inputText || !resultText) return;

  const isFav = favorites.toggle({
    type: isSummary ? "summary" : "translation",
    inputText,
    resultText,
    targetLanguage: !isSummary
      ? item.target_language || item.target_lang
      : undefined,
    createdAt: item.created_at || item.timestamp || new Date().toISOString(),
  });

  if (isFav) {
    toast.success("Added to favorites!");
  } else {
    toast.success("Removed from favorites");
  }
};

const useInTranslator = (item: any) => {
  const isSummary = item.action_type === "summarize";
  const inputText = item.input_text || item.original_text || "";
  const resultText =
    item.result ||
    item.output_text ||
    item.translated_text ||
    item.summary_text ||
    "";

  router.push({
    path: "/",
    query: {
      mode: isSummary ? "summarize" : "translate",
      prefill: inputText,
      result: resultText,
      targetLang: !isSummary
        ? item.target_language || item.target_lang
        : undefined,
    },
  });
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchHistory();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchHistory();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
  fetchHistory();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// --- Lifecycle ---
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  isDark.value =
    savedTheme === "dark" ||
    (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (!auth.isAuthenticated()) {
    router.push("/login");
  } else {
    fetchHistory();
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
        {{ t.history.title }}
      </h1>
      <p class="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
        {{ t.history.description }}
      </p>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 pb-20">
      <div
        class="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Tabs & Controls -->
        <div
          class="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#252525]"
        >
          <div class="px-6 py-4">
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <!-- Tab Buttons -->
              <div class="flex gap-2">
                <button
                  @click="handleTabChange('all')"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer',
                    activeTab === 'all'
                      ? 'bg-cyan-400 text-black shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
                  ]"
                >
                  {{ t.history.all }}
                </button>
                <button
                  @click="handleTabChange('summaries')"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer',
                    activeTab === 'summaries'
                      ? 'bg-cyan-400 text-black shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
                  ]"
                >
                  {{ t.history.summaries }}
                </button>
                <button
                  @click="handleTabChange('translations')"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer',
                    activeTab === 'translations'
                      ? 'bg-cyan-400 text-black shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
                  ]"
                >
                  {{ t.history.translations }}
                </button>
              </div>

              <!-- Delete Selected Button -->
              <button
                v-if="selectedCount > 0"
                @click="deleteSelected"
                :disabled="isDeleting"
                class="px-4 py-2 rounded-lg font-medium bg-red-500/20 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 hover:bg-red-500/30 disabled:opacity-50 transition-all duration-200 cursor-pointer"
              >
                {{ t.history.deleteSelected }} ({{ selectedCount }})
              </button>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-6">
          <!-- Loading State with Skeleton -->
          <div v-if="isLoading" class="py-4">
            <SkeletonLoader type="card" :count="3" />
          </div>

          <!-- Empty State -->
          <div v-else-if="history.length === 0" class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              {{ t.history.empty }}
            </h3>
            <p class="mt-1 text-gray-600 dark:text-gray-400">
              {{ t.history.emptyDescription }}
            </p>
          </div>

          <!-- History List -->
          <div v-else class="space-y-3">
            <!-- Select All Checkbox -->
            <div
              v-if="history.length > 0"
              class="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700"
            >
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
                class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-cyan-400 cursor-pointer"
              />
              <span
                class="text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                {{ allSelected ? t.history.deselectAll : t.history.selectAll }}
              </span>
            </div>

            <!-- History Items -->
            <div
              v-for="item in displayedHistory"
              :key="item.id"
              :class="[
                'flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-xl border transition-all duration-200',
                item.isSelected
                  ? 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-300 dark:border-cyan-700'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
              ]"
            >
              <!-- Checkbox -->
              <div class="flex items-start gap-3 sm:w-auto">
                <input
                  type="checkbox"
                  :checked="item.isSelected"
                  @change="toggleSelect(item.id)"
                  class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-cyan-400 cursor-pointer mt-1"
                />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <!-- Header: Type Badge, Language & Date -->
                <div class="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    :class="[
                      'inline-flex px-3 py-1 rounded-full text-xs font-bold',
                      item.action_type === 'summarize'
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                        : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
                    ]"
                  >
                    {{
                      item.action_type === "summarize"
                        ? t.history.summary
                        : t.history.translation
                    }}
                  </span>
                  <span
                    v-if="item.target_language || item.target_lang"
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                    {{ item.target_language || item.target_lang }}
                  </span>
                  <span
                    class="text-xs text-gray-500 dark:text-gray-400 ml-auto"
                    >{{ item.displayDate }}</span
                  >
                </div>

                <!-- Input & Result Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <!-- Input Panel -->
                  <div
                    v-if="item.input_text || item.original_text"
                    class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3"
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <svg
                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span
                        class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                        >{{ t.history.input }}</span
                      >
                    </div>
                    <p
                      :class="[
                        'text-sm text-gray-700 dark:text-gray-300',
                        isExpanded(item.id) ? '' : 'line-clamp-3',
                      ]"
                    >
                      {{ item.input_text || item.original_text }}
                    </p>
                  </div>

                  <!-- Result Panel -->
                  <div
                    v-if="
                      item.result || item.output_text || item.translated_text
                    "
                    class="bg-cyan-50 dark:bg-cyan-950/30 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800"
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <svg
                        class="w-4 h-4 text-cyan-600 dark:text-cyan-400"
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
                      <span
                        class="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide"
                        >{{ t.history.result }}</span
                      >
                    </div>
                    <p
                      :class="[
                        'text-sm text-gray-800 dark:text-gray-200',
                        isExpanded(item.id) ? '' : 'line-clamp-3',
                      ]"
                    >
                      {{
                        item.result || item.output_text || item.translated_text
                      }}
                    </p>
                  </div>
                </div>

                <!-- Expand/Collapse Button -->
                <button
                  @click="toggleExpand(item.id)"
                  class="mt-2 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <svg
                    :class="[
                      'w-4 h-4 transition-transform',
                      isExpanded(item.id) ? 'rotate-180' : '',
                    ]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  {{
                    isExpanded(item.id)
                      ? t.history.showLess
                      : t.history.showMore
                  }}
                </button>
              </div>

              <!-- Actions -->
              <div class="flex sm:flex-col gap-2 sm:ml-4">
                <!-- Use in Translator -->
                <button
                  @click="useInTranslator(item)"
                  class="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors cursor-pointer"
                  :title="t.history.useInTranslator"
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>

                <!-- Copy Result -->
                <button
                  @click="
                    copyToClipboard(
                      item.result ||
                        item.output_text ||
                        item.translated_text ||
                        ''
                    )
                  "
                  class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  :title="t.history.copyResult"
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>

                <!-- Save to Favorites -->
                <button
                  @click="toggleItemFavorite(item)"
                  :class="[
                    'p-2 rounded-lg transition-colors cursor-pointer',
                    isItemFavorited(item)
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600',
                  ]"
                  :title="
                    isItemFavorited(item)
                      ? t.history.removeFromFavorites
                      : t.history.saveToFavorites
                  "
                >
                  <svg
                    class="w-5 h-5"
                    :fill="isItemFavorited(item) ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>

                <!-- Delete -->
                <button
                  @click="deleteItem(item.id)"
                  :disabled="isDeleting"
                  class="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50 cursor-pointer"
                  :title="t.history.delete"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#252525] px-6 py-4"
        >
          <div class="flex items-center justify-between gap-4">
            <button
              @click="goToPreviousPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← {{ t.history.previous }}
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                  currentPage === page
                    ? 'bg-cyan-400 text-black font-bold'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="goToNextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {{ t.history.next }} →
            </button>
          </div>

          <!-- Pagination Info -->
          <div
            class="text-center mt-3 text-xs text-gray-600 dark:text-gray-400"
          >
            {{
              t.history.pageOf
                .replace("{current}", String(currentPage))
                .replace("{total}", String(totalPages))
                .replace("{items}", String(totalItems))
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
input[type="checkbox"] {
  accent-color: rgb(34, 211, 238);
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
