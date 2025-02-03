<template>
  <div class="chart-container">
    <canvas ref="pieChartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const pieChartCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (pieChartCanvas.value) {
    new Chart(pieChartCanvas.value, {
      type: "pie",
      data: {
        labels: ["Cotonou", "Porto-Novo", "Parakou", "Abomey-Calavi", "Bohicon"],
        datasets: [
          {
            label: "Taux de ramassage (%)",
            data: [70, 55, 80, 65, 50],
            backgroundColor: ["#2563eb", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"],
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
