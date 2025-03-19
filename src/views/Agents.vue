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
          <img :src="getPhotoUrl(agent.photo_url)" alt="Photo de l'agent" class="agent-photo" />
        </div>
        <div class="agent-body">
          <h2 class="agent-name">{{ agent.nom_agent }} {{ agent.prenom_agent }}</h2>
          <p class="agent-role">{{ agent.mail_agent }}</p>
        </div>
        <div class="agent-actions">
          <button class="btn btn-edit" @click="openEditModal(agent)">Modifier</button>
          <button class="btn btn-delete" @click="deleteAgent(agent.id)">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Modale pour ajouter un agent -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">➕ Ajouter un Agent</h2>
        <form @submit.prevent="addAgent">
          <label>Nom :</label>
          <input type="text" v-model="newAgent.nom_agent" class="input" required />

          <label>Prénom :</label>
          <input type="text" v-model="newAgent.prenom_agent" class="input" required />

          <label>Email :</label>
          <input type="email" v-model="newAgent.mail_agent" class="input" required />

          <label>Mot de passe :</label>
          <input type="password" v-model="newAgent.mdp_agent" class="input" required />

          <label>Photo :</label>
          <input type="file" accept="image/png, image/jpg, image/jpeg" @change="handleImageUpload" class="input" />
          <div v-if="previewPhoto" class="preview">
            <img :src="previewPhoto" class="preview-photo" />
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save">Ajouter</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modale pour modifier un agent -->
    <div v-if="showEditModal && currentAgent" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">✏️ Modifier l'Agent</h2>
        <form @submit.prevent="updateAgent">
          <label>Nom :</label>
          <input type="text" v-model="currentAgent.nom_agent" class="input" required />

          <label>Prénom :</label>
          <input type="text" v-model="currentAgent.prenom_agent" class="input" required />

          <label>Email :</label>
          <input type="email" v-model="currentAgent.mail_agent" class="input" required />

          <label>Photo :</label>
          <input type="file" accept="image/png, image/jpg, image/jpeg" @change="handleEditImageUpload" class="input" />
          <div v-if="previewEditPhoto || currentAgent.photo_url" class="preview">
            <img :src="previewEditPhoto || getPhotoUrl(currentAgent.photo_url)" class="preview-photo" />
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeEditModal" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save">Mettre à jour</button>
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
  photo_agent?: File | null;
}

const agents = ref<Agent[]>([]);
const showModal = ref(false);
const showEditModal = ref(false);
const previewPhoto = ref<string | null>(null);
const previewEditPhoto = ref<string | null>(null);
const currentAgent = ref<Agent | null>(null);

const defaultPhoto = "https://ui-avatars.com/api/?name=AG&background=0D8ABC&color=fff&size=80";

const newAgent = ref<Omit<Agent, "id"> & { mdp_agent: string }>({
  nom_agent: "",
  prenom_agent: "",
  mail_agent: "",
  mdp_agent: "",
  photo_agent: null,
});

const getPhotoUrl = (photoPath?: string) => photoPath ? `https://ecogest1-69586dbc1b71.herokuapp.com/${photoPath}` : defaultPhoto;

const fetchAgents = async () => {
  try {
    const response = await axios.get("https://ecogest1-69586dbc1b71.herokuapp.com/api/agents");
    agents.value = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des agents :", error);
  }
};
onMounted(fetchAgents);

const openModal = () => showModal.value = true;
const closeModal = () => {
  showModal.value = false;
  resetNewAgent();
};

const resetNewAgent = () => {
  newAgent.value = { nom_agent: "", prenom_agent: "", mail_agent: "", mdp_agent: "", photo_agent: null };
  previewPhoto.value = null;
};

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file && ["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
    newAgent.value.photo_agent = file;
    previewPhoto.value = URL.createObjectURL(file);
  } else {
    alert("Le format de l'image doit être PNG, JPG ou JPEG.");
  }
};

const addAgent = async () => {
  try {
    const formData = new FormData();
    formData.append("nom_agent", newAgent.value.nom_agent);
    formData.append("prenom_agent", newAgent.value.prenom_agent);
    formData.append("mail_agent", newAgent.value.mail_agent);
    formData.append("mdp_agent", newAgent.value.mdp_agent);
    if (newAgent.value.photo_agent) formData.append("photo_agent", newAgent.value.photo_agent);

    const response = await axios.post("https://ecogest1-69586dbc1b71.herokuapp.com/api/register", formData);
    agents.value.push({ ...response.data.agent, photo_url: response.data.photo_url || previewPhoto.value });

    // Stocker le token dans le localStorage
    localStorage.setItem(`agent_token_${response.data.agent.id}`, response.data.token);

    closeModal();
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'agent :", error);
  }
};

const openEditModal = (agent: Agent) => {
  currentAgent.value = { ...agent };
  previewEditPhoto.value = null;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  currentAgent.value = null;
  previewEditPhoto.value = null;
};

const handleEditImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file && ["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
    previewEditPhoto.value = URL.createObjectURL(file);
    if (currentAgent.value) {
      currentAgent.value.photo_agent = file;
    }
  } else {
    alert("Le format de l'image doit être PNG, JPG ou JPEG.");
  }
};

const updateAgent = async () => {
  try {
    const formData = new FormData();
    formData.append("nom_agent", currentAgent.value!.nom_agent);
    formData.append("prenom_agent", currentAgent.value!.prenom_agent);
    formData.append("mail_agent", currentAgent.value!.mail_agent);

    const response = await axios.put(`https://ecogest1-69586dbc1b71.herokuapp.com/api/agent/${currentAgent.value!.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    const updatedAgent = response.data.agent;

    const index = agents.value.findIndex(agent => agent.id === updatedAgent.id);
    if (index !== -1) {
      agents.value[index] = { ...updatedAgent, photo_url: response.data.photo_url || previewEditPhoto.value };
    }

    closeEditModal();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'agent :", error);
  }
};

const deleteAgent = async (id: number) => {
  try {
    await axios.delete(`https://ecogest1-69586dbc1b71.herokuapp.com/api/agent/${id}`);
    agents.value = agents.value.filter(agent => agent.id !== id);

  } catch (error) {
    console.error("Erreur lors de la suppression de l'agent :", error);
  }
};
</script>



<style scoped>
/* Conteneur principal */
.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.agent-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 20px;
  transition: transform 0.2s;
}

.agent-card:hover {
  transform: scale(1.05);
}

.agent-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.agent-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ccc;
}

.agent-name {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
}

.agent-role {
  font-size: 14px;
  color: #555;
}

.agent-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
}

.btn-edit {
  background: rgb(154, 175, 160);
  color: black;
}

.btn-edit:hover {
  background: #7cb46f;
}

.btn-delete {
  background: rgb(154, 175, 160);
  color: black;
}

.btn-delete:hover {
  background: #d05860;
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
