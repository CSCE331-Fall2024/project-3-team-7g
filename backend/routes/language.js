const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();
const db = require('../db');
router.use(express.json());



router.post('/getTextForUser', async (req, res) => {
    try {
        const {userEmail, input} = req.body;
        
        const getLanguage = await db.query("SELECT language from users where email = '" + userEmail + "';");
        if (getLanguage.rowCount == 0) {
            res.status(500).json({message: "User does not exist"});
            return;
        }
        const language = getLanguage.rows[0].language;

        if (language == 'en') { // English, dont bother to translate to save me money
            res.status(200).json({message: input});
            return;
        }

        let fetchUrl = new URL("https://translation.googleapis.com/language/translate/v2");
        
        const key = process.env.GOOGLE_API_KEY;
        fetchUrl.searchParams.set("key", key);
        fetchUrl.searchParams.set("q", input);
        fetchUrl.searchParams.set("target", language);

        //console.log(key + " language: " + language + " text: " + input);

        const textFetch = await fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // console.log(textFetch);
        const data = await textFetch.json();
        const responseText = data.data.translations[0].translatedText;
        res.status(200).json({message: responseText});
        return;
    }
    catch (error) {
        console.error("Error getting text for user: ", error);
        res.status(500).json({message: "An error occurred while getting text."})
    }
    
});

router.post('/changeLanguage', async (req, res) => {
    try {
        const {userEmail, language} = req.body;
        const updateUser = await db.query("UPDATE users set language = '" + language + "' where email = '" + userEmail + "';");
        res.status(200).json({message: "Language Changed"});
    }
    catch (error) { 
        console.error("Error changing Languages", error); 
        res.status(500).json({ message: "An error occurred while Changing the language." }); 
    } 
    
    
});


module.exports = router;