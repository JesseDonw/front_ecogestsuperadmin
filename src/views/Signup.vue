<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
      <!-- Titre -->
      <h2 class="text-2xl font-bold text-gray-800">Créer un compte Administrateur</h2>
      <p class="text-gray-500 text-sm mb-4">Inscrivez-vous pour accéder à l’application.</p>

      <!-- Formulaire -->
      <form @submit.prevent="registerAdmin" class="space-y-4">
        <input type="text" v-model="admin.nom_admin" class="input-field" placeholder="Nom" required />
        <input type="text" v-model="admin.prenom_admin" class="input-field" placeholder="Prénom" required />
        <input type="email" v-model="admin.mail_admin" class="input-field" placeholder="Adresse Email" required />
        <input type="password" v-model="admin.mdp_admin" class="input-field" placeholder="Mot de passe" required />
        <button type="submit" class="btn-primary">S'inscrire</button>
      </form>

      <!-- Message d'erreur -->
      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
       <!-- Options de Connexion -->
       <p class="text-gray-500 my-4">Ou connectez-vous avec</p>

<div class="space-y-2">
  <button class="btn-google">
    <img
      src="../assets/icons/google.png"
      class="mr-2"
      alt="Google Logo"
      style="width: 20px; height: 20px; margin-right: 8px"
    />
    GOOGLE
  </button>

  <button class="btn-microsoft">
    <img
      src="../assets/icons/microsoft.png"
      class="mr-2"
      alt="Google Logo"
      style="width: 20px; height: 20px; margin-right: 8px"
    />
    MICROSOFT
  </button>
</div>


      <!-- Lien vers la connexion -->
      <p class="mt-4 text-gray-500">
        Vous avez déjà un compte ?
        <router-link to="/login" class="text-blue-500 hover:underline">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "SignupView",
  setup() {
    const router = useRouter();
    const admin = ref({
      nom_admin: "",
      prenom_admin: "",
      mail_admin: "",
      mdp_admin: "",
    });

    const errorMessage = ref("");

    const registerAdmin = async () => {
  try {
    const response = await axios.post(
      "https://ecogest1-69586dbc1b71.herokuapp.com/api/registeradmin",
      admin.value
    );

    console.log("Réponse de l'API :", response.data);  // Vérifie si le token est présent

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);  // Stocke le token
      router.push("/login");  // Redirige vers le tableau de bord après inscription
    } else {
      errorMessage.value = "Aucun token reçu. Vérifiez l'API.";
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erreur d'inscription :", error.response?.data || error.message);
      errorMessage.value = error.response?.data?.message || "Erreur lors de l'inscription";
    } else {
      console.error("Une erreur inconnue est survenue", error);
      errorMessage.value = "Une erreur inconnue est survenue.";
    }
  }
};


    return { admin, registerAdmin, errorMessage };
  },
};
</script>

<style scoped>
/* Conteneur principal */
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6;
}

/* Conteneur du formulaire */
.bg-white {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Champs de saisie */
.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f9fafb;
  transition: all 0.3s ease;
}
.input-field:focus {
  border-color: #01712B;
  background-color: white;
  outline: none;
}

/* Bouton principal */
.btn-primary {
  width: 100%;
  background-color: white;
  color: black;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  text-transform: uppercase;
  transition: background 0.3s;
}
.btn-primary:hover {
  background-color: #01712B;
}

/* Boutons sociaux */
.btn-google,
.btn-microsoft {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  text-transform: uppercase;
}
.btn-google {
  background-color: white;
  color: black;
}
.btn-google:hover {
  background-color: #01712b;
}
.btn-microsoft {
  background-color: white;
  color: black;
}
.btn-microsoft:hover {
  background-color: #01712b;
}
</style>
