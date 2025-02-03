<template>
  <div class="chart-container">
    <canvas ref="lineChartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const lineChartCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (lineChartCanvas.value) {
    new Chart(lineChartCanvas.value, {
      type: "line",
      data: {
        labels: ["Jan", "Fév", "Mars", "Avril", "Mai"],
        datasets: [
          {
            label: "Taux de recyclage avant EcoGest",
            data: [30, 35, 40, 42, 45],
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            fill: true,
            tension: 0.3,
          },
          {
            label: "Taux de recyclage après EcoGest",
            data: [40, 50, 55, 60, 70],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            fill: true,
            tension: 0.3,
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
            title: {
              display: true,
              text: "Taux de recyclage (%)",
            },
            beginAtZero: true,
          },
          x: {
            title: {
              display: true,
              text: "Mois",
            },
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
