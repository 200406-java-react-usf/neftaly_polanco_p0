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
        //adding new author
        async addNewAuthor(newAuthor: Author): Promise<Author> {
        
            try {
    
                //making sure newAuthor object is valid
                if (!isValidObject(newAuthor, 'id')) {
                    throw new BadRequestError('Invalid property values found in provided author.');
                }
                
                const persistedAuthor = await this.authorRepo.save(newAuthor);
    
                return persistedAuthor;
    
            } catch (e) {
                throw e
            }
    
        }

    //update an existing author
    async updateAuthor(updatedAuthor: Author): Promise<boolean> {
        
        try {

            if (!isValidObject(updatedAuthor)) {
                throw new BadRequestError('Invalid user provided (invalid values found).');
            }

            return await this.authorRepo.update(updatedAuthor);
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