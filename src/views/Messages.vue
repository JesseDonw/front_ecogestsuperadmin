<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="messages-container">
    <div class="messages-wrapper">
      <div class="sidebar contacts">
        <div class="sidebar-header">
          <div class="user-avatar">
            <img src="https://via.placeholder.com/40" alt="Profile" class="profile-img">
          </div>
          <div class="sidebar-actions">
            <button class="icon-btn">💬</button>
            <button class="icon-btn">⋮</button>
          </div>
        </div>
        <div class="search-bar">
          <input type="text" placeholder="Rechercher ou démarrer une discussion">
        </div>
        <ul class="contact-list">
          <li v-for="contact in allContacts" :key="contact.id"
              @click="selectConversation(contact)"
              :class="{ active: selectedConversation?.id === contact.id }">
            <div class="contact-info">
              <div class="avatar-wrapper">
                <img :src="contact.avatar" alt="Avatar" class="contact-avatar">
                <span v-if="contact.online" class="online-badge"></span>
              </div>
              <div class="contact-details">
                <h4>{{ contact.name }}</h4>
                <p class="last-message">{{ getLastMessage(contact) }}</p>
              </div>
              <div class="message-info">
                <span class="timestamp">{{ contact.lastSeen }}</span>
                <span v-if="contact.unread" class="unread-badge">{{ contact.unread }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="chat-section">
        <div v-if="selectedConversation" class="chat-box">
          <div class="chat-header">
            <div class="contact-info">
              <img :src="selectedConversation.avatar" alt="Avatar" class="chat-avatar">
              <div class="contact-status">
                <h3>{{ selectedConversation.name }}</h3>
                <p v-if="selectedConversation.online" class="online-status">En ligne</p>
                <p v-else class="last-seen">Dernière connexion {{ selectedConversation.lastSeen }}</p>
              </div>
            </div>
          </div>

          <div class="chat-messages" ref="chatMessages">
            <div v-for="(msg, index) in selectedConversation.messages" :key="index"
                 :class="['message', msg.sender === 'admin' ? 'sent' : 'received']">
              <div class="message-bubble">
                <p>{{ msg.text }}</p>
                <div class="message-status">
                  <span class="timestamp">{{ msg.timestamp }}</span>
                  <span v-if="msg.sender === 'admin'" class="status-icons">
                    <span v-if="msg.status === 'sent'">✓</span>
                    <span v-if="msg.status === 'delivered'">✓✓</span>
                    <span v-if="msg.status === 'read'" style="color: #53bdeb">✓✓</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="chat-input-container">
            <div class="chat-input">
              <input v-model="newMessage" type="text"
                     placeholder="Écrire un message..."
                     @keyup.enter="sendMessage">
              <button class="send-btn" @click="sendMessage">
                {{ newMessage ? '➤' : '🎤' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

interface Message {
  sender: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen: string;
  unread?: number;
  messages: Message[];
}

const selectedConversation = ref<Contact | null>(null);
const newMessage = ref<string>("");
const chatMessages = ref<HTMLDivElement | null>(null);

const conversations = ref<Contact[]>([
  {
    id: 1,
    name: "John Doe",
    avatar: "https://via.placeholder.com/50",
    online: true,
    lastSeen: "10:30",
    unread: 2,
    messages: [
      { sender: "user", text: "Bonjour !", timestamp: "08:45", status: "read" },
      { sender: "admin", text: "Salut ! Comment puis-je aider ?", timestamp: "08:46", status: "delivered" }
    ]
  }
]);

const allContacts = ref<Contact[]>(conversations.value);

const selectConversation = (contact: Contact) => {
  selectedConversation.value = contact;
};

const getLastMessage = (contact: Contact): string => {
  if (contact.messages.length > 0) {
    return contact.messages[contact.messages.length - 1].text;
  }
  return "Aucun message";
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return;

  const message: Message = {
    sender: "admin",
    text: newMessage.value,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    status: "sent"
  };

  selectedConversation.value.messages.push(message);
  newMessage.value = "";
  nextTick(() => scrollToBottom());

  setTimeout(() => message.status = "delivered", 1000);
  setTimeout(() => message.status = "read", 3000);
};

const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};
</script>
