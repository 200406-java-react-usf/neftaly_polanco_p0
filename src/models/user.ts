export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    role_name: string;
    
    constructor(id: number, un: string, pw: string, fn: string, ln: string, phone: string, email: string, role: string) {
        this.id = id;
        this.username = un;
        this.password = pw;
        this.firstName = fn;
        this.lastName = ln;
        this.phone = phone;
        this.email = email;
        this.role_name = role;
    }
}