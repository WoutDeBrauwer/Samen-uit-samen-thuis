/**
 * Chat Class
 */

import MessageBubble from '../../components/MessageBubble';
import {
  serverTimestamp, addDoc, collection, dbFirestore, query, orderBy, onSnapshot,
} from '../firebase';
import Authenticator from './Authenticator';
import Events from './Events';

const Chat = {
  createMessage: async (message, eventId) => {
    if (message) {
      const userId = Authenticator.getCurrentUserId();
      const event = await Events.getById(eventId);
      await Chat.createMessageFirebase(message, userId, event.title);
    }
  },

  createMessageFirebase: async (message, userId, eventName) => {
    const messageData = {
      message,
      userId,
      createdOn: serverTimestamp(),
    };
    await addDoc(collection(dbFirestore, `chat:${eventName}`), messageData);
  },

  addMessageDOM: async (messageData) => {
    const message = new MessageBubble({
      text: messageData.message,
      userId: messageData.userId,
    });
    const messagesContainer = document.querySelector('.messages');

    await message.renderAsync()
      .then((messageComponent) => {
        messagesContainer.appendChild(messageComponent);
      });

    window.scrollTo(0, document.body.scrollHeight);
  },

  getMessages: async (eventId) => {
    const event = await Events.getById(eventId);
    const q = await query(collection(dbFirestore, `chat:${event.title}`), orderBy('createdOn', 'asc'));

    //  Watches realtime if there is a message added
    await onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const message = { ...change.doc.data() };
          Chat.addMessageDOM(message);
        }
      });
    });
  },
};

export default Chat;
