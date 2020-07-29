const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
    res.render('recomendador/filtros');
});

router.post('/1',(req,res) => {
    data = req.body;


    console.log(data);

    res.redirect('/');
});


module.exports = router;