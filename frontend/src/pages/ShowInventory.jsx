import React from 'react';

const ShowInventory = () => {
    const inventory = [
        { id: 1, name: 'Tomatoes', quantity: 50 },
        { id: 2, name: 'Cheese', quantity: 20 },
        { id: 3, name: 'Pasta', quantity: 30 },
    ];

    return (
        <div>
            <h1>Inventory</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowInventory;