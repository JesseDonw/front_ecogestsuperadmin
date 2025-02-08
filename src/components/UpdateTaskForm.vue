<template>
  <div v-if="props.isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">🔄 Mettre à Jour la Tâche</h2>
        <button class="close-modal" @click="closeForm">✖</button>
      </div>

      <form @submit.prevent="updateTask">
        <!-- Nom de la Tâche -->
        <label>Nom de la Tâche :</label>
        <input type="text" v-model="task.description" class="input" required />

        <!-- Date -->
        <label>Date :</label>
        <input type="date" v-model="task.date_envoie_tache" class="input" required />

        <!-- Localisation -->
        <label>Localisation :</label>
        <select v-model="task.localisation_id" class="input" required>
          <option disabled value="">Sélectionner une localisation</option>
          <option v-for="location in locations" :key="location.id" :value="location.id">
            {{ location.location }}
          </option>
        </select>

        <!-- Statut -->
        <label>Statut :</label>
        <select v-model="task.statut" class="input" required>
          <option value="en attente">En Attente</option>
          <option value="en cours">En Cours</option>
          <option value="terminée">Terminée</option>
        </select>

        <!-- Messages de chargement et erreurs -->
        <p v-if="loading" class="loading-text">
          <span class="spinner"></span> Chargement des localisations...
        </p>
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <!-- Actions -->
        <div class="modal-actions">
          <button type="button" @click="closeForm" class="btn-cancel">Annuler</button>
          <button type="submit" class="btn-save" :disabled="loading">Mettre à Jour</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from "vue";
import axios from "axios";

// Interface pour la localisation
interface Location {
  id: number;
  location: string;
}

// Interface pour la tâche
interface Task {
  id: number;
  nom_tache: string;
  date_envoie_tache: string;
  localisation: Location | null;
  statut: string;
  description?: string;
  localisation_id?: number | null;
}

// Props et événements
const props = defineProps<{ isOpen: boolean; taskToEdit: Task }>();
const emit = defineEmits(["close", "taskUpdated"]);

// Initialisation de la tâche
const task = ref<Task>({
  ...props.taskToEdit,
  description: props.taskToEdit.description || props.taskToEdit.nom_tache,
  localisation_id: props.taskToEdit.localisation?.id || null
});

// Gestion des localisations et erreurs
const locations = ref<Location[]>([]);
const loading = ref(false);
const errorMessage = ref("");

// Récupération des localisations depuis l’API
const fetchLocations = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/localisations");
    locations.value = response.data;
  } catch (error) {
    handleApiError(error, "Impossible de charger les localisations.");
  } finally {
    loading.value = false;
  }
};
onMounted(fetchLocations);

// Fonction pour mettre à jour la tâche dans l’API Laravel
const updateTask = async () => {
  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/api/taches/${task.value.id}`,
      {
        nom_tache: task.value.description,
        date_envoie_tache: task.value.date_envoie_tache,
        localisation_id: task.value.localisation_id,
        statut: task.value.statut,
      }
    );

    emit("taskUpdated", response.data.tache);
    closeForm();
  } catch (error) {
    handleApiError(error, "Erreur lors de la mise à jour de la tâche.");
  }
};

// Gestion des erreurs API
const handleApiError = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error)) {
    errorMessage.value = error.response?.data.message || defaultMessage;
    console.error("Erreur de l'API :", error.response?.data);
  } else if (error instanceof Error) {
    errorMessage.value = error.message;
    console.error("Erreur :", error.message);
  } else {
    errorMessage.value = defaultMessage;
    console.error("Erreur inconnue :", error);
  }
};

// Fermer la modale
const closeForm = () => {
  emit("close");
};
</script>

<style scoped>
/* ✅ Style pour la modale */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* Plus sombre pour un contraste plus fort */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px); /* Effet de flou derrière la modale */
}

.modal-content {
  background: linear-gradient(145deg, #ffffff, #f0f4f3); /* Léger dégradé pour un effet de profondeur */
  padding: 25px;
  border-radius: 15px;
  width: 480px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: transform 0.3s ease;
}

.modal-content:hover {
  transform: translateY(-5px); /* Effet de lévitation subtil */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 22px;
  font-weight: bold;
  color: #01712b; /* Couleur principale pour le titre */
}

.close-modal {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #333;
  transition: color 0.3s ease;
}

.close-modal:hover {
  color: #01712b; /* Changement de couleur au survol */
}

/* ✅ Style pour les champs du formulaire */
.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  background-color: #f9fafb;
  transition: all 0.3s ease;
  margin-bottom: 15px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Légère ombre intérieure */
}

.input:focus {
  border-color: #01712b;
  background-color: white;
  outline: none;
  box-shadow: 0 0 10px rgba(1, 113, 43, 0.3); /* Effet de glow au focus */
}

/* ✅ Style pour les boutons */
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.btn-cancel,
.btn-save {
  background: linear-gradient(135deg, rgb(154, 175, 160), #a1b5a7); /* Gradient léger pour plus de profondeur */
  color: black;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.2s ease;
}

.btn-cancel:hover,
.btn-save:hover {
  background: linear-gradient(135deg, #01712b, #02a045); /* Vert plus vif au survol */
  color: white;
  transform: translateY(-2px); /* Légère élévation au survol */
}

/* ✅ Style pour les messages */
.loading-text {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin-top: 10px;
}

.error-text {
  font-size: 14px;
  color: #d9534f; /* Rouge plus doux et moderne */
  text-align: center;
  margin-top: 10px;
}

/* ✅ Spinner stylisé */
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #01712b;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ✅ Responsive Design */
@media (max-width: 600px) {
  .modal-content {
    width: 90%;
    padding: 20px;
  }

  .modal-title {
    font-size: 20px;
  }

  .btn-cancel, .btn-save {
    padding: 10px 15px;
    font-size: 14px;
  }
}
</style>
