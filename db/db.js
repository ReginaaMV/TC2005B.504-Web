import mysql from "mysql2";

export const pool  = mysql.createPool({
    host            : "localhost",
    user            : "root",
    password        : "UnityRegina101213",
    database        : "my_db",
});

// Prueba de conexión
pool.query('SELECT 1', (err, results) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

