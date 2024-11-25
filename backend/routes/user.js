const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();
const db = require('../db');
router.use(express.json());


// Functions as as a getter for information about a user or to add new users
router.post('/login', async (req, res) => {
    try {
        const {userEmail, userName} = req.body;
        const getUserExists = await db.query("SELECT * FROM users where email = '" + userEmail + "';");
        if (getUserExists.rowCount == 0) {// New user, we need to add them to the database
            const getCount = await db.query("SELECT * FROM users;");
            const id = getCount.rowCount;
            db.query("INSERT INTO users values (" + id + ", '" + userName + "', '" + userEmail + "', 'Customer');");
            res.status(200).json({
                "status": "New user added",
                "user_id" : id,
                "name" : userName,
                "email" : userEmail,
                "classification" : "Customer"
            });
        }
        else {
            const id = getUserExists.rows[0].user_id;
            const classification = getUserExists.rows[0].classification;
            res.status(200).json({
                "status" : "Existing user logged in",
                "user_id" : id,
                "email" : userEmail,
                "classification" : classification
            });
        }
    }
    catch(error) {console.error("Error Logging in:", error);
        res.status(500).json({ message: "An error occurred while Logging in." });

    }
});



module.exports = router;
