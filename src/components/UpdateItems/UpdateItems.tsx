import React, { useEffect, useState } from 'react';
import { fetchItems, fetchCategories } from '../../services/firebaseService';
import ItemsForm from './ItemsForm';
import SubcategoriesForm from './SubcategoriesForm';
import { Button, CircularProgress } from '@mui/material';
import { Item } from '../../models/Item';

const UpdateItems: React.FC = () => {
    const [mode, setMode] = useState<'items' | 'subcategories'>('items');
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<{ [key: string]: { name: string, displayOrder: number }[] }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [fetchedItems, [fetchedCategories, fetchedSubcategories]] = await Promise.all([
                    fetchItems(),
                    fetchCategories()
                ]);
                setItems(fetchedItems);
                setCategories(fetchedCategories);
                setSubcategories(fetchedSubcategories);
            } catch (err) {
                setError('Failed to fetch data. Please try again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleItemsUpdate = () => {
        // Refresh items after update
        fetchItems().then(setItems).catch(console.error);
    };

    const handleSubcategoriesUpdate = (updatedSubcategories: { [key: string]: { name: string, displayOrder: number }[] }) => {
        setSubcategories(updatedSubcategories);
    };

    return (
        <div>
            <h1>{mode === 'items' ? 'Update Items' : 'Update Subcategories'}</h1>
            <Button variant="contained" onClick={() => setMode('items')} disabled={isLoading}>Update Items</Button>
            <Button variant="contained" onClick={() => setMode('subcategories')} disabled={isLoading}>Update Subcategories</Button>
            {isLoading ? (
                <CircularProgress />
            ) : error ? (
                <div>{error}</div>
            ) : (
                mode === 'items' 
                    ? <ItemsForm 
                        items={items} 
                        categories={categories} 
                        subcategories={subcategories} 
                        onUpdate={handleItemsUpdate}
                      /> 
                    : <SubcategoriesForm 
                        categories={categories} 
                        subcategories={subcategories} 
                        onUpdate={handleSubcategoriesUpdate}
                      />
            )}
        </div>
    );
};

export default UpdateItems;