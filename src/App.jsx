import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // NEW: Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // NEW: Import Toast CSS

import DashboardPage from './pages/DashboardPage.jsx'; // NEW: Import Dashboard
import ItemListPage from './pages/ItemListPage.jsx'; // NEW: Import Item List
import ItemFormPage from './pages/ItemFormPage.jsx';
import './App.css';

function App() {
    return (
        <Router>
            <div className="container">
                <header>
                    <Link to="/" className="header-link">
                        <h1>Spring8 Inventory System</h1>
                    </Link>
                    <p>Local Storage Prototype</p>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<DashboardPage />} /> {/* NEW: Dashboard is now home */}
                        <Route path="/items" element={<ItemListPage />} /> {/* NEW: Path for the full item list */}
                        <Route path="/new" element={<ItemFormPage />} />
                        <Route path="/edit/:id" element={<ItemFormPage />} />
                    </Routes>
                </main>
            </div>
            {/* NEW: Toast container for notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Router>
    );
}

export default App;