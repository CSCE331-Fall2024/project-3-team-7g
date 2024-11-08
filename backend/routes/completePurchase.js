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

router.get('/:type', (req, res) => {
    let items = [];
    const type = req.params.type;
    pool
        .query('SELECT * FROM menu where type=\'' + type + '\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                let OptionName = query_res.rows[i].name;
                let image = OptionName.toLowerCase().replace(/\s+/g, "-") + ".png";
                items.push( {OptionName, image});
            }
            res.send(items);
        });
});

module.exports = router;
