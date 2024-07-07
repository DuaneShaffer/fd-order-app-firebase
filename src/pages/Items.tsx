import React, { useEffect, useState } from 'react';
import { getItem } from '../services/ItemService';
import { Item } from '../models/Item';

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const itemList = await getItem('item-id'); // Replace with actual item ID or fetching logic
      setItems(itemList ? [itemList] : []);
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h1>Items</h1>
      {items.map(item => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <p>Category: {item.category}</p>
          {/* Display other item attributes */}
        </div>
      ))}
    </div>
  );
};

export default Items;
