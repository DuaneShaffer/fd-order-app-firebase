import { db } from './firebase';
import { Item } from './Item';

const itemsCollection = db.collection('items');

export const addItem = async (item: Item): Promise<void> => {
  await itemsCollection.doc(item.id).set(item);
};

export const updateItem = async (item: Item): Promise<void> => {
  await itemsCollection.doc(item.id).update(item);
};

export const getItem = async (itemId: string): Promise<Item | undefined> => {
  const doc = await itemsCollection.doc(itemId).get();
  return doc.exists ? (doc.data() as Item) : undefined;
};

export const deleteItem = async (itemId: string): Promise<void> => {
  await itemsCollection.doc(itemId).delete();
};
