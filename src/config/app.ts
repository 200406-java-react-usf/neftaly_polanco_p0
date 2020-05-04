import { EmployeeRepository } from "../repos/employee-repo";
import { AuthorRepository } from "../repos/author-repo";
import { BookRepository } from "../repos/book-repo";
import { EmployeeService } from "../services/employee-service";
import { CustomerRepository } from "../repos/customer-repo";
import { BookService } from "../services/book-service";
import { AuthorService } from "../services/author-service";
import { CustomerService } from "../services/customer-service";


const empRepo = new EmployeeRepository();
const empService = new EmployeeService(empRepo);

const bookRepo = new BookRepository();
const bookService = new BookService(bookRepo);

const authorRepo = new AuthorRepository();
const authorService = new AuthorService(authorRepo);

const custRepo = new CustomerRepository();
const customerService = new CustomerService(custRepo);

export default {
    empService,
    bookService,
    authorService,
    customerService
}
