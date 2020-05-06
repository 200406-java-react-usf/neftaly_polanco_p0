import { TransactionRepository } from '../repos/transaction-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/transaction-result-set-mapper';
import { Transaction } from '../models/transaction';

/*
    We need to mock the connectionPool exported from the main module
    of our application. At this time, we only use one exposed method
    of the pg Pool API: connect. So we will provide a mock function 
    in its place so that we can mock it in our tests.
*/
jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

// The result-set-mapper module also needs to be mocked
jest.mock('../util/transaction-result-set-mapper', () => {
    return {
        mapTransactionResultSet: jest.fn()
    }
});

describe('transactionRepo', () => {

    let sut = new TransactionRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        /*
            We can provide a successful retrieval as the default mock implementation
            since it is very verbose. We can provide alternative implementations for
            the query and release methods in specific tests if needed.
        */
        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                id: 1,
                                username: 'mario',
                                total: 20,
                                date: new Date(),
                               
                            }
                        ]
                    }
                }), 
                release: jest.fn()
            }
        });
        (mockMapper.mapTransactionResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Transactions when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockTransaction = new Transaction(1, 'marvin', 30, new Date());
        (mockMapper.mapTransactionResultSet as jest.Mock).mockReturnValue(mockTransaction);

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAll retrieves no records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
                release: jest.fn()
            }
        });

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to a Transaction object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockTransaction = new Transaction(1, 'Carol', 3, new Date());
        (mockMapper.mapTransactionResultSet as jest.Mock).mockReturnValue(mockTransaction);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Transaction).toBe(true);

    });

    test('should resolve to a Transaction object when getTransactionByUniqueKey retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockTransaction = new Transaction(1, 'myTransaction', 30, new Date());
         (mockMapper.mapTransactionResultSet as jest.Mock).mockReturnValue(mockTransaction);

        // Act
        let result = await sut.getTransactionByUniqueKey('date', 'mydate');

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Transaction).toBe(true);

    });

    test('should add a new transaction when save is provided with valid input', async () => {

        // Arrange
        expect.hasAssertions();
    
        let mockTransaction = new Transaction(1, 'myTransaction', 30, new Date());
        (mockMapper.mapTransactionResultSet as jest.Mock).mockReturnValue(mockTransaction);
    
        // Act
        let result = await sut.save(mockTransaction);
    
        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Transaction).toBe(true);
    
    });

    test('should delete a transaction when deleteById is provided with a transaction id', async () => {

        // Arrange
        expect.hasAssertions();

        // Act
        let result = await sut.deleteById(1);
    
        // Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);
    
    });


});
