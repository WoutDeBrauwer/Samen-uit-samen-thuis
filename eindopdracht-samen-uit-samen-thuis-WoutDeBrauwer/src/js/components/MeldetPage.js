/**
 * Meldet Page Component
 */

import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Exception from '../lib/Exceptions/Exception';

class MeldetPage extends Component {
  constructor() {
    super({
      name: 'meldet',
      model: {
        title: 'Meldet',
        forms: [
          {
            type: 'text',
            textContent: 'Titel of sleutelwoorden',
            name: 'title',
          },
          {
            type: 'textarea',
            textContent: 'Omschrijving',
            name: 'description',
          },
          {
            type: 'text',
            textContent: 'Straat',
            name: 'street',
          },
          {
            type: 'text',
            textContent: 'Nummer',
            name: 'number',
          },
          {
            type: 'text',
            textContent: 'Postcode',
            name: 'zip',
          },
          {
            type: 'text',
            textContent: 'Gemeente/stad',
            name: 'city',
          },
          {
            type: 'date',
            textContent: 'Datum',
            name: 'date',
          },
        ],
        categories: [
          'ableism',
          'ageism',
          'alloism',
          'anti-Blackness',
          'antisemitsm',
          'biphobia',
          'catcalling',
          'classism',
          'enbyphobia',
          'eugenics',
          'ethnocentrism',
          'fatphobia',
          'homophobia',
          'islamophobia',
          'lesbophobia',
          'misogyny',
          'misogynoir',
          'nativism',
          'queerphobia',
          'racism',
          'religious imperialism',
          'sexism',
          'sizeism',
          'stigmatization of addiction',
          'stigmatization of homelessness',
          'toxic masculinity',
          'transphobia',
          'whorephobia',
        ],
        button: {
          textContent: 'Meldet',
          onClick: () => {
            try {
              const formData = new FormData(document.querySelector('form'));
              const title = formData.get('title');
              const description = formData.get('description');
              const street = formData.get('street');
              const number = formData.get('number');
              const zip = formData.get('zip');
              const city = formData.get('city');
              const date = formData.get('date');
              const categories = formData.getAll('category');

              if (categories.length === 0) {
                throw new Exception();
              }

              formData.forEach((value) => {
                if (!value) throw new Exception();
              });

              console.log('EMAIL LAYOUT');
              console.log(`title: ${title}`);
              console.log(`description: ${description}`);
              console.log(`street: ${street}`);
              console.log(`number: ${number}`);
              console.log(`zip: ${zip}`);
              console.log(`city: ${city}`);
              console.log(`date: ${date}`);
              console.log(`categories: ${categories.toString()}`);

              const successContainer = document.querySelector('.successContainer');
              successContainer.innerHTML = 'Jouw Meldet is verstuurd';
              successContainer.classList.remove('hide');
            } catch (e) {
              e.showError('Vul alle velden in.');
            }
          },
        },
      },
      routerPath: '/meldet-form',
      hasBottomBar: true,
    });
  }

  render() {
    const {
      title, forms, categories, button,
    } = this.model;
    const elements = [];
    const formElements = [];
    const categoryCheckboxes = [];

    this.clearComponentContainer();

    elements.push(Elements.createHeader({
      size: 3,
      textContent: title,
      className: 'text-center',
    }));

    forms.forEach((form) => {
      if (form.type === 'textarea') {
        formElements.push(Elements.createTextarea({
          placeholder: form.textContent,
          name: form.name,
          rows: 5,
        }));
      } else {
        formElements.push(Elements.createFormElement({
          type: form.type,
          placeholder: form.textContent,
          name: form.name,
        }));
      }
    });

    formElements.push(Elements.createHeader({
      size: 4,
      textContent: 'Category:',
    }));

    categories.forEach((category) => {
      categoryCheckboxes.push(Elements.createCheckbox({
        textContent: category,
        value: category,
        name: 'category',
      }));
    });

    formElements.push(Elements.createContainer({
      className: 'categories',
      children: categoryCheckboxes,
    }));

    elements.push(Elements.createForm({
      children: formElements,
    }));

    elements.push(Elements.createErrorContainer({}));

    elements.push(Elements.createSuccessContainer({}));

    elements.push(Elements.createButton({
      textContent: button.textContent,
      onClick: button.onClick,
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default MeldetPage;
