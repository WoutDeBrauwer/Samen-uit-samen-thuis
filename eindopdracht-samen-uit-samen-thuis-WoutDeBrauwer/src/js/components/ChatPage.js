/**
 * Chat Page Component
 */

import Chat from '../lib/application/Chat';
import Events from '../lib/application/Events';
import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';

class ChatPage extends Component {
  constructor() {
    super({
      name: 'chat',
      model: {
        backBtn: {
          innerHTML: '<i class="fas fa-arrow-circle-left fa-3x"></i>',
          onClick: () => Router.getRouter().navigate(`/event-detail/${this.props.data.id}`),
        },
        sendBtn: {
          textContent: 'Stuur',
          onClick: async () => {
            const message = document.querySelector('textarea').value;
            if (message) {
              await Chat.createMessage(message, this.props.data.id);
              document.querySelector('textarea').value = '';
            }
          },
        },
        event: {},
      },
      routerPath: '/chat/:id',
      hasBottomBar: false,
    });
  }

  async loadEvent() {
    const event = await Events.getById(this.props.data.id);
    this.model.event = event;
  }

  showMessages() {
    if (document.querySelector('.messages')) {
      Chat.getMessages(this.props.data.id);
    }
  }

  async renderAsync() {
    await this.loadEvent();

    const {
      backBtn, sendBtn, event,
    } = this.model;
    const elements = [];
    const headerElements = [];
    const footerElements = [];
    const chatElements = [];
    const appContainer = document.getElementById('appContainer');

    this.clearComponentContainer();

    headerElements.push(Elements.createClickableContainer({
      innerHTML: backBtn.innerHTML,
      className: 'text-left',
      onClick: backBtn.onClick,
    }));

    headerElements.push(Elements.createHeader({
      size: 4,
      textContent: event.title,
    }));

    appContainer.appendChild(Elements.createHeaderComponent({
      children: headerElements,
      id: 'chatHeader',
      className: 'headerContainer',
    }));

    elements.push(Elements.createContainer({
      className: 'messages',
      children: chatElements,
    }));

    footerElements.push(Elements.createTextarea({
      placeholder: 'Bericht...',
      name: 'message',
      rows: 2,
    }));

    footerElements.push(Elements.createButton({
      textContent: sendBtn.textContent,
      onClick: sendBtn.onClick,
    }));

    appContainer.appendChild(Elements.createFooter({
      children: footerElements,
      id: 'chatFooter',
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default ChatPage;
