<template>
  <div class="chart-container">
    <canvas id="growthChart"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { Chart } from "chart.js";

onMounted(() => {
  new Chart(document.getElementById("growthChart") as HTMLCanvasElement, {
    type: "doughnut",
    data: {
      labels: ["Company Growth"],
      datasets: [
        {
          data: [78, 22],
          backgroundColor: ["#6366f1", "#e5e7eb"],
        },
      ],
    },
  });
});
</script>
