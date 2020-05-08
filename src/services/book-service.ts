import { Book } from "../models/book";
import { BookRepository } from "../repos/book-repo";
import { ResourceNotFoundError, BadRequestError, ResourcePersistenceError, AuthenticationError } from "../errors/errors";
import { isValidId, isEmptyObject, isValidObject, isPropertyOf } from "../util/validator";



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

        //ensuring we did not get an bookty object
        if(isEmptyObject(book)) {
            throw new ResourceNotFoundError();
        }

        return  book;
    }

        //adding new book
        async addNewBook(newBook: Book): Promise<Book> {
        
            try {
    
                //making sure newBook object is valid
                if (!isValidObject(newBook, 'id')) {
                    throw new BadRequestError('Invalid property values found in provided book.');
                }                
               
                const persistedBook = await this.bookRepo.save(newBook);
    
                return persistedBook;
    
            } catch (e) {
                throw e
            }
    
        }
        //getting book by unique keys
    async getBookByUniqueKey(queryObj: any): Promise<Book> {

        try {
            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, Book))) {
                throw new BadRequestError();
            }

            //searching by only one key (at least for now)
            let key = queryKeys[0];
            let val = queryObj[key];

            //reuse getById logic if given key is id
            if (key === 'id') {
                return await this.getBookById(+val);
            }

            // throw error if key is value is not valid
            if(!isValidId(val)) {
                throw new BadRequestError();
            }

            let book = await this.bookRepo.getBookByUniqueKey(key, val);
            
            if(isEmptyObject(book)) {
                throw new ResourceNotFoundError();
            }

            return book;

        } catch (e) {
        throw e;
        }
    }
        
    //update an existing book
    async updateBook(updatedBook: Book): Promise<boolean> {
        
        try {

            if (!isValidObject(updatedBook)) {
                throw new BadRequestError('Invalid user provided (invalid values found).');
            }

            return await this.bookRepo.update(updatedBook);
        } catch (e) {
            throw e;
        }

    }

    //deleting a book
    async deleteBookById(id: number): Promise<boolean> {
        
            let user = await this.bookRepo.getById(id)
                       
          let isDeleted = await this.bookRepo.deleteById(user.id);
          return isDeleted;
            
      
        
    }
}