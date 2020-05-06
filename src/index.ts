import dotenv from 'dotenv';
import fs, { mkdir } from 'fs';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import { UserRouter } from './routers/user-router';
import { AuthRouter } from './routers/auth-router';
import { BookRouter } from './routers/book-router';
import { TransactionRouter } from './routers/transaction-router';
import { AuthorRouter } from './routers/author-router';
import { sessionMiddleware } from './middleware/session-middleware';
import { corsFilter } from './middleware/cors-filter';
import { Pool } from 'pg';


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

//loggin config
fs.mkdir(`${__dirname}/logs`, () => {});
const logStream = fs.createWriteStream(path.join
    (__dirname, 'logs/access.log'), { flags: 'a'});

//webserver config
const app = express();
app.use(morgan('combined', { stream: logStream}));
app.use(sessionMiddleware);
app.use(corsFilter);
app.use('/', express.json());
app.use('/users', UserRouter);
app.use('/books', BookRouter);
app.use('/authors', AuthorRouter);
app.use('/transactions', TransactionRouter);
app.use('/auth', AuthRouter);

app.listen(8080, () => {
    console.log('Application running and listening at: http://localhost:8080');
})