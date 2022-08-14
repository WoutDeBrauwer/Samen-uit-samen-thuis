/**
 * Event Box Component
 */

import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';

class EventBox extends Component {
  constructor({
    id, title, startDate, startTime,
  }) {
    super({
      name: 'eventBox',
      props: {
        id,
        title,
        startDate,
        startTime,
      },
    });
  }

  render() {
    const {
      id, title, startDate, startTime,
    } = this.props;
    const elements = [];
    const textElements = [];

    this.clearComponentContainer();

    textElements.push(Elements.createHeader({
      size: 5,
      textContent: title,
    }));

    textElements.push(Elements.createParagraph({
      textContent: `${startDate} ${startTime}`,
      className: 'text-right',
    }));

    elements.push(Elements.createClickableContainer({
      className: 'text',
      children: textElements,
      onClick: () => Router.getRouter().navigate(`/event-detail/${id}`),
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default EventBox;
