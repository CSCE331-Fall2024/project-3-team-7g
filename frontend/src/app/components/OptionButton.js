import Image from 'next/image'
import React from 'react';

const OptionButton = ({ OptionName }) => {
    return (
        <button
            style={{
                backgroundImage: 'url(/orange-chicken.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '150px', // set desired width
                height: '50px', // set desired height
                color: '#fff',
                border: 'none',
            }}
        >
            {OptionName}
        </button>
    );
}

export default OptionButton;