export class Transaction {
    id: number;
    username: string;
    total: number;
	date: Date;
    ;
	

    constructor(id: number, un: string, total: number, td: Date, ) {
        this.id = id;
        this.username = un;
        this.total = total;       
        this.date = td;
        
    }
}