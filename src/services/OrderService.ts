import { db } from '../firebase';
import { Order } from '../models/Order';
import { collection, doc, setDoc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';

const ordersCollection = collection(db, 'orders');

export const addOrder = async (order: Order): Promise<void> => {
  await setDoc(doc(ordersCollection, order.id), order);
};

export const updateOrder = async (order: Order): Promise<void> => {
  await updateDoc(doc(ordersCollection, order.id), { ...order });
};

export const getOrder = async (orderId: string): Promise<Order | undefined> => {
  const docSnap = await getDoc(doc(ordersCollection, orderId));
  return docSnap.exists() ? (docSnap.data() as Order) : undefined;
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  await deleteDoc(doc(ordersCollection, orderId));
};