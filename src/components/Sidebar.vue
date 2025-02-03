<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faHome, faEnvelope, faUser, faTasks, faBell, faCalendar, faUsers, faBars } from "@fortawesome/free-solid-svg-icons";

const router = useRouter();
const isCollapsed = ref(false);

const navigateTo = (route: string) => {
  router.push(route);
};


</script>

<template>
  <div :class="['sidebar-menu', { 'collapsed': isCollapsed }]">
    <!-- ✅ Bouton toggle sans fond -->
    <button class="toggle-btn">
      <FontAwesomeIcon :icon="faBars" />
    </button>

    <nav>
      <ul>
        <li @click="navigateTo('/')" :class="{ active: $route.path === '/' }">
          <FontAwesomeIcon :icon="faHome" />
          <span v-if="!isCollapsed">Dashboard</span>
        </li>

        <li @click="navigateTo('/messages')" :class="{ active: $route.path === '/messages' }">
          <FontAwesomeIcon :icon="faEnvelope" />
          <span v-if="!isCollapsed">Messages</span>
        </li>
        <li @click="navigateTo('/profile')" :class="{ active: $route.path === '/profile' }">
          <FontAwesomeIcon :icon="faUser" />
          <span v-if="!isCollapsed">Profil</span>
        </li>
        <li @click="navigateTo('/tasks')" :class="{ active: $route.path === '/tasks' }">
          <FontAwesomeIcon :icon="faTasks" />
          <span v-if="!isCollapsed">Tâches</span>
        </li>

        <li @click="navigateTo('/calendar')" :class="{ active: $route.path === '/calendar' }">
          <FontAwesomeIcon :icon="faCalendar" />
          <span v-if="!isCollapsed">Calendrier</span>
        </li>
        <li @click="navigateTo('/agents')" :class="{ active: $route.path === '/agents' }">
          <FontAwesomeIcon :icon="faUsers" />
          <span v-if="!isCollapsed">Agents</span>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
/* ✅ Sidebar Fixe */
.sidebar-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: #01712B;
  border-right: 1px solid #e5e7eb;
  transition: width 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow: hidden;
}

.collapsed {
  width: 80px;
}

/* ✅ Bouton toggle sans fond */
.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 10px;

}

nav ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

nav ul li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s ease-in-out;
}

nav ul li:hover {
  background: #f3f4f6;
}

nav ul li.active {
  background: #F9A84D;
  color: white;
}

nav ul li svg {
  font-size: 18px;
}
</style>
