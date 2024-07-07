import React, { useState, useEffect } from 'react';
import { Typography, Container, List, ListItem, ListItemText } from '@mui/material';
import { Item } from '../models/Item';
import { getItem } from '../services/ItemService';

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // This is a placeholder. In a real app, you'd fetch all items.
    const fetchItems = async () => {
      const item = await getItem('placeholder-id');
      if (item) setItems([item]);
    };
    fetchItems();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Items
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.name} secondary={`UPC: ${item.attributes.upc}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Items;