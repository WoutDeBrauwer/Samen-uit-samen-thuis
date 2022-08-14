/**
 * Account Detail Page Component
 */

import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';
import Authenticator from '../lib/application/Authenticator';

class AccountDetailPage extends Component {
  constructor() {
    super({
      name: 'accountDetail',
      model: {
        editBtn: '<i class="fas fa-edit fa-3x"></i>',
        title: 'Jouw account',
        userData: {},
        buttons: [
          {
            textContent: 'afmelden',
            onClick: () => Authenticator.logout(),
          },
          {
            textContent: 'verwijder account',
            className: 'danger',
            onClick: () => Authenticator.deleteUser(),
          },
        ],
      },
      routerPath: '/account-detail',
      hasBottomBar: true,
    });
  }

  changeModel(data) {
    if (data) {
      this.model.userData = {
        name: data.name,
        surname: data.surname,
        username: data.username,
        telephoneNumber: data.telephoneNumber,
        imageURL: data.imageURL,
      };
    }
  }

  async renderAsync() {
    await this.getUserData();

    const {
      editBtn, title, userData, buttons,
    } = this.model;
    const elements = [];

    this.clearComponentContainer();

    elements.push(Elements.createClickableContainer({
      className: 'edit text-right',
      innerHTML: editBtn,
      onClick: () => Router.getRouter().navigate('/edit-account'),
    }));

    elements.push(Elements.createHeader({
      size: 3,
      textContent: title,
      className: 'text-center',
    }));

    elements.push(Elements.createErrorContainer({}));

    elements.push(Elements.createHeader({
      size: 4,
      textContent: `${userData.name} ${userData.surname}`,
    }));

    elements.push(Elements.createHeader({
      size: 4,
      textContent: userData.username,
    }));

    elements.push(Elements.createHeader({
      size: 4,
      textContent: userData.telephoneNumber,
    }));

    elements.push(Elements.createHeader({
      size: 4,
      textContent: 'Avatar:',
    }));

    if (userData.imageURL) {
      elements.push(Elements.createImageContainer({
        className: 'imageContainer',
        srcURL: userData.imageURL,
        alt: 'Kan de afbeelding niet laden',
      }));
    } else {
      elements.push(Elements.createImageContainer({
        className: 'imageContainer',
        alt: 'Geen afbeelding gekozen',
      }));
    }

    buttons.forEach((button) => {
      elements.push(Elements.createButton({
        textContent: button.textContent,
        className: button.className,
        onClick: button.onClick,
      }));
    });

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default AccountDetailPage;
