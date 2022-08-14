/**
 * Take Care Feature Object
 */

import Authenticator from './Authenticator';
import Events from './Events';
import {
  setDoc, doc, dbFirestore, collection, getDocs, getDoc, deleteDoc,
} from '../firebase';

const TakeCareFeature = {
  checkIfEvent: async () => {
    const events = await Events.getAll();
    const uId = Authenticator.getCurrentUserId();
    const joinedEvents = [];
    let returnValue = '';

    //  Gets all the events that the current user has created
    events.forEach((event) => {
      if (event.organiser === uId) joinedEvents.push(event);
    });
    //  Gets all the events to which the current user has been invited
    events.forEach((event) => {
      const found = event.joined.find((user) => user === uId);
      if (found) joinedEvents.push(event);
    });

    //  Checks fo every event related to the user if there is any event going on now
    joinedEvents.forEach((event) => {
      /*
      * the startdate is equal or less than the date now
      * and the enddate is equal or greater than the date now
      */
      if (event.startDate <= TakeCareFeature.getToday()
        && event.endDate >= TakeCareFeature.getToday()) {
        /*
        * the starttime is equal or less than the time now
        * and the endtime is equal or greater than the time now
        */
        if (event.startTime <= TakeCareFeature.getTime()
          && event.endTime >= TakeCareFeature.getTime()) {
          returnValue = event.id;
        }
      }
    });
    return returnValue;
  },

  //  returns the date of today
  getToday: () => {
    const date = new Date();
    let month = '';
    let day = '';

    if ((date.getMonth() + 1) < 10) {
      month = `0${date.getMonth() + 1}`;
    } else {
      month = date.getMonth() + 1;
    }

    if (date.getDate() < 10) {
      day = `0${date.getDate()}`;
    } else {
      day = date.getDate();
    }
    return `${date.getFullYear()}-${month}-${day}`;
  },

  //  Returns the curren time
  getTime: () => {
    const date = new Date();
    let hours = '';
    let minutes = '';

    if (date.getHours() < 10) {
      hours = `0${date.getHours()}`;
    } else {
      hours = date.getHours();
    }

    if (date.getMinutes() < 10) {
      minutes = `0${date.getMinutes()}`;
    } else {
      minutes = date.getMinutes();
    }

    return `${hours}:${minutes}`;
  },

  createPanic: async (eventId) => {
    const date = new Date();
    const userId = Authenticator.getCurrentUserId();
    const user = await Authenticator.getUser(userId);
    const panicData = {
      userId,
      username: user.username,
      eventId,
      date: `${date.getDate()}/${date.getUTCMonth() + 1}/${date.getFullYear()} om ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    };

    //  Writes a panic to the database
    await setDoc(doc(dbFirestore, 'panics', `${eventId}-${userId}`), panicData);
  },

  getById: async (panicId) => {
    const panic = (await getDoc(doc(dbFirestore, 'panics', panicId))).data();
    return panic;
  },

  deletePanic: async (panicId) => {
    await deleteDoc(doc(dbFirestore, 'panics', panicId));
  },

  //  gets all the panics from the database
  getAll: async () => {
    const query = collection(dbFirestore, 'panics');

    const querySnapshot = await getDocs(query);

    return querySnapshot.docs.map((docu) => (
      {
        ...docu.data(),
        id: docu.id,
      }
    ));
  },
};

export default TakeCareFeature;
