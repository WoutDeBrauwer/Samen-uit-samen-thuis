/**
 * The Component parent
 */

import Elementsfactory from './ElementsFactory';
import {
  dbRealtime, ref, child, get,
} from './firebase';
import Authenticator from './application/Authenticator';

class Component {
  constructor({
    name,
    model,
    routerPath,
    hasBottomBar,
    props = null,
  }) {
    this.name = name;
    this.model = model;
    this.props = props;
    this.componentContainer = this.createComponentContainer();
    this.routerPath = routerPath;
    this.hasBottomBar = hasBottomBar;
  }

  createComponentContainer() {
    return Elementsfactory.createContainer({
      className: `${this.name}Container basicLayout`,
    });
  }

  clearComponentContainer() {
    while (this.componentContainer.firstChild) {
      this.componentContainer.removeChild(this.componentContainer.lastChild);
    }
  }

  //  Gets user data out of the database
  async getUserData() {
    const dbRef = ref(dbRealtime);
    const uId = Authenticator.getCurrentUserId();
    await get(child(dbRef, `users/${uId}`))
      .then((snapshot) => {
        this.changeModel(snapshot.val());
      });
  }
}

export default Component;
