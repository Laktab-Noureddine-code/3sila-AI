<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import api from "../../services/api";
import { useI18n } from "../../composables/useI18n";
import { toast } from "../../stores/toast";
import { confirm } from "../../stores/confirm";
import {
  Search,
  Ban,
  CheckCircle,
  BadgeCheck,
  Trash2,
  Users,
} from "lucide-vue-next";

const { t } = useI18n();

interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
}

const loading = ref(true);
const users = ref<User[]>([]);
const searchQuery = ref("");
const roleFilter = ref("all");
const statusFilter = ref("all");
const actionLoading = ref<number | null>(null);

const filteredUsers = computed(() => {
  let result = users.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }
  if (roleFilter.value !== "all") {
    result = result.filter((u) =>
      roleFilter.value === "admin" ? u.is_admin : !u.is_admin,
    );
  }
  if (statusFilter.value !== "all") {
    result = result.filter((u) =>
      statusFilter.value === "active" ? u.is_active : !u.is_active,
    );
  }
  return result;
});

const fetchUsers = async () => {
  try {
    const res = await api.getAdminUsers(0, 1000);
    users.value = res.data;
  } catch {
    toast.error(t.value.common.error);
  } finally {
    loading.value = false;
  }
};

const handleToggleStatus = async (user: User) => {
  const msg = user.is_active
    ? t.value.admin.confirmSuspend
    : t.value.admin.confirmActivate;
  const confirmed = await confirm.show({
    title: user.is_active ? t.value.admin.suspend : t.value.admin.activate,
    message: msg,
    confirmText: t.value.common.confirm,
    type: user.is_active ? "warning" : "info",
  });
  if (!confirmed) return;
  actionLoading.value = user.id;
  try {
    const res = await api.toggleUserStatus(user.id);
    const idx = users.value.findIndex((u) => u.id === user.id);
    if (idx !== -1) users.value[idx] = res.data;
    toast.success(
      res.data.is_active
        ? t.value.admin.userActivated
        : t.value.admin.userSuspended,
    );
  } catch {
    toast.error(t.value.common.error);
  } finally {
    actionLoading.value = null;
  }
};

const handleToggleRole = async (user: User) => {
  const msg = user.is_admin
    ? t.value.admin.confirmDemote
    : t.value.admin.confirmPromote;
  const confirmed = await confirm.show({
    title: user.is_admin
      ? t.value.admin.demoteAdmin
      : t.value.admin.promoteAdmin,
    message: msg,
    confirmText: t.value.common.confirm,
    type: "warning",
  });
  if (!confirmed) return;
  actionLoading.value = user.id;
  try {
    const res = await api.toggleUserRole(user.id);
    const idx = users.value.findIndex((u) => u.id === user.id);
    if (idx !== -1) users.value[idx] = res.data;
    toast.success(
      res.data.is_admin
        ? t.value.admin.userPromoted
        : t.value.admin.userDemoted,
    );
  } catch {
    toast.error(t.value.common.error);
  } finally {
    actionLoading.value = null;
  }
};

const handleDelete = async (user: User) => {
  const confirmed = await confirm.show({
    title: t.value.admin.deleteUser,
    message: t.value.admin.confirmDelete,
    confirmText: t.value.common.delete,
    type: "danger",
  });
  if (!confirmed) return;
  actionLoading.value = user.id;
  try {
    await api.deleteUser(user.id);
    users.value = users.value.filter((u) => u.id !== user.id);
    toast.success(t.value.admin.userDeleted);
  } catch {
    toast.error(t.value.common.error);
  } finally {
    actionLoading.value = null;
  }
};

onMounted(fetchUsers);
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="space-y-4 animate-pulse">
    <div class="h-12 rounded-xl bg-gray-200 dark:bg-gray-800 w-full max-w-md" />
    <div class="h-96 rounded-2xl bg-gray-200 dark:bg-gray-800" />
  </div>

  <div v-else class="space-y-4">
    <!-- Filters bar -->
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Search -->
      <div class="relative flex-1">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        />
        <input
          v-model="searchQuery"
          :placeholder="t.admin.searchUsers"
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
        />
      </div>
      <!-- Role filter -->
      <select
        v-model="roleFilter"
        class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
      >
        <option value="all">{{ t.admin.allRoles }}</option>
        <option value="admin">{{ t.admin.admin }}</option>
        <option value="user">{{ t.admin.user }}</option>
      </select>
      <!-- Status filter -->
      <select
        v-model="statusFilter"
        class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
      >
        <option value="all">{{ t.admin.allStatuses }}</option>
        <option value="active">{{ t.admin.active }}</option>
        <option value="suspended">{{ t.admin.suspended }}</option>
      </select>
    </div>

    <!-- Users count -->
    <p class="text-sm text-gray-500 dark:text-gray-400">
      {{ t.admin.showing }} {{ filteredUsers.length }} {{ t.admin.of }}
      {{ users.length }}
    </p>

    <!-- Users table (desktop) -->
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
                {{ t.admin.name }}
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ t.admin.email }}
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ t.admin.role }}
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ t.admin.status }}
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ t.admin.actions }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  >
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                    >{{ user.name }}</span
                  >
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ user.email }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="[
                    user.is_admin
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                  ]"
                >
                  {{ user.is_admin ? t.admin.admin : t.admin.user }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="[
                    user.is_active
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
                  ]"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="user.is_active ? 'bg-green-500' : 'bg-red-500'"
                  />
                  {{ user.is_active ? t.admin.active : t.admin.suspended }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-1">
                  <!-- Toggle status -->
                  <button
                    @click="handleToggleStatus(user)"
                    :disabled="actionLoading === user.id"
                    :title="user.is_active ? t.admin.suspend : t.admin.activate"
                    class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Ban v-if="user.is_active" class="w-4 h-4 text-amber-500" />
                    <CheckCircle v-else class="w-4 h-4 text-green-500" />
                  </button>
                  <!-- Toggle role -->
                  <button
                    @click="handleToggleRole(user)"
                    :disabled="actionLoading === user.id"
                    :title="
                      user.is_admin ? t.admin.demoteAdmin : t.admin.promoteAdmin
                    "
                    class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <BadgeCheck class="w-4 h-4 text-purple-500" />
                  </button>
                  <!-- Delete -->
                  <button
                    @click="handleDelete(user)"
                    :disabled="actionLoading === user.id"
                    :title="t.admin.deleteUser"
                    class="p-2 rounded-lg text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 class="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-if="filteredUsers.length === 0" class="py-16 text-center">
        <Users
          class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3"
        />
        <p class="text-gray-500 dark:text-gray-400">{{ t.admin.noUsers }}</p>
      </div>
    </div>

    <!-- Users cards (mobile) -->
    <div class="md:hidden space-y-3">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-4"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold"
            >
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ user.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ user.email }}
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-medium"
              :class="
                user.is_admin
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              "
            >
              {{ user.is_admin ? t.admin.admin : t.admin.user }}
            </span>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-medium"
              :class="
                user.is_active
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              "
            >
              {{ user.is_active ? t.admin.active : t.admin.suspended }}
            </span>
          </div>
        </div>
        <div
          class="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800"
        >
          <button
            @click="handleToggleStatus(user)"
            :disabled="actionLoading === user.id"
            class="flex-1 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            :class="
              user.is_active
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
            "
          >
            {{ user.is_active ? t.admin.suspend : t.admin.activate }}
          </button>
          <button
            @click="handleToggleRole(user)"
            :disabled="actionLoading === user.id"
            class="flex-1 py-2 text-xs font-medium rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            {{ user.is_admin ? t.admin.demoteAdmin : t.admin.promoteAdmin }}
          </button>
          <button
            @click="handleDelete(user)"
            :disabled="actionLoading === user.id"
            class="py-2 px-3 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
      <div v-if="filteredUsers.length === 0" class="py-16 text-center">
        <p class="text-gray-500 dark:text-gray-400">{{ t.admin.noUsers }}</p>
      </div>
    </div>
  </div>
</template>
