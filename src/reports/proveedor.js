const express = require('express');
const router = express.Router();

const request = require('request');

const pool = require('../database');




router.get('/',(req,res) => {
    
    var data = {
        template:{'shortid':'BkeUxwTUeP'},
  

    }
    var options = {
        uri:'http://localhost:5489/api/report',
        method:'POST',
        json:data
    }

    
    request(options).pipe(res);

});

module.exports = router;