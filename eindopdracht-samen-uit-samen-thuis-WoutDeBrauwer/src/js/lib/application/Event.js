/**
 * An Event Object
 */

import {
  addDoc, dbFirestore, collection, setDoc, doc, getDoc,
} from '../firebase';
import Authenticator from './Authenticator';

class Event {
  constructor({
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
  }) {
    this.organiser = organiser;
    this.title = title;
    this.description = description;
    this.street = street;
    this.number = number;
    this.zip = zip;
    this.city = city;
    this.startDate = startDate;
    this.startTime = startTime;
    this.endDate = endDate;
    this.endTime = endTime;
    this.createdOn = null;
    this.invited = [];
    this.joined = [];
    this.rejected = [];
  }

  createEventData() {
    const date = new Date();

    const eventData = {
      organiser: this.organiser,
      title: this.title,
      description: this.description,
      street: this.street,
      number: this.number,
      zip: this.zip,
      city: this.city,
      startDate: this.startDate,
      startTime: this.startTime,
      endDate: this.endDate,
      endTime: this.endTime,
      invited: this.invited,
      joined: this.joined,
      rejected: this.rejected,
      editedOn: `${date.getDate()}/${date.getUTCMonth() + 1}/${date.getFullYear()} om ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      createdOn: this.createdOn,
    };

    return eventData;
  }

  //  There is some data that will stay the same with some edits.
  async keepCertainData(eventId) {
    const event = (await getDoc(doc(dbFirestore, 'events', eventId))).data();
    this.invited = event.invited;
    this.joined = event.joined;
    this.rejected = event.rejected;
    this.createdOn = event.createdOn;
  }

  async createNewEvent() {
    const date = new Date();
    this.createdOn = `${date.getDate()}/${date.getUTCMonth() + 1}/${date.getFullYear()} om ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const eventData = this.createEventData();

    const docRef = await addDoc(collection(dbFirestore, 'events'), eventData);
    return { ...eventData, id: docRef.id };
  }

  async editEvent(eventId) {
    await this.keepCertainData(eventId);

    const eventData = this.createEventData();

    await setDoc(doc(dbFirestore, 'events', eventId), eventData);
  }

  async inviteUsers(users, eventId) {
    await this.keepCertainData(eventId);
    users.forEach((user) => {
      this.invited.push(user);
    });
    //  Makes sure there are no double invites
    this.invited = [...new Set(this.invited)];
    const eventData = this.createEventData();

    await setDoc(doc(dbFirestore, 'events', eventId), eventData);
  }

  async joinEvent(eventId) {
    await this.keepCertainData(eventId);
    const userId = Authenticator.getCurrentUserId();
    this.joined.push(userId);

    //  If the user joins then it has to be deleted from invited
    const found = this.invited.find((invite) => invite === userId);
    if (found) this.invited.splice(this.invited.indexOf(found), 1);

    const eventData = this.createEventData();
    await setDoc(doc(dbFirestore, 'events', eventId), eventData);
  }

  //  Reject an event or leave an event
  async rejectEvent(eventId) {
    await this.keepCertainData(eventId);
    const userId = Authenticator.getCurrentUserId();
    this.rejected.push(userId);

    //  If the user was invited, delete him from invited
    const foundInvite = this.invited.find((invite) => invite === userId);
    if (foundInvite) this.invited.splice(this.invited.indexOf(foundInvite), 1);
    //  If the user joined, delete him from joined
    const foundJoin = this.joined.find((join) => join === userId);
    if (foundJoin) this.joined.splice(this.joined.indexOf(foundJoin), 1);

    const eventData = this.createEventData();
    await setDoc(doc(dbFirestore, 'events', eventId), eventData);
  }

  async deleteUsers(users, eventId) {
    await this.keepCertainData(eventId);
    const foundIndexInvited = [];
    const foundIndexJoined = [];
    const foundIndexRejected = [];

    //  if the user was invited, delete it from invited
    users.forEach((user) => {
      const found = this.invited.find((invite) => invite === user);
      if (found) {
        foundIndexInvited.push(this.invited.indexOf(found));
      }
    });

    //  if the user joined, delete it from joined
    users.forEach((user) => {
      const found = this.joined.find((join) => join === user);
      if (found) {
        foundIndexJoined.push(this.joined.indexOf(found));
      }
    });

    //  if the user rejected, delete it from rejected
    users.forEach((user) => {
      const found = this.rejected.find((reject) => reject === user);
      if (found) {
        foundIndexRejected.push(this.joined.indexOf(found));
      }
    });

    //  Sorts all the found indices from big to small
    //  This is easier for deleting them from the array
    foundIndexInvited.sort((a, b) => b - a);
    foundIndexJoined.sort((a, b) => b - a);
    foundIndexRejected.sort((a, b) => b - a);

    foundIndexInvited.forEach((index) => {
      this.invited.splice(index, 1);
    });
    foundIndexJoined.forEach((index) => {
      this.joined.splice(index, 1);
    });
    foundIndexRejected.forEach((index) => {
      this.rejected.splice(index, 1);
    });

    const eventData = this.createEventData();
    await setDoc(doc(dbFirestore, 'events', eventId), eventData);
  }
}

export default Event;
