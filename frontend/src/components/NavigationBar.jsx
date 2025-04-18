import React from 'react';
import { FaUtensils, FaBoxOpen, FaClipboardList, FaChartBar } from 'react-icons/fa';


function NavigationBar({children}) {
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
                        <li className="nav-item">
                            <a className="nav-link d-flex align-items-center" href="/productos">
                                <FaUtensils className="me-2" />
                                Ingresar Productos
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link d-flex align-items-center" href="/ingredientes">
                                <FaBoxOpen className="me-2" />
                                Ingresar Ingredientes
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link d-flex align-items-center" href="/inventario">
                                <FaClipboardList className="me-2" />
                                Ver Inventario
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link d-flex align-items-center" href="/reportes">
                                <FaChartBar className="me-2" />
                                Reportes
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <p>{children}</p>
        </nav>
    );
}

export default NavigationBar;
