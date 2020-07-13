const express = require('express');
const router = express.Router();

const pool = require('../database');



router.get('/list' , async (req,res) => { 
    const results = await pool.query('SELECT * FROM tablaprueba');
    console.log(results.rows);
    res.render('pruebas/list',  { pruebas: results.rows } );
});


module.exports = router;