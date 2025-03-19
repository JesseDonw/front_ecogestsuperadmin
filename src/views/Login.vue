<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
      <!-- Logo -->
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
      </div>

      <!-- Titre -->
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Connexion à votre espace super-admin</h2>

      <!-- Message d'erreur -->
      <p v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</p>

      <!-- Formulaire -->
      <form @submit.prevent="loginUser">

          <input
            type="email"
            v-model="credentials.mail_admin"
            class="input-field"
            placeholder="Adresse Email"
            required
          />
          <input
            type="password"
            v-model="credentials.mdp_admin"
            class="input-field"
            placeholder="Mot de passe"
            required
          />

        <button type="submit" class="btn-primary">Se connecter</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "LoginView",
  setup() {
    const router = useRouter();

    // Champs de connexion
    const credentials = ref({
      mail_admin: "",
      mdp_admin: "",
    });

    // Message d'erreur en cas d'échec
    const errorMessage = ref("");

    // Fonction de connexion
    const loginUser = async () => {
      try {
        const response = await axios.post("https://ecogest1-69586dbc1b71.herokuapp.com/api/loginadmin", credentials.value);

        if (response.data.token) {
          // ✅ Stockage du token et des informations admin
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("admin", JSON.stringify(response.data.admin));

          console.log("Connexion réussie. Token stocké :", response.data.token);

          // Redirection après connexion réussie
          router.push("/");
        } else {
          // Si le token n'est pas présent dans la réponse
          console.error("Aucun token reçu lors de la connexion.");
          errorMessage.value = "Erreur lors de la connexion : token non reçu.";
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Erreur lors de la connexion :", error.response?.data || error.message);
          errorMessage.value = error.response?.data?.message || "Erreur lors de la connexion";
        } else {
          console.error("Une erreur inconnue est survenue :", error);
          errorMessage.value = "Une erreur inconnue est survenue.";
        }
      }
    };

    return { credentials, loginUser, errorMessage };
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
.logo-container {
  display:flex;
  justify-content:center;
  margin-bottom: -50px;
}

.logo {
  width: 290px;
  height: 290px;
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
  width: 94%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f9fafb;
  transition: all 0.3s ease;
  margin-bottom: 16px;
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

</style>
