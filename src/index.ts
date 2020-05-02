import dotenv from 'dotenv';
import { Pool } from 'pg';
import express from 'express';

//environment config
dotenv.config();

//database config
export const connectionPool: Pool = new Pool({
    host: process.env['DB_HOST'],
    port: +process.env['DB_PORT'],
    database: process.env['DB_NAME'],
    user: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    max: 5
});

//webserver config
const app = express();

app.use('/', express.json());

app.listen(8080, () => {
    console.log('Application running and listening at: http://localhost:8080');
})