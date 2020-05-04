import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const CustomerRouter = express.Router();

const customerService = AppConfig.customerService;

CustomerRouter.get('', adminGuard, async (req, resp) => {

    try {

        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await customerService.getCustomerByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await customerService.getAllCustomers();
            resp.status(200).json(payload);
        }

    } catch (e) {
        resp.status(e.statusCode).json(e);
    }

});

CustomerRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await customerService.getCustomerById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

CustomerRouter.post('', async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /customers');
    console.log(req.body);
    try {
        let newCustomer = await customerService.addNewCustomer(req.body);
        return resp.status(201).json(newCustomer);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});
