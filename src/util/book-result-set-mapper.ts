import { BookSchema } from "./schemas";
import { Book } from "../models/book";


export function mapBookResultSet(resultSet: BookSchema): Book {
    
    if (!resultSet) {
        return {} as Book;
    }

    return new Book(
        resultSet.id,
        resultSet.title,   
        resultSet.book_price,         
    );
}

