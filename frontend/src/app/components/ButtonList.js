// "use client";

import React from 'react';
import OptionButton from './OptionButton';
const dotenv = require('dotenv').config();

    const types = ["Side", "Entree", "Appetizer", "Drink", "Size"];
    let sets = []
    for (let i = 0; i < types.length; i++) {
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
        .catch(error => console.error('Error:', JSON.stringify(error, Object.getOwnPropertyNames(error))));
    }

    const buttonSets = {
        sides:  sets[0],
        entrees: sets[1],
        appetizers: sets[2],
        drinks: sets[3],
        sizes: sets[4]
    };

    const ButtonList = ({ listType }) => {
        const buttons = buttonSets[listType] || [];
    
        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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