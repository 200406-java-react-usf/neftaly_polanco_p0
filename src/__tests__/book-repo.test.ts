import { BookRepository } from '../repos/book-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/book-result-set-mapper';
import { Book } from '../models/book';

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
jest.mock('../util/book-result-set-mapper', () => {
    return {
        mapBookResultSet: jest.fn()
    }
});

describe('bookRepo', () => {

    let sut = new BookRepository();
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
                                title: 'Don Quixote',
                                book_price: 100,                                
                            }
                        ]
                    }
                }), 
                release: jest.fn()
            }
        });
        (mockMapper.mapBookResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Books when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockBook = new Book(1, 'myBook', 5);
        (mockMapper.mapBookResultSet as jest.Mock).mockReturnValue(mockBook);

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

    test('should resolve to a Book object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

         let mockBook = new Book(1, 'myBook', 30);
         (mockMapper.mapBookResultSet as jest.Mock).mockReturnValue(mockBook);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Book).toBe(true);

    });

    test('should resolve to a Book object when getBookByUniqueKey retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

         let mockBook = new Book(1, 'myBook', 30);
         (mockMapper.mapBookResultSet as jest.Mock).mockReturnValue(mockBook);

        // Act
        let result = await sut.getBookByUniqueKey('title', 'myBook');

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Book).toBe(true);

    });

    test('should add a new book when save is provided with valid input', async () => {

        // Arrange
        expect.hasAssertions();
    
        let mockBook = new Book(1, 'myBook', 30);
        (mockMapper.mapBookResultSet as jest.Mock).mockReturnValue(mockBook);
    
        // Act
        let result = await sut.save(mockBook);
    
        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Book).toBe(true);
    
    });

    test('should delete a book when deleteById is provided with a book id', async () => {

        // Arrange
        expect.hasAssertions();

        // Act
        let result = await sut.deleteById(1);
    
        // Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);
    
    });

});
