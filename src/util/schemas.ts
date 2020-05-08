export interface UserSchema {
    id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    phone: string,
    email: string,
    role_name: string
}

export interface BookSchema {
    id: number;
    title: string;    
    book_price: number;
}

// export interface AuthorSchema {
//     id: number,
//     first_name: string,
//     last_name: string,
//     pen_name: string,
//     bookswritten: string[]
// }

export interface TransactionSchema {
    id: number;
    username: string;
    total: number;
	date: Date;    
}