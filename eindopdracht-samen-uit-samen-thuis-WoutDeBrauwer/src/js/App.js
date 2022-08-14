/**
 * App
 */

import Component from './lib/Component';
import Router from './lib/Router';
import { firebase } from './lib/firebase';

class App {
  constructor(parent) {
    this.parent = parent;
    this.components = [];
    this.firebase = firebase;
    this.takeCareFeature = false;
  }

  async showTakeCareFeature() {
    //  Find the correct component
    const header = this.components.find((component) => component.name === 'header');
    await header.renderAsync()
      .then((headerComponent) => {
        this.parent.appendChild(headerComponent);
      });
  }

  clearParent() {
    while (this.parent.firstChild) {
      this.parent.removeChild(this.parent.lastChild);
    }
  }

  addComponent(component) {
    if (!(component instanceof Component)) return;

    // get the name, routerPath and if there is a bottombar from out component
    const { name, routerPath, hasBottomBar } = component;

    // add to internal class
    this.components.push(component);

    // add to router if it is a page component (check if there is a routerpath)
    if (component.routerPath) {
      Router.getRouter().on(
        routerPath,
        (params) => {
          this.showComponent({
            name,
            props: params,
            hasBottomBar,
          });
        },
      ).resolve();
    }
  }

  async showComponent({ name, props, hasBottomBar }) {
    const foundComponent = this.components.find((component) => component.name === name);
    if (!foundComponent) return;
    this.clearParent();

    // If the take care feature is activated, add the panic button
    if (this.takeCareFeature) {
      this.showTakeCareFeature();
      this.parent.classList.add('takeCareFeatureContainer');
    } else {
      this.parent.classList.remove('takeCareFeatureContainer');
    }

    if (props) foundComponent.props = props;

    // Render the content on the page
    if (foundComponent.render) {
      this.parent.appendChild(foundComponent.render());
    }

    // If the page has a bottombar, add it
    if (hasBottomBar) {
      const bottomBar = this.components.find((component) => component.name === 'bottomBar');
      await bottomBar.renderAsync()
        .then((bottomBarComponent) => {
          this.parent.appendChild(bottomBarComponent);
        });
    }

    if (foundComponent.renderAsync) {
      await foundComponent
        .renderAsync()
        .then((renderedComponent) => {
          this.parent.appendChild(renderedComponent);
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
    if (foundComponent.showMessages) {
      foundComponent.showMessages();
    }
  }
}

export default App;
