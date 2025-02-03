import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue"; // 🔥 Ajout du Dashboard
import Login from "@/views/Login.vue";
import Calendar from "@/views/Calendrier.vue";
import Tasks from "@/views/Tasks.vue";
import Agents from "@/views/Agents.vue";
import Messages from "@/views/Messages.vue";
import Profile from "@/views/Profile.vue";
import Signup from "@/views/Signup.vue";

const routes = [
  { path: "/", name: "Dashboard", component: Dashboard }, // 🔥 Route ajoutée
  { path: "/login", name: "Login", component: Login },
  { path: "/calendar", name: "Calendar", component: Calendar },
  { path: "/tasks", name: "Tasks", component: Tasks },
  { path: "/agents", name: "Agents", component: Agents },
  { path: "/messages", name: "Messages", component: Messages },
  { path: "/profile", name: "Profile", component: Profile },
  { path: "/signup", component: Signup },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
