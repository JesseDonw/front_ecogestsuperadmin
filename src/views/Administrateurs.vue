<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="admins-container">
    <div class="header">
      <button class="btn-add" @click="openModal">➕ Ajouter un Administrateur</button>
    </div>

    <!-- Grille des administrateurs -->
    <div class="admins-grid">
      <div v-for="admin in admins" :key="admin.id" class="admin-card">
        <div class="admin-header">
          <img :src="getPhotoUrl(admin.photo_url)" alt="Photo de l'administrateur" class="admin-photo" />
        </div>
        <div class="admin-body">
          <h2 class="admin-name">{{ admin.nom_admin }} {{ admin.prenom_admin }}</h2>
          <p class="admin-email">{{ admin.mail_admin }}</p>
        </div>
      </div>
    </div>

    <!-- Modale pour ajouter un administrateur -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">➕ Ajouter un Administrateur</h2>
        <form @submit.prevent="addAdmin">
          <label>Nom :</label>
          <input type="text" v-model="newAdmin.nom_admin" class="input" required />

          <label>Prénom :</label>
          <input type="text" v-model="newAdmin.prenom_admin" class="input" required />

          <label>Email :</label>
          <input type="email" v-model="newAdmin.mail_admin" class="input" required />

          <label>Mot de passe :</label>
          <input type="password" v-model="newAdmin.mdp_admin" class="input" required />

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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

interface Admin {
  id: number;
  nom_admin: string;
  prenom_admin: string;
  mail_admin: string;
  photo_url?: string;
  photo_admin?: File | null;
}

const admins = ref<Admin[]>([]);
const showModal = ref(false);
const previewPhoto = ref<string | null>(null);
const router = useRouter();

const defaultPhoto = "https://ui-avatars.com/api/?name=Ad&background=0D8AC&color=fff&size=80";

const newAdmin = ref<Omit<Admin, "id"> & { mdp_admin: string }>({
  nom_admin: "",
  prenom_admin: "",
  mail_admin: "",
  mdp_admin: "",
  photo_admin: null,
});

const getPhotoUrl = (photoPath?: string) => photoPath ? `https://ecogest-e4b9c843b0a7.herokuapp.com/${photoPath}` : defaultPhoto;

const fetchAdmins = async () => {
  try {
    const response = await axios.get("https://ecogest-e4b9c843b0a7.herokuapp.com/api/admins");  // Utilise la bonne route
    admins.value = response.data;  // Met à jour la liste des administrateurs
  } catch (error) {
    console.error("Erreur lors de la récupération des administrateurs :", error);
  }
};
onMounted(fetchAdmins);

const openModal = () => showModal.value = true;
const closeModal = () => {
  showModal.value = false;
  resetNewAdmin();
};

const resetNewAdmin = () => {
  newAdmin.value = { nom_admin: "", prenom_admin: "", mail_admin: "", mdp_admin: "", photo_admin: null };
  previewPhoto.value = null;
};

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file && ["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
    newAdmin.value.photo_admin = file;
    previewPhoto.value = URL.createObjectURL(file);
  } else {
    alert("Le format de l'image doit être PNG, JPG ou JPEG.");
  }
};

const addAdmin = async () => {
  try {
    const formData = new FormData();
    formData.append("nom_admin", newAdmin.value.nom_admin);
    formData.append("prenom_admin", newAdmin.value.prenom_admin);
    formData.append("mail_admin", newAdmin.value.mail_admin);
    formData.append("mdp_admin", newAdmin.value.mdp_admin);
    if (newAdmin.value.photo_admin) formData.append("photo_admin", newAdmin.value.photo_admin);

    const response = await axios.post("https://ecogest-e4b9c843b0a7.herokuapp.com/api/registeradmin", formData);

    console.log("Réponse de l'API :", response.data);

    if (response.data.token) {
      localStorage.setItem("admin_token", response.data.token);  // Stocker le token
      router.push("/dashboard");  // Redirection après inscription
    } else {
      alert("Aucun token reçu. Vérifiez l'API.");
    }

    admins.value.push({ ...response.data.admin, photo_url: response.data.photo_url || previewPhoto.value });
    closeModal();
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'administrateur :", error);
  }
};
</script>

<style scoped>
/* Conteneur principal */
.admins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.admin-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 20px;
  transition: transform 0.2s;
}

.admin-card:hover {
  transform: scale(1.05);
}

.admin-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.admin-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ccc;
}

.admin-name {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
}

.admin-email {
  font-size: 14px;
  color: #555;
}

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
  font-weight: bold;
}

.btn-add:hover {
  background: #025f24;
}

/* Modale */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: linear-gradient(145deg, #ffffff, #f0f4f3);
  padding: 25px;
  border-radius: 15px;
  width: 480px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: transform 0.3s ease;
}

.modal-content:hover {
  transform: translateY(-5px);
}

.modal-title {
  font-size: 22px;
  font-weight: bold;
  color: #01712b;
  margin-bottom: 15px;
}

/* Champs de formulaire */
.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  background-color: #f9fafb;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.input:focus {
  border-color: #01712b;
  background-color: white;
  outline: none;
  box-shadow: 0 0 10px rgba(1, 113, 43, 0.3);
}

/* Boutons de la modale */
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.btn-cancel,
.btn-save {
  background: linear-gradient(135deg, rgb(154, 175, 160), #a1b5a7);
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
  background: linear-gradient(135deg, #01712b, #02a045);
  color: white;
  transform: translateY(-2px);
}

/* Aperçu des photos */
.preview {
  margin-top: 10px;
  text-align: center;
}

.preview-photo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #ddd;
}

/* Responsive Design */
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
