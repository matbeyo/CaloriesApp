// Ido Dohan 207933128
// Mattan Ben Yosef 318360351


const idb = {
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
            
            // Resolve with the database instance upon success
            request.onsuccess = (event) => resolve(event.target.result);

            // Create object stores and indexes when the database is upgraded
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Create "calories" object store with auto-incrementing primary key "id"
                const objectStore = db.createObjectStore("calories", { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("category", "category", { unique: false });
                objectStore.createIndex("date", "date", { unique: false });
            };
        });
    },

    /**
     * Adds a new calorie entry to the database
     * @param {IDBDatabase} db - The database object
     * @param {Object} calorieData - The calorie entry data
     * @returns {Promise<number>} - A promise that resolves to the new entry's ID
     */
    addCalories: async (db, calorieData) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["calories"], "readwrite");
            const objectStore = transaction.objectStore("calories");
            const request = objectStore.add(calorieData);

            // Handle errors in adding the entry
            request.onerror = (event) => reject(new Error("Error adding calorie entry"));
            // Resolve with the new entry's ID upon success
            request.onsuccess = (event) => resolve(event.target.result);
        });
    },

    /**
     * Updates an existing calorie entry in the database
     * @param {IDBDatabase} db - The database object
     * @param {Object} calorieData - The updated calorie entry data
     * @returns {Promise<undefined>} - A promise that resolves when the update is complete
     */
    updateCalories: async (db, calorieData) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["calories"], "readwrite");
            const objectStore = transaction.objectStore("calories");
            const request = objectStore.put(calorieData);
            // Handle errors in updating the entry
            request.onerror = (event) => reject(new Error("Error updating calorie entry"));
            // Resolve when the update is successful
            request.onsuccess = (event) => resolve();
        });
    },

    /**
     * Deletes a calorie entry from the database
     * @param {IDBDatabase} db - The database object
     * @param {number} id - The ID of the entry to delete
     * @returns {Promise<undefined>} - A promise that resolves when the deletion is complete
     */
    deleteCalories: async (db, id) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["calories"], "readwrite");
            const objectStore = transaction.objectStore("calories");
            const request = objectStore.delete(id);
            
            // Handle errors in deleting the entry
            request.onerror = (event) => reject(new Error("Error deleting calorie entry"));
            // Resolve when the deletion is successful
            request.onsuccess = (event) => resolve();
        });
    },

    /**
     * Retrieves calorie entries for a specific month and year
     * @param {IDBDatabase} db - The database object
     * @param {number} year - The year to retrieve entries for
     * @param {number} month - The month to retrieve entries for (0-11)
     * @returns {Promise<Array>} - A promise that resolves to an array of calorie entries
     */
    getCaloriesByMonth: async (db, year, month) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["calories"], "readonly");
            const objectStore = transaction.objectStore("calories");
            const index = objectStore.index("date");

            // Define the date range for the query
            const startDate = new Date(year, month, 1).toISOString().split('T')[0];
            const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
            
            // Create a key range to query entries within the specified date range
            const range = IDBKeyRange.bound(startDate, endDate);
            const request = index.getAll(range);
            
            // Handle errors in retrieving entries
            request.onerror = (event) => reject(new Error("Error getting calorie entries"));
            // Resolve with the array of entries upon success
            request.onsuccess = (event) => resolve(event.target.result);
        });
    }
};

export default idb;
