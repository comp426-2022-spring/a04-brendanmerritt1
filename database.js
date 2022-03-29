//program failure will throw errors
"use strict";

//require better-sqlite3
import Database from 'better-sqlite3';

//connect to database, or create one if it doesn't exist yet
const logdb = new Database('log.db');

//initializing database
function dbInit() {
    const stmt = logdb.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`);
    let row = stmt.get();
    if (row === undefined) {
        console.log('The log database appears to be empty. Initializing now...');
    
        //constant containing commands to initialize database
        const sqlInit = `
            CREATE TABLE accesslog (
                remote_addr VARCHAR,
                remote_user VARCHAR,
                date VARCHAR,
                method VARCHAR,
                url VARCHAR,
                protocol VARCHAR,
                http_version NUMERIC,
                secure VARCHAR,
                status NUMERIC,
                referrer_url VARCHAR,
                user_agent VARCHAR
            );
        `
        logdb.exec(sqlInit);
        console.log('Logging database has been created.');
    }
    else {
        console.log('Database already exists.');
    }
    return;
}

//export above code as module so that it can be used in server.js
export {logdb, dbInit};