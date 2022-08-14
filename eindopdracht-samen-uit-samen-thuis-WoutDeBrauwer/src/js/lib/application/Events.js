/**
 * Get Events
 */

import { deleteDoc } from '@firebase/firestore';
import {
  collection, dbFirestore, getDocs, getDoc, doc,
} from '../firebase';
import Authenticator from './Authenticator';

const Events = {
  getAll: async () => {
    const query = collection(dbFirestore, 'events');

    const querySnapshot = await getDocs(query);

    return querySnapshot.docs.map((docu) => (
      {
        ...docu.data(),
        id: docu.id,
      }
    ));
  },

  getRelevantEvents: async () => {
    const events = await Events.getAll();
    const userId = Authenticator.getCurrentUserId();
    const relevantEvents = [];

    events.forEach((event) => {
      const foundJoined = event.joined.find((user) => user === userId);
      if (foundJoined || event.organiser === userId) {
        relevantEvents.push(event);
      }
    });

    return relevantEvents;
  },

  getById: async (id) => {
    const event = (await getDoc(doc(dbFirestore, 'events', id))).data();
    return event;
  },

  deleteEvent: async (id) => {
    const event = await Events.getById(id);
    const query = collection(dbFirestore, `chat:${event.title}`);

    //  Deletes the chat from the event
    const querySnapshot = await getDocs(query);
    querySnapshot.docs.forEach(async (docu) => {
      await deleteDoc(doc(dbFirestore, `chat:${event.title}`, docu.id));
    });

    await deleteDoc(doc(dbFirestore, 'events', id));
  },

  //  Creates event data for easy entity making
  createEventData: async (id) => {
    const data = await Events.getById(id);
    const eventData = {
      organiser: data.organiser,
      title: data.title,
      description: data.description,
      street: data.street,
      number: data.number,
      zip: data.zip,
      city: data.city,
      startDate: data.startDate,
      startTime: data.startTime,
      endDate: data.endDate,
      endTime: data.endTime,
    };
    return eventData;
  },
};

export default Events;
