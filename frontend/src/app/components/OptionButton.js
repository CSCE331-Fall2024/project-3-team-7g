'use client';

import Image from 'next/image';
import { useState } from 'react';

const OptionButton = ({ OptionName, image, handleItemSelection, isAccessible}) => {
    const [imgSrc, setImgSrc] = useState(`/${image}`);
    const [isFallback, setIsFallback] = useState(false);
    

    const handleImageError = () => {
    setIsFallback(true);
    setImgSrc('/no-image-icon.png');
    };

    // const buttonStyle = isAccessible
    // ? {
    //     backgroundColor: "#FF5733", // Alternate style
    //     color: "#000",
    //   }
    // : {
    //     backgroundColor: "#3498db", // Default style
    //     color: "#fff",
    //   };

    const normalStyle = {
        width: '100%',
        height: '200px',
        color: '#fff',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
        padding: '8px',
        borderRadius: '8px',
    };

    const accessibleStyle = {
        width: '100%',
        height: '350px',
        color: '#fff',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
        padding: '8px',
        borderRadius: '8px',
    };

    return (
    <button
    style={isAccessible ? accessibleStyle : normalStyle}
    // style={{
    //     ...buttonStyle,
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
    // }}
    onClick={handleItemSelection}
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
