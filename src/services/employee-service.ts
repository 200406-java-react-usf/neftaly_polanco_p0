import { Employee } from "../models/employee";
import { EmployeeRepository } from "../repos/employee-repo";
import { ResourceNotFoundError, BadRequestError } from "../errors/errors";
import { isValidId, isEmptyObject, isPropertyOf } from "../util/validator";



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
    private removePassword(employee: Employee): Employee {
        if (!employee|| !employee.password) return employee;
        let emp = {...employee};
        delete emp.password;
    }


}