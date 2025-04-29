import mysql from "mysql2";

export const pool  = mysql.createPool({
    host            : "localhost",
    user            : "root",
    password        : "UnityRegina101213",
    database        : "my_db",
  });
  
