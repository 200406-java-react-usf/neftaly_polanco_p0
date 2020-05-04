export class Author {
    id: number;
    firstName: string;
    lastName: string;
    penName: string;
    booksWritten: string[];

    constructor(id: number, fn: string, ln: string, pn: string, bw: string[]) {
        this.id = id;
        this.firstName = fn;
        this.lastName = ln;
        this.penName = pn;
        this.booksWritten = bw;
    }
}