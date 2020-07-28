const express = require('express');
const router = express.Router();

const pool = require('../database');



router.get('/' ,  async (req,res) => { 

    const productores = await pool.query('SELECT * FROM "Productor"');

    const text = 'SELECT  l.nombre_pais FROM "Pais" as l,  "Pai_Prod" as a, "Productor" as t where a.id_pais=l.id_pais and t.id_productor=a.id_productor and t.id_productor=$1';

    var value = [1];

    const paises = await pool.query(text,value);

    console.log(paises.rows);

    res.render('compras/paso1', {productor : productores.rows});

});

router.post('/2' ,  async (req,res) => { 
   
    const data = req.body.productor;

    const texto = 'SELECT * FROM "Productor" WHERE nombre_productor = $1';
    
    var value1 = [];

    value1.push(data);

    const productores = await pool.query(texto,value1);

    const productor = productores.rows;

    var text = 'SELECT p.nombre_proveedor from "Proveedor" as p, "Productor" as t, "Contrato" as c where p.id_proveedor=c.id_proveedor and t.id_productor=c.id_productor and t.id_productor= $1 and fecha_cancelacion is null';

    var value2 = [];

    value2.push(productor[0].id_productor);

    const results = await pool.query(text,value2);

    console.log(results.rows);

    res.render('compras/paso2', { proveedor : results.rows , productor: productor[0]});

    // Hasta aqui llega la consulta de proveedor 

});

router.post('/3' ,  async (req,res) => { 
   //nombre productor
    const dataProductor = req.body.productor;

    //id proveedor
    const dataProveedor = req.body.proveedor;

    //DADO EL ID DEL PRODUCTOR, CONSIGO EL JSON DEL PRODUCTOR

    const textoProductor = 'SELECT * FROM "Productor" WHERE id_productor = $1';
    
    var valueProductor = [];

    valueProductor.push(dataProductor);

    const productorQuery = await pool.query(textoProductor,valueProductor);

    const productor = productorQuery.rows;


       //DADO EL NOMBRE DEL Proveedor, CONSIGO EL JSON DEL PROVEEDOR

    const textoProveedor = 'SELECT * FROM "Proveedor" WHERE nombre_proveedor = $1';
    
    var valueProveedor = [];

    valueProveedor.push(dataProveedor);

    const proveedorQuery = await pool.query(textoProveedor,valueProveedor);

    const proveedor = proveedorQuery.rows;


    //contrato dado el id del productor y proveedor

    const textoContrato = 'SELECT c.id_contrato	FROM "Contrato" as c, "Productor" as t, "Proveedor" as p where p.id_proveedor=c.id_proveedor and t.id_productor=c.id_productor and p.id_proveedor=$1 and t.id_productor=$2';

    valuePPContrato=[proveedor[0].id_proveedor,dataProductor];

    const contratoQuery = await pool.query(textoContrato,valuePPContrato);

    const contrato = contratoQuery.rows;

    //Productos dado un id de contrato

    const textoProductosContrato = 'SELECT m.numero_ipc,m.nombre_materia,d.precio, n.cantidad_vol FROM "Materia_Prima" as m, "Contrato" as c, "Proveedor" as p, "Productor" as t, "Catalogo_Contrato" as d,"Presentacion_Ing" as n where m.numero_ipc=d.id_mat_prim and d.id_contrato=c.id_contrato and d.id_contrato=c.id_contrato and d.id_productor_cont=c.id_productor and d.id_proveedor_cont=c.id_proveedor and c.id_proveedor=p.id_proveedor and c.id_productor=t.id_productor and n.id_materia_prima=m.numero_ipc and n.id_materia_prima=d.id_mat_prim and c.id_contrato=$1';

    valueProductosContrato = [contrato[0].id_contrato];

    const productosContratoQuery  = await pool.query(textoProductosContrato,valueProductosContrato);

    const productosContrato = productosContratoQuery.rows;

    console.log(productosContrato);

    //Metodos de envio dado un id de contrato 

    const textoEnvioContrato = 'SELECT e.tipo_envio,e.costo_envio from "Proveedor" as p, "Productor" as t, "Cond_Part" as c, "Contrato" as d, "Metodo_Envio" as e where p.id_proveedor=d.id_proveedor and t.id_productor=d.id_productor and d.id_contrato=c.id_contrato and p.id_proveedor=c.id_proveedor_contrato and t.id_productor=c.id_productor_contrato and c.id_metodo_envio=e.id_metodo_envio and d.id_contrato=$1';

    valueEnvioContrato = [contrato[0].id_contrato];

    const envioContratoQuery  = await pool.query(textoEnvioContrato,valueEnvioContrato);

    const envioContrato = envioContratoQuery.rows;


      //Tipos de pago dado un id de contrato 

      const textoPagoContrato = 'SELECT e.tipo_pago from "Proveedor" as p, "Productor" as t, "Cond_Part" as c, "Contrato" as d, "Condicion_Pago" e where p.id_proveedor=d.id_proveedor and t.id_productor=d.id_productor and d.id_contrato=c.id_contrato and p.id_proveedor=c.id_proveedor_contrato and t.id_productor=c.id_productor_contrato and c.id_condicion_pago=e.id_condicion_pago and d.id_contrato=$1';

      valuePagoContrato = [contrato[0].id_contrato];
  
      const pagoContratoQuery  = await pool.query(textoPagoContrato,valuePagoContrato);
  
      const pagoContrato = pagoContratoQuery.rows;

    res.render('compras/paso3', { productor : productor[0],proveedor:proveedor[0],producto:productosContrato,envios:envioContrato,pagos:pagoContrato});


});

router.post('/4' ,  async (req,res) => { 

    //id productor
     const dataProductor = req.body.productor;
 
     //id proveedor
     const dataProveedor = req.body.proveedor;

     console.log(dataProveedor,dataProductor);

     //DADO EL id DEL PRODUCTOR, CONSIGO EL json DEL PRODUCTOR

    const textoProductor = 'SELECT * FROM "Productor" WHERE id_productor = $1';
    
    var valueProductor = [];

    valueProductor.push(dataProductor);

    const productorQuery = await pool.query(textoProductor,valueProductor);

    const productor = productorQuery.rows;


     //DADO EL id DEL Proveedor, CONSIGO EL json DEL PROVEEDOR

    const textoProveedor = 'SELECT * FROM "Proveedor" WHERE id_proveedor = $1';
    
    var valueProveedor = [];

    valueProveedor.push(dataProveedor);

    const proveedorQuery = await pool.query(textoProveedor,valueProveedor);

    const proveedor = proveedorQuery.rows;

     //contrato dado el id del productor y proveedor

    const textoContrato = 'SELECT c.id_contrato	FROM "Contrato" as c, "Productor" as t, "Proveedor" as p where p.id_proveedor=c.id_proveedor and t.id_productor=c.id_productor and p.id_proveedor=$1 and t.id_productor=$2';

    valuePPContrato = [dataProveedor,dataProductor];

    const contratoQuery = await pool.query(textoContrato,valuePPContrato);

    const contrato = contratoQuery.rows;
    
    //Crear pedido solo con id contrato, id proveedor e id productor

    const crearPedido = 'INSERT INTO "Pedido" (id_pedido,estatus,fecha_emision,pago_total_dolar,id_condpart_contrato,id_condpart_contrato_productor,id_condpart_contrato_proveedor,id_productor,id_proveedor)values (DEFAULT,$1,$2,0,$3,$4,$5,$4,$5)';

    valueCrearPedido = ["pendiente","2020-07-29",contrato[0].id_contrato,dataProductor,dataProveedor];

    const pedidoQuery = await pool.query(crearPedido,valueCrearPedido);

    const pedido = pedidoQuery.rows;

    //Productos dado un id de contrato

    const textoProductosContrato = 'SELECT m.numero_ipc,m.nombre_materia,d.precio, n.cantidad_vol FROM "Materia_Prima" as m, "Contrato" as c, "Proveedor" as p, "Productor" as t, "Catalogo_Contrato" as d,"Presentacion_Ing" as n where m.numero_ipc=d.id_mat_prim and d.id_contrato=c.id_contrato and d.id_contrato=c.id_contrato and d.id_productor_cont=c.id_productor and d.id_proveedor_cont=c.id_proveedor and c.id_proveedor=p.id_proveedor and c.id_productor=t.id_productor and n.id_materia_prima=m.numero_ipc and n.id_materia_prima=d.id_mat_prim and c.id_contrato=$1';

    valueProductosContrato = [contrato[0].id_contrato];

    const productosContratoQuery  = await pool.query(textoProductosContrato,valueProductosContrato);

    const productosContrato = productosContratoQuery.rows;

    console.log(pedido);

    res.render('compras/paso4',{producto: productosContrato,productor:productor[0],proveedor:proveedor[0]});

});

router.post('/5' ,  async (req,res) => { 

     //id productor
     const ipcProducto = req.body.productos;
 
     //id proveedor
     const cantidadProducto = req.body.cantidadP;

     console.log(ipcProducto,cantidadProducto);

     res.redirect('/');


});







module.exports = router;