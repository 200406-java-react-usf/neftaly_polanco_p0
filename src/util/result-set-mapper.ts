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

export function mapBookResultSet(resultSet: BookSchema): Book {
    
    if (!resultSet) {
        return {} as Book;
    }

    return new Book(
        resultSet.id,
        resultSet.title,  
        resultSet.stock, 
        resultSet.price,  
        resultSet.genres,
        resultSet.authors,
        resultSet.buyers,        
        resultSet.transactionId,
    );
}

export function mapAuthorResultSet(resultSet: AuthorSchema): Author {
    
    if (!resultSet) {
        return {} as Author;
    }

    return new Author(
        resultSet.id,
        resultSet.first_name,  
        resultSet.last_name, 
        resultSet.pen_name,
        resultSet.bookswritten
    );
}

export function mapCustomerResultSet(resultSet: CustomerSchema): Customer {

    if(!resultSet) {
        return {} as Customer;
    }

    return new Customer(
        resultSet.id,
        resultSet.firstName,
        resultSet.lastName,
        resultSet.birthdate,
        resultSet.phone,
        resultSet.email,
        resultSet.address,
        resultSet.city,
        resultSet.state,
        resultSet.zipCode,
        resultSet.booksLog
    );
}
