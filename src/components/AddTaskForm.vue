<template>
  <div v-if="props.isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">➕ Ajouter une Tâche</h2>
        <button class="close-modal" @click="closeForm">✖</button>
      </div>

      <form @submit.prevent="submitTask">
        <!-- Nom de la Tâche -->
        <label>Nom de la Tâche :</label>
        <input type="text" v-model="task.description" class="input" required />

        <!-- Date -->
        <label>Date :</label>
        <input type="date" v-model="task.date_envoie_tache" class="input" required />

        <!-- Localisation -->
        <label>Localisation :</label>
        <select v-model="task.localisation_id" class="input">
          <option disabled value="">Sélectionner une localisation</option>
          <option v-for="location in locations" :key="location.id" :value="location.id">
            {{ location.location }} ({{ location.latitude }}, {{ location.longitude }})
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
import { ref, defineProps, defineEmits, onMounted } from "vue";
import axios from "axios";

// ✅ Définition des types
interface Location {
  id: number;
  location: string;
  latitude:number;
  longitude: number;
}

interface Task {
  description: string;
  date_envoie_tache: string;
  localisation_id: number | null;
  statut: string;
}

// ✅ Définition des props et événements
const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close", "taskAdded"]);

// ✅ Définition de la tâche par défaut
const task = ref<Task>({
  description: "",
  date_envoie_tache: "",
  localisation_id: null,
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
    const response = await axios.get("https://ecogest1-69586dbc1b71.herokuapp.com/api/localisations");
    locations.value = response.data;
  } catch (error) {
    console.error("Erreur chargement localisations :", error);
    errorMessage.value = "Impossible de charger les localisations.";
  } finally {
    loading.value = false;
  }
};
onMounted(fetchLocations);

// ✅ Fonction pour soumettre une tâche à l’API Laravel
const submitTask = async () => {
  try {
    console.log("Données envoyées :", task.value);

    const response = await axios.post("https://ecogest1-69586dbc1b71.herokuapp.com/api/taches", {
      nom_tache: task.value.description, // ✅ Correction ici
      date_envoie_tache: task.value.date_envoie_tache,
      localisation_id: task.value.localisation_id,
      statut: task.value.statut,
    });

    console.log("✅ Tâche ajoutée avec succès :", response.data);

    // ✅ Émettre l'événement pour mettre à jour la liste des tâches
    emit("taskAdded", response.data.tache);

    // ✅ Réinitialiser le formulaire après ajout
    resetForm();
    closeForm();
  } catch (error) {
  if (error instanceof Error) {
    console.error("🚨 Erreur complète :", error.message);
    errorMessage.value = "Erreur lors de l'ajout de la tâche.";
  } else {
    console.error("🚨 Erreur inconnue :", error);
    errorMessage.value = "Erreur inattendue lors de l'ajout de la tâche.";
  }
}

};


// ✅ Réinitialiser le formulaire après soumission
const resetForm = () => {
  task.value = {
    description: "",
    date_envoie_tache: "",
    localisation_id: null,
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
  background: rgba(0, 0, 0, 0.6); /* Légèrement plus foncé pour plus de contraste */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px); /* Ajoute un léger flou derrière la modale */
}

.modal-content {
  background: linear-gradient(145deg, #ffffff, #f0f4f3); /* Légère variation pour un effet subtil */
  padding: 25px;
  border-radius: 15px;
  width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: transform 0.3s ease;
}

.modal-content:hover {
  transform: translateY(-5px); /* Effet de lévitation au survol */
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
  color: #01712b; /* Couleur principale */
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
  color: #01712b; /* Accentue la couleur au survol */
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
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Légère profondeur dans les champs */
}

.input:focus {
  border-color: #01712b;
  background-color: white;
  outline: none;
  box-shadow: 0 0 8px rgba(1, 113, 43, 0.3); /* Glow vert au focus */
}

/* ✅ Style pour les boutons */
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.btn-cancel,
.btn-save {
  background: linear-gradient(135deg, rgb(154, 175, 160), #a1b5a7); /* Gradient subtil */
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
  background: linear-gradient(135deg, #01712b, #02a045); /* Accentuation du vert au survol */
  color: white;
  transform: translateY(-2px); /* Effet de "bouton qui saute" */
}

.loading-text {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin-top: 10px;
}

.error-text {
  font-size: 14px;
  color: #d9534f; /* Rouge plus moderne */
  text-align: center;
  margin-top: 10px;
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
