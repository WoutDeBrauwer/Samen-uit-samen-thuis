/**
 * Event Box Component
 */

import Authenticator from '../lib/application/Authenticator';
import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';

class PanicBox extends Component {
  constructor({
    userId, username, eventId, date,
  }) {
    super({
      name: 'panicBox',
      props: {
        userId,
        username,
        eventId,
        date,
      },
    });
  }

  render() {
    const {
      userId, username, eventId, date,
    } = this.props;
    const elements = [];
    const textElements = [];

    this.clearComponentContainer();

    textElements.push(Elements.createHeader({
      size: 5,
      textContent: username,
    }));

    textElements.push(Elements.createParagraph({
      textContent: date,
      className: 'text-right',
    }));

    elements.push(Elements.createClickableContainer({
      className: 'text',
      children: textElements,
      onClick: () => Router.getRouter().navigate(`/panic/${eventId}-${userId}`),
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default PanicBox;
