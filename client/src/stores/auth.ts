import { reactive } from "vue";

export const auth = reactive({
  // 1. Initialize state from LocalStorage (so login persists on refresh)
  token: localStorage.getItem("jwt_token") || "",
  user: JSON.parse(localStorage.getItem("user_data") || "null"),

  // 2. Check if logged in (enforce 30-day session)
  isAuthenticated() {
    const expiry = Number(localStorage.getItem("jwt_expiry") || "0");
    if (!this.token || !expiry) return false;
    if (Date.now() >= expiry) {
      this.clearAuth();
      return false;
    }
    return true;
  },

  // 3. Login Action (set 30-day expiry)
  setAuth(token: string) {
    this.token = token;
    localStorage.setItem("jwt_token", token);
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const expiryAt = Date.now() + THIRTY_DAYS_MS;
    localStorage.setItem("jwt_expiry", String(expiryAt));
  },

  setUser(user: any) {
    this.user = user;
    localStorage.setItem("user_data", JSON.stringify(user));
  },

  // 4. Logout Action
  clearAuth() {
    this.token = "";
    this.user = null;
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("jwt_expiry");
    localStorage.removeItem("user_data");
  },
});
