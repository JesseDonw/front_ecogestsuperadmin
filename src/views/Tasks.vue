<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="tasks-container">
    <h1 class="title">📌 Gestion des Tâches</h1>

    <!-- Bouton pour ajouter une tâche -->
    <div class="add-task">
      <button class="btn-add" @click="showModal = true">➕ Ajouter une Tâche</button>
    </div>

    <!-- Table des tâches -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Description</th>
            <th>Zone</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.date_envoie_tache }}</td>
            <td>{{ task.description }}</td>
            <td>{{ task.zone }}</td>
            <td>
              <select v-model="task.statut" class="input" @change="updateTask(task)">
                <option value="en attente">En attente</option>
                <option value="en cours">En cours</option>
                <option value="terminée">Terminée</option>
              </select>
            </td>
            <td class="actions">
              <button class="btn-delete" @click="deleteTask(task.id)">🗑 Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Intégration du composant AddTaskForm -->
    <AddTaskForm v-if="showModal" :isOpen="showModal" @close="showModal = false" @taskAdded="addNewTask" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import AddTaskForm from "@/components/AddTaskForm.vue";

// ✅ Définition des interfaces
interface Task {
  id: number;
  description: string;
  date_envoie_tache: string;
  zone: string;
  statut: string;
}

// ✅ Gestion des tâches
const tasks = ref<Task[]>([]);
const showModal = ref(false);

// ✅ Charger les tâches depuis l'API Laravel
const fetchTasks = async () => {
  try {
    const response = await axios.get<Task[]>("https://4969-197-234-219-114.ngrok-free.app/api/taches");
    tasks.value = response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des tâches :", error);
  }
};

// ✅ Ajouter une nouvelle tâche depuis le composant enfant
const addNewTask = (newTask: Task) => {
  tasks.value.push(newTask);
};

// ✅ Mettre à jour une tâche (statut)
const updateTask = async (task: Task) => {
  try {
    await axios.put(`https://4969-197-234-219-114.ngrok-free.app/api/taches/${task.id}`, { statut: task.statut });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche :", error);
  }
};

// ✅ Supprimer une tâche
const deleteTask = async (id: number) => {
  try {
    await axios.delete(`https://4969-197-234-219-114.ngrok-free.app/api/taches/${id}`);
    tasks.value = tasks.value.filter((task) => task.id !== id);
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche :", error);
  }
};

// ✅ Charger les données au montage du composant
onMounted(() => {
  fetchTasks();
});
</script>
