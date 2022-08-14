/**
 * Header Component
 */

import TakeCareFeature from '../lib/application/TakeCareFeature';
import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';

class Header extends Component {
  constructor() {
    super({
      name: 'header',
      model: {
        button: {
          textContent: 'Waarschuw anderen',
        },
        eventId: null,
      },
    });
  }

  async geteventId() {
    this.model.eventId = await TakeCareFeature.checkIfEvent();
  }

  async renderAsync() {
    await this.geteventId();
    const { button, eventId } = this.model;
    const elements = [];
    const headerElements = [];

    this.clearComponentContainer();

    headerElements.push(Elements.createButton({
      textContent: button.textContent,
      onClick: () => {
        Router.getRouter().navigate(`/countdownPage/${eventId}`);
      },
    }));

    elements.push(Elements.createHeaderComponent({
      children: headerElements,
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default Header;
