export class Customer {
    id: number;
    firstName: string;
    lastName: string;
	birthdate: Date;
    phone: string;
    email: string;
	address: string;
	city: string;
	state: string;
	zipCode: number;
    booksLog: string;
	

    constructor(id: number, fn: string, ln: string, bd: Date, ph: string, email: string,
	address: string, city: string, state: string, zip: number, bl: string, ) {
        this.id = id;
        this.firstName = fn;
        this.lastName = ln;       
        this.birthdate = bd;
        this.phone = ph;
        this.email = email;
		this.address = address;
		this.city = city;
		this.state = state;
        this.zipCode = zip;
        this.booksLog = bl;
    }
}