export class Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    booksLog: string;
	birthdate: Date;
	address: string;
	city: string;
	state: string;
	zipCode: number;
	

    constructor(id: number, fn: string, ln: string, email: string, bl: string, bd: Date, 
	address: string, city: string, state: string, zip: number) {
        this.id = id;
        this.firstName = fn;
        this.lastName = ln;
        this.email = email;
        this.booksLog = bl;
		this.birthdate = bd;
		this.address = address;
		this.city = city;
		this.state = state;
		this.zipCode = zip;
    }
}