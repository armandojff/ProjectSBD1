const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/',(req,res) => {
    res.render('recomendador/filtros');
});

router.post('/1',async (req,res) => {
    
    dato = req.body;

    //Conversion de datos para el Query

    if (dato.intensidad == "frescos")
         dato.intensidad = ["EdC","EdS"];
    else{
    if (dato.intensidad == "intermedios")
         dato.intensidad = ["EdT"];
         else{

    if (dato.intensidad == "intensos")
        dato.intensidad = ["EdP","P"];
    }   
    }

    //variables global
    
    var hayFiltro = 0;

    var contador$ = 1;

    var valuesPerfumes= [];

    var textoPerfumes = 'select nombre_perfume from "Perfume" inner join "Per_Pmista" on ("Perfume".id_perfume = "Per_Pmista".id_perfume) inner join "Perfumista" on ("Per_Pmista".id_perfumista = "Perfumista".id_perfumista) inner join "Fam_Per" on ("Fam_Per".id_perfume = "Perfume".id_perfume) inner join "Familia_Olfativa" on "Fam_Per".id_folf = "Familia_Olfativa".id_folf inner join "Pal_Folf" on "Familia_Olfativa".id_folf = "Pal_Folf".id_folf inner join "Palabra_Clave" on "Palabra_Clave".id_palabra = "Pal_Folf".id_palabra inner join "Intensidad" on "Intensidad".id_perfume = "Perfume".id_perfume';
//filtro familia
    if (dato.familia){

        hayFiltro = 1;

        if(!Array.isArray(dato.familia)){
            var arrayFam = [];
            arrayFam.push(dato.familia);

            
        }else{
            var arrayFam = dato.familia;
        }

        

        var contaArray=0;

        var paramsFam = [];

        for(var i = 1; i <= arrayFam.length; i++) {
            paramsFam.push('$' + contador$);
            valuesPerfumes.push(arrayFam[contaArray]);
            contaArray++;
            contador$++;
        }

        var queryFamilia = ' where "Familia_Olfativa".nombre_folf IN (' + paramsFam.join(',') + ')';

        textoPerfumes = textoPerfumes + queryFamilia;


    }

    //filtro genero

    if(dato.genero != ""){

        if(hayFiltro){
            var queryGenero = ' and "Perfume".genero = $'+contador$;
            contador$++;
            valuesPerfumes.push(dato.genero);
            textoPerfumes = textoPerfumes + queryGenero;
            
        }else{

            var queryGenero = ' where "Perfume".genero = $'+contador$;
            contador$++;
            valuesPerfumes.push(dato.genero);
            textoPerfumes = textoPerfumes + queryGenero;
            hayFiltro=1;

        }


    }

    //filtro edad

    if(dato.edad != ""){

        if(hayFiltro){
            var queryEdad = ' and "Perfume".edad = $'+contador$;
            contador$++;
            valuesPerfumes.push(dato.edad);
            textoPerfumes = textoPerfumes + queryEdad;
            
        }else{

            var queryEdad = ' where "Perfume".edad = $'+contador$;
            contador$++;
            valuesPerfumes.push(dato.edad);
            textoPerfumes = textoPerfumes + queryEdad;
            hayFiltro=1;

        }


    }

    //filtro intensidad

    if(dato.intensidad){
        if(hayFiltro){
            var arrayIntensidad = dato.intensidad;
            
            var contadorArray=0;

            var paramsIntensidad = [];

            for(var i = 1; i <= arrayIntensidad.length; i++) {
                paramsIntensidad.push('$' + contador$);
                valuesPerfumes.push(arrayIntensidad[contadorArray]);
                contadorArray++;
                contador$++;
            }

            var queryIntensidad = ' and "Intensidad".tipo_intensidad IN (' + paramsIntensidad.join(',') + ')';

            textoPerfumes = textoPerfumes + queryIntensidad;


        }else{

            hayFiltro = 1;

            var arrayIntensidad = dato.intensidad;
            
            var contadorArray=0;

            var paramsIntensidad = [];

            for(var i = 1; i <= arrayIntensidad.length; i++) {
                paramsIntensidad.push('$' + contador$);
                valuesPerfumes.push(arrayIntensidad[contadorArray]);
                contadorArray++;
                contador$++;
            }

            var queryIntensidad = ' where "Intensidad".tipo_intensidad IN (' + paramsIntensidad.join(',') + ')';

            textoPerfumes = textoPerfumes + queryIntensidad;

            

        }


    }

    //filtro palabra clave 

    if(dato.palabra){


        if(hayFiltro){

            if(!Array.isArray(dato.palabra)){
                var arrayPalabra = [];
                arrayPalabra.push(dato.palabra);
    
                
            }else{
                var arrayPalabra = dato.palabra;
            }
            
            var contadoreArray=0;

            var paramsPalabra = [];

            for(var i = 1; i <= arrayPalabra.length; i++) {
                paramsPalabra.push('$' + contador$);
                valuesPerfumes.push(arrayPalabra[contadoreArray]);
                contadoreArray++;
                contador$++;
            }

            var queryPalabra = ' and "Palabra_Clave".nombre_palabra IN (' + paramsPalabra.join(',') + ')';

            textoPerfumes = textoPerfumes + queryPalabra;


        }else{

            hayFiltro = 1;

            if(!Array.isArray(dato.palabra)){
                var arrayPalabra = [];
                arrayPalabra.push(dato.palabra);
    
                
            }else{
                var arrayPalabra = dato.palabra;
            }

            
            var contadoreArray=0;

            var paramsPalabra = [];

            for(var i = 1; i <= arrayPalabra.length; i++) {
                paramsPalabra.push('$' + contador$);
                valuesPerfumes.push(arrayPalabra[contadoreArray]);
                contadoreArray++;
                contador$++;
            }

            var queryPalabra = ' where "Palabra_Clave".nombre_palabra IN (' + paramsPalabra.join(',') + ')';

            textoPerfumes = textoPerfumes + queryPalabra;

        }




    }


    console.log(textoPerfumes);
    console.log(valuesPerfumes);

    textoPerfumes = textoPerfumes + ' group by (nombre_perfume)';



    const perfumes = await pool.query(textoPerfumes,valuesPerfumes);

    console.log(perfumes.rows);


/*
    console.log("req body: ",dato);

    var array = dato.familia;
    var params = [];
    for(var i = 1; i <= array.length; i++) {
        params.push('$' + i);

    }
    var queryText = 'SELECT id FROM my_table WHERE something IN (' + params.join(',') + ')';

    console.log(queryText);

  

    //query de perfumes

    const textPerfumes = 'select nombre_perfume from "Perfume" inner join "Per_Pmista" on ("Perfume".id_perfume = "Per_Pmista".id_perfume) inner join "Perfumista" on ("Per_Pmista".id_perfumista = "Perfumista".id_perfumista) inner join "Fam_Per" on ("Fam_Per".id_perfume = "Perfume".id_perfume) inner join "Familia_Olfativa" on "Fam_Per".id_folf = "Familia_Olfativa".id_folf inner join "Pal_Folf" on "Familia_Olfativa".id_folf = "Pal_Folf".id_folf inner join "Palabra_Clave" on "Palabra_Clave".id_palabra = "Pal_Folf".id_palabra inner join "Intensidad" on "Intensidad".id_perfume = "Perfume".id_perfume where "Perfume".genero = $1 and "Perfume".edad = $2  and "Familia_Olfativa".nombre_folf IN ($3,$4) group by (nombre_perfume)';

    const valuePerumes = [dato.genero,dato.edad,"Verde","Maderas"];

    const perfumes = await pool.query(textPerfumes,valuePerumes);

   console.log(perfumes.rows);*/
    
    res.render('recomendador/list',{perfume:perfumes.rows});


});


module.exports = router;