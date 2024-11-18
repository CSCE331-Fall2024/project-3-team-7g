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
    // const fallBackSet = {
    //     objectFit: 'contain',
    //     marginBottom: '2em',
    //     width: '100px',
    //     height: '100px'
    // };
    // const imgNormStyle = {
    //     objectFit: 'contain',
    //     marginBottom: '2em',
    //     width: '180px',
    //     height: '180px',
    //   };
      
    //   const imgAltStyle = {
    //     objectFit: 'contain',
    //     width: '240px',
    //     height: '240px',
    //   };
    const imgStyle = isFallback
    ? { width: 100, height: 100, objectFit: 'contain', marginBottom: '1em' }
    : isAccessible
    ? { width: 240, height: 240, objectFit: 'contain', marginBottom: '1em' }
    : { width: 180, height: 180, objectFit: 'contain', marginBottom: '2em' };

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
        height: '400px',
        color: '#fff',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '36px',
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
        padding: '8px',
        borderRadius: '8px',
    };

    return (
    <button
    style={isAccessible ? accessibleStyle : normalStyle}




    onClick={() => handleItemSelection(listType, OptionName)}

    >
    <Image
        
        
        src={imgSrc}
        alt={`${OptionName} Image`}
        
        width={imgStyle.width}
        height={imgStyle.height}
        style={imgStyle}
        // width={isFallback ? 100 : isAccessible ? imgAltStyle.width : imgNormStyle.width}
        // height={isFallback ? 100 : isAccessible ? imgAltStyle.height : imgNormStyle.height}
        // style={isAccessible ? imgAltStyle : imgNormStyle}
        
        // style={{
        //     objectFit: 'contain',
        //     marginBottom: '2em', 
 
        // }}
        
        onError={handleImageError}
        
    />
    {OptionName}
    </button>
);
};

export default OptionButton;
