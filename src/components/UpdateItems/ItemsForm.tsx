import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Item } from '../../models/Item';
import { updateItemDocument, addItemDocument } from '../../services/firebaseService';

interface ItemsFormProps {
    items: Item[];
    categories: string[];
    subcategories: { [key: string]: { name: string, displayOrder: number }[] };
    onUpdate: () => void;
}

const ItemsForm: React.FC<ItemsFormProps> = ({ items, categories, subcategories, onUpdate }) => {
    const [editItem, setEditItem] = useState<Item | null>(null);
    const [newDetails, setNewDetails] = useState<Partial<Item>>({
        name: '',
        category: '',
        subcategory: '',
        attributes: {
            caseSize: 0,
            upc: '',
            weight: 0,
            history: []
        },
        isActive: false,
        isInAndOut: false
    });

    const handleEditClick = (item: Item) => {
        setEditItem(item);
        setNewDetails({
            name: item.name,
            category: item.category,
            subcategory: item.subcategory,
            attributes: {
                caseSize: item.attributes.caseSize,
                upc: item.attributes.upc || '',
                weight: item.attributes.weight,
                history: item.attributes.history || [],
            },
            isActive: item.isActive,
            isInAndOut: item.isInAndOut,
        });
    };

    const handleSaveItemClick = async () => {
        try {
            if (editItem) {
                await updateItemDocument(editItem.id, newDetails);
            } else {
                await addItemDocument(newDetails);
            }
            resetItemForm();
            onUpdate(); // Notify parent component to refresh items
        } catch (err) {
            console.error('Failed to save item:', err);
            // Handle error (e.g., show error message to user)
        }
    };

    const resetItemForm = () => {
        setEditItem(null);
        setNewDetails({
            name: '',
            category: '',
            subcategory: '',
            attributes: {
                caseSize: 0,
                upc: '',
                weight: 0,
                history: []
            },
            isActive: false,
            isInAndOut: false
        });
    };

    return (
        <div>
            <TextField
                label="Name"
                value={newDetails.name || ''}
                onChange={(e) => setNewDetails({ ...newDetails, name: e.target.value })}
                fullWidth
                margin="normal"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                    value={newDetails.category || ''}
                    onChange={(e) => setNewDetails({ ...newDetails, category: e.target.value as string })}
                >
                    {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Subcategory</InputLabel>
                <Select
                    value={newDetails.subcategory || ''}
                    onChange={(e) => setNewDetails({ ...newDetails, subcategory: e.target.value as string })}
                >
                    {(subcategories[newDetails.category!] || []).sort((a, b) => a.displayOrder - b.displayOrder).map((subcategory) => (
                        <MenuItem key={subcategory.name} value={subcategory.name}>
                            {subcategory.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Case Size"
                type="number"
                value={newDetails.attributes?.caseSize || ''}
                onChange={(e) =>
                    setNewDetails({
                        ...newDetails,
                        attributes: {
                            ...newDetails.attributes!,
                            caseSize: parseInt(e.target.value)
                        }
                    })
                }
                fullWidth
                margin="normal"
            />
            <TextField
                label="UPC"
                value={newDetails.attributes?.upc || ''}
                onChange={(e) =>
                    setNewDetails({
                        ...newDetails,
                        attributes: {
                            ...newDetails.attributes!,
                            upc: e.target.value
                        }
                    })
                }
                fullWidth
                margin="normal"
            />
            <TextField
                label="Weight"
                type="number"
                value={newDetails.attributes?.weight || ''}
                onChange={(e) =>
                    setNewDetails({
                        ...newDetails,
                        attributes: {
                            ...newDetails.attributes!,
                            weight: parseInt(e.target.value)
                        }
                    })
                }
                fullWidth
                margin="normal"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={newDetails.isActive || false}
                        onChange={(e) => setNewDetails({ ...newDetails, isActive: e.target.checked })}
                    />
                }
                label="Active"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={newDetails.isInAndOut || false}
                        onChange={(e) => setNewDetails({ ...newDetails, isInAndOut: e.target.checked })}
                    />
                }
                label="In and Out"
            />
            <Button variant="contained" color="primary" onClick={handleSaveItemClick}>
                {editItem ? 'Save' : 'Insert'}
            </Button>
            {editItem && (
                <Button variant="outlined" color="secondary" onClick={() => setEditItem(null)}>
                    Cancel
                </Button>
            )}
        </div>
    );
};

export default ItemsForm;