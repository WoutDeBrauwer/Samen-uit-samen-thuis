/**
 * Counter Component
 */

import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';

class Counter extends Component {
  constructor() {
    super({
      name: 'counter',
      model: {
        count: 5,
      },
    });
  }

  countDown() {
    this.model.count -= 1;
    const countElements = this.componentContainer.getElementsByClassName('count');
    countElements[0].innerHTML = this.countString(this.model.count);
  }

  countString(count) {
    return `${count}`;
  }

  render() {
    const { count } = this.model;
    const elements = [];

    this.clearComponentContainer();

    elements.push(Elements.createHeader({
      textContent: this.countString(count),
      className: 'count',
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
  // Counter Setup

  // const counter = new Counter();
  // appContainer.appendChild(counter.render());
  // const countInterval = setInterval(() => {
  //   counter.countDown();
  //   if (counter.model.count === 0) clearInterval(countInterval);
  // }, 1000);
}

export default Counter;
