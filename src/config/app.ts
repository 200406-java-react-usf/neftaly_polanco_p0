import { UserRepository } from "../repos/user-repo";
//import { AuthorRepository } from "../repos/author-repo";
import { BookRepository } from "../repos/book-repo";
import { UserService } from "../services/user-service";
import { TransactionRepository } from "../repos/transaction-repo";
import { BookService } from "../services/book-service";
// import { AuthorService } from "../services/author-service";
import { TransactionService } from "../services/transaction-service";


const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const bookRepo = new BookRepository();
const bookService = new BookService(bookRepo);

// const authorRepo = new AuthorRepository();
// const authorService = new AuthorService(authorRepo);

const transRepo = new TransactionRepository();
const transactionService = new TransactionService(transRepo);

export default {
    userService,
    bookService,
    // authorService,
    transactionService
}
