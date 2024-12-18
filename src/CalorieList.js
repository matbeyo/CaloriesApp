import React from 'react';
import idb from './idb';

const CalorieList = ({ calories, db, fetchCalories, setError, setEditingEntry }) => {
    const handleDelete = async (id) => {
        try {
            await idb.deleteCalories(db, id);
            fetchCalories();
        } catch (err) {
            setError("Failed to delete calorie entry. Please try again.");
        }
    };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
    };

    return (
        <ul className="list-group list-group-flush">
            {calories.map((entry) => (
                <li key={entry.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <span className="badge bg-primary me-2">{entry.category}</span>
                        <strong>{entry.calories} calories</strong> - {entry.description} ({entry.date})
                    </div>
                    <div className="btn-group">
                        <button onClick={() => handleEdit(entry)} className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button onClick={() => handleDelete(entry.id)} className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default CalorieList;
