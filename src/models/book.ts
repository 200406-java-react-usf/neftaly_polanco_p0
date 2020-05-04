export class Book {
    id: number;
    title: string;    
    stock: number;
    price: number;
    genres: string;
    authors: string[];
    buyers: string    
    transactionId: number;

    constructor(id: number, title: string, amount: number, price: number, genres: string, writers: string[], buyers: string, tid: number) {
        this.id = id;
        this.title = title;
        this.stock = amount; 
        this.price = price;   
        this.genres = genres;
        this.authors = writers;
        this.buyers = buyers;
        this.transactionId = tid;
   
    }
}