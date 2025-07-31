import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaBoxOpen, FaClipboardList, FaChartBar } from 'react-icons/fa';

function NavigationBar() {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const handleDropdown = (e) => {
        e.preventDefault();
        setShowDropdown((prev) => !prev);
    };

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        if (!showDropdown) return;
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm fixed-top">
            <div className="container">
                <a className="navbar-brand d-flex align-items-center" href="/">
                    <FaUtensils className="me-2" />
                    Restaurant Manager
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item dropdown" style={{ position: 'relative' }}>
                            <a
                                className="nav-link d-flex align-items-center dropdown-toggle"
                                href="#"
                                role="button"
                                aria-expanded={showDropdown}
                                onClick={handleDropdown}
                            >
                                <FaClipboardList className="me-2" />
                                Inventario
                            </a>
                            {showDropdown && (
                                <div ref={dropdownRef} className="dropdown-menu show" style={{ position: 'absolute', top: '100%', left: 0 }}>
                                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/EnterProducts'); }}>Productos</button>
                                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/EnterIngredients'); }}>Ingredientes</button>
                                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/EnterGrains'); }}>Granos</button>
                                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/EnterInputs'); }}>Insumos</button>
                                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/EnterCrockery'); }}>Vajilla</button>
                                </div>
                            )}
                        </li>
                        <li className="nav-item">
                            <a className="nav-link d-flex align-items-center" href="/ViewOrders">
                                <FaClipboardList className="me-2" />
                                Pedidos
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link d-flex align-items-center" href="/Reports">
                                <FaChartBar className="me-2" />
                                Reportes
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavigationBar;
