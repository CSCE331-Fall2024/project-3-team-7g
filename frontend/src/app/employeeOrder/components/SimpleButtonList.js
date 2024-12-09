"use client";

import React from 'react';
import SimpleOptionButton from './SimpleOptionButton';

    const types = ["Side", "Entree", "Appetizer", "Drink", "Size"];
    let sets = []
    for (let i = 0; i < types.length; i++) {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_PORT + '/getItemsByType/' + types[i], {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
    
            const data = await response.json();
            sets.push(data);
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    }    

    const buttonSets = {
        sides:  sets[0],
        entrees: sets[1],
        Appetizer: sets[2],
        Drink: sets[3],
        sizes: sets[4]
    };

    const SimpleButtonList = ({ listType, handleItemClick, selectedItems, isAccessible}) => {
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
                {buttons.map((button, index) => {
                    let isSelected;
                    if (selectedItems != null) {
                        isSelected = selectedItems.includes(button.OptionName);
                    } else {
                        isSelected = false;
                    }
                    
                    return (
                        <SimpleOptionButton
                            key={index}
                            OptionName={button.OptionName}
                            listType={listType}
                            image={button.image}
                            handleItemSelection={handleItemClick}
                            isSelected={isSelected}
                            isAccessible = {isAccessible}
                        />
                    );
                })}
            </div>
        );
    };
    
    export default SimpleButtonList;