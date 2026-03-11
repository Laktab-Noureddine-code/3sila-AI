import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import HistoryView from "../views/HistoryView.vue";
import FavoritesView from "../views/FavoritesView.vue";
import AboutView from "../views/AboutView.vue";
import PrivacyPolicyView from "../views/PrivacyPolicyView.vue";
import TermsOfServiceView from "../views/TermsOfServiceView.vue";
import ContactView from "../views/ContactView.vue";
import ForgotPasswordView from "../views/ForgotPasswordView.vue";
import ResetPasswordView from "../views/ResetPasswordView.vue";
import ProfileView from "../views/ProfileView.vue";
import AdminLayout from "../views/admin/AdminLayout.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AdminUsers from "../views/admin/AdminUsers.vue";
import AdminHistory from "../views/admin/AdminHistory.vue";
import AdminSettings from "../views/admin/AdminSettings.vue";
import { auth } from "../stores/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: HomeView as any,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView as any,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupView as any,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView as any,
  },
  {
    path: "/privacy",
    name: "privacy",
    component: PrivacyPolicyView as any,
  },
  {
    path: "/terms",
    name: "terms",
    component: TermsOfServiceView as any,
  },
  {
    path: "/history",
    name: "history",
    component: HistoryView as any,
  },
  {
    path: "/favorites",
    name: "favorites",
    component: FavoritesView as any,
  },
  {
    path: "/contact",
    name: "contact",
    component: ContactView as any,
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: ForgotPasswordView as any,
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPasswordView as any,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView as any,
  },
  {
    path: "/admin",
    component: AdminLayout as any,
    meta: { requiresAdmin: true },
    children: [
      { path: "", name: "admin-dashboard", component: AdminDashboard as any },
      { path: "users", name: "admin-users", component: AdminUsers as any },
      {
        path: "history",
        name: "admin-history",
        component: AdminHistory as any,
      },
      {
        path: "settings",
        name: "admin-settings",
        component: AdminSettings as any,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Redirect authenticated users away from login/signup pages
// Protect admin routes
router.beforeEach((to, _from, next) => {
  if (auth.isAuthenticated() && (to.name === "login" || to.name === "signup")) {
    next("/");
  } else if (to.name === "profile" && !auth.isAuthenticated()) {
    next("/login");
  } else if (to.matched.some((r) => r.meta.requiresAdmin)) {
    if (!auth.isAuthenticated() || !auth.user?.is_admin) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
