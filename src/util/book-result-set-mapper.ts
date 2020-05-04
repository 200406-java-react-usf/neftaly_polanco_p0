import { BookSchema } from "./schemas";
import { Book } from "../models/book";


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

