export class Employee {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    birthdate: Date;
    hireDate: Date;
    phone: string;
    email: string;
    role: string;
    
    constructor(id: number, un: string, pw: string, fn: string, ln: string, bd: Date, hd: Date, phone: string, email: string, role: string) {
        this.id = id;
        this.username = un;
        this.password = pw;
        this.firstName = fn;
        this.lastName = ln;
        this.birthdate = bd;
        this.hireDate = hd;
        this.phone = phone;
        this.email = email;
        this.role = role;
    }
}