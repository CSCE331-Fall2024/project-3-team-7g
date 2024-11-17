const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();
const db = require("../db");

router.use(express.json());

router.get('/:type', (req, res) => {
    let items = [];
    const type = req.params.type;

    if (type === 'Size') {
        const sizes = ['Bowl', 'Plate', 'Bigger Plate', 'A La Carte'];
        for (let i = 0; i < sizes.length; i++) {
            const OptionName = sizes[i];
            const image = sizes[i].toLowerCase().replace(/\s+/g, "-") + ".png";
            items.push({ OptionName, image });
        }
    }

    db.query(`SELECT * FROM menu WHERE type=$1`, [type])
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                const OptionName = query_res.rows[i].name;
                const image = OptionName.toLowerCase().replace(/\s+/g, "-") + ".png";
                items.push({ OptionName, image });
            }
            res.json(items);
        })
        .catch(error => {
            console.error('Database query error:', error);
            res.status(500).json({
                error: 'Failed to retrieve items',
                details: error.message
            });
        });
});

module.exports = router;
