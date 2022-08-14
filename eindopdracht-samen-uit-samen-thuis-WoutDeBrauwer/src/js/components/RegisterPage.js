/**
 * Register Page Component
 */

import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';
import Authenticator from '../lib/application/Authenticator';

class RegisterPage extends Component {
  constructor() {
    super({
      name: 'register',
      model: {
        title: 'Samen uit, Samen thuis',
        forms: [
          'Email',
          'Password',
        ],
        button: {
          textContent: 'Registreer',
          onClick: () => Authenticator.registerNewAccount(),
        },
      },
      routerPath: '/register',
      hasBottomBar: false,
    });
  }

  render() {
    const { title, forms, button } = this.model;
    const elements = [];
    const formElements = [];

    this.clearComponentContainer();

    elements.push(Elements.createHeader({
      size: 2,
      textContent: title,
      className: 'text-center',
    }));

    elements.push(Elements.createErrorContainer({}));

    forms.forEach((form) => {
      formElements.push(Elements.createFormElement({
        type: form.toLowerCase(),
        placeholder: form,
        name: form.toLowerCase(),
      }));
    });

    elements.push(Elements.createForm({
      children: formElements,
    }));

    elements.push(Elements.createButton({
      textContent: button.textContent,
      onClick: button.onClick,
    }));

    elements.push(Elements.createHeader({
      size: 5,
      textContent: 'ga terug naar',
      className: 'grey text-center',
    }));

    elements.push(Elements.createButton({
      textContent: 'login',
      className: 'link',
      onClick: () => Router.getRouter().navigate('/'),
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default RegisterPage;
