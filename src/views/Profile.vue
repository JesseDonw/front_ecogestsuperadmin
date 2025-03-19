<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="profile-container">
    <!-- Bannière d'édition du profil -->
    <div class="edit-banner">
      <h2>Modifier le Profil</h2>
      <p>Complétez vos informations</p>
    </div>

    <div class="profile-layout">
      <!-- Formulaire d'édition -->
      <div class="edit-profile">
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label>Entreprise</label>
            <input type="text" class="input-field" value="ECOGEST" disabled />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Nom d'utilisateur</label>
              <input type="text" v-model="profile.username" class="input-field" required />
            </div>
            <div class="form-group">
              <label>Adresse Email</label>
              <input type="email" v-model="profile.email" class="input-field" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Prénom</label>
              <input type="text" v-model="profile.firstName" class="input-field" required />
            </div>
            <div class="form-group">
              <label>Nom</label>
              <input type="text" v-model="profile.lastName" class="input-field" required />
            </div>
          </div>

          <div class="form-group">
            <label>Adresse</label>
            <input type="text" v-model="profile.address" class="input-field" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Ville</label>
              <input type="text" v-model="profile.city" class="input-field" required />
            </div>
            <div class="form-group">
              <label>Pays</label>
              <input type="text" v-model="profile.country" class="input-field" required />
            </div>
            <div class="form-group">
              <label>Code Postal</label>
              <input type="text" v-model="profile.postalCode" class="input-field" required />
            </div>
          </div>

          <div class="form-group">
            <label>À propos de moi</label>
            <textarea v-model="profile.about" class="textarea-field" required></textarea>
          </div>

          <button type="submit" class="btn-save">Mettre à jour le profil</button>
        </form>
      </div>

      <!-- Carte du profil -->
      <div class="profile-card">
        <div class="profile-header">
          <img :src="profile.picture || defaultPicture" alt="Profil" class="profile-picture" />

          <!-- Bouton "+" superposé -->
          <label class="edit-photo">
            <input type="file" @change="uploadImage" class="hidden" />
            <span>➕</span>
          </label>
        </div>

        <div class="profile-info">
          <h2>{{ profile.firstName }} {{ profile.lastName }}</h2>
          <p class="profile-title">{{ profile.role }}</p>
          <p class="profile-desc">
            "Expert en gestion des déchets et développement durable chez ECOGEST."
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";


const defaultPicture = "https://via.placeholder.com/120";

const profile = ref({
  username: "Super Admin",
  email: "superad@gmail.com",
  firstName: "Super",
  lastName: "Admin",
  address: "Rue des Entrepreneurs, Cotonou",
  city: "Cotonou",
  country: "Bénin",
  postalCode: "22900",
  about: "Spécialiste en gestion écologique et recyclage durable.",
  role: "Super Admin ECOGEST",
  picture: "https://ui-avatars.com/api/?name=Ad&background=0D8AC&color=fff&size=80",
});

// Fonction pour modifier la photo de profil
const uploadImage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profile.value.picture = e.target?.result as string;
    };
    reader.readAsDataURL(target.files[0]);
  }
};

const updateProfile = () => {
  alert("Profil mis à jour avec succès !");
};
</script>

<style scoped>
/* Conteneur principal */
.profile-container {
  background: #f8fafc;
  min-height: 100vh;
  padding: 20px;
}

/* Bannière de modification */
.edit-banner {
  background: #01712B;
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
  margin-bottom: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* Mise en page */
.profile-layout {
  display: flex;
  gap: 20px;
}

/* Formulaire */
.edit-profile {
  flex: 2;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.input-field,
.textarea-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.textarea-field {
  height: 80px;
}

.btn-save {
  background: #01712B;
  color: white;
  padding: 12px;
  border: none;
  width: 100%;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.btn-save:hover {
  background: #01712B;
}

/* Carte du profil */
.profile-card {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.profile-header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* Bouton "+" superposé sur l'image */

  .edit-photo {
  position: absolute;
  bottom: 10px;
  right: 110px; /* Augmente cette valeur pour déplacer le bouton vers la gauche */
  background: #000;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
}

.edit-photo input {
  display: none;
}


/* Infos personnelles */
.profile-info {
  text-align: center;
}

.profile-title {
  color: #6b7280;
  font-size: 14px;
}

.profile-desc {
  font-size: 12px;
  color: #374151;
  margin-top: 10px;
}
</style>
