import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import axios from "axios";



// FontAwesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBell,
  faUser,
  faCog,
  faSearch,
  faChartPie,
  faShoppingCart,
  faCreditCard,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";

// Ajout des icônes
library.add(faBell, faUser, faCog, faSearch, faChartPie, faShoppingCart, faCreditCard, faExchangeAlt);
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;





const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
