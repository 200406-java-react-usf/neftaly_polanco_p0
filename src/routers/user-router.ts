import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard, UserGuard } from '../middleware/auth-middleware';

export const UserRouter = express.Router();

const userService = AppConfig.userService;

UserRouter.get('', UserGuard, async (req, resp) => {

    try {
        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await userService.getUserByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await userService.getAllUsers();
            resp.status(200).json(payload);
        }

    } catch (e) {
        resp.status(e.statusCode).json(e);
    }

});

UserRouter.get('/:id', UserGuard, async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await userService.getUserById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

UserRouter.post('', adminGuard, async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let newUser = await userService.addNewUser(req.body);
        return resp.status(201).json(newUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

UserRouter.delete('/:id', adminGuard, async (req, resp) => {
    const id = +req.params.id;
    try {
        let deleteUser = await userService.deleteUserById(id);
        return resp.status(200).send(deleteUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

UserRouter.put('/:id', adminGuard, async (req, resp) => {

    console.log('PUT REQUEST RECEIVED AT /books');
    console.log(req.body);
    try {
        let updatedUser = await userService.updateUser(req.body);
        return resp.status(201).json(updatedUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});
