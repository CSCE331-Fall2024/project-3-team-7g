const changeText = async (userEmail, texts) => {
    try {

        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/language/getTextForUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail: userEmail,
                inputs: texts
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();

        return data.data;

    } catch (error) {
        console.log("Something went wrong " + error.JSON)
    }

    
    


};

export default changeText;