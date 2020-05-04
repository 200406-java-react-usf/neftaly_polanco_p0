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
        join Copies_Sold cs
        on b.id = cs.book_id

        join Transactions t
        on cs.transaction_id = t.id

        join Written_By wb
        on b.id = wb.book_id

        join Authors au
        on wb.author_id = au.id

        join Book_Genres bg
        on b.id = bg.book_id

        join Genres g
        on bg.genre_id = g.id
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

            let bookAuthors = {...newBook.authors}
           
            let sql = `
                insert into Books (title, stock, price) 
                values ($1, $2, $3) returning id
                insert into Book_Genres values ($4, $5) returning id
                insert into Written_By values ($1, $6)
            `;
            let rs = await client.query(sql, [newBook.title, newBook.stock, newBook.price, newBook.genres, newBook.authors]);
            
            newBook.id = rs.rows[0].id;
            
            return newBook;

        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    //update book work in progress
    async update(updatedBook: Book): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = ``;
            let rs = await client.query(sql, []);
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
            let sql = `delete from Books where b.id = $1`;
            await client.query(sql, []);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

}
