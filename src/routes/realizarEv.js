const express = require('express');

const router = express.Router();

const pool = require('../database');




router.get('/' ,  async (req,res) => { 

    const productores = await pool.query('SELECT * FROM "Productor"');

    res.render('realizarEv/paso1', {productor : productores.rows});

});




router.get('/2' ,   (req,res) => { 

    res.redirect('/realizarEv');

});


router.post('/2' ,  async (req,res) => { 
   
    const data = req.body.productor;
    
    const data2 = req.body.tipo;

    const textoProductor = 'SELECT * FROM "Productor" WHERE nombre_productor = $1';
    
    var valueProductor = [];

    valueProductor.push(data);

    const productores = await pool.query(textoProductor,valueProductor);

    const productor = productores.rows;

    var textoProveedor = 'SELECT p.nombre_proveedor FROM "Proveedor" as p, "Pais" as l, "Metodo_Envio" e, "Pai_Prod" as a, "Productor" as t, "Historico_Membresia" as h where p.id_proveedor=e.id_proveedor and l.id_pais=e.id_pais and e.id_pais=a.id_pais and t.id_productor=a.id_productor and t.id_productor=$1 and h.id_proveedor=p.id_proveedor and h.fecha_fin is null group by (p.nombre_proveedor)';

    var valueProveedor = [];

    valueProveedor.push(productor[0].id_productor);
   
    const proveedorQuery = await pool.query(textoProveedor,valueProveedor);

    console.log(proveedorQuery.rows);

    res.render('realizarEv/paso2', { proveedor : proveedorQuery.rows , productor: productor[0]});

    // Hasta aqui llega la consulta de proveedor 



});

router.get('/3' ,   (req,res) => { 

    res.redirect('/realizarEv');

});

router.post('/3' ,  async (req,res) => { 
   
    const data = req.body.proveedor;
    
    const data2 = req.body.productor;

    //query con nombre proveedor

    const texto = 'SELECT * FROM "Proveedor" WHERE nombre_proveedor = $1';
    
    var value1 = [];

    value1.push(data);

    const proveedor = await pool.query(texto,value1);

    const prove = proveedor.rows;

    //query con id productor

    const texto2 = 'SELECT * FROM "Productor" WHERE id_productor = $1';
    
    var value2 = [];

    value2.push(data2);

    const productores = await pool.query(texto2,value2);

    const productor = productores.rows;

      //contrato para comprobar

      var textoContrato = 'SELECT c.id_contrato from "Proveedor" as p, "Contrato" as c where p.id_proveedor=c.id_proveedor and  c.id_productor=$1 and c.id_proveedor=$2 and c.fecha_cancelacion is null ';

      var valueContrato = [];
  
      valueContrato.push(data2);
      valueContrato.push(prove[0].id_proveedor);

      const contratoQuery = await pool.query(textoContrato,valueContrato);

      console.log(contratoQuery.rows);

      if ( contratoQuery.rows.length != 0 ){

        res.render('realizarEv/error',{mensaje: "Ya hay contrato, no se puede realizar evaluacion inicial"});
       
      }else{
            //query pagos
    
    var text = 'SELECT c.* from "Proveedor" as p, "Condicion_Pago" as c where p.id_proveedor=c.id_proveedor and p.id_proveedor= $1';
    
    var value = [prove[0].id_proveedor];

    const results = await pool.query(text,value);

    //query para productos

    const textoProductos = 'SELECT m.* from "Proveedor" as p, "Materia_Prima" as m where p.id_proveedor=m.id_proveedor and p.id_proveedor = $1';
 
    var valueProductos = [];

    valueProductos.push(prove[0].id_proveedor);

    const productos = await pool.query(textoProductos,valueProductos);


    //query para metodos de envio

    const textoMetodo = 'SELECT e.*from "Proveedor" as p, "Metodo_Envio" as e where p.id_proveedor=e.id_proveedor and p.id_proveedor= $1';
 
    var valueMetodo = [];

    valueMetodo.push(prove[0].id_proveedor);

    const rmetodos = await pool.query(textoMetodo,valueMetodo);

    const metodos = rmetodos.rows;



    res.render('realizarEv/pasoMuestra', {productor:productor[0],proveedor:prove[0],producto: productos.rows , pagos: results.rows , envios: metodos} )

    //res.render('realizarEv/paso3', { pagos : results.rows , proveedor : proveedor.rows , productor: productores.rows});
        

}




});

router.post('/valoracionC' ,  async (req,res) => { 

    const idProveedor = req.body.proveedor;
    
    const idProductor = req.body.productor;

    //query para conseguir datos de criterios historico formula

    const textoHF = 'SELECT c.id_criterio,c.nombre_criterio,c.descripcion_criterio, h.peso, tipo_formula, fecha_inicio from "Criterio" as c, "Hist_Formula" as h where  c.id_criterio=h.id_criterio and id_productor=$1 and fecha_fin is null and tipo_formula=$2';  
    
    var valueHF = [idProductor,"inicial"];

    const HFQuery = await pool.query(textoHF,valueHF);

    var historicoF = HFQuery.rows;

    console.log(HFQuery.rows);


    //query para rangos en la escala

    const textoRangos = 'SELECT  e.rango_inicial,e.rango_final from "Escala" as e where e.id_productor=$1 and e.fecha_inicio=$2';

    var valueRangos = [idProductor];

    valueRangos.push(historicoF[0].fecha_inicio);

    const rangosQuery = await pool.query(textoRangos,valueRangos);

    const rangos = rangosQuery.rows;

    res.render('realizarEv/pasovaloracion',{criterios:HFQuery.rows , idProveedor:idProveedor,idProductor:idProductor,rangoinicial:rangos[0].rango_inicial,rangofinal:rangos[0].rango_final});

});

router.post('/aprobacion' ,  async (req,res) => { 

    var peso = req.body.peso;

    var valoracion = req.body.valoracion;


   
    console.log(req.body);

    var valoracion1 = (peso[0]/100) * valoracion[0];

    var valoracion2 = (peso[1]/100) * valoracion[1];

    var valoracion3 = (peso[2]/100) * valoracion[2];

    var suma_total = valoracion1 + valoracion2 + valoracion3;

    var comparacion = ( suma_total * 100 ) / 5;

    if (comparacion >= req.body.pesoExito){

        console.log("Aprobado");

         //query para  aprobado

         const textoAprobado = 'INSERT INTO public."Resultado_Evaluacion" (fecha_resultado,resultado,tipo_evaluacion,id_productor,id_proveedor) VALUES ($1,$2,$3,$4,$5)';

         var valueAprobado = [];
 
         valueAprobado.push("2020-07-29");
         valueAprobado.push("aprobado");
         valueAprobado.push("inicial");
         valueAprobado.push(req.body.idProductor);
         valueAprobado.push(req.body.idProveedor);
 
         const aprobadoQuery = await pool.query(textoAprobado,valueAprobado);

        res.render('realizarEv/confirmacion',{idProveedor: req.body.idProveedor, idProductor:req.body.idProductor});

    }else{

        console.log("No Aprobado");

        //query para no aprobado

        const textoReprobado = 'INSERT INTO public."Resultado_Evaluacion" (fecha_resultado,resultado,tipo_evaluacion,id_productor,id_proveedor) VALUES ($1,$2,$3,$4,$5)';

        var valueReprobado = [];

        valueReprobado.push("2020-07-29");
        valueReprobado.push("reprobado");
        valueReprobado.push("inicial");
        valueReprobado.push(req.body.idProductor);
        valueReprobado.push(req.body.idProveedor);

        const reprobadoQuery = await pool.query(textoReprobado,valueReprobado);

        res.render('realizarEv/error',{mensaje : "Evaluacion terminada, resultado: no aprobada"});

    }

});


router.get('/4' ,   (req,res) => { 

    res.redirect('/realizarEv');

});

router.post('/4' ,  async (req,res) => { 
   
    const id_pago  = req.body.pago;

    const id_productor = req.body.productor;

    const id_proveedor = req.body.proveedor;

    const textoMetodo = 'SELECT e.*from "Proveedor" as p, "Metodo_Envio" as e where p.id_proveedor=e.id_proveedor and p.id_proveedor= $1';
 
    var valueMetodo = [];

    valueMetodo.push(id_proveedor);

    const rmetodos = await pool.query(textoMetodo,valueMetodo);

    const metodos = rmetodos.rows;

    console.log(metodos);

    const texto2 = 'SELECT * FROM "Proveedor" WHERE id_proveedor = $1';
    
    var value2 = [];

    value2.push(id_proveedor);

    const proveedor = await pool.query(texto2,value2);

    console.log(proveedor.rows);



    /* 
    const texto = 'SELECT * FROM "Productor" WHERE nombre_productor = $1';
    
    var value1 = [];

    value1.push(data2);

    const productores = await pool.query(texto,value1);

    const productor = productores.rows;
    
    console.log(results.rows);*/

    res.render('realizarEv/paso4', {envios: metodos ,pago: id_pago , productor: id_productor, proveedor: proveedor.rows });

    // Hasta aqui llega la consulta de proveedor 


});

router.post('/10' ,  async (req,res) => { 

    //query con nombre proveedor

    const texto = 'SELECT * FROM "Proveedor" WHERE id_proveedor = $1';
    
    var value1 = [];

    value1.push(req.body.idProveedor);

    const proveedorQuery = await pool.query(texto,value1);

    const proveedor = proveedorQuery.rows;

    //query con id productor

    const texto2 = 'SELECT * FROM "Productor" WHERE id_productor = $1';
    
    var value2 = [];

    value2.push(req.body.idProductor);

    const productores = await pool.query(texto2,value2);

    const productor = productores.rows;

    console.log(proveedor);
    console.log(productor);

    //query para metodos de pago 

    const textoPagos = 'SELECT c.* from "Proveedor" as p, "Condicion_Pago" as c where p.id_proveedor=c.id_proveedor and p.id_proveedor=$1';

    const valuePagos = [req.body.idProveedor];

    const pagos = await pool.query(textoPagos,valuePagos);


    res.render('realizarEv/paso3',{pagos:pagos.rows,productor:productor,proveedor:proveedor});

});

router.get('/5' ,   (req,res) => { 

    res.redirect('/realizarEv');

});




router.post('/5' ,  async (req,res) => { 
   
    const id_pago  = req.body.pago;

    const id_productor = req.body.productor;

    const id_proveedor = req.body.proveedor;

    const id_envio = req.body.envio;

    const textoProductos = 'SELECT m.* from "Proveedor" as p, "Materia_Prima" as m where p.id_proveedor=m.id_proveedor and p.id_proveedor = $1';
 
    var valueProductos = [];

    valueProductos.push(id_proveedor);

    const productos = await pool.query(textoProductos,valueProductos);

    console.log(productos.rows);

    const texto2 = 'SELECT * FROM "Proveedor" WHERE id_proveedor = $1';
    
    var value2 = [];

    value2.push(id_proveedor);

    const proveedor = await pool.query(texto2,value2);

    console.log(proveedor.rows);


    /* 
    const texto = 'SELECT * FROM "Productor" WHERE nombre_productor = $1';
    
    var value1 = [];

    value1.push(data2);

    const productores = await pool.query(texto,value1);

    const productor = productores.rows;
    
    console.log(results.rows);*/

    res.render('realizarEv/paso5',{producto: productos.rows , proveedor: proveedor.rows ,productor: id_productor , envio: id_envio , pago: id_pago})


    // Hasta aqui llega la consulta de proveedor 


});


router.get('/6' ,   (req,res) => { 

    res.redirect('/realizarEv');

});

router.post('/6' ,  async (req,res) => { 
   
    const id_pago  = req.body.pago;

    const id_productor = req.body.productor;

    const id_proveedor = req.body.proveedor;

    const id_envio = req.body.envio;

    const id_productos = req.body.productos;

    console.log(id_pago);
    console.log(id_productor);
    console.log(id_proveedor);
    console.log(id_envio);
    console.log(id_productos);

    //INSERCIONES EN LA BASE DE DATOS 

    // INSERT DEL CONTRATO 

    const text = 'INSERT INTO public."Contrato" (id_contrato, fecha_inicio, exclusividad, tipo_oferta, cantidad_oferta, fecha_cancelacion, motivo_cancelacion, id_productor, id_proveedor) VALUES (DEFAULT, $1, false, NULL, NULL, NULL, NULL, $2, $3)';
    
    var value = [];
    value.push("2020-07-29");
    value.push(id_productor);
    value.push(id_proveedor);

    const contratoInsert =  await pool.query(text,value);

    //consigo el contrato

    const textContrato = 'SELECT id_contrato from "Contrato" where id_proveedor=$1 and id_productor=$2 and fecha_cancelacion is null';
    
    const valueContrato =[];

    valueContrato.push(id_proveedor);
    valueContrato.push(id_productor);

    const contratoQuery = await pool.query(textContrato,valueContrato);

    const contrato = contratoQuery.rows;

    console.log(contrato);

//insertar metodo pago
    const textometodo_pago = 'INSERT INTO "Cond_Part"  (id_cond_part, descripcion,id_condicion_pago,id_cond_pago_proveedor,id_contrato,id_proveedor_contrato,id_productor_contrato)  values (DEFAULT,NULL,$1,$2,$3,$4,$5)';

    const valuemetodo_pago = [];

    valuemetodo_pago.push(id_pago);
    valuemetodo_pago.push(id_proveedor);
    valuemetodo_pago.push(contrato[0].id_contrato);
    valuemetodo_pago.push(id_proveedor);
    valuemetodo_pago.push(id_productor);

    const metodo_pagoquery = await pool.query(textometodo_pago,valuemetodo_pago);

    const metodo_pago = metodo_pagoquery.rows;

    //conseguir id pais con id envio

    //consigo el contrato

    const textopaisenvio = 'SELECT id_pais  from "Metodo_Envio" where id_metodo_envio=$1';
    
    const valuepaisenvio =[];

    valuepaisenvio.push(id_envio);

    const envioquery = await pool.query(textopaisenvio,valuepaisenvio);

    const envio = envioquery.rows;

    console.log(envio);


    //insertar metodo envio

    const textometodo_envio = 'INSERT INTO "Cond_Part" (id_cond_part, descripcion,id_metodo_envio,id_envio_pais,id_proveedor_envio,id_contrato,id_proveedor_contrato,id_productor_contrato) values (DEFAULT,NULL,$1,$2,$3,$4,$5,$6)';
    
    valuemetodo_envio = [];
    valuemetodo_envio.push(id_envio);
    valuemetodo_envio.push(envio[0].id_pais);
    valuemetodo_envio.push(id_proveedor);
    valuemetodo_envio.push(contrato[0].id_contrato);
    valuemetodo_envio.push(id_proveedor);
    valuemetodo_envio.push(id_productor);

    const metodo_envioquery = await pool.query(textometodo_envio,valuemetodo_envio);

    const metodo_envio = metodo_envioquery.rows;

    console.log("pase metodo envio");;

    //inserto los productos 

    
    if(!Array.isArray(id_productos)){
        var arrayProductos = [];
        arrayProductos.push(id_productos);

        
    }else{
        var arrayProductos = id_productos;
    }

    for(var i = 0; i < arrayProductos.length; i++) {

        const textprecios = 'SELECT precio from "Presentacion_Ing" where id_materia_prima=$1';

        var valueprecios = [arrayProductos[i]];

        const preciosquery = await pool.query(textprecios,valueprecios);

        var precio = preciosquery.rows;

        valueprecios = [];

        const insertproducto = 'INSERT INTO public."Catalogo_Contrato" (id_cat_cont, precio, id_contrato, id_productor_cont, id_proveedor_cont, id_ing, id_mat_prim) VALUES (DEFAULT, $1, $2, $3, $4, NULL, $5)';
        
        var valueinsertp = [];

        valueinsertp.push(precio[0].precio);
        valueinsertp.push(contrato[0].id_contrato);;
        valueinsertp.push(id_productor);
        valueinsertp.push(id_proveedor);
        valueinsertp.push(arrayProductos[i]);

        const productoQuery = await pool.query(insertproducto,valueinsertp);

        var valueinsertp = [];

    }



    res.redirect('/')

});




module.exports = router;







