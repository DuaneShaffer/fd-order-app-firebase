import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { updateSubcategoryDocument, createSubcategoryDocument } from '../../services/firebaseService';

interface SubcategoriesFormProps {
    categories: string[];
    subcategories: { [key: string]: { name: string, displayOrder: number }[] };
    onUpdate: (updatedSubcategories: { [key: string]: { name: string, displayOrder: number }[] }) => void;
}

const SubcategoriesForm: React.FC<SubcategoriesFormProps> = ({ categories, subcategories, onUpdate }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [subcategoryDetails, setSubcategoryDetails] = useState<string>('');

    const handleSaveSubcategoryClick = async () => {
        try {
            const newSubcategory = {
                name: subcategoryDetails,
                displayOrder: subcategories[selectedCategory]?.length || 0
            };

            if (subcategories[selectedCategory]) {
                await updateSubcategoryDocument(selectedCategory, [...subcategories[selectedCategory], newSubcategory]);
            } else {
                await createSubcategoryDocument(selectedCategory, newSubcategory);
            }

            setSubcategoryDetails('');
            const updatedSubcategories = {
                ...subcategories,
                [selectedCategory]: [...(subcategories[selectedCategory] || []), newSubcategory]
            };
            onUpdate(updatedSubcategories);
        } catch (err) {
            console.error('Failed to save subcategory:', err);
            // Handle error (e.g., show error message to user)
        }
    };

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        try {
            const items = Array.from(subcategories[selectedCategory]);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            const updatedItems = items.map((item, index) => ({
                ...item,
                displayOrder: index
            }));

            await updateSubcategoryDocument(selectedCategory, updatedItems);

            const updatedSubcategories = {
                ...subcategories,
                [selectedCategory]: updatedItems
            };
            onUpdate(updatedSubcategories);
        } catch (err) {
            console.error('Failed to reorder subcategories:', err);
            // Handle error (e.g., show error message to user)
        }
    };

    return (
        <div>
            <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as string)}
                >
                    {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedCategory && (
                <div>
                    <TextField
                        label="New Subcategory"
                        value={subcategoryDetails}
                        onChange={(e) => setSubcategoryDetails(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSaveSubcategoryClick} 
                        disabled={!subcategoryDetails.trim()}
                    >
                        Add Subcategory
                    </Button>
                    <h2>Existing Subcategories</h2>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId={`subcategories-${selectedCategory}`}>
                            {(provided, snapshot) => (
                                <List 
                                    {...provided.droppableProps} 
                                    ref={provided.innerRef}
                                    style={{
                                        background: snapshot.isDraggingOver ? '#e0e0e0' : 'transparent',
                                        padding: 8,
                                        borderRadius: 4,
                                        transition: 'background-color 0.2s ease'
                                    }}
                                >
                                    {subcategories[selectedCategory]
                                        ?.sort((a, b) => a.displayOrder - b.displayOrder)
                                        .map((subcategory, index) => (
                                            <Draggable key={subcategory.name} draggableId={subcategory.name} index={index}>
                                                {(provided, snapshot) => (
                                                    <ListItem
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            userSelect: 'none',
                                                            padding: 16,
                                                            margin: '0 0 8px 0',
                                                            minHeight: '50px',
                                                            backgroundColor: snapshot.isDragging ? '#4caf50' : '#fff',
                                                            color: snapshot.isDragging ? '#fff' : '#000',
                                                            boxShadow: snapshot.isDragging ? '0 5px 10px rgba(0,0,0,0.2)' : 'none',
                                                            borderRadius: 4,
                                                            transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                                                            ...provided.draggableProps.style
                                                        }}
                                                    >
                                                        <DragIndicatorIcon style={{ marginRight: 8 }} />
                                                        <ListItemText primary={subcategory.name} />
                                                    </ListItem>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </List>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            )}
        </div>
    );
};

export default SubcategoriesForm;