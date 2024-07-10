import { db } from '../firebase';
import { collection, doc, getDocs, getDoc, updateDoc, setDoc, addDoc, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { Item } from '../models/Item';

export const fetchItems = async (): Promise<Item[]> => {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(collection(db, 'items'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
};

export const fetchCategories = async (): Promise<[string[], { [key: string]: { name: string, displayOrder: number }[] }]> => {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(collection(db, 'categories'));
    const categoriesArray: string[] = [];
    const subcategoriesMap: { [key: string]: { name: string, displayOrder: number }[] } = {};
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        categoriesArray.push(data.name);
        subcategoriesMap[data.name] = data.subcategories || [];
    });
    return [categoriesArray, subcategoriesMap];
};

export const updateItemDocument = async (itemId: string, newDetails: Partial<Item>) => {
    const itemDoc = doc(db, 'items', itemId);
    await updateDoc(itemDoc, newDetails);
};

export const addItemDocument = async (newItem: Partial<Item>) => {
    await addDoc(collection(db, 'items'), newItem);
};

export const updateSubcategoryDocument = async (categoryName: string, updatedSubcategories: { name: string, displayOrder: number }[]) => {
    const categoryDocRef = doc(db, 'categories', categoryName);
    await updateDoc(categoryDocRef, { subcategories: updatedSubcategories });
};

export const createSubcategoryDocument = async (categoryName: string, newSubcategory: { name: string, displayOrder: number }) => {
    const categoryDocRef = doc(db, 'categories', categoryName);
    await setDoc(categoryDocRef, {
        name: categoryName,
        subcategories: [newSubcategory]
    });
};
