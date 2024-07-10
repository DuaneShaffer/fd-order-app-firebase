// src/components/NewOrders.tsx

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { Order } from '../models/Order';

const NewOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), where('status', '==', 'new'));
    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const ordersArray: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersArray.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersArray);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>New Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            Order ID: {order.id}, Customer: {order.userId}, Location: ${order.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewOrders;
