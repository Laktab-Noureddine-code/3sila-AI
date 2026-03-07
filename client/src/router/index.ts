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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Redirect authenticated users away from login/signup pages
router.beforeEach((to, _from, next) => {
  if (auth.isAuthenticated() && (to.name === "login" || to.name === "signup")) {
    next("/");
  } else {
    next();
  }
});

export default router;
