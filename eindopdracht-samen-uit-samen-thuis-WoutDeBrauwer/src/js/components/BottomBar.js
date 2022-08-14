/**
 * Bottombar Component
 */

import { collection, onSnapshot } from '@firebase/firestore';
import { query } from 'firebase/database';
import Events from '../lib/application/Events';
import TakeCareFeature from '../lib/application/TakeCareFeature';
import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import { dbFirestore } from '../lib/firebase';
import Router from '../lib/Router';

class BottomBar extends Component {
  constructor() {
    super({
      name: 'bottomBar',
      model: {
        buttons: [
          {
            innerHTML: 'Meldet',
            className: 'footer',
            onClick: () => Router.getRouter().navigate('/meldet-form'),
          },
          {
            innerHTML: '<i class="fas fa-exclamation fa-lg"></i>',
            className: 'footer',
            onClick: () => Router.getRouter().navigate('/take-care'),
          },
          {
            innerHTML: '<i class="fas fa-plus fa-lg"></i>',
            className: 'footer',
            onClick: () => Router.getRouter().navigate('/event-edit/:id'),
          },
          {
            innerHTML: '<i class="fas fa-user fa-lg"></i>',
            className: 'footer',
            onClick: () => Router.getRouter().navigate('/account-detail'),
          },
          {
            innerHTML: '<i class="fas fa-home fa-lg"></i>',
            className: 'home',
            onClick: () => Router.getRouter().navigate('/home'),
          },
        ],
      },
    });
  }

  async getRelevantPanics() {
    const panics = await TakeCareFeature.getAll();
    const relevantEvents = await Events.getRelevantEvents();
    const relevantPanics = [];

    panics.forEach((panic) => {
      const foundPanic = relevantEvents.find((event) => event.id === panic.eventId);
      if (foundPanic) relevantPanics.push(panic);
    });
    if (relevantPanics.length > 0) {
      this.model.buttons[1].className = 'footer alarm';
    } else {
      this.model.buttons[1].className = 'footer';
    }
  }

  async renderAsync() {
    await this.getRelevantPanics();
    const { buttons } = this.model;
    const elements = [];
    const footerButtons = [];
    const homeButton = [];

    this.clearComponentContainer();
    this.componentContainer.classList.remove('basicLayout');

    buttons.forEach((button) => {
      const buttonElement = Elements.createButton({
        innerHTML: button.innerHTML,
        className: button.className,
        onClick: button.onClick,
      });
      if (button.className === 'footer' || button.className === 'footer alarm') {
        footerButtons.push(buttonElement);
      } else {
        homeButton.push(buttonElement);
      }
    });

    elements.push(Elements.createContainer({
      className: 'buttons',
      children: footerButtons,
    }));

    homeButton.forEach((button) => elements.push(button));

    this.componentContainer.appendChild(
      Elements.createFooter({
        children: elements,
      }),
    );

    return this.componentContainer;
  }
}

export default BottomBar;
