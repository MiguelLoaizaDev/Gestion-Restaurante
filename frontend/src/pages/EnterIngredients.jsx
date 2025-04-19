import React from 'react';

const EnterIngredients = () => {
    return (
        <div>
            <h1>Enter Ingredients</h1>
            <form>
                <div>
                    <label htmlFor="ingredientName">Ingredient Name:</label>
                    <input type="text" id="ingredientName" name="ingredientName" />
                </div>
                <div>
                    <label htmlFor="quantity">Quantity:</label>
                    <input type="number" id="quantity" name="quantity" />
                </div>
                <div>
                    <label htmlFor="unit">Unit:</label>
                    <select id="unit" name="unit">
                        <option value="kg">Kilograms</option>
                        <option value="g">Grams</option>
                        <option value="l">Liters</option>
                        <option value="ml">Milliliters</option>
                    </select>
                </div>
                <button type="submit">Add Ingredient</button>
            </form>
        </div>
    );
};

export default EnterIngredients;