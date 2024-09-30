// Ido Dohan 207933128
// Mattan Ben Yosef 318360351


import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const CalorieChart = ({ calories }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Group the calorie entries by date and sum them
        const groupedCalories = calories.reduce((acc, entry) => {
            const date = entry.date; // Ensure date is correctly referenced
            const calorieCount = Number(entry.calories); // Ensure calories are numbers
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += calorieCount; // Sum up the calories for each date
            return acc;
        }, {});

        // Prepare the data for the chart
        const labels = Object.keys(groupedCalories); // Array of dates
        const data = Object.values(groupedCalories); // Array of summed calorie values

        // Check if the canvas exists before rendering the chart
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels, // Dates
                    datasets: [{
                        label: 'Calories',
                        data, // Summed calorie values
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            return () => chart.destroy(); // Clean up the chart on unmount
        }
    }, [calories]);

    return <canvas ref={chartRef} />;
};

export default CalorieChart;
