import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/api';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalItems: 0,
        itemsWithMissingFields: [] // UPDATED: Renamed for clarity
    });

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getDashboardStats();
            setStats(data);
        };
        fetchStats();
    }, []);

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Items Registered</h3>
                    <p>{stats.totalItems}</p>
                </div>
            </div>

            <div className="dashboard-actions">
                <Link to="/items" className="button-link">View All Items</Link>
                <Link to="/new" className="button-link">Register New Item</Link>
            </div>

            {/* This entire section is updated to display the new data */}
            <div className="actionable-list">
                <h3>Items Requiring Missing Fields ({stats.itemsWithMissingFields.length})</h3>
                {stats.itemsWithMissingFields.length > 0 ? (
                    stats.itemsWithMissingFields.map(item => (
                        <Link key={item._id} to={`/edit/${item._id}`} className="actionable-card-warning">
                            {/* NEW: Wrapper for name and tags */}
                            <div className="item-info">
                                <span>{item.item_name}</span>
                                {/* NEW: Div to display the missing field tags */}
                                <div className="missing-tags">
                                    {item.missing_fields.map(field => (
                                        <span key={field} className="missing-tag">{field}</span>
                                    ))}
                                </div>
                            </div>
                            <span className="item-date">{new Date(item.purchase_date).toLocaleDateString()}</span>
                        </Link>
                    ))
                ) : (
                    <p className="positive-message">Great work! All items have the required fields.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;