<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="chat-container">
    <!-- Liste des clients -->
    <div class="sidebar left">
      <h2>Clients</h2>
      <ul>
        <li v-for="client in clients" :key="client.id" @click="openChat(client)"
            :class="{ active: activeChat && activeChat.id === client.id }">
          <div class="avatar-container">
            <img v-if="client.photo_url" :src="client.photo_url" class="user-avatar" />
            <div v-else class="avatar-placeholder">{{ getInitials(getFullName(client)) }}</div>
            <span class="status-dot" :class="{ online: client.isOnline }"></span>
          </div>
          <div class="user-info">
            <span class="agent-name">{{ getFullName(client) }}</span>
            <span class="last-message">Dernier message...</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Zone de chat -->
    <div class="chat-window" v-if="activeChat">
      <div class="chat-header">
        <div class="avatar-container">
          <img v-if="activeChat.photo_url" :src="activeChat.photo_url" class="chat-avatar" />
          <div v-else class="avatar-placeholder">{{ getInitials(getFullName(activeChat)) }}</div>
        </div>
        <span class="chat-username">{{ getFullName(activeChat) }}</span>
      </div>

      <div class="messages-container" @scroll.passive="loadMoreMessages">
        <div v-for="(msg, key) in filteredMessages" :key="key"
            :class="['message', isMySelf(msg) ? 'my-message' : 'other-message']">
          <div class="message-content">
            <p v-if="msg.type === 'text'" class="message-text">{{ msg.message }}</p>
            <img v-if="msg.type === 'image'" :src="msg.fileUrl" class="message-image" />
            <a v-if="msg.type === 'file'" :href="msg.fileUrl" target="_blank" class="message-file">📎 Télécharger</a>
            <div class="message-meta">
              <span class="message-time">{{ msg.sentAt }}</span>
            </div>
          </div>
        </div>
      </div>

      <form class="chat-form" @submit.prevent="sendMessage">
        <div class="input-container">
          <input v-model="newMessage" class="chat-input" placeholder="Tapez votre message ici..." />
          <button type="submit" class="chat-button">Envoyer</button>
        </div>
      </form>
    </div>

    <!-- Liste des agents à droite -->
    <div class="sidebar right">
      <div class="user-profile">
        <input type="text" placeholder="Search..." class="search-bar" />
      </div>
      <h2>Agents</h2>
      <ul>
        <li v-for="agent in agents" :key="agent.id" @click="openChat(agent)"
            :class="{ active: activeChat && activeChat.id === agent.id }">
          <div class="avatar-container">
            <img v-if="agent.photo_url" :src="agent.photo_url" class="user-avatar" />
            <div v-else class="avatar-placeholder">{{ getInitials(getFullName(agent)) }}</div>
            <span class="status-dot" :class="{ online: agent.isOnline }"></span>
          </div>
          <div class="user-info">
            <span class="agent-name">{{ getFullName(agent) }}</span>
            <span class="last-message">Dernier message...</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import axios from 'axios';

// Interfaces
interface IChatMessage {
  id: number;
  from: string;
  to: string;
  photo_url?: string;
  nom_expediteur: string;
  prenom_expediteur: string;
  message: string;
  sentAt: string;
  type?: 'text' | 'image' | 'file';
  fileUrl?: string;
}

interface IUser {
  id: string;
  role: 'client' | 'agent' | 'admin';
  isOnline?: boolean;
  photo_url?: string;
}

interface IAgent extends IUser {
  nom_agent: string;
  prenom_agent: string;
}

interface IClient extends IUser {
  nom_client: string;
  prenom_client: string;
}

interface IAdmin extends IUser {
  nom_admin: string;
  prenom_admin: string;
}

interface ApiMessage {
  id: number;
  sender_type: string;
  sender_id: number;
  receiver_type: string;
  receiver_id: number;
  content: string;
  created_at: string;
}

// Utilisateur connecté
const user = reactive<IAdmin>({
  id: 'admin-1',
  nom_admin: 'Admin',
  prenom_admin: '',
  photo_url: '',
  role: 'admin',
});

// Déclarations pour les clients et agents
const clients = ref<IClient[]>([]);
const agents = ref<IAgent[]>([]);

// Fonctions pour récupérer les clients et agents
const fetchClients = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/clients');
    clients.value = response.data.map((client: IClient) => ({
      ...client,
      id: `client-${client.id}`,
      role: 'client',
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
  }
};

const fetchAgents = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/agents');
    agents.value = response.data.map((agent: IAgent) => ({
      ...agent,
      id: `agent-${agent.id}`,
      role: 'agent',
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des agents:', error);
  }
};

// Récupérer les messages depuis l'API
const fetchMessages = async () => {
  if (!activeChat.value) return;

  try {
    const response = await axios.get('http://localhost:8000/api/fetch-messages', {
      params: {
        with_id: parseInt(activeChat.value.id.replace(/^(client|agent|admin)-/, '')),
        with_type: activeChat.value.role === 'client'
          ? 'App\\Models\\Client'
          : activeChat.value.role === 'agent'
            ? 'App\\Models\\AgentCollecte'
            : 'App\\Models\\Administrateur',
      }
    });

    allMessages.value = response.data.map((msg: ApiMessage) => ({
      id: msg.id,
      from: msg.sender_type === 'App\\Models\\Administrateur' ? `admin-${msg.sender_id}`
            : msg.sender_type === 'App\\Models\\AgentCollecte' ? `agent-${msg.sender_id}`
            : `client-${msg.sender_id}`,
      to: msg.receiver_type === 'App\\Models\\Administrateur' ? `admin-${msg.receiver_id}`
            : msg.receiver_type === 'App\\Models\\AgentCollecte' ? `agent-${msg.receiver_id}`
            : `client-${msg.receiver_id}`,
      message: msg.content,
      sentAt: new Date(msg.created_at).toLocaleTimeString().slice(0, 5),
      type: 'text',
    }));

    localStorage.setItem(`messages-${activeChat.value.id}`, JSON.stringify(allMessages.value));
  } catch (error) {
    console.error('Erreur lors de la récupération des messages :', error);
  }
};

// Fonction pour charger plus de messages (intégrée)
const loadMoreMessages = () => {
  if (activeChat.value) {
    fetchMessages();
    console.log('Chargement de plus de messages...');
  }
};

// Chargement initial des données
onMounted(() => {
  fetchClients();
  fetchAgents();

  if (clients.value.length > 0) {
    openChat(clients.value[0]);
  } else if (agents.value.length > 0) {
    openChat(agents.value[0]);
  }

  setInterval(() => {
    if (activeChat.value) {
      fetchMessages();
    }
  }, 5000);
});

// Gestion des messages
const allMessages = ref<IChatMessage[]>([]);
const newMessage = ref('');
const activeChat = ref<IUser | null>(null);

const openChat = async (person: IUser) => {
  activeChat.value = person;

  const savedMessages = localStorage.getItem(`messages-${person.id}`);
  if (savedMessages) {
    allMessages.value = JSON.parse(savedMessages);
  }

  await fetchMessages();
};

const filteredMessages = computed(() => {
  if (!activeChat.value) return [];
  return allMessages.value.filter(
    (msg) => (msg.from === user.id && msg.to === activeChat.value?.id) || (msg.from === activeChat.value?.id && msg.to === user.id)
  );
});

const sendMessage = async () => {
  if (newMessage.value.trim() === '' || !activeChat.value) return;

  try {
    const response = await axios.post('http://localhost:8000/api/send-message', {
      sender_id: parseInt(user.id.replace('admin-', '')),
      sender_type: 'App\\Models\\Administrateur',
      receiver_id: parseInt(activeChat.value.id.replace(/^(client|agent)-/, '')),
      receiver_type: activeChat.value.role === 'client'
        ? 'App\\Models\\Client'
        : 'App\\Models\\AgentCollecte',
      content: newMessage.value,
    });

    const newMsg: IChatMessage = {
      id: response.data.data.id,
      from: user.id,
      to: activeChat.value.id,
      nom_expediteur: user.nom_admin,
      prenom_expediteur: user.prenom_admin,
      message: newMessage.value,
      sentAt: new Date().toLocaleTimeString().slice(0, 5),
      type: 'text',
    };

    allMessages.value.push(newMsg);
    newMessage.value = '';
    localStorage.setItem(`messages-${activeChat.value.id}`, JSON.stringify(allMessages.value));
    playNotificationSound();
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message :', error);
  }
};

const playNotificationSound = () => {
  const audio = new Audio('/sounds/notification.mp3');
  audio.play();
};

const isMySelf = (message: IChatMessage) => message.from === user.id;

const getFullName = (person: IUser): string => {
  if (person.role === 'agent') {
    return `${(person as IAgent).nom_agent} ${(person as IAgent).prenom_agent}`;
  } else if (person.role === 'client') {
    return `${(person as IClient).nom_client} ${(person as IClient).prenom_client}`;
  }
  return '';
};

const getInitials = (fullName: string): string => {
  if (!fullName) return '';
  const nameArray = fullName.trim().split(' ');
  return nameArray.length > 1
    ? nameArray[0][0].toUpperCase() + nameArray[1][0].toUpperCase()
    : nameArray[0][0].toUpperCase();
};
</script>



<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  background: #f4f4f4;
}
/* Gestion automatique de la coupure après 40 lettres */
.letter-wrap {
  max-width: 100%; /* Empêche l'expansion excessive */
  overflow-wrap: break-word; /* Coupe proprement les mots longs */
  word-break: break-word; /* Assure la coupure correcte */
  white-space: normal; /* Empêche l'affichage en une seule ligne */
  line-height: 1.5;
}

/* Ajout d'un espace pour éviter l'effet visuel des coupures */
.letter-wrap::after {
  content: '\200B'; /* Caractère invisible pour éviter le collage des mots */
}

/* Liste des utilisateurs */
.sidebar {
  width: 320px;
  background: rgba(255, 255, 255, 0.9); /* Effet translucide */
  border-radius: 20px; /* Coins arrondis */
  padding: 15px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  backdrop-filter: blur(10px); /* Effet de flou pour un style glassmorphism */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); /* Ombre douce */
  transition: all 0.3s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.2); /* Légère bordure translucide */
}
.sidebar:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.left {
  border-right: 1px solid #ddd;
}

.right {
  border-left: 1px solid #ddd;
}

.search-bar {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  outline: none;
  transition: all 0.3s ease-in-out;
  background: rgba(255, 255, 255, 0.8);
  color: #333;
}

/* Effet focus sur la barre de recherche */
.search-bar:focus {
  background: white;
  border-color: #6b5ed2;
  box-shadow: 0 0 10px rgba(107, 94, 210, 0.5);
}
/* Zone du chat */
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #e9ecef;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 10px;
}

/* Messages */
.message {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.my-message {
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  margin: 0 10px;
}

.avatar-text {
  font-size: 14px;
}

.message-content {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  background: white;
}

.my-message .message-content {
  background: #dcf8c6;
}

.message-text,
.message-image,
.message-file {
  margin: 5px 0;
}

.typing-indicator {
  font-style: italic;
  font-size: 12px;
  color: gray;
  padding: 5px;
}


.input-container {
  display: flex;
  width: 100%;
  max-width: 600px;
  border-radius: 25px;
  overflow: hidden;
  background: #f1f3f5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chat-input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 25px 0 0 25px;
  outline: none;
  font-size: 14px;
  background: transparent;
}

.chat-input::placeholder {
  color: #aaa;
  font-style: italic;
}

.chat-button {
  padding: 12px 20px;
  border: none;
  background: #01712B;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  border-radius: 0 25px 25px 0;
}

.chat-button:hover {
  background:#51a270;
  ;
}
/* Section des chats */
.chat-section {
  margin-top: 15px;
}

.chat-section h3 {
  font-size: 16px;
  font-weight: bold;
  color: #01712B;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.chat-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Élément de liste */
.chat-section li {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  position: relative;
}

/* Effet de survol */
.chat-section li:hover {
  background: #5bb17c;
  transform: scale(1.02);
}

/* Élément actif (sélectionné) */
.chat-section li.active {
  background:#01712B;
  color: white;
  transform: scale(1.05);
  font-weight: bold;
}

/* Conteneur de l'avatar */
.avatar-container {
  position: relative;
  margin-right: 12px;
}

.user-avatar,
.avatar-placeholder {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

/* Indicateur de statut */
.status-dot {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: gray;
}

/* Statut en ligne */
.status-dot.online {
  background: #4caf50; /* Vert pour "en ligne" */
}

/* Infos utilisateur */
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  font-size: 14px;
}

.last-message {
  font-size: 12px;
  color: gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Heure du dernier message */
.message-time {
  font-size: 12px;
  color: gray;
}

h3 {
  color: #01712B;
  font-size: 16px;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

/* Effet de survol sur les utilisateurs */
li:hover {
  background: #69bd89;
  transform: scale(1.02);
}

/* Élément actif (utilisateur sélectionné) */
li.active {
  background:#01712B;
  color: white;
  transform: scale(1.05);
  font-weight: bold;
}

/* Avatar des utilisateurs */
.user-avatar,
.avatar-placeholder {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

/* Effet de glow sur l’avatar lorsqu’un utilisateur est en ligne */
li.active .user-avatar {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* Avatar du profil utilisateur */
</style>
