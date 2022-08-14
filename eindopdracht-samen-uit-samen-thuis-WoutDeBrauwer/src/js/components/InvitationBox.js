/**
 * Invitation Box Component
 */

import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';
import EventBox from './EventBox';
import Events from '../lib/application/Events';
import Event from '../lib/application/Event';

class InvitationBox extends Component {
  constructor({
    id, title, startDate, startTime,
  }) {
    super({
      name: 'invitationBox',
      props: {
        id,
        title,
        startDate,
        startTime,
      },
      model: {
        buttons: [
          {
            className: 'reject',
            innerHTML: '<i class="fas fa-times fa-2x"></i>',
            onClick: async () => {
              const eventData = await Events.createEventData(this.props.id);
              const event = new Event(eventData);
              await event.rejectEvent(this.props.id);
              Router.getRouter().navigate('/');
              Router.getRouter().navigate('/home');
            },
          },
          {
            className: 'join',
            innerHTML: '<i class="fas fa-check fa-2x"></i>',
            onClick: async () => {
              const eventData = await Events.createEventData(this.props.id);
              const event = new Event(eventData);
              await event.joinEvent(this.props.id);
              Router.getRouter().navigate('/');
              Router.getRouter().navigate('/home');
            },
          },
        ],
      },
    });
  }

  render() {
    const { buttons } = this.model;
    const {
      id, title, startDate, startTime,
    } = this.props;
    const elements = [];
    const buttonElements = [];

    this.clearComponentContainer();

    const eventBox = new EventBox({
      id, title, startDate, startTime,
    });
    elements.push(eventBox.render());

    buttons.forEach((button) => {
      buttonElements.push(Elements.createButton({
        className: button.className,
        innerHTML: button.innerHTML,
        onClick: button.onClick,
      }));
    });

    elements.push(Elements.createContainer({
      className: 'buttons',
      children: buttonElements,
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default InvitationBox;
