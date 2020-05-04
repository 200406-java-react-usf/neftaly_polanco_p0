import { Customer } from "../models/customer";
import { CustomerSchema } from "./schemas";

export function mapCustomerResultSet(resultSet: CustomerSchema): Customer {

    if(!resultSet) {
        return {} as Customer;
    }

    return new Customer(
        resultSet.id,
        resultSet.firstName,
        resultSet.lastName,
        resultSet.birthdate,
        resultSet.phone,
        resultSet.email,
        resultSet.address,
        resultSet.city,
        resultSet.state,
        resultSet.zipCode,
        resultSet.booksLog
    );
}
