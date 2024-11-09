const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();
const db  = require("../db");

router.use(express.json());



router.get('/:type', (req, res) => {
    let items = [];
    const type = req.params.type;
    if (type == 'Size') {
        const sizes = ['Bowl', 'Plate', 'Bigger Plate', 'A La Carte'];
        for (var i = 0; i < sizes.length; i++) {
            const OptionName = sizes[i];
            const image = sizes[i].toLowerCase().replace(/\s+/g, "-") + ".png";
            items.push( {OptionName, image} );
        }

    }

    db
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
