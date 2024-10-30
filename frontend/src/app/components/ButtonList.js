import React from 'react';
import OptionButton from './OptionButton';

// Main component that creates multiple buttons using the map function
    const buttonSets = {
        sides: [
            { OptionName: 'Chow Mein', image: 'chow-mein.png' },
            { OptionName: 'White Rice', image: 'white-rice.png' },
            { OptionName: 'Fried Rice', image: 'fried-rice.png' },
            { OptionName: 'Super Greens', image: 'super-greens.png' },
        ],
        entrees: [
            { OptionName: 'Honey Walnut Shrimp', image: 'honey-walnut-shrimp.png' },
            { OptionName: 'Beijing Beef', image: 'beijing-beef.png' },
            { OptionName: 'Broccoli Beef', image: 'broccoli-beef.png' },
            { OptionName: 'Black Pepper Chicken', image: 'black-pepper.png' },
            { OptionName: 'Beyond Original Orange Chicken', image: 'beyond-original-orange-chicken.png' },
            { OptionName: 'Grilled Teriyaki Chicken', image: 'grilled-teriyaki-chicken.png' },
            { OptionName: 'Kung Pao Chicken', image: 'kung-pao-chicken.png' },
            { OptionName: 'Mushroom Chicken', image: 'mushroom-chicken.png' },
            { OptionName: 'Orange Chicken', image: 'orange-chicken.png' },
            { OptionName: 'Honey Sesame Chicken Breast', image: 'honey-sesame-chicken-breast.png' },
            { OptionName: 'String Bean Chicken Breast', image: 'string-bean-chicken-breast.png' },
            { OptionName: 'Sweet Fire Chicken', image: 'sweet-fire-chicken.png' },
            { OptionName: 'Hot Ones Chicken', image: 'hot-ones-chicken.png' }
        ],
    };

    const ButtonList = ({ listType }) => {
        const buttons = buttonSets[listType] || []; // Get the appropriate button set
    
        return (
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap', // Allows wrapping if buttons exceed container width
                    gap: '16px', // Space between buttons
                    justifyContent: 'center', // Centers the buttons horizontally
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
