const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();
const db  = require("../db");

router.use(express.json());



router.get('/user', (req, res) => {
    teammembers = []
    db
        .query('SELECT * FROM teammembers;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                teammembers.push(query_res.rows[i]);
            }
            const data = {teammembers: teammembers};
            res.send(teammembers);
        });
});

module.exports = router;
