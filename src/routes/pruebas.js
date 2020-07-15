const express = require('express');
const router = express.Router();

const pool = require('../database');



router.get('/' , async (req,res) => { 
    
    const results = await pool.query('SELECT * FROM tablaprueba');
   
    res.render('pruebas/list',  { pruebas: results.rows } );

});

router.get('/add', (req,res) => {
    
    res.render('pruebas/add');

})

router.post('/add',  async (req,res) => { 
    
    const data = req.body;
    
    var text = 'INSERT INTO tablaprueba(idprueba,nombreprueba,descripcionprueba) VALUES ( $1, $2 ,$3)';
   
    const values = [data.Id,data.Nombre,data.Descripcion];
   
    const results = await pool.query(text,values);
    
    res.redirect('/pruebas');
    
 });

router.get('/delete/:id', async (req,res) => {
    
    const {id} = req.params;

    var text = 'DELETE FROM tablaprueba WHERE idprueba = $1';
   
    const value = [id];
    
    const results = await pool.query(text,value);

    res.redirect ('/pruebas');

});

router.get('/edit/:id', async (req,res) => {
    
    const {id} = req.params;

    var text = 'SELECT * FROM tablaprueba WHERE idprueba = $1';
   
    const value = [id];
    
    const results = await pool.query(text,value);

    console.log(results.rows);

    res.render ('pruebas/edit', { pruebas: results.rows } );

});


 


module.exports = router;