import { Customer } from '../models/customer';
import { CrudRepository } from './crud-repo';
import { 
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapCustomerResultSet } from '../util/result-set-mapper';

export class CustomerRepository implements CrudRepository<Customer> {

    baseQuery = `
        select * from Customers
    `;
    // get all customers
    async getAll(): Promise<Customer[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql); // rs = ResultSet
            return rs.rows.map(mapCustomerResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    //get customer by id
    async getById(id: number): Promise<Customer> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where cu.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapCustomerResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    //add a new customer
    async save(newCustomer: Customer): Promise<Customer> {
            
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
           
            let sql = `
                insert into Customers (first_name, last_name, phone, email, address, city, state, zip_code) 
                values ($1, $2, $3, $4, $5, $6, $7, $8) returning id
            `;
            let rs = await client.query(sql, [newCustomer.firstName, newCustomer.lastName, 
                newCustomer.phone, newCustomer.email, newCustomer.address, newCustomer.city, 
                newCustomer.state, newCustomer.zipCode]);
            
            newCustomer.id = rs.rows[0].id;
            
            return newCustomer;

        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

     //getting Customer by unique key such as phone or email;
     async getCustomerByUniqueKey(key: string, val: string): Promise<Customer> {
        let client: PoolClient;
        
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where ae.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapCustomerResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    //update an existing customer
    async update(updatedCustomer: Customer): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `update Customers where cu.id = $1 values `;
            let rs = await client.query(sql, []);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }
    
    //delete customer
    async deleteById(id: number): Promise<boolean> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `delete from Customers where id = $1`;
            await client.query(sql, []);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

}
