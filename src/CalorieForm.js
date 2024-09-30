// Ido Dohan 207933128
// Mattan Ben Yosef 318360351


import React, { useState } from 'react';
import idb from './idb';

const CalorieForm = ({ db, fetchCalories, setError }) => {
    // State for the new calorie entry
    const [newCalorie, setNewCalorie] = useState({
        calories: '',
        category: 'BREAKFAST',
        description: '',
        date: new Date().toISOString().split('T')[0],// Default to today's date
    });
    const [editingId, setEditingId] = useState(null);

    // Handler for input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCalorie(prev => ({ ...prev, [name]: value }));
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
                await idb.updateCalories(db, { ...newCalorie, id: editingId });
            } else {
                // Add new calorie entry
                await idb.addCalories(db, newCalorie);
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

    return (
        <div className="card shadow-sm">
            <div className="card-header text-white bg-secondary">
                <h5 className="card-title mb-0">Add New Entry</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleAddCalorie}>
                    <div className="form-floating mb-3">
                        <input type="number" id="calories" name="calories" value={newCalorie.calories} onChange={handleInputChange} className="form-control" placeholder="Calories" required />
                        <label htmlFor="calories">Calories</label>
                    </div>
                    <div className="form-floating mb-3">
                        <select id="category" name="category" value={newCalorie.category} onChange={handleInputChange} className="form-control">
                            <option value="BREAKFAST">Breakfast</option>
                            <option value="LUNCH">Lunch</option>
                            <option value="DINNER">Dinner</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <label htmlFor="category">Category</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" id="description" name="description" value={newCalorie.description} onChange={handleInputChange} className="form-control" placeholder="Description" required />
                        <label htmlFor="description">Description</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="date" id="date" name="date" value={newCalorie.date} onChange={handleInputChange} className="form-control" required />
                        <label htmlFor="date">Date</label>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">
                        <i className="bi bi-plus-circle"></i> {editingId ? 'Update' : 'Add'} Calorie Entry
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CalorieForm;
