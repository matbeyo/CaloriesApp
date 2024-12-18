import React from 'react';
import idb from './idb';

const CalorieList = ({ calories, db, fetchCalories, setError }) => {
    // Handler to delete a calorie entry
    const handleDelete = async (id) => {
        try {
            await idb.deleteCalories(db, id);
            fetchCalories(); // Refresh the list after deletion
        } catch (err) {
            setError("Failed to delete calorie entry. Please try again.");
        }
    };

    const handleEdit = (entry) => {
    };

    return (
        <ul className="list-group list-group-flush">
            {calories.map((entry) => (
                <li key={entry.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <span className="badge bg-primary me-2">{entry.category}</span>
                        <strong>{entry.calories} calories</strong> - {entry.description} ({entry.date})
                    </div>
                    <div className="d-flex gap-2">
                        <button 
                            onClick={() => handleEdit(entry)} 
                            className="btn btn-sm btn-outline-primary w-24"
                        >
                            <i className="bi bi-pencil me-1"></i>Edit
                        </button>
                        <button 
                            onClick={() => handleDelete(entry.id)} 
                            className="btn btn-sm btn-outline-danger w-24"
                        >
                            <i className="bi bi-trash me-1"></i>Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default CalorieList;
