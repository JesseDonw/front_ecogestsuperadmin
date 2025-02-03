import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: { name: "", email: "", profilePicture: "" }
  }),

  actions: {
    setUser(userData: { name: string; email: string; profilePicture: string }) {
      this.user = userData;
    },
    logout() {
      this.user = { name: "", email: "", profilePicture: "" };
    }
  },

  persist: true, // ✅ Sauvegarde les données même après un refresh
});
