import { reactive } from "vue";

export interface FavoriteItem {
  id: string;
  type: "translation" | "summary";
  inputText: string;
  resultText: string;
  targetLanguage?: string;
  createdAt: string;
  savedAt: string;
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

export const favorites = reactive({
  items: loadFavorites() as FavoriteItem[],

  // Check if an item is already favorited (by content match)
  isFavorited(inputText: string, resultText: string): boolean {
    return this.items.some(
      (item) => item.inputText === inputText && item.resultText === resultText
    );
  },

  // Get favorite by ID
  getById(id: string): FavoriteItem | undefined {
    return this.items.find((item) => item.id === id);
  },

  // Add a new favorite
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

  // Remove a favorite by ID
  remove(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index > -1) {
      this.items.splice(index, 1);
      saveFavorites(this.items);
      return true;
    }
    return false;
  },

  // Remove by content match
  removeByContent(inputText: string, resultText: string): boolean {
    const index = this.items.findIndex(
      (item) => item.inputText === inputText && item.resultText === resultText
    );
    if (index > -1) {
      this.items.splice(index, 1);
      saveFavorites(this.items);
      return true;
    }
    return false;
  },

  // Toggle favorite status
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
