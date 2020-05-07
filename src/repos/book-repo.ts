// import book model
import { Book } from '../models/book';
//import crud repo
import { CrudRepository } from './crud-repo';

import {
    InternalServerError
} from '../errors/errors';
//import connection
import { PoolClient } from 'pg';
import { connectionPool } from '..';
//import map result set
import { mapBookResultSet } from '../util/book-result-set-mapper';

//create book repository
export class BookRepository implements CrudRepository<Book> {

    baseQuery = `
        select *
        from Books b
        `;

    //get all books
    async getAll(): Promise<Book[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql); // rs = ResultSet
            return rs.rows.map(mapBookResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    //get book by id
    async getById(id: number): Promise<Book> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where b.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapBookResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    // add new book
    async save(newBook: Book): Promise<Book> {
            
        let client: PoolClient;

        try {
            client = await connectionPool.connect();            
           
            let sql = `
                insert into Books (title, book_price) 
                values ($1, $2) returning id                
            `;
            let rs = await client.query(sql, [newBook.title, newBook.price]);
            
            newBook.id = rs.rows[0].id;
            
            return newBook;

        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    //getting Book by unique key such as phone or email;
    async getBookByUniqueKey(key: string, val: string): Promise<Book> {
        let client: PoolClient;
        
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where b.${key} = ${val}`;
            let rs = await client.query(sql, [val]);
            return mapBookResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    //update book 
    async update(updatedBook: Book): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `update b set book_price = $2 where id = $2`;
            let rs = await client.query(sql, [updatedBook.price, updatedBook.id]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    //delete a book
    async deleteById(id: number): Promise<boolean> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `delete from b where id = $1`;
            let rs = await client.query(sql);            
            return (true);
            
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

}
