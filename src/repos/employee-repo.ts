import { Employee } from '../models/employee';
import { CrudRepository } from './crud-repo';
import Validator from '../util/validator';
import {  
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapEmployeeResultSet } from '../util/result-set-mapper';

export class EmployeeRepository implements CrudRepository<Employee> {

    baseQuery = `
        select
            ae.id,
            ae.username,
            ae.password,
            ae.first_name,
            ae.lastname,
            ae.birth_date,
            ae.hire_date,
            ae.email,
            er.name as role_name

            from Employees ae
            join Roles er
            on ae.role_id = er.id
    `;
    
    //getting all employees at once
    async getAll(): Promise<Employee[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql); //rs stands for ResultSet
            return rs.rows.map(mapEmployeeResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release()
        }
    }       

    // getting employee by its id
    async getById(id: number): Promise<Employee> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where ae.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapEmployeeResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }    
    }
    
    //getting employee by unique key such as username or email;
    async getEmployeeByUniqueKey(key: string, val: string): Promise<Employee> {
        let client: PoolClient;
        
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where ae.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapEmployeeResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

   //getting Employee by its credentials
    async getEmployeeByCredentials(un: string, pw: string) {
        
       let client: PoolClient;

       try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where ae.username = $1 and ae.password = $2`;
            let rs = await client.query(sql, [un, pw]);
            return mapEmployeeResultSet(rs.rows[0]);
       } catch (e) {
           throw new InternalServerError();
       } finally {
           client && client.release();
       }
    
    }

    //adding a new employee
   async save(newEmployee: Employee): Promise<Employee> {
            
        let client: PoolClient;
        
        try {
            client = await connectionPool.connect();

            let role_id = (await client.query('select id from Rloes where role_name = $1', [newEmployee.role])).rows[0].id;

            let sql = `insert into Employees (first_name, last_name, username, 
                password, birthdate, phone, email, role_id) 
                values ($1, $2, $3, $4, $5, $6, $7, $8) returning id`;

            let rs = (await client.query(sql, [newEmployee.username, newEmployee.password, 
                newEmployee.firstName, newEmployee.lastName, newEmployee.birthdate, 
                newEmployee.phone, newEmployee.email, role_id]));

            newEmployee.id = rs.rows[0].id;

            return newEmployee;

        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async update(updatedEmployee: Employee): Promise<boolean> {
        
        let client: PoolClient;
        let queryKeys = Object.keys(updatedEmployee);

        try {
            client = await connectionPool.connect();
            let sql = `update Employees set`;
            let rs = await client.query(sql, []);
            return true;
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
             let sql = '';
             let rs = await client.query(sql, []);
             return true;

         } catch (e) {

         } finally {
             client && client.release();
         }
    }

    // private removePassword(employee: Employee): Employee {
    //     let emp = {...employee};
    //     delete emp.password;
    //     return emp;   
    // }

}
