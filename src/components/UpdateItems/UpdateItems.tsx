import React, { useEffect, useState } from 'react';
import { ref, getDownloadURL, uploadString, listAll } from 'firebase/storage';
import { storage } from '../../firebase';
import { 
  Button, CircularProgress, TextField, Table, TableBody, TableCell, 
  TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, 
  Select, MenuItem, FormControl, InputLabel, Checkbox, IconButton 
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface Item {
  case: number;
  name: string;
  oz: number;
  upc: string;
  inactive: boolean;
}

interface Category {
  name: string;
  items: Item[];
}

interface InventoryData {
  categories: Category[];
}

const UpdateItems: React.FC = () => {
    const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
    const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
    const [fileList, setFileList] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
    const [newCategoryName, setNewCategoryName] = useState<string>('');
    const [showNewCategoryDialog, setShowNewCategoryDialog] = useState<boolean>(false);
    const [showResetDialog, setShowResetDialog] = useState<boolean>(false);

    useEffect(() => {
        loadFileList();
        const savedData = sessionStorage.getItem('inventoryData');
        if (savedData) {
            setInventoryData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        if (selectedFile && !inventoryData) {
            loadData();
        }
    }, [selectedFile]);

    useEffect(() => {
        if (inventoryData) {
            sessionStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        }
    }, [inventoryData]);

    const formatFileName = (fileName: string): string => {
        return fileName
            .replace(/_/g, ' ')
            .replace(/\.json$/, '')
            .replace(/\b\w/g, c => c.toUpperCase());
    };

    const loadFileList = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const folderRef = ref(storage, 'app_items');
            const result = await listAll(folderRef);
            const files = result.items.map(item => item.name);
            setFileList(files);
            if (files.length > 0) {
                setSelectedFile(files[0]);
            }
        } catch (err) {
            setError('Failed to fetch file list. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const loadData = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        setError(null);
        try {
            const fileRef = ref(storage, `app_items/${selectedFile}`);
            const url = await getDownloadURL(fileRef);
            const response = await fetch(url);
            const data: InventoryData = await response.json();
            
            // Set default inactive value to false if not present
            data.categories.forEach(category => {
                category.items.forEach(item => {
                    if (item.inactive === undefined) {
                        item.inactive = false;
                    }
                });
            });
            
            setInventoryData(data);
            sessionStorage.setItem('inventoryData', JSON.stringify(data));
        } catch (err) {
            setError('Failed to fetch data. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!inventoryData || !selectedFile) return;
        setShowConfirmDialog(true);
    };

    const confirmSave = async () => {
        setShowConfirmDialog(false);
        setIsLoading(true);
        setError(null);
        try {
            const fileRef = ref(storage, `app_items/${selectedFile}`);
            await uploadString(fileRef, JSON.stringify(inventoryData), 'raw', { contentType: 'application/json' });
            alert('Data saved successfully!');
        } catch (err: any) {
            setError(`Failed to save data: ${err.message}. Please try again.`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditItem = (categoryIndex: number, itemIndex: number) => {
        setEditingItem({ ...inventoryData!.categories[categoryIndex].items[itemIndex] });
        setEditingCategoryIndex(categoryIndex);
        setEditingItemIndex(itemIndex);
    };

    const handleUpdateItem = () => {
        if (editingItem && editingCategoryIndex !== null && editingItemIndex !== null) {
            const updatedInventoryData = { ...inventoryData! };
            updatedInventoryData.categories[editingCategoryIndex].items[editingItemIndex] = editingItem;
            setInventoryData(updatedInventoryData);
            setEditingItem(null);
            setEditingCategoryIndex(null);
            setEditingItemIndex(null);
        }
    };

    const handleAddItem = (categoryIndex: number) => {
        setEditingItem({ case: 0, name: '', oz: 0, upc: '', inactive: false });
        setEditingCategoryIndex(categoryIndex);
        setEditingItemIndex(-1);
    };

    const handleAddNewItem = () => {
        if (editingItem && editingCategoryIndex !== null) {
            const updatedInventoryData = { ...inventoryData! };
            updatedInventoryData.categories[editingCategoryIndex].items.push(editingItem);
            setInventoryData(updatedInventoryData);
            setEditingItem(null);
            setEditingCategoryIndex(null);
            setEditingItemIndex(null);
        }
    };

    const handleAddCategory = () => {
        setShowNewCategoryDialog(true);
    };

    const confirmAddCategory = () => {
        if (newCategoryName && inventoryData) {
            const updatedInventoryData = { ...inventoryData };
            updatedInventoryData.categories.push({ name: newCategoryName, items: [] });
            setInventoryData(updatedInventoryData);
            setNewCategoryName('');
            setShowNewCategoryDialog(false);
        }
    };

    const handleMoveItem = (categoryIndex: number, itemIndex: number, direction: 'up' | 'down') => {
        if (!inventoryData) return;
        
        const newInventoryData = { ...inventoryData };
        const items = newInventoryData.categories[categoryIndex].items;
        const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;

        if (newIndex >= 0 && newIndex < items.length) {
            [items[itemIndex], items[newIndex]] = [items[newIndex], items[itemIndex]];
            setInventoryData(newInventoryData);
        }
    };

    const handleToggleInactive = (categoryIndex: number, itemIndex: number) => {
        if (!inventoryData) return;

        const newInventoryData = { ...inventoryData };
        const item = newInventoryData.categories[categoryIndex].items[itemIndex];
        item.inactive = !item.inactive;
        setInventoryData(newInventoryData);
    };

    const handleReset = () => {
        setShowResetDialog(true);
    };

    const confirmReset = () => {
        sessionStorage.removeItem('inventoryData');
        setInventoryData(null);
        loadData();
        setShowResetDialog(false);
    };

    if (isLoading) return <CircularProgress />;
    if (error) return <div>{error}</div>;
    if (!inventoryData) return null;

    return (
        <div>
            <h1>Update Items</h1>
            <FormControl fullWidth>
                <InputLabel>Select Category</InputLabel>
                <Select
                    value={selectedFile}
                    onChange={(e) => setSelectedFile(e.target.value as string)}
                >
                    {fileList.map((file) => (
                        <MenuItem key={file} value={file}>{formatFileName(file)}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSave} disabled={isLoading}>Save Changes</Button>
            <Button variant="contained" onClick={handleAddCategory} disabled={isLoading}>Add Category</Button>
            <Button variant="contained" onClick={handleReset} disabled={isLoading}>Reset Changes</Button>
            {inventoryData.categories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                    <h2>{category.name}</h2>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>UPC</TableCell>
                                <TableCell>Case Size</TableCell>
                                <TableCell>Oz</TableCell>
                                <TableCell>Active</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {category.items.map((item, itemIndex) => (
                                <TableRow key={itemIndex}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.upc}</TableCell>
                                    <TableCell>{item.case}</TableCell>
                                    <TableCell>{item.oz}</TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={!item.inactive}
                                            onChange={() => handleToggleInactive(categoryIndex, itemIndex)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleMoveItem(categoryIndex, itemIndex, 'up')} disabled={itemIndex === 0}>
                                            <ArrowUpwardIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleMoveItem(categoryIndex, itemIndex, 'down')} disabled={itemIndex === category.items.length - 1}>
                                            <ArrowDownwardIcon />
                                        </IconButton>
                                        <Button onClick={() => handleEditItem(categoryIndex, itemIndex)}>Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button onClick={() => handleAddItem(categoryIndex)}>Add Item</Button>
                </div>
            ))}
            <Dialog open={!!editingItem} onClose={() => setEditingItem(null)}>
                <DialogTitle>{editingItemIndex === -1 ? 'Add New Item' : 'Edit Item'}</DialogTitle>
                <DialogContent>
                    {editingItem && (
                        <>
                            <TextField
                                label="Name"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="UPC"
                                value={editingItem.upc}
                                onChange={(e) => setEditingItem({ ...editingItem, upc: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Case Size"
                                type="number"
                                value={editingItem.case}
                                onChange={(e) => setEditingItem({ ...editingItem, case: Number(e.target.value) })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Oz"
                                type="number"
                                value={editingItem.oz}
                                onChange={(e) => setEditingItem({ ...editingItem, oz: Number(e.target.value) })}
                                fullWidth
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Active</InputLabel>
                                <Select
                                    value={editingItem.inactive ? 'inactive' : 'active'}
                                    onChange={(e) => setEditingItem({ ...editingItem, inactive: e.target.value === 'inactive' })}
                                >
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingItem(null)}>Cancel</Button>
                    <Button onClick={editingItemIndex === -1 ? handleAddNewItem : handleUpdateItem}>
                        {editingItemIndex === -1 ? 'Add' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
                <DialogTitle>Confirm Save</DialogTitle>
                <DialogContent>
                    Are you sure you want to save the changes?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
                    <Button onClick={confirmSave}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showNewCategoryDialog} onClose={() => setShowNewCategoryDialog(false)}>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowNewCategoryDialog(false)}>Cancel</Button>
                    <Button onClick={confirmAddCategory}>Add</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
                <DialogTitle>Confirm Reset</DialogTitle>
                <DialogContent>
                    Are you sure you want to reset all changes? This will discard all unsaved modifications.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
                    <Button onClick={confirmReset}>Confirm Reset</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UpdateItems;