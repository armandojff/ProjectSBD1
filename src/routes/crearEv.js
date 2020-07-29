const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/', async (req,res) => {

    const productores = await pool.query('SELECT * FROM "Productor"');

    res.render('crearEv/paso1',{productor:productores.rows});
});

router.post('/2' ,  async (req,res) => { 

    //query para criterios

    nombreProductor = req.body.productor;

    var queryCriterios = await pool.query('select * from "Criterio" where id_criterio !=5');

    const criterios = queryCriterios.rows;

    //conseguir productor 

    const textoProductor = 'SELECT * FROM "Productor" WHERE nombre_productor = $1';
    
    var valueProductor = [];

    valueProductor.push(nombreProductor);

    const productorQuery = await pool.query(textoProductor,valueProductor);

    const productor = productorQuery.rows;

    res.render('crearEv/paso2',{criterios:criterios ,idProductor:productor[0].id_productor});


});

router.post('/3' ,  async (req,res) => { 
   
    const porcentajes = req.body;

    //console.log(porcentajes);

    //query para criterios

    if(porcentajes.fechafin === "")
        porcentajes.fechafin = null;

    var fechainicio = [porcentajes.fechainicio];

    var fechafin = [porcentajes.fechafin];

    var idproductor = [porcentajes.idProductor];

    var criterios = porcentajes.criterioN;

    var porcentaje = porcentajes.porcentajeC;




    for(var i = 0; i <= 3; i++) {

        var textoInsert = 'INSERT INTO public."Hist_Formula" (fecha_inicio,fecha_fin,tipo_formula,peso,id_productor,id_criterio) VALUES ($1, $2, $3, $4, $5, $6)';
        
        var valueInserts = [];

        valueInserts.push(fechainicio[0]);
        valueInserts.push(fechafin[0]);
        valueInserts.push("inicial");
        valueInserts.push(porcentaje[i]);
        valueInserts.push(idproductor[0]);
        valueInserts.push(criterios[i]);

        const insertQuery = await pool.query(textoInsert,valueInserts);

        valueInserts = [];
        
    
    }

    res.render('crearEv/paso3',{fechainicio:fechainicio[0],fechafin:fechafin[0],idProductor:idproductor[0]});

   // res.render('crearEv/paso2',{criterios:criterios});


});

router.post('/4' ,  async (req,res) => { 

    //query para criterios

    fechainicio = req.body.fechainicio;

    fechafin = req.body.fechafin;

    rangoinicial = req.body.rangoinicial;

    rangofinal = req.body.rangofinal;

    idProductor = req.body.idProductor;

    console.log(req.body);

    //insertar escala 

    const textoEscala = 'INSERT INTO public."Escala" (fecha_inicio,fecha_fin,rango_inicial,rango_final,id_productor)  VALUES ($1,$2,$3,$4,$5);';
    
    var valueEscala = [];

    valueEscala.push(fechainicio);
    valueEscala.push(fechafin);
    valueEscala.push(rangoinicial);
    valueEscala.push(rangofinal);
    valueEscala.push(idProductor);

    const escalaQuery = await pool.query(textoEscala,valueEscala);

    res.redirect('/');


});


module.exports = router;