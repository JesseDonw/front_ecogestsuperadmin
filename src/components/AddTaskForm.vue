<template>
  <div v-if="props.isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">➕ Ajouter une Tâche</h2>
        <button class="close-modal" @click="closeForm">✖</button>
      </div>

      <form @submit.prevent="submitTask">
        <!-- Nom de la tâche -->
        <label>Nom de la Tâche :</label>
        <input type="text" v-model="task.description" class="input" required />

        <!-- Date -->
        <label>Date :</label>
        <input type="date" v-model="task.date_envoie_tache" class="input" required />

        <!-- Localisation -->
        <label>Localisation :</label>
        <select v-model="task.zone" class="input" @focus="fetchLocations">
          <option disabled value="">Sélectionner une localisation</option>
          <option v-for="location in locations" :key="location.id" :value="formatLocation(location)">
            {{ formatLocation(location) }}
          </option>
        </select>

        <!-- Messages d'erreur -->
        <p v-if="loading" class="loading-text">Chargement des localisations...</p>
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <div class="modal-actions">
          <button type="button" @click="closeForm" class="btn-cancel">Annuler</button>
          <button type="submit" class="btn-save" :disabled="loading">Ajouter</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import axios from "axios";

// ✅ Définition des types
interface Location {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  client_id: number;
}

interface Task {
  description: string;
  date_envoie_tache: string;
  zone: string;
  statut: string;
}

// ✅ Définition des props et événements
const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close", "taskAdded"]);

// ✅ Définition de la tâche par défaut
const task = ref<Task>({
  description: "",
  date_envoie_tache: "",
  zone: "",
  statut: "en attente",
});

// ✅ Gestion des localisations et erreurs
const locations = ref<Location[]>([]);
const loading = ref(false);
const errorMessage = ref("");

// ✅ Récupération des localisations depuis l’API
const fetchLocations = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/localisations");
    locations.value = response.data.map((loc: Location) => ({
      id: loc.id,
      location: loc.location,
      latitude: loc.latitude,
      longitude: loc.longitude,
      client_id: loc.client_id
    }));
  } catch (error) {
    console.error("Erreur chargement localisations :", error);
    errorMessage.value = "Impossible de charger les localisations.";
  } finally {
    loading.value = false;
  }
};

// ✅ Formater la localisation pour l’affichage
const formatLocation = (location: Location) => {
  return `${location.location} (${location.latitude}, ${location.longitude}, ${location.client_id})`;
};

// ✅ Fonction pour soumettre une tâche à l’API Laravel
const submitTask = async () => {
  try {
    console.log("Données envoyées :", task.value);

    const response = await axios.post("http://127.0.0.1:8000/api/taches", {
      description: task.value.description,
      date_envoie_tache: task.value.date_envoie_tache,
      zone: task.value.zone,
      statut: task.value.statut,
    });

    console.log("Tâche ajoutée :", response.data);
    emit("taskAdded", response.data);
    resetForm(); // 🔥 Nettoie le formulaire après ajout
    closeForm();
  } catch (error) {
    console.error("Erreur ajout tâche :", error);
    errorMessage.value = "Erreur lors de l'ajout de la tâche.";
  }
};

// ✅ Réinitialiser le formulaire après soumission
const resetForm = () => {
  task.value = {
    description: "",
    date_envoie_tache: "",
    zone: "",
    statut: "en attente",
  };
};

// ✅ Fermer la modale
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 450px;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
}

.close-modal {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

/* ✅ Style pour les champs du formulaire */
.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: #f9fafb;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.input:focus {
  border-color: #01712b;
  background-color: white;
  outline: none;
}

/* ✅ Style pour les boutons */
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.btn-cancel,
.btn-save {
  background: rgb(154, 175, 160);
  color: black;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
}

.btn-cancel:hover,
.btn-save:hover {
  background: #01712b;
  color: white;
}

.loading-text {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin-top: 5px;
}

.error-text {
  font-size: 14px;
  color: red;
  text-align: center;
  margin-top: 5px;
}
</style>
