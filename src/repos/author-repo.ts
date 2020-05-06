import { Author } from '../models/author';
import { CrudRepository } from './crud-repo';
import { 
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapAuthorResultSet } from '../util/author-result-set-mapper';

export class AuthorRepository implements CrudRepository<Author> {

    baseQuery = `
        select * from Authors
    `;
    // get all authors
    async getAll(): Promise<Author[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql); // rs = ResultSet
            return rs.rows.map(mapAuthorResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    //get author by id
    async getById(id: number): Promise<Author> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapAuthorResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    //add a new author
    async save(newAuthor: Author): Promise<Author> {
            
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
           
            let sql = `
                insert into Authors (first_name, last_name, pen_name) 
                values ($1, $2, $3) returning id
            `;
            let rs = await client.query(sql, [newAuthor.firstName, newAuthor.lastName, newAuthor.penName]);
            
            newAuthor.id = rs.rows[0].id;
            
            return newAuthor;

        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    //getting Author by unique key such as phone or email;
    async getAuthorByUniqueKey(key: string, val: string): Promise<Author> {
        let client: PoolClient;
        
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where ae.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapAuthorResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    //update an existing author

    async update(updatedAuthor: Author): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `update Authors where au.id = $1 values `;
            let rs = await client.query(sql, []);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }
    
    //delete author
    async deleteById(id: number): Promise<boolean> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `delete from Authors where id = $1`;
            await client.query(sql, []);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

}
