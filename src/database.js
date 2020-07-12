const { Pool } = require('pg');

const config = {
    user:'postgres',
    host: 'localhost',
    password: '3004092',
    database: 'ProyectoSBD1'   
};

const pool = new Pool ( config );

module.exports = pool;


