/**
 * Home Page Component
 */

import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import InvitationBox from './InvitationBox';
import EventBox from './EventBox';
import Events from '../lib/application/Events';
import Authenticator from '../lib/application/Authenticator';

class Homepage extends Component {
  constructor() {
    super({
      name: 'home',
      model: {
        title1: 'Uitnodigingen',
        title2: 'Jouw evenementen',
        title3: 'Geaccepteerde evenementen',
      },
      routerPath: '/home',
      hasBottomBar: true,
    });
  }

  async renderAsync() {
    const userId = Authenticator.getCurrentUserId();
    const { title1, title2, title3 } = this.model;
    const elements = [];
    const events = await Events.getAll();

    this.clearComponentContainer();

    elements.push(Elements.createHeader({
      size: 4,
      textContent: title1,
    }));

    events.forEach((event) => {
      const invitedUsers = event.invited;
      const found = invitedUsers.find((user) => user === userId);
      if (found) {
        const invitationBox = new InvitationBox({
          id: event.id, title: event.title, startDate: event.startDate, startTime: event.startTime,
        });
        elements.push(invitationBox.render());
      }
    });

    elements.push(Elements.createHeader({
      size: 4,
      textContent: title2,
    }));

    events.forEach((event) => {
      if (event.organiser === userId) {
        const eventBox = new EventBox({
          id: event.id, title: event.title, startDate: event.startDate, startTime: event.startTime, routerPath: 'event-detail',
        });
        elements.push(eventBox.render());
      }
    });

    elements.push(Elements.createHeader({
      size: 4,
      textContent: title3,
    }));

    events.forEach((event) => {
      const joinedUsers = event.joined;
      const found = joinedUsers.find((user) => user === userId);
      if (found) {
        const eventBox = new EventBox({
          id: event.id, title: event.title, startDate: event.startDate, startTime: event.startTime, routerPath: 'event-detail',
        });
        elements.push(eventBox.render());
      }
    });

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default Homepage;
