import { reactive } from "vue";
import api from "../services/api";
import { auth } from "./auth";

export interface FavoriteItem {
  id: string;
  type: "translation" | "summary";
  inputText: string;
  resultText: string;
  targetLanguage?: string;
  createdAt: string;
  savedAt: string;
}

// Server item shape from History model
interface ServerHistoryItem {
  id: number;
  action_type: string;
  original_text: string;
  summary_text?: string;
  translated_text?: string;
  target_lang?: string;
  is_favorite: boolean;
  created_at: string;
}

const STORAGE_KEY = "favorites";

// Load favorites from localStorage
const loadFavorites = (): FavoriteItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save favorites to localStorage
const saveFavorites = (items: FavoriteItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

// Convert server history item to FavoriteItem
const serverToFavorite = (item: ServerHistoryItem): FavoriteItem => {
  const isSummary = item.action_type === "summarize";
  return {
    id: String(item.id),
    type: isSummary ? "summary" : "translation",
    inputText: item.original_text,
    resultText: isSummary
      ? item.summary_text || ""
      : item.translated_text || "",
    targetLanguage: item.target_lang || undefined,
    createdAt: item.created_at,
    savedAt: item.created_at,
  };
};

export const favorites = reactive({
  items: loadFavorites() as FavoriteItem[],
  isLoading: false,
  isServerMode: false,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,

  // Fetch favorites from server (for authenticated users)
  async fetchFavorites(page: number = 1, perPage: number = 20) {
    if (!auth.isAuthenticated()) {
      this.isServerMode = false;
      this.items = loadFavorites();
      return;
    }
    this.isServerMode = true;
    this.isLoading = true;
    try {
      const response = await api.getFavorites(page, perPage);
      const data = response.data;
      if (data.items) {
        this.items = data.items.map(serverToFavorite);
        this.totalPages = data.pages || 1;
        this.totalItems = data.total || 0;
        this.currentPage = page;
      } else if (Array.isArray(data)) {
        this.items = data.map(serverToFavorite);
        this.totalPages = 1;
        this.totalItems = data.length;
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      // Fallback to localStorage
      this.isServerMode = false;
      this.items = loadFavorites();
    } finally {
      this.isLoading = false;
    }
  },

  // Toggle favorite on server
  async toggleServerFavorite(itemId: number): Promise<boolean> {
    try {
      const response = await api.toggleFavorite(itemId);
      return response.data.is_favorite;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  },

  // Check if an item is already favorited (by content match — localStorage mode)
  isFavorited(inputText: string, resultText: string): boolean {
    return this.items.some(
      (item) => item.inputText === inputText && item.resultText === resultText,
    );
  },

  // Check if favorited by server ID
  isFavoritedById(id: string): boolean {
    return this.items.some((item) => item.id === id);
  },

  // Get favorite by ID
  getById(id: string): FavoriteItem | undefined {
    return this.items.find((item) => item.id === id);
  },

  // Add a new favorite (localStorage mode)
  add(item: Omit<FavoriteItem, "id" | "savedAt">): FavoriteItem {
    const newItem: FavoriteItem = {
      ...item,
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
    };
    this.items.unshift(newItem);
    saveFavorites(this.items);
    return newItem;
  },

  // Remove a favorite by ID (localStorage mode)
  remove(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index > -1) {
      this.items.splice(index, 1);
      saveFavorites(this.items);
      return true;
    }
    return false;
  },

  // Remove by content match (localStorage mode)
  removeByContent(inputText: string, resultText: string): boolean {
    const index = this.items.findIndex(
      (item) => item.inputText === inputText && item.resultText === resultText,
    );
    if (index > -1) {
      this.items.splice(index, 1);
      saveFavorites(this.items);
      return true;
    }
    return false;
  },

  // Toggle favorite status (localStorage mode)
  toggle(item: Omit<FavoriteItem, "id" | "savedAt">): boolean {
    if (this.isFavorited(item.inputText, item.resultText)) {
      this.removeByContent(item.inputText, item.resultText);
      return false;
    } else {
      this.add(item);
      return true;
    }
  },

  // Clear all favorites
  clearAll() {
    this.items = [];
    saveFavorites(this.items);
  },

  // Get count
  get count(): number {
    return this.items.length;
  },

  // Get favorites by type
  getByType(type: "translation" | "summary"): FavoriteItem[] {
    return this.items.filter((item) => item.type === type);
  },
});
