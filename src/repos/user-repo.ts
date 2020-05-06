import { User } from '../models/user';
import { CrudRepository } from './crud-repo';
import {  
    InternalServerError, BadRequestError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapUserResultSet } from '../util/user-result-set-mapper';
import { isPropertyOf } from '../util/validator';

export class UserRepository implements CrudRepository<User> {

    baseQuery = `
        select 
            us.id,
            us.username,
            us.password,
            us.first_name,
            us.last_name,
            us.phone,
            us.email,
        ro.role_name as role_name
        from users us 
        join roles ro 
        on us.role_id = ro.id                 
    `;
    
    //getting all users at once
    async getAll(): Promise<User[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} order by us.id`;
            let rs = await client.query(sql); //rs stands for ResultSet
            return rs.rows.map(mapUserResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release()
        }
    }       

    // getting user by its id
    async getById(id: number): Promise<User> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where us.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }    
    }
    
    //getting user by unique key such as username or email;
    async getUserByUniqueKey(key: string, val: string): Promise<User> {
        let client: PoolClient;
        
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where us.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

   //getting User by its credentials
    async getUserByCredentials(un: string, pw: string) {
        
       let client: PoolClient;

       try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where us.username = $1 and us.password = $2`;
            let rs = await client.query(sql, [un, pw]);
            return mapUserResultSet(rs.rows[0]);
       } catch (e) {
           throw new InternalServerError();
       } finally {
           client && client.release();
       }
    
    }

    //adding a new user
   async save(newUser: User): Promise<User> {
            
        let client: PoolClient;
        
        try {
            client = await connectionPool.connect();

            let role_id = (await client.query('select id from Roles where role_name = $1', [newUser.role_name])).rows[0].id;

            let sql = `insert into us (first_name, last_name, username, 
                password, phone, email, role_id) 
                values ($1, $2, $3, $4, $5, $6, $7) returning id` ;

            let rs = (await client.query(sql, [newUser.username, newUser.password, 
                newUser.firstName, newUser.lastName,  
                newUser.phone, newUser.email, role_id]));

            newUser.id = rs.rows[0].id;

            return newUser;

        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async update(updatedUser: User): Promise<boolean> {
        
        let client: PoolClient;
        let queryKeys = Object.keys(updatedUser);
        if(!queryKeys.every(key => isPropertyOf(key, User))) {
            throw new BadRequestError();
        }

        try {
            client = await connectionPool.connect();
            let sql = `update Users set $1 = $2 where id = $3`;
            let rs = await client.query(sql, ['username', updatedUser, updatedUser.id]);
            if(rs)
            return true;
            else return false;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async deleteById(id: number): Promise<boolean> {

        let client: PoolClient;
            
         try {
             client = await connectionPool.connect();
             let sql = 'delete from us where id = $1';
             await client.query(sql, [id]);                
             return true;
             
         } catch (e) {
            throw new InternalServerError();
        }  finally {
             client && client.release();
         }
    }
}
