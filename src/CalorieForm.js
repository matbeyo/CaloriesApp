// Ido Dohan 207933128
// Mattan Ben Yosef 318360351

import React, { useState, useEffect } from 'react';

const CalorieForm = ({ db, fetchCalories, setError, entryToEdit, setEntryToEdit }) => {
    // State for the calorie entry form
    const [newCalorie, setNewCalorie] = useState({
        calories: '',
        category: 'BREAKFAST',
        description: '',
        date: new Date().toISOString().split('T')[0], // Default to today's date
    });
    const [editingId, setEditingId] = useState(null);

    // Update form fields when entryToEdit changes
    useEffect(() => {
        if (entryToEdit) {
            // Populate form with the entry to edit
            setNewCalorie({
                calories: entryToEdit.calories,
                category: entryToEdit.category,
                description: entryToEdit.description,
                date: entryToEdit.date,
            });
            setEditingId(entryToEdit.id);
        } else {
            // Reset form when not editing
            setNewCalorie({
                calories: '',
                category: 'BREAKFAST',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });
            setEditingId(null);
        }
    }, [entryToEdit]);

    // Handler for input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCalorie((prev) => ({ ...prev, [name]: value }));
    };

    // Handler for adding or updating a calorie entry
    const handleAddCalorie = async (e) => {
        e.preventDefault();
        if (newCalorie.calories <= 0) {
            setError("Calories must be greater than zero.");
            return;
        }

        try {
            if (editingId) {
                // Update existing calorie entry
                await db.updateCalories({ ...newCalorie, id: editingId });
                setEntryToEdit(null); // Reset editing state
            } else {
                // Add new calorie entry
                await db.addCalories(newCalorie);
            }
            // Reset the form fields
            setNewCalorie({
                calories: '',
                category: 'BREAKFAST',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });
            setEditingId(null);
            fetchCalories();
        } catch (err) {
            setError(`Failed to ${editingId ? 'update' : 'add'} calorie entry. Please try again.`);
        }
    };

    // Handler to cancel editing
    const handleCancelEdit = () => {
        setEntryToEdit(null);
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header text-white bg-secondary">
                <h5 className="card-title mb-0">{editingId ? 'Edit Entry' : 'Add New Entry'}</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleAddCalorie}>
                    <div className="form-floating mb-3">
                        <input
                            type="number"
                            id="calories"
                            name="calories"
                            value={newCalorie.calories}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Calories"
                            required
                        />
                        <label htmlFor="calories">Calories</label>
                    </div>
                    <div className="form-floating mb-3">
                        <select
                            id="category"
                            name="category"
                            value={newCalorie.category}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="BREAKFAST">Breakfast</option>
                            <option value="LUNCH">Lunch</option>
                            <option value="DINNER">Dinner</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <label htmlFor="category">Category</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={newCalorie.description}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Description"
                            required
                        />
                        <label htmlFor="description">Description</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={newCalorie.date}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                        <label htmlFor="date">Date</label>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">
                        <i className={`bi ${editingId ? 'bi-pencil' : 'bi-plus-circle'}`}></i>{' '}
                        {editingId ? 'Update' : 'Add'} Calorie Entry
                    </button>
                    {editingId && (
                        <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                            Cancel
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CalorieForm;
