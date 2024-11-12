import React from 'react';
import OptionButton from './OptionButton';
const dotenv = require('dotenv').config();


// Main component that creates multiple buttons using the map function
    const types = ["Side", "Entree", "Appetizer", "Drink"];
    let sets = []
    for (let i = 0; i < types.length; i++) {
        // console.log(process.env.BACKEND_PORT + "<<<< THIS IS THE BACKEND PORT");
        await fetch(process.env.BACKEND_PORT + '/getItemsByType/' + types[i], {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            sets.push(data);
        })
        .catch(error => console.error('Error:', error));
    }
    

    const buttonSets = {
        sides:  sets[0],
        entrees: sets[1],
        appetizers: sets[2],
        drinks: sets[3]
    };

    const ButtonList = ({ listType }) => {
        const buttons = buttonSets[listType] || []; // Get the appropriate button set
    
        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Larger minimum size
                    gap: '16px',
                    padding: '16px',
                }}
            >

                {buttons.map((button, index) => (
                    <OptionButton 
                        key={index} 
                        OptionName={button.OptionName} 
                        image={button.image}
                        
                    />
                ))}
            </div>
        );
    }
    
    export default ButtonList;