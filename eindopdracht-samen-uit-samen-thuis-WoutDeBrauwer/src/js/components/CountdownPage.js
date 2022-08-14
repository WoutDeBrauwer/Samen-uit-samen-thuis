/**
 * Countdown Page Component
 */

import Authenticator from '../lib/application/Authenticator';
import TakeCareFeature from '../lib/application/TakeCareFeature';
import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';
import Counter from './Counter';

class CountdownPage extends Component {
  constructor() {
    super({
      name: 'countdownPage',
      model: {
        textContent: 'Je staat op punt iedereen in het evenement te waarschuwen',
        button: {
          textContent: 'annuleer',
          className: 'danger',
        },
      },
      routerPath: '/countdownPage/:id',
      hasBottomBar: false,
    });
  }

  render() {
    const { textContent, button } = this.model;
    const elements = [];

    this.clearComponentContainer();

    const counter = new Counter();
    elements.push(counter.render());
    const countdown = setInterval(async () => {
      counter.countDown();
      if (counter.model.count < 1) {
        clearInterval(countdown);
        await TakeCareFeature.createPanic(this.props.data.id);
        Router.getRouter().navigate(`/panic/${this.props.data.id}-${Authenticator.getCurrentUserId()}`);
      }
    }, 1000);

    elements.push(Elements.createHeader({
      size: 3,
      textContent,
      className: 'text-center',
    }));

    elements.push(Elements.createButton({
      textContent: button.textContent,
      className: button.className,
      onClick: () => {
        clearInterval(countdown);
        Router.getRouter().navigate('/home');
      },
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default CountdownPage;
