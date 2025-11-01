const mysql = require('mysql');

const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || "VolunteerHook",
    password: process.env.DB_PASSWORD || "VHook101",
    database: process.env.DB_NAME || "SoftwareProject_db",
});

db.getConnection((err, connection) =>{
    /*istanbul ignore next */
    if(err){
        console.error("Error connection to database:", err);
    }

    else{
            console.log("Database connection success!");
            connection.release();
    }

});

module.exports = {db};