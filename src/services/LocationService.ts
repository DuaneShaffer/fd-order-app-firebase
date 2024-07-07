import { db } from './firebase';
import { Location } from './Location';

const locationsCollection = db.collection('locations');

export const addLocation = async (location: Location): Promise<void> => {
  await locationsCollection.doc(location.id).set(location);
};

export const updateLocation = async (location: Location): Promise<void> => {
  await locationsCollection.doc(location.id).update(location);
};

export const getLocation = async (locationId: string): Promise<Location | undefined> => {
  const doc = await locationsCollection.doc(locationId).get();
  return doc.exists ? (doc.data() as Location) : undefined;
};

export const deleteLocation = async (locationId: string): Promise<void> => {
  await locationsCollection.doc(locationId).delete();
};
