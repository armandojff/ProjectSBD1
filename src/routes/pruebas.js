const express = require('express');

const router = express.Router();

const pool = require('../database');

const fs = require("fs");

const PDFDocument = require("../reportes/pdfkit-tables");

const path = require('path');



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


router.post('/edit/:id', async (req,res) => {
    
    const {id} = req.params;

    const data = req.body;

    var text = 'SELECT * FROM tablaprueba WHERE idprueba = $1';

    const value = [id];
    
    const results = await pool.query(text,value);

    var prueba = results.rows;

    var text1 = 'UPDATE tablaprueba SET idprueba = $1 , nombreprueba = $2, descripcionprueba = $3 WHERE idprueba= $4';
   
    const values = [data.Id,data.Nombre,data.Descripcion,prueba[0].idprueba];
    
    const results2 = await pool.query(text1,values);

    res.redirect ('/pruebas');

});


 
router.get('/reporte/:id', async (req,res) => {

    const {id} = req.params;

    var text = 'SELECT * FROM tablaprueba WHERE idprueba = $1';
   
    const value = [id];
    
    const results = await pool.query(text,value);

    // Create The PDF document
    const doc = new PDFDocument();

    // Load the registers 
    const registros = results.rows;

    // Pipe the PDF into a patient's file

    const dirreportes = path.join(__dirname, '../reportes/descargados');

    //const dirlogo = path.join(__dirname,'../img/logo.png.jpg');

    const nombrerep = registros[0].idprueba;

    console.log(nombrerep);

    doc.pipe(fs.createWriteStream(dirreportes + '/reporte-de-' + nombrerep + '.pdf'));

    // Add the header - https://pspdfkit.com/blog/2019/generate-invoices-pdfkit-node/
    doc
    //.image("logo.png", 50, 45, { width: 50 })
        //.image(dirlogo,50,45,{ with: 20} )
        .fillColor("#444444")
        .fontSize(20)
        .text("Reporte de prueba.", 90, 57)
        .fontSize(10)
        .text("Datos para la tabla de id: "+registros[0].idprueba, 90, 90, { align: "center" })
        //.text("Chamblee, GA 30341", 200, 80, { align: "right" })
        .moveDown();

    // Create the table - https://www.andronio.me/2017/09/02/pdfkit-tables/
    const table = {
        headers: ["Id", "Nombre", "Descripcion"],
        rows: []
    };

        // Add the patients to the table
    for (const registro of registros) {
      table.rows.push([registro.idprueba, registro.nombreprueba, registro.descripcionprueba])
    }

    // Draw the table
    doc.moveDown().table(table, 30, 125, { width: 590 });

    // Finalize the PDF and end the stream
    doc.end();

    res.redirect('/pruebas');

});

router.get('/reporte', async (req,res) => {

    var text = 'SELECT * FROM tablaprueba ';
   
    const results = await pool.query(text);

    // Create The PDF document
    const doc = new PDFDocument();

    // Load the registers 
    const registros = results.rows;

    // Pipe the PDF into a patient's file

    const dirreportes = path.join(__dirname, '../reportes/descargados');

    //const dirlogo = path.join(__dirname,'../img/logo.png.jpg');

    doc.pipe(fs.createWriteStream(dirreportes + '/reporte-general.pdf'));

    // Add the header - https://pspdfkit.com/blog/2019/generate-invoices-pdfkit-node/
    doc
    //.image("logo.png", 50, 45, { width: 50 })
        //.image(dirlogo,50,45,{ with: 20} )
        .fillColor("#444444")
        .fontSize(20)
        .text("Reporte de prueba.", 90, 57)
        .fontSize(10)
        //.text("Chamblee, GA 30341", 200, 80, { align: "right" })
        .moveDown();

    // Create the table - https://www.andronio.me/2017/09/02/pdfkit-tables/
    const table = {
        headers: ["Id", "Nombre", "Descripcion"],
        rows: []
    };

        // Add the patients to the table
    for (const registro of registros) {
      table.rows.push([registro.idprueba, registro.nombreprueba, registro.descripcionprueba])
    }

    // Draw the table
    doc.moveDown().table(table, 30, 125, { width: 590 });

    // Finalize the PDF and end the stream
    doc.end();

    res.redirect('/pruebas');

})

module.exports = router;