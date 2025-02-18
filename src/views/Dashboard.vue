<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dashboard-container">
    <!-- 📦 Section Widgets -->
    <div class="widgets-container">
      <div class="widget fade-in">
        <h3>🚛 Nombre de tâches </h3>
    <p class="big-number">{{ totalCollections }}</p>
    <p>Tâches en attente: {{ pendingCollections }}</p>
    <p>Tâches terminées: {{ completedCollections }}</p>
  </div>

      <div class="widget fade-in">
        <h3>♻️ Taux de Recyclage</h3>
        <PieChart :data="recyclingRateData" />
      </div>

      <div class="widget fade-in">
        <h3>🌍 Pollution Évitée</h3>
        <BarChart :data="pollutionData" />
      </div>
    </div>

    <!-- 📈 Graphiques & Tâches -->
    <div class="graph-tasks-container">
      <div class="graph fade-in">
        <h3>📈 Évolution du Recyclage</h3>
        <LineChart :data="recyclingTrend" />
      </div>

      <div class="tasks fade-in">
        <h3>📝 Tâches du Jour</h3>
        <ul>
          <li v-for="task in tasks" :key="task.id">✅ {{ task.name }} - {{ task.time }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import PieChart from "@/components/PieChart.vue";
import BarChart from "@/components/BarChart.vue";
import LineChart from "@/components/LineChart.vue";
import axios from 'axios';

// ✅ Définition des types
interface Task {
  id: number;
  name: string;
  time: string;
}

// ✅ Définition des variables réactives avec types explicites
const totalCollections = ref(0);

const pendingCollections = ref(0); // Tâches en attente
const completedCollections = ref(0); // Tâches terminées
const recyclingRateData = ref<number[]>([]);
const pollutionData = ref<number[]>([]);
const recyclingTrend = ref<number[]>([]);

const tasks = ref<Task[]>([]);


    const router = useRouter();

    onMounted(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');  // Redirige vers la connexion si aucun token
      }
    });

// ✅ Simulation de récupération de données API
const fetchData = async () => {
  try {
    // Simuler un appel API avec setTimeout
    setTimeout(() => {


      recyclingRateData.value = [40, 30, 20, 10]; // Ex: verre, plastique, métal, autres
      pollutionData.value = [100, 150, 200, 250]; // Ex: données de pollution
      recyclingTrend.value = [10, 20, 30, 50, 80, 100]; // Ex: tendance recyclage
      tasks.value = [
        { id: 1, name: "Ramassage Fidjrossè", time: "08h00" },
        { id: 2, name: "Maintenance Camions", time: "14h00" },
        { id: 3, name: "Tri des Déchets", time: "16h30" },
      ];
    }, 1000);
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
  }
};

// ✅ Charger les données au montage
onMounted(fetchData);


/// Fonction pour récupérer les tâches depuis l'API
const getTaskCount = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/tasks/count/sorted-by-location'); // URL de ton API Laravel

    // Mise à jour des variables avec les données de la réponse
    totalCollections.value = response.data.total_tasks; // Total des tâches
    pendingCollections.value = response.data.pending_tasks; // Tâches en attente
    completedCollections.value = response.data.completed_tasks; // Tâches terminées


  } catch (error) {
    console.error('Erreur lors de la récupération des tâches :', error);
  }
};

// Appeler la fonction au montage du composant
onMounted(() => {
  getTaskCount();
});
</script>

<style scoped>
/* 🌿 Conteneur principal */
.dashboard-container {
  padding: 20px;
  background: linear-gradient(120deg, #e0f7fa, #f1f8e9);
  min-height: 100vh;
}

/* 📦 Widgets */
.widgets-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.widget {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease-in-out;
}


.widget:hover {
  transform: scale(1.05);
}

.big-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #01712b;
  margin-top: 10px;
}

/* 📈 Graphiques et Tâches */
.graph-tasks-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.graph, .tasks {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.graph:hover, .tasks:hover {
  transform: scale(1.03);
}

/* 🎨 Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 1s ease-in-out;
}
</style>


