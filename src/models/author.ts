export class Author {
    id: number;
    firstName: string;
    lastName: string;
    booksWritten: string;

    constructor(id: number, fn: string, ln: string, email: string, bw: string) {
        this.id = id;
        this.firstName = fn;
        this.lastName = ln;
        this.booksWritten = bw;
    }
}