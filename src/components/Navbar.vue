<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header class="navbar">
    <!-- 🔍 Barre de recherche -->
    <div class="search-bar">
      <FontAwesomeIcon :icon="faSearch" class="search-icon" />
      <input type="text" placeholder="Rechercher..." />
    </div>

    <div class="navbar-icons">
      <!-- 🔔 Notifications avec badge -->
      <div class="notifications" @click.stop="toggleNotifications">
        <FontAwesomeIcon :icon="faBell" class="notif-bell" />
        <span class="notif-badge">3</span>
      </div>

      <!-- 🧑 Profil utilisateur -->
      <div class="profile-menu">
        <img
      :src="user.profilePicture || defaultPhoto"
      alt="User Profile"
      class="avatar"
      @click.stop="toggleProfileMenu"
    />
      </div>
    </div>

    <!-- ✅ Dropdown Notifications -->
    <transition name="fade">
      <div v-if="showNotifications" class="dropdown-menu notif-dropdown">
        <h4>Notifications</h4>
        <ul>
          <li>Tâche réussit</li>
          <li>Tâche réussit</li>
          <li>Message de l'agent</li>
        </ul>
      </div>
    </transition>

    <!-- ✅ Dropdown Profil amélioré -->
    <transition name="fade">
      <div v-if="showProfileMenu" class="dropdown-menu profile-dropdown">
        <div class="profile-header">
          <img :src="user.profilePicture || 'https://via.placeholder.com/50'"  class="profile-avatar" />
          <div>
            <h4>{{ user.name || 'Admin Ad' }}</h4>
            <p>{{ user.email || 'admin@gmail.com' }}</p>
          </div>
        </div>
        <ul>
          <li @click="router.push('/profile')">
            <FontAwesomeIcon :icon="faUser" /> Mon Profil
          </li>
          <li>
            <FontAwesomeIcon :icon="faCog" /> Paramètres
          </li>
          <li @click="logout">
            <FontAwesomeIcon :icon="faSignOutAlt" /> Déconnexion
          </li>
        </ul>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBell, faUser, faSearch, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "../stores/userStore";



const router = useRouter();
const showNotifications = ref(false);
const showProfileMenu = ref(false);

const userStore = useUserStore();
const defaultPhoto = "https://ui-avatars.com/api/?name=Ad&background=0D8AC&color=fff&size=80";

const user = ref(userStore.user || JSON.parse(localStorage.getItem("user") || "{}"));

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showProfileMenu.value = false;
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
  showNotifications.value = false;
};

const logout = () => {
  showProfileMenu.value = false;
  userStore.logout();
  localStorage.removeItem("user");
  router.push("/login");
};

const closeDropdowns = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".notifications") && !target.closest(".profile-menu") && !target.closest(".dropdown-menu")) {
    showNotifications.value = false;
    showProfileMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdowns);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdowns);
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #01712B;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  margin-bottom: 20px;
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #f3f4f6;
  padding: 8px 12px;
  border-radius: 8px;
}

.search-bar input {
  border: none;
  background: none;
  margin-left: 8px;
  outline: none;
  width: 200px;
}

.navbar-icons {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notifications {
  position: relative;
  cursor: pointer;
}

.notif-bell {
  font-size: 20px;
  color: #374151;
}

.notif-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 50%;
  font-weight: bold;
}

.profile-menu img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  right: 10px;
  top: 60px;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 10px;
  width: 280px;
  z-index: 10;
  transition: all 0.3s ease-in-out;
}

.notif-dropdown h4 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}

.notif-dropdown ul {
  list-style: none;
  padding: 0;
}

.notif-dropdown ul li {
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
}

.notif-dropdown ul li:last-child {
  border-bottom: none;
}

.profile-dropdown {
  padding: 0;
  overflow: hidden;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9fafb;
  padding: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.profile-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.profile-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.profile-header p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.profile-dropdown ul {
  list-style: none;
  padding: 0;
}

.profile-dropdown ul li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

.profile-dropdown ul li:hover {
  background: #f3f4f6;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
