<!-- eslint-disable vue/require-toggle-inside-transition -->
<template>
  <transition name="fade">
    <template v-if="visible">
      <div class="modal-overlay">
        <transition name="scale">
          <div class="modal-content">
            <!-- En-tête du modal -->
            <div class="modal-header">
              <h2 class="modal-title">{{ title }}</h2>
              <button class="close-modal" @click="onCancel">✖</button>
            </div>

            <!-- Message -->
            <p class="modal-message">{{ message }}</p>

            <!-- Actions -->
            <div class="modal-actions">
              <button @click="onCancel" class="btn-cancel">Annuler</button>
              <button @click="onConfirm" class="btn-confirm">Confirmer</button>
            </div>
          </div>
        </transition>
      </div>
    </template>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ConfirmationModal",
  props: {
    visible: { type: Boolean, required: true }, // Contrôle la visibilité du modal
    title: { type: String, required: true }, // Titre du modal
    message: { type: String, required: true }, // Message affiché
  },
  emits: ["confirm", "cancel"], // Gestion des actions
  methods: {
    onConfirm() {
      this.$emit("confirm");
    },
    onCancel() {
      this.$emit("cancel");
    },
  },
});
</script>

<style scoped>
/* Animation fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Animation scale */
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease;
}
.scale-enter, .scale-leave-to {
  transform: scale(0.9);
}

/* Fond sombre */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Contenu du modal */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

/* En-tête du modal */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
}

.close-modal {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
}

/* Message */
.modal-message {
  margin: 20px 0;
  font-size: 16px;
  color: #374151;
}

/* Actions */
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-cancel {
  background: #6b7280;
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-cancel:hover {
  background: #4b5563;
}

.btn-confirm {
  background: #ef4444;
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-confirm:hover {
  background: #dc2626;
}
</style>
