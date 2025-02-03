<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBell, faUser, faSearch, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "../stores/userStore"; // ✅ Vérifie que le chemin est correct





const router = useRouter();
const showNotifications = ref(false);
const showProfileMenu = ref(false);

// ✅ Récupérer les données utilisateur depuis Pinia ou localStorage
const userStore = useUserStore();
const user = ref(userStore.user || JSON.parse(localStorage.getItem("user") || "{}"));

// ✅ Gestion des dropdowns
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showProfileMenu.value = false;
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
  showNotifications.value = false;
};

// ✅ Déconnexion et redirection vers `/login`
const logout = () => {
  showProfileMenu.value = false;
  userStore.logout(); // Déconnexion via Pinia
  localStorage.removeItem("user"); // Supprimer les données du localStorage
  router.push("/login");
};

// ✅ Gestion du clic en dehors des dropdowns
const closeDropdowns = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".notifications") && !target.closest(".profile-menu")) {
    showNotifications.value = false;
    showProfileMenu.value = false;
  }
};

// ✅ Ajouter et supprimer les écouteurs d'événements
onMounted(() => {
  document.addEventListener("click", closeDropdowns);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdowns);
});
</script>

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
          :src="user.profilePicture || 'https://via.placeholder.com/40'"
          alt="User"
          class="avatar"
          @click.stop="toggleProfileMenu"
        />
      </div>
    </div>

    <!-- ✅ Dropdown Profil amélioré -->
    <transition name="fade">
      <div v-if="showProfileMenu" class="dropdown-menu profile-dropdown">
        <div class="profile-header">
          <img :src="user.profilePicture || 'https://via.placeholder.com/50'" alt="User" class="profile-avatar" />
          <div>
            <h4>{{ user.name || 'Utilisateur inconnu' }}</h4>
            <p>{{ user.email || 'email@example.com' }}</p>
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

<style scoped>
/* ✅ Navbar */
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

/* 🔍 Barre de recherche */
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

/* ✅ Icônes de la navbar */
.navbar-icons {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 🔔 Notifications */
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

/* 👤 Profil */
.profile-menu img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

/* ✅ Dropdown Menu */
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

/* 👤 Profil Dropdown */
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

/* ✅ Liens du menu */
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

/* ✅ Animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
