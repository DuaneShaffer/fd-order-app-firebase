import { db } from '../firebase';
import { Location } from '../models/Location';
import { collection, doc, setDoc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';

const locationsCollection = collection(db, 'locations');

export const addLocation = async (location: Location): Promise<void> => {
  await setDoc(doc(locationsCollection, location.id), location);
};

export const updateLocation = async (location: Location): Promise<void> => {
  await updateDoc(doc(locationsCollection, location.id), { ...location });
};

export const getLocation = async (locationId: string): Promise<Location | undefined> => {
  const docSnap = await getDoc(doc(locationsCollection, locationId));
  return docSnap.exists() ? (docSnap.data() as Location) : undefined;
};

export const deleteLocation = async (locationId: string): Promise<void> => {
  await deleteDoc(doc(locationsCollection, locationId));
};  