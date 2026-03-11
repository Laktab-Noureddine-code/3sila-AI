import axios from "axios";

// 1. Create an Axios instance
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt_token");
  const expiry = Number(localStorage.getItem("jwt_expiry") || "0");
  const isValid = token && expiry && Date.now() < expiry;
  if (isValid) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    if (token && expiry && Date.now() >= expiry) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("jwt_expiry");
      localStorage.removeItem("user_data");
    }
  }
  return config;
});

// Clear credentials on unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("jwt_expiry");
      localStorage.removeItem("user_data");
    }
    return Promise.reject(error);
  },
);

export default {
  // AI Services
  translateText(text: string, targetLang: string = "French") {
    return apiClient.post("/tools/translate", {
      text,
      target_lang: targetLang,
    });
  },

  summarizeText(text: string) {
    return apiClient.post("/tools/summarize", { text });
  },

  // Auth Services
  login(credentials: { email: string; password: string }) {
    // FastAPI OAuth2 expects form-urlencoded data
    const formData = `username=${encodeURIComponent(
      credentials.email,
    )}&password=${encodeURIComponent(credentials.password)}`;
    return apiClient.post("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  register(userData: object) {
    return apiClient.post("/auth/signup", userData);
  },

  getUser() {
    return apiClient.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    });
  },

  // History Services
  getHistory(page: number = 1, perPage: number = 20) {
    return apiClient.get("/history/", { params: { page, per_page: perPage } });
  },

  getHistorySummaries(page: number = 1, perPage: number = 20) {
    return apiClient.get("/history/summaries", {
      params: { page, per_page: perPage },
    });
  },

  getHistoryTranslations(page: number = 1, perPage: number = 20) {
    return apiClient.get("/history/translations", {
      params: { page, per_page: perPage },
    });
  },

  deleteTranslation(id: string) {
    return apiClient.delete(`/history/translations/${id}`);
  },

  deleteSummary(id: string) {
    return apiClient.delete(`/history/summaries/${id}`);
  },

  // OCR Service
  extractTextFromFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("apikey", import.meta.env.VITE_OCR_API_KEY);
    formData.append("language", "eng");

    return axios.post("https://api.ocr.space/parse/image", formData);
  },

  // Admin Services
  getAdminStats() {
    return apiClient.get("/admin/stats");
  },

  getAdminActivityChart(days: number = 7) {
    return apiClient.get("/admin/charts/activity", { params: { days } });
  },

  getAdminUsers(skip: number = 0, limit: number = 100) {
    return apiClient.get("/admin/users", { params: { skip, limit } });
  },

  toggleUserStatus(userId: number) {
    return apiClient.patch(`/admin/users/${userId}/status`);
  },

  toggleUserRole(userId: number) {
    return apiClient.patch(`/admin/users/${userId}/role`);
  },

  deleteUser(userId: number) {
    return apiClient.delete(`/admin/users/${userId}`);
  },

  getAdminHistory(skip: number = 0, limit: number = 100) {
    return apiClient.get("/admin/history", { params: { skip, limit } });
  },

  getAdminUserHistory(userId: number, skip: number = 0, limit: number = 100) {
    return apiClient.get(`/admin/history/user/${userId}`, {
      params: { skip, limit },
    });
  },

  updateAdminConfig(key: string, value: string, description?: string) {
    return apiClient.put(`/admin/config/${key}`, { value, description });
  },
};
