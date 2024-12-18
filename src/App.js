import React, { useState, useEffect } from 'react';
import idb from './idb';
import CalorieForm from './CalorieForm';
import CalorieList from './CalorieList';
import CalorieChart from './CalorieChart';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
    const [db, setDb] = useState(null);
    const [calories, setCalories] = useState([]);
    const [error, setError] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(true);
    const [editingEntry, setEditingEntry] = useState(null);
    
    // Initialize the database
    useEffect(() => {
        const initDb = async () => {
            try {
                setIsLoading(true);
                const database = await idb.openCaloriesDB();
                setDb(database);
            } catch (err) {
                console.error('Database initialization error:', err);
                setError("Failed to initialize database. Please refresh the page.");
            } finally {
                setIsLoading(false);
            }
        };
        initDb();
    }, []);

    // Function to refresh calories data
    const refreshCalories = async () => {
        if (!db) return;
        try {
            const fetchedCalories = await idb.getCaloriesByMonth(db, selectedYear, selectedMonth);
            setCalories(fetchedCalories);
            setError(null);
        } catch (err) {
            setError("Failed to fetch calorie entries. Please try again.");
        }
    };

    // Handle month change
    const handleMonthChange = (e) => {
        const [year, month] = e.target.value.split('-');
        setSelectedYear(parseInt(year));
        setSelectedMonth(parseInt(month) - 1);
    };

    // Fetch calories when db, month, or year changes
    useEffect(() => {
        refreshCalories();
    }, [db, selectedMonth, selectedYear]);

    if (isLoading) {
        return <div className="container mt-5 text-center">Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Calorie Management App</h1>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}

            <div className="row">
                <div className="col-md-4 mb-4">
                    <CalorieForm 
                        db={db} 
                        fetchCalories={refreshCalories}
                        setError={setError}
                        editingEntry={editingEntry}
                        setEditingEntry={setEditingEntry}
                    />
                </div>
                <div className="col-md-8 mb-4">
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
                                fetchCalories={refreshCalories}
                                setError={setError}
                                setEditingEntry={setEditingEntry}
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
