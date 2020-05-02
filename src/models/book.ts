export class Book {
    id: number;
    title: string;
    genres: string;
    authorId: number;
    inStock: number;
    readers: string;
    publisher: string;
    pubDate: Date;    

    constructor(id: number, title: string, writerId: number, genres: string, status: number, readers: string, pub: string, pd: Date) {
        this.id = id;
        this.title = title;
        this.authorId = writerId;
        this.genres = genres;
        this.inStock = status;
        this.readers = readers;
        this.publisher = pub;
        this.pubDate = pd;
    }
}