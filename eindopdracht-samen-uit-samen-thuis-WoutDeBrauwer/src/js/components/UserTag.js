/**
 * User Tag Component
 */

import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';

class UserTag extends Component {
  constructor(username, imageURL) {
    super({
      name: 'userTag',
      model: {
        username,
        imageURL,
        picture: '<i class="fas fa-user"></i>',
      },
    });
  }

  render() {
    const { username, imageURL, picture } = this.model;
    const elements = [];

    this.clearComponentContainer();

    if (imageURL) {
      elements.push(Elements.createContainer({
        className: 'image',
        backgroundImage: imageURL,
      }));
    } else {
      elements.push(Elements.createContainer({
        className: 'picture',
        innerHTML: picture,
      }));
    }

    const usernametext = Elements.createParagraph({
      textContent: username,
    });

    elements.push(Elements.createContainer({
      className: 'tag',
      children: [usernametext],
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default UserTag;
