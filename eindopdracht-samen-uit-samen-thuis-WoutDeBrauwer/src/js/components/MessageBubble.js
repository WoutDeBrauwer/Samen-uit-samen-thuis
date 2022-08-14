/**
 * Message Bubble Component
 */

import Authenticator from '../lib/application/Authenticator';
import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import {
  dbRealtime, child, get, ref,
} from '../lib/firebase';

class MessageBubble extends Component {
  constructor({ text, userId }) {
    super({
      name: 'message',
      model: {
        message: {
          text,
          userId,
        },
        messageClassname: '',
        username: '',
      },
    });
  }

  getMessageClassname() {
    const { message } = this.model;
    const userId = Authenticator.getCurrentUserId();
    if (message.userId === userId) {
      this.model.messageClassname = 'message right';
    } else {
      this.model.messageClassname = 'message left';
    }
  }

  async getUsername() {
    const { userId } = this.model.message;
    const dbRef = ref(dbRealtime);
    await get(child(dbRef, `users/${userId}`))
      .then((snapshot) => {
        this.model.username = snapshot.val().username;
      });
  }

  async renderAsync() {
    await this.getUsername();
    this.getMessageClassname();
    const { message, messageClassname, username } = this.model;
    const elements = [];

    this.clearComponentContainer();

    this.componentContainer.classList.remove('basicLayout');

    if (messageClassname === 'message left') {
      elements.push(Elements.createContainer({
        className: messageClassname,
        innerHTML: `<p>${username}:</p><p>${message.text}</p>`,
      }));
    } else {
      elements.push(Elements.createContainer({
        className: messageClassname,
        innerHTML: `<p>${message.text}</p>`,
      }));
    }

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default MessageBubble;
