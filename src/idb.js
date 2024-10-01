// idb.js

// Ido Dohan 207933128
// Mattan Ben Yosef 318360351

(function () {
    // Helper function to format dates in 'YYYY-MM-DD' format in local time
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() +1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2,'0');
        return `${year}-${month}-${day}`;
    }

    const idb = {
        /**
         * Opens or creates a database for calorie management and returns an object with methods to interact with it
         * @param {string} dbName - The name of the database
         * @param {number} version - The version of the database
         * @returns {Promise<Object>} - A promise that resolves to an object with methods to interact with the database
         */
        openCaloriesDB: function (dbName, version) {
            return new Promise((resolve, reject) => {
                const request = window.indexedDB.open(dbName, version);

                request.onerror = function (event) {
                    reject(new Error("Error opening database"));
                };

                request.onupgradeneeded = function (event) {
                    const db = event.target.result;
                    const objectStore = db.createObjectStore("calories", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                    objectStore.createIndex("category", "category", { unique: false });
                    objectStore.createIndex("date", "date", { unique: false });
                };

                request.onsuccess = function (event) {
                    const db = event.target.result;

                    // Create a wrapper object with methods
                    const dbWrapper = {
                        /**
                         * Adds a new calorie entry to the database
                         * @param {Object} calorieData - The calorie entry data
                         * @returns {Promise<number>} - A promise that resolves to the new entry's ID
                         */
                        addCalories: function (calorieData) {
                            return new Promise((resolve, reject) => {
                                // Add current date if not provided, in 'YYYY-MM-DD' format
                                if (!calorieData.date) {
                                    calorieData.date = formatDate(new Date());
                                }

                                // Ensure the calorie property is named 'calories'
                                if (calorieData.calorie && !calorieData.calories) {
                                    calorieData.calories = calorieData.calorie;
                                    delete calorieData.calorie;
                                }

                                const transaction = db.transaction(["calories"], "readwrite");
                                const objectStore = transaction.objectStore("calories");
                                const request = objectStore.add(calorieData);

                                request.onerror = function (event) {
                                    reject(new Error("Error adding calorie entry"));
                                };

                                request.onsuccess = function (event) {
                                    resolve(event.target.result); // The ID of the new entry
                                };
                            });
                        },

                        /**
                         * Updates an existing calorie entry in the database
                         * @param {Object} calorieData - The updated calorie entry data
                         * @returns {Promise<void>} - A promise that resolves when the update is complete
                         */
                        updateCalories: function (calorieData) {
                            return new Promise((resolve, reject) => {
                                const transaction = db.transaction(["calories"], "readwrite");
                                const objectStore = transaction.objectStore("calories");
                                const request = objectStore.put(calorieData);

                                request.onerror = function (event) {
                                    reject(new Error("Error updating calorie entry"));
                                };

                                request.onsuccess = function (event) {
                                    resolve();
                                };
                            });
                        },

                        /**
                         * Deletes a calorie entry from the database
                         * @param {number} id - The ID of the entry to delete
                         * @returns {Promise<void>} - A promise that resolves when the deletion is complete
                         */
                        deleteCalories: function (id) {
                            return new Promise((resolve, reject) => {
                                const transaction = db.transaction(["calories"], "readwrite");
                                const objectStore = transaction.objectStore("calories");
                                const request = objectStore.delete(id);

                                request.onerror = function (event) {
                                    reject(new Error("Error deleting calorie entry"));
                                };

                                request.onsuccess = function (event) {
                                    resolve();
                                };
                            });
                        },

                        /**
                         * Retrieves calorie entries for a specific month and year
                         * @param {number} year - The year to retrieve entries for
                         * @param {number} month - The month to retrieve entries for (0-11)
                         * @returns {Promise<Array>} - A promise that resolves to an array of calorie entries
                         */
                        getCaloriesByMonth: function (year, month) {
                            return new Promise((resolve, reject) => {
                                const transaction = db.transaction(["calories"], "readonly");
                                const objectStore = transaction.objectStore("calories");
                                const index = objectStore.index("date");

                                // Define the date range for the query in 'YYYY-MM-DD' format
                                const startDate = formatDate(new Date(year, month, 1));
                                const endDate = formatDate(new Date(year, month + 1, 1));

                                const range = IDBKeyRange.bound(startDate, endDate, false, true);

                                const results = [];
                                const request = index.openCursor(range);

                                request.onsuccess = function (event) {
                                    const cursor = event.target.result;
                                    if (cursor) {
                                        results.push(cursor.value);
                                        cursor.continue();
                                    } else {
                                        resolve(results);
                                    }
                                };

                                request.onerror = function (event) {
                                    reject(new Error("Error retrieving calorie entries"));
                                };
                            });
                        },
                    };

                    resolve(dbWrapper);
                };
            });
        },
    };

    // Check if module.exports is available (CommonJS)
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = idb;
    } else {
        // Otherwise, attach to the global object (window)
        if (typeof window !== 'undefined') {
            window.idb = idb;
        }
    }
})();
