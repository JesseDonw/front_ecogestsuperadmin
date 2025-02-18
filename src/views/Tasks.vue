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
            <th>Nom</th>
            <th>Localisation</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.date_envoie_tache }}</td>
            <td>{{ task.nom_tache }}</td>
            <td>{{ task.localisation ? task.localisation.location + ' (' + task.localisation.latitude + ', ' + task.localisation.longitude + ')': 'Non défini'  }}</td>
            <td>
              <select v-model="task.statut" class="input" @change="updateTaskStatus(task)">
                <option value="en attente">En attente</option>
                <option value="en cours">En cours</option>
                <option value="terminée">Terminée</option>
              </select>
            </td>
            <td class="actions">
              <button class="btn-edit" @click="editTask(task)"> Modifier</button>
              <button class="btn-delete" @click="deleteTask(task.id)"> Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Intégration du composant AddTaskForm -->
    <AddTaskForm v-if="showModal" :isOpen="showModal" @close="showModal = false" @taskAdded="addNewTask" />

    <!-- Intégration du composant UpdateTaskForm -->
    <UpdateTaskForm
      v-if="showEditModal"
      :isOpen="showEditModal"
      :taskToEdit="taskToEdit!"
      @close="showEditModal = false"
      @taskUpdated="updateTaskInList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import AddTaskForm from "@/components/AddTaskForm.vue";
import UpdateTaskForm from "@/components/UpdateTaskForm.vue";

// ✅ Définition des interfaces
interface Location {
  id: number;
  location: string;
  latitude:number;
  longitude: number;
}

interface Task {
  id: number;
  nom_tache: string;
  date_envoie_tache: string;
  localisation: Location | null;
  statut: string;
  description?: string; // Optionnel
  localisation_id?: number | null; // Optionnel
}

// ✅ Gestion des tâches
const tasks = ref<Task[]>([]);
const showModal = ref<boolean>(false);
const showEditModal = ref<boolean>(false);
const taskToEdit = ref<Task | null>(null);

// ✅ Charger les tâches depuis l'API Laravel
const fetchTasks = async () => {
  try {
    const response = await axios.get<Task[]>("http://127.0.0.1:8000/api/taches");
    tasks.value = response.data;
  } catch (error) {
    console.error("❌ Erreur lors du chargement des tâches :", error);
  }
};

// ✅ Ajouter une nouvelle tâche depuis le composant enfant
const addNewTask = (newTask: Task) => {
  tasks.value.push(newTask);
  fetchTasks();
};

// ✅ Mettre à jour uniquement le statut d'une tâche
const updateTaskStatus = async (task: Task) => {
  try {
    await axios.put(`http://127.0.0.1:8000/api/taches/${task.id}`, { statut: task.statut });
    fetchTasks();
    console.log("✅ Statut mis à jour :", task.statut);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du statut :", error);
  }
};

// ✅ Adapter les propriétés de localisation pour UpdateTaskForm
const adaptTaskForUpdate = (task: Task) => {
  return {
    ...task,
    localisation: task.localisation
      ? { id: task.localisation.id, location: task.localisation.location }
      : null,
  };
};

// ✅ Modifier une tâche avec adaptation des propriétés
const editTask = (task: Task) => {
  taskToEdit.value = adaptTaskForUpdate(task) as unknown as Task;
  showEditModal.value = true;
};

// ✅ Mettre à jour la tâche dans la liste après modification
const updateTaskInList = (updatedTask: Task) => {
  const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
  if (index !== -1) {
    tasks.value[index] = updatedTask;
  }
};

// ✅ Supprimer une tâche
const deleteTask = async (id: number) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/taches/${id}`);
    fetchTasks();
    tasks.value = tasks.value.filter((task) => task.id !== id);
    console.log("✅ Tâche supprimée avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de la tâche :", error);
  }
};

// ✅ Charger les données au montage du composant
onMounted(fetchTasks);
</script>





<style scoped>
/* ✅ Conteneur principal */
.tasks-container {
  width: 85%;
  margin: 30px auto;
  padding: 30px;
  background: #f4f6f9;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease-in-out;
}

.tasks-container:hover {
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

/* ✅ Titre */
.title {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
  position: relative;
}

.title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: #01712b;
  margin: 8px auto 0;
  border-radius: 2px;
}

/* ✅ Bouton ajouter une tâche */
.btn-add {
  background: linear-gradient(135deg, #01712b, #02a045);
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  margin-bottom: 25px;
  transition: background 0.3s ease, transform 0.2s ease;
}

.btn-add:hover {
  background: linear-gradient(135deg, #02a045, #01712b);
  transform: translateY(-2px);
}

/* ✅ Table */
.table-container {
  overflow-x: auto;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 15px 20px;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
  transition: background 0.3s ease;
}

th {
  background: #ecf0f1;
  color: #34495e;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 14px;
}

tr:hover td {
  background: #f9fbfc;
}

/* ✅ Sélecteur de statut */
.input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  background: #f9f9f9;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.input:hover, .input:focus {
  border-color: #01712b;
  background: white;
  outline: none;
}

/* ✅ Actions */
.actions {
  text-align: center;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-edit, .btn-delete {
  background: #dfe6e9;
  color: #2d3436;
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease, transform 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-edit:hover, .btn-delete:hover {
  background: #01712b;
  color: white;
  transform: translateY(-2px);
}



/* ✅ Responsive Design */
@media (max-width: 768px) {
  .tasks-container {
    width: 95%;
    padding: 20px;
  }

  th, td {
    padding: 12px 15px;
  }

  .btn-add {
    padding: 10px 20px;
    font-size: 14px;
  }

  .btn-edit, .btn-delete {
    padding: 8px 10px;
    font-size: 13px;
  }
}
</style>
