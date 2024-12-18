
const idb = {

    createDummyData: () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };

        return [
            // Yesterday's entries
            {
                calories: 300,
                category: 'BREAKFAST',
                description: 'Oatmeal with fruits',
                date: formatDate(yesterday)
            },
            {
                calories: 600,
                category: 'LUNCH',
                description: 'Chicken salad',
                date: formatDate(yesterday)
            },
            {
                calories: 800,
                category: 'DINNER',
                description: 'Pasta with meatballs',
                date: formatDate(yesterday)
            },
            // Today's entries
            {
                calories: 400,
                category: 'BREAKFAST',
                description: 'Pancakes with maple syrup',
                date: formatDate(today)
            },
            {
                calories: 550,
                category: 'LUNCH',
                description: 'Turkey sandwich',
                date: formatDate(today)
            },
            {
                calories: 750,
                category: 'DINNER',
                description: 'Grilled salmon with rice',
                date: formatDate(today)
            },
            // Tomorrow's planned entries
            {
                calories: 350,
                category: 'BREAKFAST',
                description: 'Greek yogurt with granola',
                date: formatDate(tomorrow)
            },
            {
                calories: 500,
                category: 'LUNCH',
                description: 'Quinoa bowl',
                date: formatDate(tomorrow)
            },
            {
                calories: 700,
                category: 'DINNER',
                description: 'Stir-fry vegetables with tofu',
                date: formatDate(tomorrow)
            }
        ];
    },

    /**
     * Opens or creates a database for calorie management
     * @param {string} dbName - The name of the database
     * @param {number} version - The version of the database
     * @returns {Promise<IDBDatabase>} - A promise that resolves to the database object
     */
    openCaloriesDB: async (dbName, version) => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);

            // Handle errors in opening the database
            request.onerror = (event) => reject(new Error("Error opening database"));
            
            // Create object stores and indexes when the database is upgraded
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Create "calories" object store with auto-incrementing primary key "id"
                const objectStore = db.createObjectStore("calories", { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("category", "category", { unique: false });
                objectStore.createIndex("date", "date", { unique: false });
            };

            // Initialize with dummy data upon success
            request.onsuccess = async (event) => {
                const db = event.target.result;
                
                // Check if there's any existing data
                const transaction = db.transaction(["calories"], "readonly");
                const objectStore = transaction.objectStore("calories");
                const countRequest = objectStore.count();
                
                countRequest.onsuccess = async () => {
                    if (countRequest.result === 0) {
                        // No existing data, add dummy data
                        const dummyData = idb.createDummyData();
                        const writeTransaction = db.transaction(["calories"], "readwrite");
                        const writeStore = writeTransaction.objectStore("calories");
                        
                        for (const entry of dummyData) {
                            writeStore.add(entry);
                        }
                        
                        writeTransaction.oncomplete = () => {
                            resolve(db);
                        };
                    } else {
                        resolve(db);
                    }
                };
            };
        });
    },

    // ... rest of the existing idb methods remain unchanged ...
    addCalories: async (db, calorieData) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["calories"], "readwrite");
            const objectStore = transaction.objectStore("calories");
            const request = objectStore.add(calorieData);

            request.onerror = (event) => reject(new Error("Error adding calorie entry"));
            request.onsuccess = (event) => resolve(event.target.result);
        });
    },

    updateCalories: async (db, calorieData) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["calories"], "readwrite");
            const objectStore = transaction.objectStore("calories");
            const request = objectStore.put(calorieData);
            request.onerror = (event) => reject(new Error("Error updating calorie entry"));
            request.onsuccess = (event) => resolve();
        });
    },

    deleteCalories: async (db, id) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["calories"], "readwrite");
            const objectStore = transaction.objectStore("calories");
            const request = objectStore.delete(id);
            
            request.onerror = (event) => reject(new Error("Error deleting calorie entry"));
            request.onsuccess = (event) => resolve();
        });
    },

    getCaloriesByMonth: async (db, year, month) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["calories"], "readonly");
            const objectStore = transaction.objectStore("calories");
            const index = objectStore.index("date");

            const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
            const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')}`;

            const range = IDBKeyRange.bound(startDate, endDate);

            const request = index.getAll(range);

            request.onerror = (event) => reject(new Error("Error getting calorie entries"));
            request.onsuccess = (event) => resolve(event.target.result);
        });
    },
};

export default idb;
