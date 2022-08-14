/**
 * Login Page Component
 */

import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';
import Authenticator from '../lib/application/Authenticator';

class LoginPage extends Component {
  constructor() {
    super({
      name: 'login',
      model: {
        title: 'Samen uit, Samen thuis',
        forms: [
          'Email',
          'Password',
        ],
        loginButton: {
          textContent: 'login',
          onClick: () => Authenticator.login(),
        },
        googleButton: {
          textContent: 'login met google',
          onClick: () => Authenticator.googleLogin(),
        },
      },
      routerPath: '/',
      hasBottomBar: false,
    });
  }

  render() {
    const {
      title, forms, loginButton, googleButton,
    } = this.model;
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
      textContent: loginButton.textContent,
      onClick: loginButton.onClick,
    }));

    elements.push(Elements.createHeader({
      size: 5,
      textContent: 'OF',
      className: 'text-center',
    }));

    elements.push(Elements.createButton({
      textContent: googleButton.textContent,
      onClick: googleButton.onClick,
    }));

    elements.push(Elements.createHeader({
      size: 5,
      textContent: 'Geen account?',
      className: 'grey text-center',
    }));

    elements.push(Elements.createButton({
      textContent: 'Registreer hier',
      className: 'link',
      onClick: () => Router.getRouter().navigate('/register'),
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default LoginPage;
