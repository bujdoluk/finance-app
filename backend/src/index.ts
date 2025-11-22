import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
http = require('http')

async function main() {
    /**
     * HTTP and console logging middleware using winston package
     */
    app.use(initRequest)
    app.use(logResponse)
}

main();