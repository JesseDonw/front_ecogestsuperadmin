<template>
  <div class="app-container">
    <!-- ✅ Cache Sidebar sur Signup et Login -->
    <SidebarMenu v-if="!isAuthPage" />

    <div class="main-content" :class="{ 'full-width': isAuthPage }">
      <!-- ✅ Cache Navbar sur Signup et Login -->
      <NavbarAdmin v-if="!isAuthPage" />

      <!-- ✅ Transition fluide entre les pages -->
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import SidebarMenu from "@/components/Sidebar.vue";
import NavbarAdmin from "@/components/Navbar.vue";

const route = useRoute();

// ✅ Détecte si la page est Signup ou Login
const isAuthPage = computed(() => ["/signup", "/login"].includes(route.path));

// ✅ Force le scroll en haut quand on change de page
watchEffect(() => {
  window.scrollTo(0, 0);
});
</script>

<style scoped>
/* ✅ Conteneur principal */
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ✅ Contenu principal ajusté */
.main-content {
  flex-grow: 1;
  margin-left: 250px; /* Prend en compte la sidebar */
  padding: 20px;
  overflow-y: auto;
  background: #f9fafb;
  transition: margin-left 0.3s ease-in-out;
}

/* ✅ Quand on est sur Signup ou Login, pas de sidebar */
.full-width {
  margin-left: 0;
}

/* ✅ Animation de transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
