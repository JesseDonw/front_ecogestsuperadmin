<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="calendar-container">


    <div class="calendar-wrapper">
      <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </div>

    <!-- Modale d'ajout d'événement -->
    <transition name="fade">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2 class="modal-title">➕ Ajouter un événement</h2>
          <form @submit.prevent="addEvent">

            <!-- Sélection de la tâche -->
            <label class="modal-label">📌 Tâche :</label>
            <Multiselect v-model="newEvent.task" :options="tasks" placeholder="Sélectionner une tâche" class="modal-select" />

            <!-- Sélection de la ville -->
            <label class="modal-label">🏙️ Ville :</label>
            <Multiselect v-model="newEvent.city" :options="Object.keys(citiesWithDistricts)" placeholder="Sélectionner une ville" class="modal-select" @update:modelValue="updateDistricts" />

            <!-- Sélection du quartier -->
            <label class="modal-label">📍 Quartier :</label>
            <Multiselect v-model="newEvent.district" :options="filteredDistricts" placeholder="Sélectionner un quartier" class="modal-select" v-if="filteredDistricts.length" />

            <!-- Boutons -->
            <div class="btn-group">
              <button type="submit" class="btn-save">✅ Ajouter</button>
              <button type="button" @click="closeModal" class="btn-cancel">❌ Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Multiselect from "@vueform/multiselect";

// État de la modale
const showModal = ref(false);
const selectedDate = ref<string>("");

// Liste des événements
interface EventData {
  id: string;
  title: string;
  start: string;
  location: string;
  backgroundColor: string;
}

const events = ref<EventData[]>([
  { id: "1", title: "Ramassage - Cotonou", start: "2024-02-10", location: "Fidjrossè", backgroundColor: "#2563eb" },
]);

// Liste des tâches
const tasks = ["Ramassage des déchets", "Inspection des bacs", "Collecte de plastique"];

// Typage strict pour éviter les erreurs TS7053
const citiesWithDistricts: Record<string, string[]> = {
  "Cotonou": ["Fidjrossè", "Akpakpa", "Jéricho"],
  "Porto-Novo": ["Avassa", "Djonou", "Gbada"],
  "Abomey-Calavi": ["Glo-Djigbé", "Zinvié", "Hêvié"],
};

const filteredDistricts = ref<string[]>([]);
const newEvent = ref<{ task: string; city: string; district: string }>({ task: "", city: "", district: "" });

// Mise à jour des quartiers selon la ville sélectionnée
const updateDistricts = () => {
  filteredDistricts.value = citiesWithDistricts[newEvent.value.city] || [];
};

// Options du calendrier
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  editable: true,
  selectable: true,
  events: events.value,
  locale: "fr", // Ajout de la langue française
  buttonText: { // Personnalisation des boutons
    today: "Aujourd'hui",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
    list: "Agenda"
  },
  dateClick: (info: { dateStr: string }) => openModal(info.dateStr),
});

// Ouvrir la modale
const openModal = (date: string) => {
  selectedDate.value = date;
  showModal.value = true;
};

// Fermer la modale
const closeModal = () => {
  showModal.value = false;
  newEvent.value = { task: "", city: "", district: "" };
};

// Ajouter un événement
const addEvent = () => {
  if (!newEvent.value.task || !newEvent.value.city || !selectedDate.value) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  const newTask: EventData = {
    id: (events.value.length + 1).toString(),
    title: `${newEvent.value.task} - ${newEvent.value.city}, ${newEvent.value.district}`,
    start: selectedDate.value,
    location: newEvent.value.district || "Non défini",
    backgroundColor: "#f59e0b",
  };

  events.value.push(newTask);
  calendarOptions.value.events = [...events.value];

  // Réinitialiser et fermer la modale
  closeModal();
};
</script>

<style scoped>
/* Conteneur principal */
.calendar-container {
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
}

.title {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
  margin-bottom: 20px;
}

/* Style du calendrier */
.calendar-wrapper {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Modale */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  width: 420px;
  text-align: center;
}

.modal-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #374151;
}

.modal-label {
  font-weight: bold;
  display: block;
  margin-top: 12px;
  text-align: left;
}

.modal-select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

/* Animation de la modale */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Boutons */
.btn-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-save {
  background:rgb(154, 175, 160);
  color: black;
  padding: 10px;
  border: none;
  flex: 1;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-save:hover {
  background: #1e40af;
}

.btn-cancel {
  background:rgb(154, 175, 160);
  color: black;
  padding: 10px;
  border: none;
  flex: 1;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-cancel:hover {
  background: #dc2626;
}
</style>
