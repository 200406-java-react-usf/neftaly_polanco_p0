import { EmployeeSchema } from "./schemas";
import { Employee } from "../models/employee";

export function mapEmployeeResultSet(resultSet: EmployeeSchema): User {
    
    if (!resultSet) {
        return {} as Employee
    }

    return new Employee(
        resultSet.id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
		resultSet.hire_date,
		resultSet.birth_date,
		resultSet.email,
        resultSet.role_name
    );
}