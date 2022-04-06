//require dependencies
import express from 'express';
import Yargs from 'yargs';
import fs from 'fs';
import morgan from 'morgan';
import {logdb, dbInit} from './database.js';
import * as coin from './coin.mjs'

//initialize constants for dependencies
const app = express();
const fileReader = fs;
const argv = Yargs(process.argv.slice(2)).help(false).argv;

//allow express to read json or url encoded formats
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//define port as default or from command line
const port = (argv.port == undefined) ? 5555 : argv.port;

//create rest of command line options
const debug = (argv.debug == undefined || argv.debug == 'false') ? false : true;
const log = (argv.log == undefined || argv.log == 'true') ? true : false;
const help = (argv.help == undefined) ? false : true;

//display help message from html file if --help
async function getHelp() {
    if (help) {
        fileReader.readFile('./help.html', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                process.exit(0);
            }
            console.log(data);
            process.exit(0);
        });
    }
    return;
}

//declare appServer as async, wait for help option to finish
async function appServer() {
    await getHelp();
    if (!help) {
        dbInit();
        const server = app.listen(port, () => {
            console.log(`App is running on port ${port}`);
        });
    }
}

//start up the server
appServer();

//middleware function that inserts a new record in database
app.use((req, res, next) => {
    //create log data object that contains necessary variables
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        secure: req.secure,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    };
    const stmt = logdb.prepare(`INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, secure, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    //stmt.run(Object.values(logdata));
    stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, String(logdata.secure), logdata.status, logdata.referer, logdata.useragent)
    next();
});

//if log option is true, write log to file
if (log) {
    const accessLog = fileReader.createWriteStream('access.log', { flags: 'a' });
    app.use(morgan('combined', { stream: accessLog }));
};

//if debug option is true, create specific endpoints
if (debug) {
    app.get('/app/log/access', (req, res) => {
        try {
            const stmt = logdb.prepare(`SELECT * FROM accesslog`).all();
            res.status(200).json(stmt);
        } catch (e) {
            console.error(e);
        }
    });
    app.get('/app/error', (req, res) => {
        throw new Error('Error test successful.')
    });
};

//define check endpoint
app.get('/app/', (req, res) => {
    //respond with status 200
    res.statusCode = 200;

    //respond with status message "OK"
    res.statusMessage = 'OK';
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
    res.end(res.statusCode + ' ' + res.statusMessage);
});

//random coin flip endpoint
app.get('/app/flip', (req, res) => {
    res.contentType('text/json');
    res.status(200).json({ 'flip' : coin.coinFlip()});
});

//multiple flips endpoint
app.get('/app/flips/:number', (req, res) => {
    res.contentType('text/json');
	const flips = coin.coinFlips(req.params.number);
    const count = coin.countFlips(flips);
    res.status(200).json({ 'raw' : flips, 'summary' : count})
});

//flip match against heads endpoint
app.get('/app/flip/call/heads', (req, res) => {
    res.contentType('text/json');
    res.status(200).json(coin.flipACoin('heads'));
});

//flip match against tails endpoint
app.get('/app/flip/call/tails', (req, res) => {
    res.contentType('text/json');
    res.status(200).json(coin.flipACoin('tails'));
});

//default endpoint
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND');
});