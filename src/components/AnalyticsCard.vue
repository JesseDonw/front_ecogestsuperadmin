<script setup lang="ts">
defineProps({
  title: String,
  number: String,
  growth: String,
  icon: String
});
</script>

<template>
  <div class="card">
    <font-awesome-icon :icon="icon" class="icon" />
    <div class="info">
      <h3>{{ title }}</h3>
      <p class="number">{{ number }}</p>
      <p class="growth">{{ growth }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: 24px;
  color: #2563eb;
}

.number {
  font-size: 20px;
  font-weight: bold;
}

.growth {
  color: green;
  font-size: 14px;
}
</style>
