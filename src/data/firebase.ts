import { initializeApp } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  runTransaction,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { Contact } from "../types/contact";

const firebaseConfig = {
  apiKey: "AIzaSyBuqjyB9dCeakwIzCM_niGS6LzIqqMZrO4",
  authDomain: "notnotion-e43f3.firebaseapp.com",
  projectId: "notnotion-e43f3",
  storageBucket: "notnotion-e43f3.firebasestorage.app",
  messagingSenderId: "582299699145",
  appId: "1:582299699145:web:c2d2f37c7eebb3c9e70a18",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

const contactsCollection = collection(db, "contacts");
const legacyStorageKey = "ais_contacts_table_data_v4";
const migrationDoc = doc(db, "appMetadata", "legacyContactsMigration");

export const migrateLegacyContacts = async (): Promise<void> => {
  const savedContacts = localStorage.getItem(legacyStorageKey);
  if (!savedContacts) return;

  const parsedContacts = JSON.parse(savedContacts) as Contact[];
  if (!Array.isArray(parsedContacts)) return;

  const existingContacts = await getDocs(contactsCollection);
  await runTransaction(db, async (transaction) => {
    const migration = await transaction.get(migrationDoc);
    if (migration.exists()) return;

    if (existingContacts.empty) {
      parsedContacts.forEach((contact) => {
        transaction.set(doc(contactsCollection, contact.id), {
          ...contact,
          gender: contact.gender === "Male" ? "Male" : "Female",
        });
      });
    }
    transaction.set(migrationDoc, { completedAt: new Date().toISOString() });
  });

  localStorage.removeItem(legacyStorageKey);
};

export const subscribeToContacts = (
  onChange: (contacts: Contact[]) => void,
  onError: (error: Error) => void,
): Unsubscribe =>
  onSnapshot(
    contactsCollection,
    (snapshot) => {
      onChange(
        snapshot.docs.map(
          (contactDoc) =>
            ({
              ...contactDoc.data(),
              id: contactDoc.id,
            }) as Contact,
        ),
      );
    },
    onError,
  );

export const saveContact = (contact: Contact): Promise<void> =>
  setDoc(doc(contactsCollection, contact.id), contact);

export const removeContact = (contactId: string): Promise<void> =>
  deleteDoc(doc(contactsCollection, contactId));
