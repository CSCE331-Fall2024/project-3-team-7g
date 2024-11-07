const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();

router.use(express.json());

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

router.get('/', (req, res) => {
    let items = [];
    let type = req.body.Type;
    pool
        .query('SELECT * FROM menu where type=\'' + type + '\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                let str = query_res.rows[i].name;
                let imageStr = str.toLowerCase().replace(/\s+/g, "_") + ".png";
                items.push( {str, imageStr});
            }
            res.send(items);
        });
});

module.exports = router;
