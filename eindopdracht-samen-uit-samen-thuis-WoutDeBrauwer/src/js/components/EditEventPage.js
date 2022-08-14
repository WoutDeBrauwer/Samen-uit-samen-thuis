/**
 * Edit Event Page Component
 */

import Component from '../lib/Component';
import Elements from '../lib/ElementsFactory';
import Router from '../lib/Router';
import Event from '../lib/application/Event';
import Exception from '../lib/Exceptions/Exception';
import Authenticator from '../lib/application/Authenticator';
import Events from '../lib/application/Events';

class EditEventPage extends Component {
  constructor() {
    super({
      name: 'editEvent',
      model: {
        title: 'Evenement aanmaken',
        linkPicture: '<i class="fas fa-times fa-3x"></i>',
        linkOnclick: () => {
          if (this.props.data.id === ':id') {
            Router.getRouter().navigate('/home');
          } else {
            Router.getRouter().navigate(`/event-detail/${this.props.data.id}`);
          }
        },
        forms: [
          {
            type: 'text',
            name: 'Naam',
            value: '',
          },
          {
            type: 'textarea',
            name: 'Beschrijving',
            placeholder: 'Beschrijving',
            value: '',
          },
          {
            type: 'text',
            name: 'Straat',
            value: '',
          },
          {
            type: 'text',
            name: 'Nummer',
            value: '',
          },
          {
            type: 'text',
            name: 'Postcode',
            value: '',
          },
          {
            type: 'text',
            name: 'Gemeente/Stad',
            value: '',
          },
          {
            type: 'date',
            name: 'Startdatum',
            value: '',
          },
          {
            type: 'time',
            name: 'starttijd',
            value: '',
          },
          {
            type: 'date',
            name: 'einddatum',
            value: '',
          },
          {
            type: 'time',
            name: 'eindtijd',
            value: '',
          },
        ],
        button: {
          textContent: 'opslaan',
          onClick: async () => {
            try {
              const organiser = Authenticator.getCurrentUserId();
              const formData = new FormData(document.querySelector('form'));
              const title = formData.get('naam');
              const description = formData.get('beschrijving');
              const street = formData.get('straat');
              const number = formData.get('nummer');
              const zip = formData.get('postcode');
              const city = formData.get('gemeente/stad');
              const startDate = formData.get('startdatum');
              const startTime = formData.get('starttijd');
              const endDate = formData.get('einddatum');
              const endTime = formData.get('eindtijd');

              formData.forEach((value) => {
                if (!value) throw new Exception('Vul alle velden in');
              });

              if (startDate > endDate) {
                throw new Exception('Einddatum mag niet voor de startdatum liggen');
              }

              if (startDate === endDate) {
                if (startTime > endTime) {
                  throw new Exception('Voor dezelfde datum mag eindtijd niet voor de starttijd liggen');
                }
              }

              const event = new Event({
                organiser,
                title,
                description,
                street,
                number,
                zip,
                city,
                startDate,
                startTime,
                endDate,
                endTime,
              });

              if (this.props.data.id === ':id') {
                const eventData = await event.createNewEvent();
                Router.getRouter().navigate(`/event-detail/${eventData.id}`);
              } else {
                await event.editEvent(this.props.data.id);
                Router.getRouter().navigate(`/event-detail/${this.props.data.id}`);
              }
            } catch (e) {
              e.checkWichError();
            }
          },
        },
      },
      routerPath: '/event-edit/:id',
      hasBottomBar: false,
    });
  }

  async loadEvent(id) {
    if (!(id === ':id')) {
      const event = await Events.getById(id);
      this.model.forms = [
        {
          type: 'text',
          name: 'Naam',
          value: event.title,
        },
        {
          type: 'textarea',
          name: 'Beschrijving',
          placeholder: 'Beschrijving',
          value: event.description,
        },
        {
          type: 'text',
          name: 'Straat',
          value: event.street,
        },
        {
          type: 'text',
          name: 'Nummer',
          value: event.number,
        },
        {
          type: 'text',
          name: 'Postcode',
          value: event.zip,
        },
        {
          type: 'text',
          name: 'Gemeente/Stad',
          value: event.city,
        },
        {
          type: 'date',
          name: 'Startdatum',
          value: event.startDate,
        },
        {
          type: 'time',
          name: 'Starttijd',
          value: event.startTime,
        },
        {
          type: 'date',
          name: 'Einddatum',
          value: event.endDate,
        },
        {
          type: 'time',
          name: 'Eindtijd',
          value: event.endTime,
        },
      ];
    }
  }

  async renderAsync() {
    const eventId = this.props.data.id;
    await this.loadEvent(eventId);
    const {
      title, forms, button, linkPicture, linkOnclick,
    } = this.model;
    const elements = [];
    const formElements = [];

    this.clearComponentContainer();

    elements.push(Elements.createClickableContainer({
      className: 'text-right',
      innerHTML: linkPicture,
      onClick: linkOnclick,
    }));

    elements.push(Elements.createHeader({
      size: 3,
      textContent: title,
      className: 'text-center',
    }));

    forms.forEach((form) => {
      formElements.push(Elements.createHeader({
        size: 3,
        textContent: form.name,
      }));
      if (form.type === 'textarea') {
        formElements.push(Elements.createTextarea({
          value: form.value,
          innerHTML: form.value,
          placeholder: form.placeholder,
          name: form.name.toLowerCase(),
          rows: 5,
        }));
      } else {
        formElements.push(Elements.createFormElement({
          type: form.type,
          value: form.value,
          placeholder: form.name.toLowerCase(),
          name: form.name.toLowerCase(),
        }));
      }
    });

    elements.push(Elements.createForm({
      children: formElements,
    }));

    elements.push(Elements.createErrorContainer({}));

    elements.push(Elements.createButton({
      textContent: button.textContent,
      onClick: button.onClick,
    }));

    elements.forEach((element) => this.componentContainer.appendChild(element));

    return this.componentContainer;
  }
}

export default EditEventPage;
