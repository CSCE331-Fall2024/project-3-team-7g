const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();
const db = require('../db');
router.use(express.json());

const GOOGLE_TRANSLATE_API = "https://translation.googleapis.com/language/translate/v2";
const API_KEY = process.env.GOOGLE_API_KEY;


/**
 * Handles getting text for users with HTTP POST request to "/routes/language/getTextForUser" endpoint.
 * 
 * @name post/getTextForUser
 * @function backend/language/getTextForUser
 * @param {express.Request} req - JSON containing information.
 * @param {string} req.body.userEmail - The email of the user adding to their purchase.
 * @param {string[]} req.body.inputs - Array of words to translate.
 * @param {express.Response} res - Response from server. 200 for success, 500 for incorrect argument(s).
 * @description Translates words with Google's Translate API. If there are errors with this function, verify that there's a valid google api key in the environment variables.
 */
router.post('/getTextForUser', async (req, res) => {
    try {
        const {userEmail, inputs} = req.body;
        //console.log(inputs);
        const getLanguage = await db.query("SELECT language from users where email = '" + userEmail + "';");
        if (getLanguage.rowCount == 0) {
            res.status(500).json({message: "User does not exist"});
            return;
        }
        const language = getLanguage.rows[0].language;

        if (language == 'en') { // English, dont bother to translate to save me money
            res.status(200).json({data: inputs});
            return;
        }

        const response = await fetch(`${GOOGLE_TRANSLATE_API}?key=${API_KEY}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              q: inputs,
              target: language,
              format: "html",
            }),
          });
    
          if (!response.ok) {
            throw new Error("Failed to fetch translations");
          }
        const data = await response.json();
        const translatedTexts = data.data.translations.map((t) => t.translatedText);
        //console.log(translatedTexts);
        res.status(200).json({data: translatedTexts});
        return;
    }
    catch (error) {
        console.error("Error getting text for user: ", error);
        res.status(500).json({message: "An error occurred while getting text."})
    }
});

/**
 * Handles changing languages for a user with HTTP POST request to "/routes/language/changeLanguage" endpoint.
 * 
 * @name post/changeLanguage
 * @function backend/language/changeLanguage
 * @param {express.Request} req - JSON containing information
 * @param {string} req.body.userEmail - The email of the user changing their desired language.
 * @param {string} req.body.language - Desired language, in ISO 639-1 standard.
 * @param {express.Response} res - Response from server. 200 for success, 500 for incorrect argument(s).
 * @description changes the language of a given user. On Success, any consecutive pages the user goes to will be translated into their language.
 */
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