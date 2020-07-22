const express = require('express');

const router = express.Router();

const pool = require('../database');




router.get('/' ,  async (req,res) => { 

    const productores = await pool.query('SELECT * FROM "Productor"');

    res.render('realizarEv/paso1', {productor : productores.rows});

});

router.post('/2' ,  async (req,res) => { 
   
    const data = req.body.productor;
    
    const data2 = req.body.tipo;

    const texto = 'SELECT * FROM "Productor" WHERE nombre_productor = $1';
    
    var value1 = [];

    value1.push(data);

    const productores = await pool.query(texto,value1);

    const productor = productores.rows;

    var text = 'SELECT p.nombre_proveedor FROM "Proveedor" as p, "Pais" as l, "Metodo_Envio" e, "Pai_Prod" as a, "Productor" as t, "Historico_Membresia" as h where p.id_proveedor=e.id_proveedor and l.id_pais=e.id_pais and e.id_pais=a.id_pais and t.id_productor=a.id_productor and t.id_productor= $1 and h.id_proveedor=p.id_proveedor and h.fecha_fin is null group by (p.nombre_proveedor)';
    
    var value = [productor[0].id_productor];

    const results = await pool.query(text,value);

    console.log(results.rows);

    res.render('realizarEv/paso2', { proveedor : results.rows});

    // Hasta aqui llega la consulta de proveedor 

});









module.exports = router;







