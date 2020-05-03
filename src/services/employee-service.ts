import { Employee } from "../models/employee";
import { EmployeeRepository } from "../repos/employee-repo";
import { ResourceNotFoundError } from "../errors/errors";



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


}