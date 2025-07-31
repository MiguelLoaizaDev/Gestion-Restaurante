import React from 'react';
import { useNavigate } from 'react-router-dom';

function InventoryPanel({ visible }) {
    const navigate = useNavigate();
    if (!visible) return null;
    return (
        <div className="bg-light border-bottom shadow-sm w-100" style={{ position: 'relative', top: '56px', zIndex: 1020 }}>
            <div className="container py-2 d-flex justify-content-center gap-3">
                <button className="btn btn-outline-primary" onClick={() => navigate('/EnterProducts')}>Productos</button>
                <button className="btn btn-outline-primary" onClick={() => navigate('/EnterIngredients')}>Ingredientes</button>
                <button className="btn btn-outline-primary" onClick={() => navigate('/EnterGrains')}>Granos</button>
                <button className="btn btn-outline-primary" onClick={() => navigate('/EnterInputs')}>Insumos</button>
                <button className="btn btn-outline-primary" onClick={() => navigate('/EnterCrockery')}>Vajilla</button>
            </div>
        </div>
    );
}

export default InventoryPanel;
