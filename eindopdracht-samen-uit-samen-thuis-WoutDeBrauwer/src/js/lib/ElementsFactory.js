/**
 * My Elements Helper
 */

const Elements = {
  createButton({
    textContent = '',
    onClick = null,
    className = '',
    id = '',
    innerHTML = '',
  }) {
    const button = document.createElement('button');
    button.textContent = textContent;
    button.className = className;
    if (id) button.id = id;
    if (innerHTML) button.innerHTML = innerHTML;
    if (onClick) {
      button.addEventListener('click', () => {
        onClick();
      });
    }
    return button;
  },

  createHeaderComponent({
    children = [],
    id = '',
    className = '',
  }) {
    const header = document.createElement('header');
    if (id) header.setAttribute('id', id);
    if (className) header.classList.add(className);
    if (children.length) {
      children.forEach((child) => {
        if (child instanceof Element) {
          header.appendChild(child);
        }
      });
    }
    return header;
  },

  createHeader({
    size = 1,
    textContent = '',
    className = '',
  }) {
    if (size < 1 || size > 6) return null;
    const header = document.createElement(`h${size}`);
    header.textContent = textContent;
    if (className) header.className = className;
    return header;
  },

  createParagraph({
    textContent = '',
    className = '',
  }) {
    const p = document.createElement('p');
    p.textContent = textContent;
    if (className) p.className = className;
    return p;
  },

  createLink({
    href = '#',
    textContent = '',
    target = '_self',
  }) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = textContent;
    a.target = target;
    return a;
  },

  createList({
    items = [],
    ordered = false,
  }) {
    const list = document.createElement(ordered ? 'ol' : 'ul');
    items.forEach(({
      textContent,
      href,
    }) => {
      const li = document.createElement('li');
      if (!href) li.textContent = textContent;
      else {
        li.appendChild(this.createLink({
          textContent,
          href,
        }));
      }
      list.appendChild(li);
    });
    return list;
  },

  createContainer({
    className = '',
    id = '',
    innerHTML = '',
    children = [],
    backgroundImage = '',
  }) {
    const container = document.createElement('div');
    if (id) container.setAttribute('id', id);
    container.className = className;
    container.innerHTML = innerHTML;
    if (backgroundImage) container.style.backgroundImage = `url(${backgroundImage})`;
    if (children.length) {
      children.forEach((child) => {
        if (child instanceof Element) {
          container.appendChild(child);
        }
      });
    }
    return container;
  },

  createClickableContainer({
    className = '',
    id = '',
    innerHTML = '',
    children = [],
    onClick = null,
  }) {
    const container = document.createElement('div');
    if (id) container.setAttribute('id', id);
    container.className = className;
    container.innerHTML = innerHTML;
    if (children.length) {
      children.forEach((child) => {
        if (child instanceof Element) {
          container.appendChild(child);
        }
      });
    }
    if (onClick) {
      container.addEventListener('click', () => {
        onClick();
      });
    }
    return container;
  },

  createForm({
    action = '#',
    children = [],
  }) {
    const form = document.createElement('form');
    form.setAttribute('action', action);
    if (children.length) {
      children.forEach((child) => {
        if (child instanceof Element) {
          form.appendChild(child);
        }
      });
    }
    return form;
  },

  createFormElement({
    type = 'text',
    placeholder = '',
    value = '',
    name = '',
    id = '',
  }) {
    const formElement = document.createElement('input');
    formElement.setAttribute('type', type);
    if (placeholder) formElement.setAttribute('placeholder', placeholder);
    if (value) formElement.setAttribute('value', value);
    if (name) formElement.setAttribute('name', name);
    if (id) formElement.id = id;
    return formElement;
  },

  createErrorContainer({
    className = 'errorContainer',
    hidden = true,
  }) {
    const container = document.createElement('div');
    container.classList.add(className);
    if (hidden) container.classList.add('hide');
    return container;
  },

  createSuccessContainer({
    className = 'successContainer',
    hidden = true,
  }) {
    const container = document.createElement('div');
    container.classList.add(className);
    if (hidden) container.classList.add('hide');
    return container;
  },

  createTextarea({
    placeholder = '',
    value = '',
    name = '',
    cols = 30,
    rows = 10,
    innerHTML = '',
  }) {
    const textarea = document.createElement('textarea');
    if (placeholder) textarea.setAttribute('placeholder', placeholder);
    if (value) textarea.setAttribute('value', value);
    if (name) textarea.setAttribute('name', name);
    if (innerHTML) textarea.innerHTML = innerHTML;
    textarea.setAttribute('cols', cols);
    textarea.setAttribute('rows', rows);
    return textarea;
  },

  createCheckbox({
    textContent = '',
    value = '',
    name = '',
  }) {
    const label = document.createElement('label');
    if (textContent) label.textContent = textContent;
    label.setAttribute('for', value);
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('name', name);
    checkbox.setAttribute('value', value);
    checkbox.setAttribute('id', value);
    label.appendChild(checkbox);
    return label;
  },

  createImageContainer({
    className = '',
    srcURL = '',
    alt = '',
  }) {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add(className);
    const image = document.createElement('img');
    image.setAttribute('src', srcURL);
    image.setAttribute('alt', alt);
    imageContainer.appendChild(image);
    return imageContainer;
  },

  createFooter({
    children = [],
    id = '',
  }) {
    const footer = document.createElement('footer');
    if (id) footer.setAttribute('id', id);
    if (children.length) {
      children.forEach((child) => {
        if (child instanceof Element) {
          footer.appendChild(child);
        }
      });
    }
    return footer;
  },
};

export default Elements;
