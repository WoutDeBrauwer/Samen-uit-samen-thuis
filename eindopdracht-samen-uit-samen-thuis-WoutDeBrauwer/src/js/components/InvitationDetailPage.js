/**
 * Invitation Detail Page Component
 */

import EventDetailPage from './EventDetailPage';
import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';
import Events from '../lib/application/Events';
import Event from '../lib/application/Event';

class InvitationDetailPage extends Component {
  constructor() {
    super({
      name: 'invitationDetail',
      model: {
        buttons: [
          {
            innerHTML: '<i class="fas fa-times fa-2x"></i>',
            className: 'danger',
            onClick: async () => {
              const eventData = await Events.createEventData(this.props.id);
              const event = new Event(eventData);
              await event.rejectEvent(this.props.id);
              Router.getRouter().navigate('/home');
            },
          },
          {
            innerHTML: '<i class="fas fa-check fa-2x"></i>',
            className: 'success',
            onClick: async () => {
              const eventData = await Events.createEventData(this.props.id);
              const event = new Event(eventData);
              await event.joinEvent(this.props.id);
              Router.getRouter().navigate('/home');
            },
          },
        ],
      },
      routerPath: '/invitation-detail/:id',
      hasBottomBar: true,
    });
  }

  render() {
    const { buttons } = this.model;
    const elements = [];
    const buttonElements = [];

    this.clearComponentContainer();

    const eventDetail = new EventDetailPage();
    elements.push(eventDetail.renderAsync());

    buttons.forEach((button) => {
      buttonElements.push(Elements.createButton({
        innerHTML: button.innerHTML,
        className: button.className,
        onClick: button.onClick,
      }));
    });

    elements.push(Elements.createContainer({
      className: 'buttonLayout',
      children: buttonElements,
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default InvitationDetailPage;
