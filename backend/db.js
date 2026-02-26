const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',           // username PostgreSQL Anda
    host: 'localhost',
    database: 'data1',          // nama database Anda
    password: 'postgres',        // password PostgreSQL Anda
    port: 5432,
});

module.exports = pool;