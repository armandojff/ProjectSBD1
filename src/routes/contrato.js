const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/', async (req,res) => {

    const productores = await pool.query('SELECT * FROM "Productor"');

    res.render('contrato/cancelar1',{productor:productores.rows});

});

router.post('/2' ,  async (req,res) => { 
   
    const data = req.body.productor;

    //productor dado el nombre

    const textoProductor = 'SELECT * FROM "Productor" WHERE nombre_productor = $1';
    
    var valueProductor = [];

    valueProductor.push(data);

    const productorQuery = await pool.query(textoProductor,valueProductor);

    const productor = productorQuery.rows;

    //contratos vigentes dado id productor

    var textoContratoV = 'SELECT c.id_contrato, c.fecha_inicio, p.nombre_proveedor FROM "Contrato" as c, "Proveedor" as p where c.id_proveedor=p.id_proveedor and c.id_productor=$1 and c.fecha_cancelacion is null';

    var valueContratoV=[productor[0].id_productor];

    const contratoVQuery = await pool.query(textoContratoV,valueContratoV);

    contratos = contratoVQuery.rows;

    res.render('contrato/cancelar2', { contratos : contratos , productor: productor[0]});

    // Hasta aqui llega la consulta de proveedor 

});

router.post('/3' ,  async (req,res) => { 
   
    const idContrato = req.body.idContrato;

    const motivo = req.body.motivo;

    console.log(motivo,idContrato);

    //query cancelar contrato

    const textoCancelacion = 'UPDATE "Contrato"set fecha_cancelacion= $1, motivo_cancelacion=$2 where id_contrato=$3';

    const valueCancelacion =["2020/07/29",motivo,idContrato];

    const cancelacionQuery = await pool.query(textoCancelacion,valueCancelacion);

    res.redirect('/contrato');

    // Hasta aqui llega la consulta de proveedor 

});




module.exports = router;