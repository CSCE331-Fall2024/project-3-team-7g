'use client';
const SimpleOptionButton = ({ OptionName, image, handleItemSelection, isSelected, listType, isAccessible}) => {
    const normalStyle = {
        width: '100%',
        height: '200px',
        color: '#fff',
        border: 'none',
        display: 'flex',
        backgroundColor: isSelected ? '#000000' : '#ce123c',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
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
        {OptionName}
    </button>
);
};

export default SimpleOptionButton;
