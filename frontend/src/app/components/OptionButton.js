import Image from 'next/image'
import React from 'react';

const OptionButton = ({ OptionName, image }) => {
    return (
        <button
            style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'contain', // Ensures the full image is visible
                backgroundRepeat: 'no-repeat', // Prevents repeating if the image is smaller
                backgroundPosition: 'center', // Centers the image within the button
                width: '100%',
                height: '200px', // Fixed height for consistent appearance
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                padding: '8px',
                borderRadius: '8px',
                    }}
                >
                    {OptionName}
                </button>
            );
        }

export default OptionButton;
