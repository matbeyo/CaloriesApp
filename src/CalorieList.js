// Ido Dohan 207933128
// Mattan Ben Yosef 318360351

import React from 'react';

const CalorieList = ({ calories, db, fetchCalories, setError, setEntryToEdit }) => {
    // Handler to delete a calorie entry
    const handleDelete = async (id) => {
        try {
            await db.deleteCalories(id);
            fetchCalories(); // Refresh the list after deletion
        } catch (err) {
            setError("Failed to delete calorie entry. Please try again.");
        }
    };

    // Handler to initiate editing of a calorie entry
    const handleEdit = (entry) => {
        setEntryToEdit(entry); // Set the selected entry for editing
    };

    return (
        <ul className="list-group list-group-flush">
            {calories.map((entry) => (
                <li
                    key={entry.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                >
                    <div>
                        <span className="badge bg-primary me-2">{entry.category}</span>
                        <strong>{entry.calories} calories</strong> - {entry.description} (
                        {entry.date})
                    </div>
                    <div>
                        <button
                            onClick={() => handleEdit(entry)}
                            className="btn btn-sm btn-outline-primary me-2"
                        >
                            <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button
                            onClick={() => handleDelete(entry.id)}
                            className="btn btn-sm btn-outline-danger"
                        >
                            <i className="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default CalorieList;
