import Image from 'next/image'
import React from 'react';

const OptionButton = ({ OptionName, image }) => {
    return (
        <button
            style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '500px',
                height: '150px',
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', // Subtle shadow effect
                    }}
                >
                    {OptionName}
                </button>
            );
        }

export default OptionButton;
