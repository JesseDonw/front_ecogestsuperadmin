<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="agents-container">
    <div class="header">
      <button class="btn-add" @click="openModal">➕ Ajouter un Agent</button>
    </div>

    <!-- Grille des agents -->
    <div class="agents-grid">
      <div v-for="agent in agents" :key="agent.id" class="agent-card">
        <div class="agent-header">
          <img :src="agent.photo_url || defaultPhoto" alt="Photo de l'agent" class="agent-photo">
        </div>
        <div class="agent-body">
          <h2 class="agent-name">{{ agent.nom_agent }} {{ agent.prenom_agent }}</h2>
          <p class="agent-email">{{ agent.mail_agent }}</p>
        </div>
      </div>
    </div>

    <!-- Modale pour ajouter un agent -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">➕ Ajouter un Agent</h2>
        <form @submit.prevent="addAgent">
          <label>Nom :</label>
          <input type="text" v-model="newAgent.nom_agent" class="input" required>

          <label>Prénom :</label>
          <input type="text" v-model="newAgent.prenom_agent" class="input" required>

          <label>Email :</label>
          <input type="email" v-model="newAgent.mail_agent" class="input" required>

          <label>Mot de passe :</label>
          <input type="password" v-model="newAgent.mdp_agent" class="input" required>

          <label>Photo :</label>
          <input type="file" @change="handleImageUpload" class="input">
          <div v-if="previewPhoto" class="preview">
            <img :src="previewPhoto" class="preview-photo">
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

interface Agent {
  id: number;
  nom_agent: string;
  prenom_agent: string;
  mail_agent: string;
  photo_url?: string;
}

const defaultPhoto = "https://via.placeholder.com/150";
const showModal = ref(false);
const agents = ref<Agent[]>([]);
const previewPhoto = ref<string | null>(null);

const newAgent = ref({
  nom_agent: "",
  prenom_agent: "",
  mail_agent: "",
  mdp_agent: "",
  photo_agent: null as File | null,
});

// ✅ Charger les agents depuis l'API
const fetchAgents = async () => {
  try {
    const response = await axios.get("https://fcf6-137-255-41-249.ngrok-free.app/api/agents");
    agents.value = response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des agents :", error);
  }
};

// ✅ Ouvrir/Fermer le modal
const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  newAgent.value = { nom_agent: "", prenom_agent: "", mail_agent: "", mdp_agent: "", photo_agent: null };
  previewPhoto.value = null;
};

// ✅ Gérer l'upload de la photo
const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    newAgent.value.photo_agent = file;
    previewPhoto.value = URL.createObjectURL(file);
  }
};

// ✅ Ajouter un agent via API Laravel
const addAgent = async () => {
  try {
    const formData = new FormData();
    formData.append("nom_agent", newAgent.value.nom_agent);
    formData.append("prenom_agent", newAgent.value.prenom_agent);
    formData.append("mail_agent", newAgent.value.mail_agent);
    formData.append("mdp_agent", newAgent.value.mdp_agent);

    if (newAgent.value.photo_agent) {
      formData.append("photo_agent", newAgent.value.photo_agent);
    }

    console.log("Données envoyées :", Object.fromEntries(formData.entries())); // 🔍 Debug

    const response = await axios.post(
      "https://fcf6-137-255-41-249.ngrok-free.app/api/register",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("Réponse API :", response.data); // 🔍 Debug

    agents.value.push(response.data);
    closeModal();
  } catch (error) {
  if (axios.isAxiosError(error)) {
    console.error("Erreur API :", error.response?.data || error.message);
  } else {
    console.error("Erreur inconnue :", error);
  }
}
};

// ✅ Charger les agents au montage
onMounted(fetchAgents);
</script>

<style scoped>
/* Conteneur principal */
.agents-container {
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
}

/* En-tête */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-add {
  background: #01712B;
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-add:hover {
  background: #025f24;
}

/* Grille des agents */
.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

/* Carte d'agent */
.agent-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.agent-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #ddd;
}

.agent-name {
  font-size: 18px;
  font-weight: bold;
}

.agent-email {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 10px;
}

/* Modale */
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
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.input {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.preview {
  margin-top: 10px;
  text-align: center;
}

.preview-photo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
