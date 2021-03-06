import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { UserGuard } from '../middleware/auth-middleware';


export const BookRouter = express.Router();

const bookService = AppConfig.bookService;

BookRouter.get('', async (req, resp) => {

    try {
         
        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await bookService.getBookByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
       } else {
            let payload = await bookService.getAllBooks();
            resp.status(200).json(payload);
        }
        
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});

BookRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await bookService.getBookById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});



BookRouter.post('', UserGuard, async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /books');
    console.log(req.body);
    try {
        let newBook = await bookService.addNewBook(req.body);
        return resp.status(201).json(newBook);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

BookRouter.put('/:id', UserGuard, async (req, resp) => {

    console.log('PUT REQUEST RECEIVED AT /books');
    console.log(req.body);
    try {
        let updatedBook = await bookService.updateBook(req.body);
        return resp.status(201).json(updatedBook);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

BookRouter.delete('/:id', UserGuard, async (req, resp) => {
    const id = +req.params.id;
    //console.log(req.params.id);
    try {
        await bookService.deleteBookById(id);
        return resp.status(204).json();
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});
