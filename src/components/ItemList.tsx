import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

interface Item {
  id: string;
  name: string;
  category: string;
  // Add other fields as necessary
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsData: Item[] = [];
      querySnapshot.forEach((doc) => {
        itemsData.push({ id: doc.id, ...doc.data() } as Item);
      });
      setItems(itemsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Items</Typography>
      <List>
        {items.map((item) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.name} secondary={item.category} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ItemList;