import { db } from '../firebase';
import { Item } from '../models/Item';
import { collection, doc, setDoc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';

const itemsCollection = collection(db, 'items');

export const addItem = async (item: Item): Promise<void> => {
  await setDoc(doc(itemsCollection, item.id), item);
};

export const updateItem = async (item: Item): Promise<void> => {
  await updateDoc(doc(itemsCollection, item.id), { ...item });
};

export const getItem = async (itemId: string): Promise<Item | undefined> => {
  const docSnap = await getDoc(doc(itemsCollection, itemId));
  return docSnap.exists() ? (docSnap.data() as Item) : undefined;
};

export const deleteItem = async (itemId: string): Promise<void> => {
  await deleteDoc(doc(itemsCollection, itemId));
};