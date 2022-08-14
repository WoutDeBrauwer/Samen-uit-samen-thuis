/**
 * Add Users Component
 */

import Authenticator from '../lib/application/Authenticator';
import Events from '../lib/application/Events';
import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';
import UserTag from './UserTag';
import Event from '../lib/application/Event';

class AddUsersPage extends Component {
  constructor() {
    super({
      name: 'addUsers',
      model: {
        title: 'Selecteer users',
        buttonTextContent: 'Users toevoegen',
        buttonOnClick: async () => {
          const checkBoxes = document.querySelectorAll('input');
          const selectedUsers = [];
          checkBoxes.forEach((checkBox) => {
            if (checkBox.checked) {
              selectedUsers.push(checkBox.value);
            }
          });
          const eventData = await Events.createEventData(this.props.data.id);
          const event = new Event(eventData);
          await event.inviteUsers(selectedUsers, this.props.data.id);
          Router.getRouter().navigate(`/event-detail/${this.props.data.id}`);
        },
        users: [],
        linkPicture: '<i class="fas fa-times fa-3x"></i>',
        linkOnclick: () => Router.getRouter().navigate(`/event-detail/${this.props.data.id}`),
      },
      routerPath: '/add-users/:id',
      hasBottomBar: false,
    });
  }

  async getEvent() {
    const event = await Events.getById(this.props.data.id);
    return event;
  }

  async loadUsers() {
    const users = {};
    const event = await this.getEvent();

    const allUsers = await Authenticator.getAllUsers();
    for (const key in allUsers) {
      if (Object.hasOwnProperty.call(allUsers, key)) {
        const user = allUsers[key];
        if (!(event.invited.find((invite) => invite === key))) {
          if (!(event.joined.find((join) => join === key))) {
            if (!(event.invited.find((reject) => reject === key))) {
              users[key] = user;
            }
          }
        }
      }
    }
    this.model.users = users;
  }

  async renderAsync() {
    await this.loadUsers();

    const {
      title, buttonTextContent, buttonOnClick, linkPicture, linkOnclick, users,
    } = this.model;
    const elements = [];
    const formElements = [];
    const userElements = [];

    this.clearComponentContainer();

    elements.push(Elements.createClickableContainer({
      className: 'text-right',
      innerHTML: linkPicture,
      onClick: linkOnclick,
    }));

    elements.push(Elements.createHeader({
      size: 3,
      textContent: title,
      className: 'text-center',
    }));

    for (const key in users) {
      if (Object.hasOwnProperty.call(users, key)) {
        if (!(key === Authenticator.getCurrentUserId())) {
          const user = users[key];
          const userTagElements = [];
          if (user.imageURL) {
            const userTag = new UserTag(user.username, user.imageURL);
            userTagElements.push(userTag.render());
          } else {
            const userTag = new UserTag(user.username, null);
            userTagElements.push(userTag.render());
          }
          userTagElements.push(Elements.createCheckbox({
            value: key,
          }));
          userElements.push(Elements.createContainer({
            className: 'user',
            children: userTagElements,
          }));
        }
      }
    }

    formElements.push(Elements.createContainer({
      className: 'users',
      children: userElements,
    }));

    elements.push(Elements.createForm({
      children: formElements,
    }));

    elements.push(Elements.createButton({
      textContent: buttonTextContent,
      onClick: buttonOnClick,
      className: 'success',
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default AddUsersPage;
