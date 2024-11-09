'use client';

import Image from 'next/image';
import { useState } from 'react';

const OptionButton = ({ OptionName, image }) => {
    const [imgSrc, setImgSrc] = useState(`/${image}`);
    const [isFallback, setIsFallback] = useState(false);
    const [isAccessible, setIsAccessible] = useState(false);

    const toggleAccessibility = () => {
        setIsAccessible(prevState => !prevState); // Flips true to false and vice versa
    };



    const handleImageError = () => {
        setIsFallback(true);
        setImgSrc('/no-image-icon.png');
        setIsAccessible(true);
    };
    // const normalStyle = {
    //     width: '100%',
    //     height: '200px',
    //     color: '#fff',
    //     border: 'none',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     fontSize: '1rem',
    //     textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
    //     padding: '8px',
    //     borderRadius: '8px',
    // };

    // const accessibleStyle = {
    //     width: '100%',
    //     height: '350px',
    //     color: '#fff',
    //     border: 'none',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     fontSize: '24px',
    //     fontWeight: 'bold',
    //     textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
    //     padding: '8px',
    //     borderRadius: '8px',
    // };

    return (
        <button
            style={{
                width: '100%',
                height: isAccessible ? '350px' : '200px',
                color: '#fff',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isAccessible ? '24px' : '1rem',
                fontWeight: isAccessible ? 'bold' : 'normal',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                padding: '8px',
                borderRadius: '8px',
            }}
        >
            <Image
                src={imgSrc}
                alt={`${OptionName} Image`}
                width={isFallback ? 100 : 180} // Make the fallback image smaller (100px wide)
                height={isFallback ? 100 : 180} // Make the fallback image smaller (100px high)
                style={{
                objectFit: 'contain', // Ensure the image fits nicely
                marginBottom: '2em',  // Space between the image and text
                }}
                onError={handleImageError} // Fallback when image fails to load
            />
            {OptionName}
        </button>
);
};

export default OptionButton;
