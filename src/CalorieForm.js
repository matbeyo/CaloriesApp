import React, { useState, useEffect } from 'react';
import idb from './idb';

const CalorieForm = ({ db, fetchCalories, setError, editingEntry, setEditingEntry }) => {
    const [formData, setFormData] = useState({
        calories: '',
        category: 'BREAKFAST',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    // Update form when editingEntry changes
    useEffect(() => {
        if (editingEntry) {
            setFormData({
                calories: editingEntry.calories,
                category: editingEntry.category,
                description: editingEntry.description,
                date: editingEntry.date,
            });
        }
    }, [editingEntry]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.calories <= 0) {
            setError("Calories must be greater than zero.");
            return;
        }

        try {
            if (editingEntry) {
                // Update existing entry
                await idb.updateCalories(db, {
                    ...formData,
                    id: editingEntry.id
                });
                setEditingEntry(null); // Clear editing state
            } else {
                // Add new entry
                await idb.addCalories(db, formData);
            }

            // Reset form
            setFormData({
                calories: '',
                category: 'BREAKFAST',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });
            
            fetchCalories();
        } catch (err) {
            setError(`Failed to ${editingEntry ? 'update' : 'add'} calorie entry. Please try again.`);
        }
    };

    const handleCancel = () => {
        setEditingEntry(null);
        setFormData({
            calories: '',
            category: 'BREAKFAST',
            description: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header text-white bg-secondary">
                <h5 className="card-title mb-0">
                    {editingEntry ? 'Edit Entry' : 'Add New Entry'}
                </h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                        <input
                            type="number"
                            id="calories"
                            name="calories"
                            value={formData.calories}
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
                            value={formData.category}
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
                            value={formData.description}
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
                            value={formData.date}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                        <label htmlFor="date">Date</label>
                    </div>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            <i className={`bi ${editingEntry ? 'bi-check-circle' : 'bi-plus-circle'}`}></i>
                            {editingEntry ? ' Save Changes' : ' Add Entry'}
                        </button>
                        {editingEntry && (
                            <button type="button" onClick={handleCancel} className="btn btn-secondary">
                                <i className="bi bi-x-circle"></i> Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CalorieForm;
