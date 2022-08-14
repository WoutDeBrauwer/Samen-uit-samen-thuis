/**
 * Event Detail Page
 */

import UserTag from './UserTag';
import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';
import Authenticator from '../lib/application/Authenticator';
import Events from '../lib/application/Events';
import Event from '../lib/application/Event';

class EventDetailPage extends Component {
  constructor() {
    super({
      name: 'eventDetail',
      model: {
        users: [],
        editBtn: '<i class="fas fa-edit fa-3x"></i>',
        chatBtn: '<i class="fas fa-comment fa-3x"></i>',
        selectUsersbuttons: [
          {
            textContent: 'Mensen verwijderen',
            className: 'danger',
            onClick: () => Router.getRouter().navigate(`/delete-users/${this.props.data.id}`),
          },
          {
            textContent: 'Mensen toevoegen',
            className: 'success',
            onClick: () => Router.getRouter().navigate(`/add-users/${this.props.data.id}`),
          },
        ],
        joinRejectButtons: [
          {
            innerHTML: '<i class="fas fa-times fa-2x"></i>',
            className: 'danger',
            onClick: async () => {
              const eventData = await Events.createEventData(this.props.data.id);
              const event = new Event(eventData);
              await event.rejectEvent(this.props.data.id);
              Router.getRouter().navigate('/home');
            },
          },
          {
            innerHTML: '<i class="fas fa-check fa-2x"></i>',
            className: 'success',
            onClick: async () => {
              const eventData = await Events.createEventData(this.props.data.id);
              const event = new Event(eventData);
              await event.joinEvent(this.props.data.id);
              Router.getRouter().navigate('/home');
            },
          },
        ],
        leaveButton: {
          textContent: 'Verlaat evenement',
          className: 'danger',
          onClick: async () => {
            const eventData = await Events.createEventData(this.props.data.id);
            const event = new Event(eventData);
            await event.rejectEvent(this.props.data.id);
            Router.getRouter().navigate('/home');
          },
        },
        event: {},
      },
      routerPath: '/event-detail/:id',
      hasBottomBar: true,
    });
  }

  async loadEvent(id) {
    this.model.event = await Events.getById(id);
  }

  async loadUsers() {
    const users = await Authenticator.getAllUsers();
    this.model.users = users;
  }

  async renderAsync() {
    const userId = Authenticator.getCurrentUserId();
    const eventId = this.props.data.id;
    await this.loadEvent(eventId);
    await this.loadUsers();

    const {
      editBtn, chatBtn, selectUsersbuttons, event, users, joinRejectButtons, leaveButton,
    } = this.model;
    const elements = [];
    const invited = [];
    const joined = [];
    const rejected = [];
    const buttonElements = [];

    this.clearComponentContainer();

    if (userId === event.organiser) {
      elements.push(Elements.createClickableContainer({
        className: 'edit text-right',
        innerHTML: editBtn,
        onClick: () => Router.getRouter().navigate(`/event-edit/${eventId}`),
      }));
    }

    elements.push(Elements.createHeader({
      size: 2,
      textContent: event.title,
    }));

    elements.push(Elements.createParagraph({
      textContent: `Georganiseerd door ${users[event.organiser].username}`,
    }));

    elements.push(Elements.createHeader({
      size: 4,
      textContent: event.description,
    }));

    elements.push(Elements.createHeader({
      size: 5,
      textContent: `${event.startDate} ${event.startTime} tot ${event.endDate} ${event.endTime}`,
    }));

    elements.push(Elements.createHeader({
      size: 5,
      textContent: `${event.street} ${event.number} ${event.zip} ${event.city}`,
    }));

    const foundJoined = event.joined.find((user) => user === userId);
    if (foundJoined || userId === event.organiser) {
      elements.push(Elements.createClickableContainer({
        className: 'edit text-right',
        innerHTML: chatBtn,
        onClick: () => Router.getRouter().navigate(`/chat/${eventId}`),
      }));
    }

    elements.push(Elements.createHeader({
      size: 5,
      textContent: 'Uitgenodigd:',
    }));

    event.invited.forEach((invite) => {
      const usertag = new UserTag(users[invite].username, users[invite].imageURL);
      invited.push(usertag.render());
      elements.push(Elements.createContainer({
        className: 'buttonLayout',
        children: invited,
      }));
    });

    elements.push(Elements.createHeader({
      size: 5,
      textContent: 'Geaccepteerd:',
    }));

    event.joined.forEach((join) => {
      const usertag = new UserTag(users[join].username, users[join].imageURL);
      joined.push(usertag.render());
      elements.push(Elements.createContainer({
        className: 'buttonLayout',
        children: joined,
      }));
    });

    elements.push(Elements.createHeader({
      size: 5,
      textContent: 'Geweigerd:',
    }));

    event.rejected.forEach((reject) => {
      const usertag = new UserTag(users[reject].username, users[reject].imageURL);
      rejected.push(usertag.render());
      elements.push(Elements.createContainer({
        className: 'buttonLayout',
        children: rejected,
      }));
    });

    if (userId === event.organiser) {
      selectUsersbuttons.forEach((button) => {
        buttonElements.push(Elements.createButton({
          textContent: button.textContent,
          className: button.className,
          onClick: button.onClick,
        }));
      });

      elements.push(Elements.createContainer({
        className: 'buttons buttonLayout',
        children: buttonElements,
      }));
    }

    elements.push(Elements.createParagraph({
      textContent: `Gemaakt op ${event.createdOn}`,
    }));

    elements.push(Elements.createParagraph({
      textContent: `Laatst gewijzigd op ${event.editedOn}`,
    }));

    if (userId === event.organiser) {
      elements.push(Elements.createButton({
        textContent: 'Verwijder evenement',
        className: 'danger',
        onClick: async () => {
          await Events.deleteEvent(eventId);
          Router.getRouter().navigate('/home');
        },
      }));
    }

    const foundInvite = event.invited.find((user) => user === userId);
    if (foundInvite) {
      const buttons = [];
      joinRejectButtons.forEach((button) => {
        buttons.push(Elements.createButton({
          innerHTML: button.innerHTML,
          className: button.className,
          onClick: button.onClick,
        }));
      });
      elements.push(Elements.createContainer({
        className: 'buttonLayout',
        children: buttons,
      }));
    }

    const foundJoin = event.joined.find((user) => user === userId);
    if (foundJoin) {
      elements.push(Elements.createButton({
        textContent: leaveButton.textContent,
        className: leaveButton.className,
        onClick: leaveButton.onClick,
      }));
    }

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default EventDetailPage;
