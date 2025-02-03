<template>
  <div class="calendar-container">
    <FullCalendar ref="calendar" :options="calendarOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

interface EventData {
  title: string;
  start: string;
  backgroundColor: string;
}

const events = ref<EventData[]>([]);
const taskColors = ["#22c55e", "#facc15", "#ef4444"];

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  editable: true,
  droppable: true,
  events: events.value,
});

const addTaskToCalendar = (task: string) => {
  events.value.push({
    title: task,
    start: new Date().toISOString().split("T")[0], // Ajoute l'événement à aujourd'hui
    backgroundColor: taskColors[Math.floor(Math.random() * taskColors.length)],
  });
  calendarOptions.value.events = [...events.value]; // Mettre à jour les événements
};

defineExpose({ addTaskToCalendar });
</script>

<style scoped>
.calendar-container {
  flex: 3;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
