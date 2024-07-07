import React, { useState, useEffect } from 'react';
import { Typography, Container, List, ListItem, ListItemText } from '@mui/material';
import { Order } from '../models/Order';
import { getOrder } from '../services/OrderService';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // This is a placeholder. In a real app, you'd fetch all orders.
    const fetchOrders = async () => {
      const order = await getOrder('placeholder-id');
      if (order) setOrders([order]);
    };
    fetchOrders();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <List>
        {orders.map((order) => (
          <ListItem key={order.id}>
            <ListItemText 
              primary={`Order #${order.id}`} 
              secondary={`Status: ${order.status}`} 
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Orders;