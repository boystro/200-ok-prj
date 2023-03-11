import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, deleteDoc, getDoc, getDocs, getFirestore, query, where, doc, setDoc } from "firebase/firestore";

// Primary
// const firebaseConfig = {
//   apiKey: "AIzaSyC0OBg4AZUc3irWshg1vUFcCeIyGyl2XWk",
//   authDomain: "prj-404-2c806.firebaseapp.com",
//   projectId: "prj-404-2c806",
//   storageBucket: "prj-404-2c806.appspot.com",
//   messagingSenderId: "657999429129",
//   appId: "1:657999429129:web:3c721ef6b1ae66f8ca82d8"
// };

// Alternate
const firebaseConfig = {
  apiKey: "AIzaSyC7F7NCUPsK8hkFdJ6ECLm9NgU0DXlcVNI",
  authDomain: "prj-404-200-ok.firebaseapp.com",
  projectId: "prj-404-200-ok",
  storageBucket: "prj-404-200-ok.appspot.com",
  messagingSenderId: "291258786472",
  appId: "1:291258786472:web:5ddcd501acf1aa6489589d"
};

const app = initializeApp(firebaseConfig);
export const db   = getFirestore();
export const auth = getAuth();

export const superusers = collection(db, "superusers")
export const events = collection(db, "events")

export async function newEvent(eventName:string, eventDate:string, eventDescription:string, hostName:string, hostEmail:string) {
  return await addDoc(events, {
    hostName : hostName,
    hostEmail : hostEmail,
    eventName : eventName,
    eventDate : eventDate,
    eventDescription : eventDescription,
    participants : []
  })
}

export async function getOwnEvents(hostEmail:string) {
  return await getDocs(query(events, where("hostEmail", "==" , hostEmail)))
}

export async function getEvents(hostEmail:string) {
  return await getDocs(query(events, where("hostEmail", "!=" , hostEmail)))
}

export async function getAllEvents() {
  return await getDocs(events)
}

export async function userParticipateEvent(userEmail:string, eventId:string) {
  const d = doc(db, "events", eventId)
  return await getDoc(d).then(async (snapshot) => {
    const data = snapshot.data()
    if (data) {
      data.participants.push(userEmail)
      await setDoc(d, data);
    }
  })
}

export async function userDeparticipateEvent(userEmail:string, eventId:string) {
  const d = doc(db, "events", eventId)
  return await getDoc(d).then(async (snapshot) => {
    const data = snapshot.data()
    if (data) {
      data.participants = data.participants.filter((p:any) => p != userEmail)
      await setDoc(d, data);
    }
  })
}

export async function deleteEvent(id:string) {
  return await deleteDoc(doc(db, "events", id))
}
