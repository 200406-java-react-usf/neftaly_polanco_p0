export class Book {
    id: number;
    title: string;
    genres: string;
    authorId: number;
    inStock: number;
    buyers: string;   

    constructor(id: number, title: string, writerId: number, genres: string, status: number, buyers: string, pub: string, pd: Date) {
        this.id = id;
        this.title = title;
        this.authorId = writerId;
        this.genres = genres;
        this.inStock = status;
        this.buyers = readers;        
    }
}