<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Users,
  CheckCircle,
  Ban,
  Languages,
  FileText,
  Zap,
} from "lucide-vue-next";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import api from "../../services/api";
import { useI18n } from "../../composables/useI18n";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const { t } = useI18n();

const loading = ref(true);
const chartDays = ref(7);

const stats = ref({
  total_users: 0,
  active_users: 0,
  total_history_actions: 0,
  total_translations: 0,
  total_summarizations: 0,
  actions_today: 0,
});

const chartData = ref<
  { date: string; translations: number; summarizations: number }[]
>([]);

const suspendedUsers = computed(
  () => stats.value.total_users - stats.value.active_users,
);

const statCards = computed(() => [
  {
    label: t.value.admin.totalUsers,
    value: stats.value.total_users,
    icon: "users",
    color: "cyan",
  },
  {
    label: t.value.admin.activeUsers,
    value: stats.value.active_users,
    icon: "active",
    color: "green",
  },
  {
    label: t.value.admin.suspendedUsers,
    value: suspendedUsers.value,
    icon: "suspended",
    color: "red",
  },
  {
    label: t.value.admin.totalTranslations,
    value: stats.value.total_translations,
    icon: "translate",
    color: "blue",
  },
  {
    label: t.value.admin.totalSummaries,
    value: stats.value.total_summarizations,
    icon: "summary",
    color: "purple",
  },
  {
    label: t.value.admin.actionsToday,
    value: stats.value.actions_today,
    icon: "today",
    color: "amber",
  },
]);

const lineChartData = computed(() => ({
  labels: chartData.value.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }),
  datasets: [
    {
      label: t.value.admin.translations,
      data: chartData.value.map((d) => d.translations),
      borderColor: "#06b6d4",
      backgroundColor: "rgba(6, 182, 212, 0.1)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: t.value.admin.summarizations,
      data: chartData.value.map((d) => d.summarizations),
      borderColor: "#8b5cf6",
      backgroundColor: "rgba(139, 92, 246, 0.1)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        color: document.documentElement.classList.contains("dark")
          ? "#9ca3af"
          : "#4b5563",
      },
    },
    tooltip: {
      backgroundColor: document.documentElement.classList.contains("dark")
        ? "#1f2937"
        : "#fff",
      titleColor: document.documentElement.classList.contains("dark")
        ? "#f3f4f6"
        : "#111827",
      bodyColor: document.documentElement.classList.contains("dark")
        ? "#d1d5db"
        : "#374151",
      borderColor: document.documentElement.classList.contains("dark")
        ? "#374151"
        : "#e5e7eb",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: document.documentElement.classList.contains("dark")
          ? "#6b7280"
          : "#9ca3af",
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: document.documentElement.classList.contains("dark")
          ? "rgba(75,85,99,0.3)"
          : "rgba(229,231,235,0.8)",
      },
      ticks: {
        color: document.documentElement.classList.contains("dark")
          ? "#6b7280"
          : "#9ca3af",
        stepSize: 1,
      },
    },
  },
}));

const fetchStats = async () => {
  try {
    const res = await api.getAdminStats();
    stats.value = res.data;
  } catch {
    /* ignore */
  }
};

const fetchChart = async () => {
  try {
    const res = await api.getAdminActivityChart(chartDays.value);
    chartData.value = res.data;
  } catch {
    /* ignore */
  }
};

const changeChartDays = async (days: number) => {
  chartDays.value = days;
  await fetchChart();
};

onMounted(async () => {
  await Promise.all([fetchStats(), fetchChart()]);
  loading.value = false;
});
</script>

<template>
  <!-- Loading skeleton -->
  <div v-if="loading" class="space-y-6 animate-pulse">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="h-28 rounded-2xl bg-gray-200 dark:bg-gray-800"
      />
    </div>
    <div class="h-80 rounded-2xl bg-gray-200 dark:bg-gray-800" />
  </div>

  <div v-else class="space-y-6">
    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="relative overflow-hidden rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-5 transition-all duration-200 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {{ card.label }}
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ card.value.toLocaleString() }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center"
            :class="{
              'bg-cyan-100 dark:bg-cyan-900/30': card.color === 'cyan',
              'bg-green-100 dark:bg-green-900/30': card.color === 'green',
              'bg-red-100 dark:bg-red-900/30': card.color === 'red',
              'bg-blue-100 dark:bg-blue-900/30': card.color === 'blue',
              'bg-purple-100 dark:bg-purple-900/30': card.color === 'purple',
              'bg-amber-100 dark:bg-amber-900/30': card.color === 'amber',
            }"
          >
            <!-- Users -->
            <Users
              v-if="card.icon === 'users'"
              class="w-6 h-6 text-cyan-600 dark:text-cyan-400"
            />
            <!-- Active -->
            <CheckCircle
              v-if="card.icon === 'active'"
              class="w-6 h-6 text-green-600 dark:text-green-400"
            />
            <!-- Suspended -->
            <Ban
              v-if="card.icon === 'suspended'"
              class="w-6 h-6 text-red-600 dark:text-red-400"
            />
            <!-- Translate -->
            <Languages
              v-if="card.icon === 'translate'"
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
            />
            <!-- Summary -->
            <FileText
              v-if="card.icon === 'summary'"
              class="w-6 h-6 text-purple-600 dark:text-purple-400"
            />
            <!-- Today -->
            <Zap
              v-if="card.icon === 'today'"
              class="w-6 h-6 text-amber-600 dark:text-amber-400"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Activity chart -->
    <div
      class="rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t.admin.activityChart }}
        </h2>
        <div class="flex items-center gap-2">
          <button
            v-for="d in [
              { days: 7, label: t.admin.last7Days },
              { days: 14, label: t.admin.last14Days },
              { days: 30, label: t.admin.last30Days },
            ]"
            :key="d.days"
            @click="changeChartDays(d.days)"
            class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            :class="[
              chartDays === d.days
                ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800',
            ]"
          >
            {{ d.label }}
          </button>
        </div>
      </div>
      <div class="h-72 sm:h-80">
        <Line :data="lineChartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>
