const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();
const db = require("../db");

router.use(express.json());


/**
 * Fetches menu items or size options based on the type specified in the route parameter.
 * @name get/getItemsByType
 * @function
 * @memberof module:routes
 * @param {express.Request} req - The HTTP request object containing `type` as a route parameter.
 * @param {express.Response} res - The HTTP response object.
 * @description Retrieves predefined size options if the type is "Size" and appends them to the list. 
 *              Otherwise, queries the `menu` table for items matching the specified type and appends them to the list.
 */

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
