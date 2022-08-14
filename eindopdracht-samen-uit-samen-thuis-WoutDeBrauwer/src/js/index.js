import '../../design-system/sass/main.scss';
import App from './App';
import {
  LoginPage,
  RegisterPage,
  EditAccountPage,
  BottomBar,
  Homepage,
  EventDetailPage,
  AccountDetailPage,
  EditEventPage,
  DeleteUsersPage,
  AddUsersPage,
  MeldetPage,
  Header,
  CountdownPage,
  TakeCarePage,
  PanicPage,
  ChatPage,
} from './components/index';
import TakeCareFeature from './lib/application/TakeCareFeature';

import {
  auth,
  onAuthStateChanged,
} from './lib/firebase';

import Router from './lib/Router';

const appContainer = document.getElementById('appContainer');
const app = new App(appContainer);

const checkTakeCareFeature = async () => {
  //  Checks if there is an event going on
  if (await TakeCareFeature.checkIfEvent()) {
    //  If there is an event going on, create the header
    app.takeCareFeature = true;
  } else {
    //  If there is no event, do not create the header
    app.takeCareFeature = false;
  }
};

const loadRest = () => {
  // The Bottombar
  app.addComponent(new BottomBar());

  // The header
  app.addComponent(new Header());

  // The actual pages
  app.addComponent(new EditAccountPage());
  app.addComponent(new Homepage());
  app.addComponent(new EventDetailPage());
  app.addComponent(new AccountDetailPage());
  app.addComponent(new EditEventPage());
  app.addComponent(new DeleteUsersPage());
  app.addComponent(new AddUsersPage());
  app.addComponent(new MeldetPage());
  app.addComponent(new CountdownPage());
  app.addComponent(new TakeCarePage());
  app.addComponent(new PanicPage());
  app.addComponent(new ChatPage());
};

// If the user is already logged in, send him directly to home
const onAuthStateChangedFunction = async (user) => {
  await checkTakeCareFeature();
  if (user) {
    loadRest();
    Router.getRouter().navigate('/home');
  }
};

const initApp = () => {
  //  Load first these so there is a user before the rest loads
  app.addComponent(new LoginPage());
  app.addComponent(new RegisterPage());
};

//  Sees if there is already a user logged in
onAuthStateChanged(auth, onAuthStateChangedFunction);

window.addEventListener('load', initApp);
