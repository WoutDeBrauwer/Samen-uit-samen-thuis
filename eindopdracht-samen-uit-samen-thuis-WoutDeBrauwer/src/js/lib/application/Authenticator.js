/**
 * Authenticator
 */

import Exception from '../Exceptions/Exception';
import {
  //  authentication
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  deleteUser,
  //  realtime database
  dbRealtime,
  get,
  child,
  ref,
  set,
} from '../firebase';

import Router from '../Router';
import Events from './Events';
import Event from './Event';

class Authenticator {
  //  Shows the error on screen
  static showError(error) {
    if (!error) return;
    const exception = new Exception(error);
    exception.checkWichError();
  }

  //  Gets the current user
  static getCurrentUser() {
    return auth.currentUser;
  }

  //  Gets the current userId
  static getCurrentUserId() {
    return this.getCurrentUser().uid;
  }

  static getAllUsers() {
    const dbRef = ref(dbRealtime);
    const users = get(child(dbRef, 'users'))
      .then((snapshot) => snapshot.val());
    return users;
  }

  static async getUser(userId) {
    const users = await this.getAllUsers();
    return users[userId];
  }

  //  Register a new account
  static async registerNewAccount() {
    const formData = new FormData(document.querySelector('form'));
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Router.getRouter().navigate('/edit-account');
    } catch (e) {
      this.showError(e);
    }
  }

  //  Log in to an existing account
  static async login() {
    const formData = new FormData(document.querySelector('form'));
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Router.getRouter().navigate('/home');
    } catch (e) {
      this.showError(e);
    }
  }

  //  Log in to an account via Google
  static async googleLogin() {
    const provider = new GoogleAuthProvider();

    try {
      const dbRef = ref(dbRealtime);
      await signInWithPopup(auth, provider);

      get(child(dbRef, `users/${this.getCurrentUserId()}`))
        .then(async (snapshot) => {
          //  Checks if the user already exists
          if (snapshot.exists()) {
            //  If the user already exist, send it to the home page
            Router.getRouter().navigate('/home');
          } else {
            //  if the user doesnt exist, send it to the account completion
            Router.getRouter().navigate('/edit-account');
          }
        });
    } catch (e) {
      this.showError(e);
    }
  }

  //  Logs the user out
  static async logout() {
    await signOut(auth);
    Router.getRouter().navigate('/');
  }

  //  Deletes a user
  static async deleteUser() {
    const uId = this.getCurrentUserId();

    //  Deletes all the events the user has created
    const events = await Events.getAll();
    events.forEach(async (event) => {
      if (event.organiser === uId) {
        Events.deleteEvent(event.id);
      } else {
        //  Deletes the user from all the other events its related to
        // invited, joined and rejected
        const eventData = await Events.createEventData(event.id);
        const event1 = new Event(eventData);
        await event1.deleteUsers([uId], event.id);
      }
    });
    //  Deletes the data of this user saved in the database
    await set(ref(dbRealtime, `users/${uId}`), null);

    //  Deletes the user itself from the database
    deleteUser(this.getCurrentUser()).then(() => {
      Router.getRouter().navigate('/');
    }).catch((e) => {
      this.showError(e);
    });
  }
}

export default Authenticator;
