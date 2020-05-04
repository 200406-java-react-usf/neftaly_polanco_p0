import { Author } from "../models/author";
import { AuthorRepository } from "../repos/author-repo";
import { ResourceNotFoundError, BadRequestError, ResourcePersistenceError, AuthenticationError } from "../errors/errors";
import { isValidId, isEmptyObject, isValidObject,  } from "../util/validator";



export class AuthorService {
    constructor(private authorRepo: AuthorRepository) {
        this.authorRepo = authorRepo;
    }

    //getting all authors
    async getAllAuthors(): Promise<Author[]> {
        let authors = await this.authorRepo.getAll();

        if (authors.length == 0) {
            throw new ResourceNotFoundError();
        }
        return authors
    }

    //getting author by id
    async getAuthorById(id: number): Promise<Author> {
        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let author = await this.authorRepo.getById(id);

        //ensuring we did not get an empty object
        if(isEmptyObject(author)) {
            throw new ResourceNotFoundError();
        }

        return  author;
    }

    //update an existing author
    async updateCustomer(updatedCustomer: Author): Promise<boolean> {
        
        try {

            if (!isValidObject(updatedCustomer)) {
                throw new BadRequestError('Invalid user provided (invalid values found).');
            }

            return await this.authorRepo.update(updatedCustomer);
        } catch (e) {
            throw e;
        }

    }

    //deleting an author
    async deleteById(id: number): Promise<boolean> {
        
        try {
           
           await this.authorRepo.deleteById(id);
            
        } catch (e) {
            throw e;
        }
        return true;
    }
}