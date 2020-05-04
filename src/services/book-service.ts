import { Book } from "../models/book";
import { BookRepository } from "../repos/book-repo";
import { ResourceNotFoundError, BadRequestError, ResourcePersistenceError, AuthenticationError } from "../errors/errors";
import { isValidId, isEmptyObject, isValidObject,  } from "../util/validator";



export class BookService {
    constructor(private bookRepo: BookRepository) {
        this.bookRepo = bookRepo;
    }

    //getting all books
    async getAllBooks(): Promise<Book[]> {
        let books = await this.bookRepo.getAll();

        if (books.length == 0) {
            throw new ResourceNotFoundError();
        }
        return books
    }

    //getting book by id
    async getBookById(id: number): Promise<Book> {
        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let book = await this.bookRepo.getById(id);

        //ensuring we did not get an empty object
        if(isEmptyObject(book)) {
            throw new ResourceNotFoundError();
        }

        return  book;
    }

    //update an existing book
    async updateCustomer(updatedCustomer: Book): Promise<boolean> {
        
        try {

            if (!isValidObject(updatedCustomer)) {
                throw new BadRequestError('Invalid user provided (invalid values found).');
            }

            return await this.bookRepo.update(updatedCustomer);
        } catch (e) {
            throw e;
        }

    }

    //deleting a book
    async deleteById(id: number): Promise<boolean> {
        
        try {
           
           await this.bookRepo.deleteById(id);
            
        } catch (e) {
            throw e;
        }
        return true;
    }
}