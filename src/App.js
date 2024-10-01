// App.js

// Ido Dohan 207933128
// Mattan Ben Yosef 318360351

import React, { useState, useEffect } from 'react';
import idb from './idb.js'; 
import CalorieForm from './CalorieForm';
import CalorieList from './CalorieList';
import CalorieChart from './CalorieChart';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // For icons

const App = () => {
    const [db, setDb] = useState(null);
    const [calories, setCalories] = useState([]);
    const [error, setError] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [entryToEdit, setEntryToEdit] = useState(null); // New state for the entry being edited

    // Initialize the IndexedDB database when the component mounts
    useEffect(() => {
        const initDb = async () => {
            try {
                const database = await idb.openCaloriesDB("caloriesdb", 1);
                setDb(database);
            } catch (err) {
                console.error(err);
                setError("Failed to initialize database. Please refresh the page.");
            }
        };
        initDb();
    }, []);

    // Fetch calorie entries whenever the database, selected month, or selected year changes
    useEffect(() => {
        if (db) {
            fetchCalories();
        }
    }, [db, selectedMonth, selectedYear]);

    // Function to fetch calorie entries from the database
    const fetchCalories = async () => {
        try {
            const fetchedCalories = await db.getCaloriesByMonth(selectedYear, selectedMonth);
            setCalories(fetchedCalories);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch calorie entries. Please try again.");
        }
    };

    // Handler for changing the selected month and year
    const handleMonthChange = (e) => {
        const [year, month] = e.target.value.split('-');
        setSelectedYear(parseInt(year));
        setSelectedMonth(parseInt(month) - 1);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Calorie Management App</h1>

            {error && (
                <div
                    className="alert alert-danger d-flex align-items-center justify-content-between"
                    role="alert"
                >
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setError(null)}
                    ></button>
                </div>
            )}

            <div className="row">
                <div className="col-lg-6 mb-4">
                    <CalorieForm
                        db={db}
                        fetchCalories={fetchCalories}
                        setError={setError}
                        entryToEdit={entryToEdit}        // Pass entryToEdit to CalorieForm
                        setEntryToEdit={setEntryToEdit}  // Pass setEntryToEdit to CalorieForm
                    />
                </div>
                <div className="col-lg-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header text-white bg-primary">
                            <h5 className="card-title mb-0">Calorie Report</h5>
                        </div>
                        <div className="card-body">
                            <input
                                type="month"
                                value={`${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`}
                                onChange={handleMonthChange}
                                className="form-control mb-3"
                            />
                            <CalorieList
                                calories={calories}
                                db={db}
                                fetchCalories={fetchCalories}
                                setError={setError}
                                setEntryToEdit={setEntryToEdit}  // Pass setEntryToEdit to CalorieList
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-header text-white bg-success">
                    <h5 className="card-title mb-0">Calorie Intake Chart</h5>
                </div>
                <div className="card-body">
                    <CalorieChart calories={calories} />
                </div>
            </div>
        </div>
    );
};

export default App;
