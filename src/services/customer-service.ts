import { Customer } from "../models/customer";
import { CustomerRepository } from "../repos/customer-repo";
import { ResourceNotFoundError, BadRequestError, ResourcePersistenceError, AuthenticationError } from "../errors/errors";
import { isValidId, isEmptyObject, isPropertyOf, isValidObject, isValidStrings } from "../util/validator";



export class CustomerService {
    constructor(private customerRepo: CustomerRepository) {
        this.customerRepo = customerRepo;
    }

    //getting all customers
    async getAllCustomers(): Promise<Customer[]> {
        let customers = await this.customerRepo.getAll();

        if (customers.length == 0) {
            throw new ResourceNotFoundError();
        }
        return customers;
    }

    //getting customer by id
    async getCustomerById(id: number): Promise<Customer> {
        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let customer = await this.customerRepo.getById(id);

        //ensuring we did not get an customerty object
        if(isEmptyObject(customer)) {
            throw new ResourceNotFoundError();
        }

        return  customer;
    }
       
    //adding new customer
    async addNewCustomer(newCustomer: Customer): Promise<Customer> {
        
        try {

            //making sure newCustomer object is valid
            if (!isValidObject(newCustomer, 'id')) {
                throw new BadRequestError('Invalid property values found in provided customer.');
            }
            
            // checking that username is available
            let phoneAvailable = await this.isPhoneAvailable(newCustomer.phone);

            if (!phoneAvailable) {
                throw new ResourcePersistenceError('The provided username is already taken.');
            }

            //checking that email is available        
            let emailAvailable = await this.isEmailAvailable(newCustomer.email);
    
            if (!emailAvailable) {
                throw new  ResourcePersistenceError('The provided email is already taken.');
            }
            
            const persistedCustomer = await this.customerRepo.save(newCustomer);

            return persistedCustomer;

        } catch (e) {
            throw e
        }

    }

    //getting customer by unique keys
    async getCustomerByUniqueKey(queryObj: any): Promise<Customer> {

        try {
            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, Customer))) {
                throw new BadRequestError();
            }

            //searching by only one key (at least for now)
            let key = queryKeys[0];
            let val = queryObj[key];

            //reuse getById logic if given key is id
            if (key === 'id') {
                return await this.getCustomerById(+val);
            }

            // throw error if key is value is not valid
            if(!isValidId(val)) {
                throw new BadRequestError();
            }

            let customer = await this.customerRepo.getCustomerByUniqueKey(key, val);
            
            if(isEmptyObject(customer)) {
                throw new ResourceNotFoundError();
            }

            return customer;

        } catch (e) {
        throw e;
        }
    }

    private async isEmailAvailable(email: string): Promise<boolean> {
        
        try {
            await this.getCustomerByUniqueKey({'email': email});
        } catch (e) {
            console.log('email is available')
            return true;
        }

        console.log('email is unavailable')
        return false;
    }

    private async isPhoneAvailable(phone: string): Promise<boolean> {
        
        try {
            await this.getCustomerByUniqueKey({'phone': phone});
        } catch (e) {
            console.log('phone is available')
            return true;
        }

        console.log('phone is unavailable')
        return false;
    }

    //update an existing customer
    async updateCustomer(updatedCustomer: Customer): Promise<boolean> {
        
        try {

            if (!isValidObject(updatedCustomer)) {
                throw new BadRequestError('Invalid user provided (invalid values found).');
            }

            return await this.customerRepo.update(updatedCustomer);
        } catch (e) {
            throw e;
        }

    }

    //deleting an customer
    async deleteById(id: number): Promise<boolean> {
        
        try {
           
           await this.customerRepo.deleteById(id);
            
        } catch (e) {
            throw e;
        }
        return true;
    }

}