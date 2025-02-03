<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dashboard-container">
  

    <!-- 📦 Section Widgets -->
    <div class="widgets-container">
      <div class="widget">
        <h3>🚛 Collectes Aujourd’hui</h3>
        <p class="big-number">{{ totalCollections }}</p>
        <p>+{{ additionalCollections }} collectes supplémentaires</p>
      </div>

      <div class="widget">
        <h3>♻️ Taux de Recyclage</h3>
        <PieChart />
      </div>

      <div class="widget">
        <h3>🌍 Pollution Évitée</h3>
        <BarChart />
      </div>
    </div>

    <!-- 📈 Graphiques & Tâches -->
    <div class="graph-tasks-container">
      <div class="graph">
        <h3>📈 Évolution du Recyclage</h3>
        <LineChart />
      </div>

      <div class="tasks">
        <h3>📝 Tâches du Jour</h3>
        <ul>
          <li v-for="task in tasks" :key="task.id">✅ {{ task.name }} - {{ task.time }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PieChart from "@/components/PieChart.vue";
import BarChart from "@/components/BarChart.vue";
import LineChart from "@/components/LineChart.vue";

// Collectes et statistiques
const totalCollections = ref(12);
const additionalCollections = ref(3);

// Liste des tâches
const tasks = ref([
  { id: 1, name: "Ramassage Fidjrossè", time: "08h00" },
  { id: 2, name: "Maintenance Camions", time: "14h00" },
]);
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 📦 Widgets */
.widgets-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.widget {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.big-number {
  font-size: 2rem;
  font-weight: bold;
}

/* 📈 Graphiques et Tâches */
.graph-tasks-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.graph {
  flex: 2;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.tasks {
  flex: 1;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
