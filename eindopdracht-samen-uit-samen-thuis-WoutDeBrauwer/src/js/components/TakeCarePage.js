/**
 * Take Care Page Component
 */

import PanicBox from './PanicBox';
import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Authenticator from '../lib/application/Authenticator';
import TakeCareFeature from '../lib/application/TakeCareFeature';
import Events from '../lib/application/Events';

class TakeCarePage extends Component {
  constructor() {
    super({
      name: 'takeCare',
      model: {
        textContent: 'Niemand is in paniek :)',
        panics: [],
      },
      routerPath: '/take-care',
      hasBottomBar: true,
    });
  }

  async loadrelevantPanics() {
    const panics = await TakeCareFeature.getAll();
    const relevantEvents = await Events.getRelevantEvents();
    const relevantPanics = [];

    panics.forEach((panic) => {
      const foundPanic = relevantEvents.find((event) => event.id === panic.eventId);
      if (foundPanic) relevantPanics.push(panic);
    });

    if (relevantPanics.length > 0) {
      this.model.textContent = 'Er is iemand in paniek';
    }
    this.model.panics = relevantPanics;
  }

  async renderAsync() {
    await this.loadrelevantPanics();
    const { textContent, panics } = this.model;
    const elements = [];

    this.clearComponentContainer();

    elements.push(Elements.createHeader({
      size: 3,
      textContent,
      className: 'text-center',
    }));

    panics.forEach((panic) => {
      const panicBox = new PanicBox({
        userId: panic.userId,
        username: panic.username,
        eventId: panic.eventId,
        date: panic.date,
      });
      elements.push(panicBox.render());
    });

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default TakeCarePage;
