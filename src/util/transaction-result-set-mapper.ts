import { Transaction } from "../models/transaction";
import { TransactionSchema } from "./schemas";

export function mapTransactionResultSet(resultSet: TransactionSchema): Transaction {

    if(!resultSet) {
        return {} as Transaction;
    }

    return new Transaction(
        resultSet.id,
        resultSet.username,
        resultSet.total,
        resultSet.date,
        
    );
}
