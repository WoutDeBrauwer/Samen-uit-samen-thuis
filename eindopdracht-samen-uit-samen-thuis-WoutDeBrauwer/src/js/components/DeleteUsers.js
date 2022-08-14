/**
 * Delete Users Component
 */

import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';
import UserTag from './UserTag';
import Authenticator from '../lib/application/Authenticator';
import Events from '../lib/application/Events';
import Event from '../lib/application/Event';

class DeleteUsersPage extends Component {
  constructor() {
    super({
      name: 'deleteUsers',
      model: {
        title: 'Selecteer users',
        buttonTextContent: 'Users verwijderen',
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
          await event.deleteUsers(selectedUsers, this.props.data.id);
          Router.getRouter().navigate(`/event-detail/${this.props.data.id}`);
        },
        linkPicture: '<i class="fas fa-times fa-3x"></i>',
        linkOnclick: () => Router.getRouter().navigate(`/event-detail/${this.props.data.id}`),
        invitedUsers: [],
        joinedUsers: [],
        rejectedUsers: [],
        allUsers: [],
      },
      routerPath: '/delete-users/:id',
      hasBottomBar: false,
    });
  }

  async loadUsers() {
    const users = await Authenticator.getAllUsers();
    this.model.allUsers = users;
  }

  async loadInvitedUsers() {
    const event = await Events.getById(this.props.data.id);
    const invitedUsers = event.invited;
    this.model.invitedUsers = invitedUsers;
  }

  async loadJoinedUsers() {
    const event = await Events.getById(this.props.data.id);
    const joinedUsers = event.joined;
    this.model.joinedUsers = joinedUsers;
  }

  async loadRejectedUsers() {
    const event = await Events.getById(this.props.data.id);
    const rejectedUsers = event.rejected;
    this.model.rejectedUsers = rejectedUsers;
  }

  async renderAsync() {
    await this.loadInvitedUsers();
    await this.loadJoinedUsers();
    await this.loadRejectedUsers();
    await this.loadUsers();

    const {
      title, buttonTextContent, buttonOnClick, linkPicture, linkOnclick, invitedUsers, joinedUsers,
      rejectedUsers, allUsers,
    } = this.model;
    const elements = [];
    const userElements = [];
    const users = invitedUsers.concat(joinedUsers, rejectedUsers);

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

    users.forEach((user) => {
      if (!(user === Authenticator.getCurrentUserId())) {
        const userTagElements = [];
        if (allUsers[user].imageURL) {
          const userTag = new UserTag(allUsers[user].username, allUsers[user].imageURL);
          userTagElements.push(userTag.render());
        } else {
          const userTag = new UserTag(allUsers[user].username, null);
          userTagElements.push(userTag.render());
        }
        userTagElements.push(Elements.createCheckbox({
          value: user,
        }));
        userElements.push(Elements.createContainer({
          className: 'user',
          children: userTagElements,
        }));
      }
    });

    elements.push(Elements.createContainer({
      className: 'users',
      children: userElements,
    }));

    elements.push(Elements.createButton({
      textContent: buttonTextContent,
      onClick: buttonOnClick,
      className: 'danger',
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default DeleteUsersPage;
