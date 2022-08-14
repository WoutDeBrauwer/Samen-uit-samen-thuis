/**
 * Panic Page Component
 */

import Authenticator from '../lib/application/Authenticator';
import TakeCareFeature from '../lib/application/TakeCareFeature';
import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';

class PanicPage extends Component {
  constructor() {
    super({
      name: 'panicPage',
      model: {
        meldetBtn: {
          textContent: 'Meldet',
          onClick: () => {
            Router.getRouter().navigate('/meldet-form');
          },
        },
        deleteBtn: {
          textContent: 'Verwijderen',
          className: 'danger',
          onClick: async () => {
            await TakeCareFeature.deletePanic(this.props.data.id);
            Router.getRouter().navigate('/take-care');
          },
        },
      },
      routerPath: '/panic/:id',
      hasBottomBar: true,
    });
  }

  async renderAsync() {
    const {
      meldetBtn, deleteBtn,
    } = this.model;
    const elements = [];
    const userId = Authenticator.getCurrentUserId();
    const panicId = this.props.data.id;
    const panicUserId = panicId.split('-')[1];
    this.clearComponentContainer();

    elements.push(Elements.createButton({
      textContent: meldetBtn.textContent,
      className: meldetBtn.className,
      onClick: meldetBtn.onClick,
    }));

    if (userId === panicUserId) {
      elements.push(Elements.createButton({
        textContent: deleteBtn.textContent,
        className: deleteBtn.className,
        onClick: deleteBtn.onClick,
      }));
    }

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default PanicPage;
