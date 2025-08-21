const LOCAL_STORAGE_KEY = 'spring8_inventory_items';

// --- Helper Functions ---
const readItems = () => {
    const itemsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    return itemsJson ? JSON.parse(itemsJson) : [];
};
const writeItems = (items) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
};

// --- Public API Functions ---

/**
 * Gets all items, with an optional search filter and specific field.
 * @param {string} searchTerm - The text to search for.
 * @param {string} searchField - The specific field to search in ('all', 'item_name', etc.).
 * @returns {Promise<Array>} A promise that resolves to the array of items.
 */
export const getItems = async (searchTerm = '', searchField = 'all') => {
    let items = readItems();
    if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        items = items.filter(item => {
            if (searchField === 'all') {
                return (
                    item.item_name.toLowerCase().includes(lowercasedTerm) ||
                    item.document_number.toLowerCase().includes(lowercasedTerm) ||
                    (item.provisional_asset_number || '').toLowerCase().includes(lowercasedTerm) ||
                    (item.qr_number || '').toLowerCase().includes(lowercasedTerm)
                );
            } else {
                // Search in a specific field
                return (item[searchField] || '').toLowerCase().includes(lowercasedTerm);
            }
        });
    }
    return items.sort((a, b) => b.createdAt - a.createdAt);
};

export const getItem = async (id) => {
    const items = readItems();
    const item = items.find(item => item._id === id);
    if (!item) throw new Error('Item not found');
    return item;
};

export const createItem = async (itemData) => {
    const items = readItems();
    const newItem = {
        ...itemData,
        _id: `item_${Date.now()}`,
        document_number: `${new Date().toISOString().slice(0, 10)}-${Date.now()}`,
        createdAt: Date.now()
    };
    writeItems([...items, newItem]);
    return newItem;
};

export const updateItem = async (id, itemData) => {
    let items = readItems();
    const itemIndex = items.findIndex(item => item._id === id);
    if (itemIndex === -1) throw new Error('Item not found for update');
    items[itemIndex] = { ...items[itemIndex], ...itemData };
    writeItems(items);
    return items[itemIndex];
};

// NEW: A helper function to get dashboard stats
export const getDashboardStats = async () => {
    const items = readItems();
    const totalItems = items.length;

    // This logic is now much more powerful.
    // It checks each item for several conditions.
    const itemsWithMissingFields = items
        .map(item => {
            const missing = []; // An array to hold the names of missing fields

            if (!item.photo_base64) {
                missing.push('Photo');
            }
            if (!item.qr_number) {
                missing.push('QR Number');
            }
            if (!item.storage_location) {
                missing.push('Location');
            }
            // As per spec, Final Asset Number is important for items over ¥200,000
            if (item.purchase_amount > 200000 && !item.final_asset_number) {
                missing.push('Final Asset No.');
            }

            // If the 'missing' array has any items, we return the item
            // along with a new property that lists what's missing.
            if (missing.length > 0) {
                return { ...item, missing_fields: missing };
            }
            return null; // Otherwise, we return null for this item
        })
        .filter(item => item !== null); // Finally, we filter out all the nulls

    // The logic for recentItems has been removed, so we don't return it.
    return { totalItems, itemsWithMissingFields };
};