'use client';

import Image from 'next/image';
import { useState } from 'react';

const OptionButton = ({ OptionName, image, listType, handleItemSelection, isSelected}) => {
    const [imgSrc, setImgSrc] = useState(`/${image}`);
    const [isFallback, setIsFallback] = useState(false);

    const handleImageError = () => {
    setIsFallback(true);
    setImgSrc('/no-image-icon.png');
    };

    return (
    <button
    style={{
        width: '100%',
        height: '200px',
        color: '#fff',
        border: 'none',
        display: 'flex',
        backgroundColor: isSelected ? '#000000' : '#ce123c',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
        padding: '8px',
        borderRadius: '8px',
    }}
    onClick={() => handleItemSelection(listType, OptionName)}
    >
    <Image
        src={imgSrc}
        alt={`${OptionName} Image`}
        width={isFallback ? 100 : 180}
        height={isFallback ? 100 : 180}
        style={{
            objectFit: 'contain',
            marginBottom: '2em', 
        }}
        onError={handleImageError}
    />
    {OptionName}
    </button>
);
};

export default OptionButton;
