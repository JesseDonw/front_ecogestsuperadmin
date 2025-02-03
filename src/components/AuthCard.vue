<template>
  <div class="bg-white p-8 rounded-lg shadow-lg w-96">
    <h2 class="text-2xl font-bold text-gray-800 text-center mb-2">{{ title }}</h2>
    <p class="text-gray-500 text-center text-sm mb-4">{{ subtitle }}</p>

    <slot></slot> <!-- Ici on insère le contenu du formulaire -->

    <p v-if="bottomText" class="mt-4 text-center text-gray-500">
      {{ bottomText }}
      <router-link :to="bottomLink" class="text-blue-500 hover:underline">
        {{ bottomLinkText }}
      </router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AuthCard",
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    bottomText: { type: String, default: "" },
    bottomLink: { type: String, default: "#" },
    bottomLinkText: { type: String, default: "" },
  },
});
</script>
