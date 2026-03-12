<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import api from "../../services/api";
import { useI18n } from "../../composables/useI18n";
import { toast } from "../../stores/toast";
import { Clock } from "lucide-vue-next";

const { t } = useI18n();

interface HistoryRecord {
  id: number;
  user_id: number;
  action_type: string;
  original_text: string;
  summary_text: string | null;
  translated_text: string | null;
  target_lang: string | null;
  source_type: string;
  source_url: string | null;
  is_favorite: boolean;
  created_at: string;
}

const loading = ref(true);
const records = ref<HistoryRecord[]>([]);
const typeFilter = ref("all");
const skip = ref(0);
const limit = 50;
const hasMore = ref(true);
const loadingMore = ref(false);
const expandedIds = ref<Set<number>>(new Set());

const filteredRecords = computed(() => {
  if (typeFilter.value === "all") return records.value;
  return records.value.filter((r) => r.action_type === typeFilter.value);
});

const fetchHistory = async (append = false) => {
  try {
    if (append) loadingMore.value = true;
    const res = await api.getAdminHistory(skip.value, limit);
    if (append) {
      records.value.push(...res.data);
    } else {
      records.value = res.data;
    }
    hasMore.value = res.data.length === limit;
  } catch {
    toast.error(t.value.common.error);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = async () => {
  skip.value += limit;
  await fetchHistory(true);
};

const toggleExpand = (id: number) => {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id);
  } else {
    expandedIds.value.add(id);
  }
};

const truncate = (text: string | null, len = 80) => {
  if (!text) return "—";
  // Strip HTML tags for truncated preview
  const tmp = document.createElement("div");
  tmp.innerHTML = text;
  const plain = tmp.textContent || text;
  return plain.length > len ? plain.slice(0, len) + "..." : plain;
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getResultText = (record: HistoryRecord) => {
  return record.action_type === "translate"
    ? record.translated_text
    : record.summary_text;
};

onMounted(() => fetchHistory());
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="space-y-4 animate-pulse">
    <div class="h-12 rounded-xl bg-gray-200 dark:bg-gray-800 w-48" />
    <div
      v-for="i in 5"
      :key="i"
      class="h-24 rounded-2xl bg-gray-200 dark:bg-gray-800"
    />
  </div>

  <div v-else class="space-y-4">
    <!-- Filter -->
    <div class="flex items-center gap-3">
      <select
        v-model="typeFilter"
        class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
      >
        <option value="all">{{ t.admin.allTypes }}</option>
        <option value="translate">{{ t.admin.translate }}</option>
        <option value="summarize">{{ t.admin.summarize }}</option>
      </select>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {{ filteredRecords.length }} {{ t.admin.totalActions.toLowerCase() }}
      </span>
    </div>

    <!-- Records table (desktop) -->
    <div
      class="hidden md:block rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800">
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ t.admin.actionType }}
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ t.admin.originalText }}
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ t.admin.resultText }}
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ t.admin.date }}
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                User ID
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="record in filteredRecords"
              :key="record.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              @click="toggleExpand(record.id)"
            >
              <td
                class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono"
              >
                #{{ record.id }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="[
                    record.action_type === 'translate'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
                  ]"
                >
                  {{
                    record.action_type === "translate"
                      ? t.admin.translate
                      : t.admin.summarize
                  }}
                </span>
                <span
                  v-if="record.target_lang"
                  class="ml-2 text-xs text-gray-400"
                  >→ {{ record.target_lang }}</span
                >
              </td>
              <td
                class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs"
              >
                <template v-if="expandedIds.has(record.id)">
                  <div
                    class="tiptap-content"
                    v-html="record.original_text"
                  ></div>
                </template>
                <template v-else>
                  {{ truncate(record.original_text) }}
                </template>
              </td>
              <td
                class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs"
              >
                <template v-if="expandedIds.has(record.id)">
                  <div
                    class="tiptap-content"
                    v-html="getResultText(record)"
                  ></div>
                </template>
                <template v-else>
                  {{ truncate(getResultText(record)) }}
                </template>
              </td>
              <td
                class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                {{ formatDate(record.created_at) }}
              </td>
              <td
                class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono"
              >
                #{{ record.user_id }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-if="filteredRecords.length === 0" class="py-16 text-center">
        <Clock
          class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3"
        />
        <p class="text-gray-500 dark:text-gray-400">{{ t.admin.noHistory }}</p>
      </div>
    </div>

    <!-- Records cards (mobile) -->
    <div class="md:hidden space-y-3">
      <div
        v-for="record in filteredRecords"
        :key="record.id"
        class="rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-4 cursor-pointer"
        @click="toggleExpand(record.id)"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 font-mono"
              >#{{ record.id }}</span
            >
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-medium"
              :class="[
                record.action_type === 'translate'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
              ]"
            >
              {{
                record.action_type === "translate"
                  ? t.admin.translate
                  : t.admin.summarize
              }}
            </span>
            <span v-if="record.target_lang" class="text-[10px] text-gray-400"
              >→ {{ record.target_lang }}</span
            >
          </div>
          <span class="text-[10px] text-gray-400"
            >User #{{ record.user_id }}</span
          >
        </div>
        <div class="space-y-2">
          <div>
            <p
              class="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5"
            >
              {{ t.admin.originalText }}
            </p>
            <div
              v-if="expandedIds.has(record.id)"
              class="text-sm text-gray-700 dark:text-gray-300 tiptap-content"
              v-html="record.original_text"
            ></div>
            <p v-else class="text-sm text-gray-700 dark:text-gray-300">
              {{ truncate(record.original_text, 100) }}
            </p>
          </div>
          <div>
            <p
              class="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5"
            >
              {{ t.admin.resultText }}
            </p>
            <div
              v-if="expandedIds.has(record.id)"
              class="text-sm text-gray-700 dark:text-gray-300 tiptap-content"
              v-html="getResultText(record)"
            ></div>
            <p v-else class="text-sm text-gray-700 dark:text-gray-300">
              {{ truncate(getResultText(record), 100) }}
            </p>
          </div>
        </div>
        <p class="text-[10px] text-gray-400 mt-2">
          {{ formatDate(record.created_at) }}
        </p>
      </div>
      <div v-if="filteredRecords.length === 0" class="py-16 text-center">
        <p class="text-gray-500 dark:text-gray-400">{{ t.admin.noHistory }}</p>
      </div>
    </div>

    <!-- Load more -->
    <div
      v-if="hasMore && filteredRecords.length > 0"
      class="flex justify-center pt-2"
    >
      <button
        @click="loadMore"
        :disabled="loadingMore"
        class="px-6 py-2.5 rounded-xl text-sm font-medium bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
      >
        {{ loadingMore ? t.common.loading : t.admin.loadMore }}
      </button>
    </div>
  </div>
</template>
