import React, { useState, useEffect } from 'react';
import { Typography, Container, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Item } from '../models/Item';
import { getItem } from '../services/ItemService';

const Warehouse: React.FC = () => {
  const [inventory, setInventory] = useState<Item[]>([]);

  useEffect(() => {
    // This is a placeholder. In a real app, you'd fetch all inventory items.
    const fetchInventory = async () => {
      const item = await getItem('placeholder-id');
      if (item) setInventory([item]);
    };
    fetchInventory();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Warehouse Inventory
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell>UPC</TableCell>
            <TableCell>Case Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.attributes.upc}</TableCell>
              <TableCell>{item.attributes.caseSize}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Warehouse;