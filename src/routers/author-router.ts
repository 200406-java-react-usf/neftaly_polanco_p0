import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const AuthorRouter = express.Router();

const authorService = AppConfig.authorService;

AuthorRouter.get('', async (req, resp) => {

    try {

        let reqURL = url.parse(req.url, true);
            let payload = await authorService.getAllAuthors();
            resp.status(200).json(payload);       
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }

});

AuthorRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await authorService.getAuthorById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

AuthorRouter.post('', async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /author');
    console.log(req.body);
    try {
        let newAuthor = await authorService.addNewAuthor(req.body);
        return resp.status(201).json(newAuthor);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});
