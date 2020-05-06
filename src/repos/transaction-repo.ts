import { Transaction } from '../models/transaction';
import { CrudRepository } from './crud-repo';
import { 
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapTransactionResultSet } from '../util/transaction-result-set-mapper';

export class TransactionRepository implements CrudRepository<Transaction> {

    baseQuery = `
            select 
            tr.id,
            tr.date,
            us.username as username
        from Transactions tr        
        join users us on 
        tr.user_id = us.id
    `;
    // get all transactions
    async getAll(): Promise<Transaction[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql); // rs = ResultSet
            return rs.rows.map(mapTransactionResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    //get transaction by id
    async getById(id: number): Promise<Transaction> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where tr.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapTransactionResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    //add a new transaction
    async save(newTransaction: Transaction): Promise<Transaction> {
            
        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            let total = 'sel'
           
            let sql = `  
                insert into tr (user_id) 
                values ($1) returning id
            `;
            let rs = await client.query(sql, [newTransaction.username]);
            
            newTransaction.id = rs.rows[0].id;
            
            return newTransaction;

        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

     //getting Transaction by unique key such as phone or email;
     async getTransactionByUniqueKey(key: string, val: string): Promise<Transaction> {
        let client: PoolClient;
        
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where tr.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapTransactionResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    //update an existing transaction
    async update(updatedTransaction: Transaction): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `update Transactions where tr.id = $1 values `;
            let rs = await client.query(sql, []);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }
    
    //delete transaction
    async deleteById(id: number): Promise<boolean> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `delete from Transactions where tr.id = $1`;
            await client.query(sql, []);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

}
