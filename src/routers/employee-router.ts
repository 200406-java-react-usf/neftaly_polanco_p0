import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const EmployeeRouter = express.Router();

const empService = AppConfig.empService;

EmployeeRouter.get('', adminGuard, async (req, resp) => {

    try {

        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await empService.getEmployeeByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await empService.getAllEmployees();
            resp.status(200).json(payload);
        }

    } catch (e) {
        resp.status(e.statusCode).json(e);
    }

});

EmployeeRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await empService.getEmployeeById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

EmployeeRouter.post('', async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /employees');
    console.log(req.body);
    try {
        let newEmp = await empService.addNewEmployee(req.body);
        return resp.status(201).json(newEmp);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});
