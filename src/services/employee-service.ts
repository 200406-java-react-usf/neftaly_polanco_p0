import { Employee } from "../models/employee";
import { EmployeeRepository } from "../repos/employee-repo";
import { ResourceNotFoundError, BadRequestError, ResourcePersistenceError, AuthenticationError } from "../errors/errors";
import { isValidId, isEmptyObject, isPropertyOf, isValidObject, isValidStrings } from "../util/validator";



export class EmployeeService {
    constructor(private empRepo: EmployeeRepository) {
        this.empRepo = empRepo;
    }

    async getAllEmployees(): Promise<Employee[]> {
        let emps = await this.empRepo.getAll();

        if (emps.length == 0) {
            throw new ResourceNotFoundError();
        }
        return emps.map(this.removePassword);
    }

    async getEmployeeById(id: number): Promise<Employee> {
        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let employee = await this.empRepo.getById(id);

        if(isEmptyObject(employee)) {
            throw new ResourceNotFoundError();
        }

        return  this.removePassword(employee);
    }

    async getEmployeeByUniqueKey(queryObj: any): Promise<Employee> {

        try {
            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, Employee))) {
                throw new BadRequestError();
            }

            //searching by only one key (at least for now)
            let key = queryKeys[0];
            let val = queryObj[key];

            //reuse getById logic if given key is id
            if (key === 'id') {
                return await this.getEmployeeById(+val);
            }

            // throw error if key is value is not valid
            if(!isValidId(val)) {
                throw new BadRequestError();
            }

            let emp = await this.empRepo.getEmployeeByUniqueKey(key, val);
            
            if(isEmptyObject(emp)) {
                throw new ResourceNotFoundError();
            }

            return this.removePassword(emp);

        } catch (e) {
        throw e;
        }
    }
    async authenticateUser(un: string, pw: string): Promise<Employee> {

        try {

            if (!isValidStrings(un, pw)) {
                throw new BadRequestError();
            }

            let authEmp: Employee;
            
            authEmp = await this.empRepo.getEmployeeByCredentials(un, pw);
           

            if (isEmptyObject(authEmp)) {
                throw new AuthenticationError('Bad credentials provided.');
            }

            return this.removePassword(authEmp);

        } catch (e) {
            throw e;
        }

    }

    async addNewEmployee(newEmp: Employee): Promise<Employee> {
        
        try {

            if (!isValidObject(newEmp, 'id')) {
                throw new BadRequestError('Invalid property values found in provided employee.');
            }

            let usernameAvailable = await this.isUsernameAvailable(newEmp.username);

            if (!usernameAvailable) {
                throw new ResourcePersistenceError('The provided username is already taken.');
            }
        
            let emailAvailable = await this.isEmailAvailable(newEmp.email);
    
            if (!emailAvailable) {
                throw new  ResourcePersistenceError('The provided email is already taken.');
            }

            newEmp.role = 'staff'; // all new registers have 'staff' role by default
            const persistedEmployee = await this.empRepo.save(newEmp);

            return this.removePassword(persistedEmployee);

        } catch (e) {
            throw e
        }

    }

    private async isUsernameAvailable(username: string): Promise<boolean> {

        try {
            await this.getEmployeeByUniqueKey({'username': username});
        } catch (e) {
            console.log('username is available')
            return true;
        }

        console.log('username is unavailable')
        return false;

    }

    private async isEmailAvailable(email: string): Promise<boolean> {
        
        try {
            await this.getEmployeeByUniqueKey({'email': email});
        } catch (e) {
            console.log('email is available')
            return true;
        }

        console.log('email is unavailable')
        return false;
    }

    private removePassword(employee: Employee): Employee {
        if (!employee|| !employee.password) return employee;
        let emp = {...employee};
        delete emp.password;
    }
}