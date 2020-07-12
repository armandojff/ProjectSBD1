const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/',(req,res) => {
    const getParfums = async () => {
            const res = await pool.query('select * from perfume'); 
            res.send(res.rows);
    };
    getParfums();
});


module.exports = router;