import { EmployeeSchema, BookSchema, AuthorSchema, CustomerSchema } from "./schemas";
import { Employee } from "../models/employee";
import { Book } from "../models/book";
import { Author } from "../models/author";
import { Customer } from "../models/customer";

export function mapEmployeeResultSet(resultSet: EmployeeSchema): Employee {
    
    if (!resultSet) {
        return {} as Employee;
    }

    return new Employee(
        resultSet.id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
		resultSet.hire_date,
        resultSet.birth_date,
        resultSet.phone,
		resultSet.email,
        resultSet.role_name
    );
}
