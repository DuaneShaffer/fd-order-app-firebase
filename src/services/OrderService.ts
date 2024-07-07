import { db } from './firebase';
import { Order } from './Order';

const ordersCollection = db.collection('orders');

export const addOrder = async (order: Order): Promise<void> => {
  await ordersCollection.doc(order.id).set(order);
};

export const updateOrder = async (order: Order): Promise<void> => {
  await ordersCollection.doc(order.id).update(order);
};

export const getOrder = async (orderId: string): Promise<Order | undefined> => {
  const doc = await ordersCollection.doc(orderId).get();
  return doc.exists ? (doc.data() as Order) : undefined;
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  await ordersCollection.doc(orderId).delete();
};
