<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { favorites, type FavoriteItem } from "../stores/favorites";
import { toast } from "../stores/toast";
import { confirm } from "../stores/confirm";
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();

const router = useRouter();

// --- State ---
const activeTab = ref<"all" | "summaries" | "translations">("all");
const isDark = ref(true);
const selectedItems = ref<Set<string>>(new Set());
const isDeleting = ref(false);
const expandedItems = ref<Set<string>>(new Set());

// --- Computed ---
const displayedFavorites = computed(() => {
  let items = favorites.items;

  if (activeTab.value === "summaries") {
    items = favorites.getByType("summary");
  } else if (activeTab.value === "translations") {
    items = favorites.getByType("translation");
  }

  return items.map((item) => ({
    ...item,
    isSelected: selectedItems.value.has(item.id),
    displayDate: new Date(item.savedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
});

const selectedCount = computed(() => selectedItems.value.size);
const allSelected = computed(
  () =>
    displayedFavorites.value.length > 0 &&
    displayedFavorites.value.length === selectedCount.value
);

// --- Methods ---
const handleTabChange = (tab: "all" | "summaries" | "translations") => {
  activeTab.value = tab;
  selectedItems.value.clear();
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value.clear();
  } else {
    displayedFavorites.value.forEach((item) => {
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
  const item = favorites.getById(itemId);
  const itemType = item?.type === "summary" ? "summary" : "translation";

  const confirmed = await confirm.show({
    title: "Remove Favorite",
    message: `Are you sure you want to remove this ${itemType} from favorites?`,
    confirmText: "Remove",
    cancelText: "Cancel",
    type: "danger",
  });

  if (!confirmed) return;

  isDeleting.value = true;
  try {
    favorites.remove(itemId);
    selectedItems.value.delete(itemId);
    toast.success("Removed from favorites");
  } catch (error) {
    console.error("Error removing favorite:", error);
    toast.error("Failed to remove favorite");
  } finally {
    isDeleting.value = false;
  }
};

const deleteSelected = async () => {
  if (selectedItems.value.size === 0) return;

  const confirmed = await confirm.show({
    title: "Remove Favorites",
    message: `Are you sure you want to remove ${selectedItems.value.size} item(s) from favorites?`,
    confirmText: "Remove",
    cancelText: "Cancel",
    type: "danger",
  });

  if (!confirmed) return;

  isDeleting.value = true;
  const itemsToDelete = Array.from(selectedItems.value);

  try {
    itemsToDelete.forEach((id) => favorites.remove(id));
    selectedItems.value.clear();
    toast.success("Removed from favorites");
  } catch (error) {
    console.error("Error removing favorites:", error);
    toast.error("Failed to remove some favorites");
  } finally {
    isDeleting.value = false;
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard!");
};

const useInTranslator = (item: FavoriteItem) => {
  router.push({
    path: "/",
    query: {
      mode: item.type === "translation" ? "translate" : "summarize",
      prefill: item.inputText,
      result: item.resultText,
      targetLang: item.targetLanguage || undefined,
    },
  });
};

// --- Lifecycle ---
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  isDark.value =
    savedTheme === "dark" ||
    (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
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
          <svg
            class="w-10 h-10 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
          {{ t.favorites.title }}
        </span>
      </h1>
      <p class="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
        {{ t.favorites.description }}
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
                    'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                    activeTab === 'all'
                      ? 'bg-yellow-400 text-black shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer',
                  ]"
                >
                  {{ t.favorites.all }}
                </button>
                <button
                  @click="handleTabChange('summaries')"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                    activeTab === 'summaries'
                      ? 'bg-yellow-400 text-black shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer',
                  ]"
                >
                  {{ t.favorites.summaries }}
                </button>
                <button
                  @click="handleTabChange('translations')"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                    activeTab === 'translations'
                      ? 'bg-yellow-400 text-black shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer',
                  ]"
                >
                  {{ t.favorites.translations }}
                </button>
              </div>

              <!-- Delete Selected Button -->
              <button
                v-if="selectedCount > 0"
                @click="deleteSelected"
                :disabled="isDeleting"
                class="px-4 py-2 rounded-lg font-medium bg-red-500/20 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 hover:bg-red-500/30 disabled:opacity-50 transition-all duration-200"
              >
                {{ t.favorites.removeSelected }} ({{ selectedCount }})
              </button>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-6">
          <!-- Empty State -->
          <div v-if="displayedFavorites.length === 0" class="text-center py-12">
            <svg
              class="mx-auto h-16 w-16 text-yellow-400/50"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              {{ t.favorites.empty }}
            </h3>
            <p class="mt-1 text-gray-600 dark:text-gray-400">
              {{ t.favorites.emptyDescription }}
            </p>
            <button
              @click="router.push('/')"
              class="mt-6 px-6 py-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {{ t.favorites.startTranslating }}
            </button>
          </div>

          <!-- Favorites List -->
          <div v-else class="space-y-3">
            <!-- Select All Checkbox -->
            <div
              class="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700"
            >
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
                class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-yellow-400 cursor-pointer"
              />
              <span
                class="text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                {{
                  allSelected ? t.favorites.deselectAll : t.favorites.selectAll
                }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-500 ml-auto">
                {{ displayedFavorites.length }}
                {{
                  displayedFavorites.length !== 1
                    ? t.favorites.favorites_count
                    : t.favorites.favorite
                }}
              </span>
            </div>

            <!-- Favorite Items -->
            <div
              v-for="item in displayedFavorites"
              :key="item.id"
              :class="[
                'flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-xl border transition-all duration-200',
                item.isSelected
                  ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-700'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
              ]"
            >
              <!-- Checkbox -->
              <div class="flex items-start gap-3 sm:w-auto">
                <input
                  type="checkbox"
                  :checked="item.isSelected"
                  @change="toggleSelect(item.id)"
                  class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-yellow-400 cursor-pointer mt-1"
                />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <!-- Header: Type Badge, Language & Date -->
                <div class="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    :class="[
                      'inline-flex px-3 py-1 rounded-full text-xs font-bold',
                      item.type === 'summary'
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                        : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
                    ]"
                  >
                    {{
                      item.type === "summary"
                        ? t.favorites.summary
                        : t.favorites.translation
                    }}
                  </span>
                  <svg
                    class="w-4 h-4 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    />
                  </svg>
                  <span
                    v-if="item.targetLanguage"
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
                    {{ item.targetLanguage }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400 ml-auto"
                    >{{ t.favorites.saved }} {{ item.displayDate }}</span
                  >
                </div>

                <!-- Input & Result Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <!-- Input Panel -->
                  <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
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
                        >{{ t.favorites.input }}</span
                      >
                    </div>
                    <p
                      :class="[
                        'text-sm text-gray-700 dark:text-gray-300',
                        isExpanded(item.id) ? '' : 'line-clamp-3',
                      ]"
                    >
                      {{ item.inputText }}
                    </p>
                  </div>

                  <!-- Result Panel -->
                  <div
                    class="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800"
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <svg
                        class="w-4 h-4 text-yellow-600 dark:text-yellow-400"
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
                        class="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide"
                        >{{ t.favorites.result }}</span
                      >
                    </div>
                    <p
                      :class="[
                        'text-sm text-gray-800 dark:text-gray-200',
                        isExpanded(item.id) ? '' : 'line-clamp-3',
                      ]"
                    >
                      {{ item.resultText }}
                    </p>
                  </div>
                </div>

                <!-- Expand/Collapse Button -->
                <button
                  @click="toggleExpand(item.id)"
                  class="mt-2 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors cursor-pointer"
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
                      ? t.favorites.showLess
                      : t.favorites.showMore
                  }}
                </button>
              </div>

              <!-- Actions -->
              <div class="flex sm:flex-col gap-2 sm:ml-4">
                <!-- Use in Translator -->
                <button
                  @click="useInTranslator(item)"
                  class="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors cursor-pointer"
                  :title="t.favorites.useInTranslator"
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
                  @click="copyToClipboard(item.resultText)"
                  class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  :title="t.favorites.copyResult"
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

                <!-- Delete -->
                <button
                  @click="deleteItem(item.id)"
                  :disabled="isDeleting"
                  class="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50 cursor-pointer"
                  :title="t.favorites.removeFromFavorites"
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
      </div>
    </div>
  </div>
</template>
