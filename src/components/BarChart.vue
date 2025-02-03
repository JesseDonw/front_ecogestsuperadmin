<template>
  <div class="chart-container">
    <canvas ref="barChartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const barChartCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (barChartCanvas.value) {
    new Chart(barChartCanvas.value, {
      type: "bar",
      data: {
        labels: ["Jan", "Fév", "Mars", "Avril", "Mai"],
        datasets: [
          {
            label: "Pollution évitée (kg CO₂)",
            data: [1200, 1500, 1700, 2000, 2300],
            backgroundColor: "#10b981",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
