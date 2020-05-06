import { Transaction } from "../models/transaction";
import { TransactionRepository } from "../repos/transaction-repo";
import { ResourceNotFoundError, BadRequestError, ResourcePersistenceError, AuthenticationError } from "../errors/errors";
import { isValidId, isEmptyObject, isPropertyOf, isValidObject, isValidStrings } from "../util/validator";



export class TransactionService {
    constructor(private transactionRepo: TransactionRepository) {
        this.transactionRepo = transactionRepo;
    }

    //getting all transactions
    async getAllTransactions(): Promise<Transaction[]> {
        let transactions = await this.transactionRepo.getAll();

        if (transactions.length == 0) {
            throw new ResourceNotFoundError();
        }
        return transactions;
    }

    //getting transaction by id
    async getTransactionById(id: number): Promise<Transaction> {
        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let transaction = await this.transactionRepo.getById(id);

        //ensuring we did not get an transactionty object
        if(isEmptyObject(transaction)) {
            throw new ResourceNotFoundError();
        }

        return transaction;
    }
       
    //adding new transaction
    async addNewTransaction(newTransaction: Transaction): Promise<Transaction> {
        
        try {

            //making sure newTransaction object is valid
            if (!isValidObject(newTransaction, 'id')) {
                throw new BadRequestError('Invalid property values found in provided transaction.');
            }
                     
            const persistedTransaction = await this.transactionRepo.save(newTransaction);

            return persistedTransaction;

        } catch (e) {
            throw e
        }

    }

    //getting transaction by unique keys
    async getTransactionByUniqueKey(queryObj: any): Promise<Transaction> {

        try {
            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, Transaction))) {
                throw new BadRequestError();
            }

            //searching by only one key (at least for now)
            let key = queryKeys[0];
            let val = queryObj[key];

            //reuse getById logic if given key is id
            if (key === 'id') {
                return await this.getTransactionById(+val);
            }

            // throw error if key is value is not valid
            if(!isValidId(val)) {
                throw new BadRequestError();
            }

            let transaction = await this.transactionRepo.getTransactionByUniqueKey(key, val);
            
            if(isEmptyObject(transaction)) {
                throw new ResourceNotFoundError();
            }

            return transaction;

        } catch (e) {
        throw e;
        }
    }

    

    //update an existing transaction
    async updateTransaction(updatedTransaction: Transaction): Promise<boolean> {
        
        try {

            if (!isValidObject(updatedTransaction)) {
                throw new BadRequestError('Invalid user provided (invalid values found).');
            }

            return await this.transactionRepo.update(updatedTransaction);
        } catch (e) {
            throw e;
        }

    }

    //deleting an transaction
    async deleteTransactionById(id: number): Promise<boolean> {
        
        try {
           
           await this.transactionRepo.deleteById(id);
            
        } catch (e) {
            throw e;
        }
        return true;
    }

}