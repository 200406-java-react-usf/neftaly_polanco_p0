import express from 'express';
import AppConfig from '../config/app';
import { Principal } from '../dtos/principal';

export const AuthRouter = express.Router();

const empService = AppConfig.empService;

AuthRouter.get('', (req, resp) => {
    delete req.session.principal;
    resp.status(204);
});

AuthRouter.post('', async (req, resp) => {

    try {

        const { username, password } = req.body;
        let authEmp = await empService.authenticateEmp(username, password);
        let payload = new Principal(authEmp.id, authEmp.username, authEmp.role);
        req.session.principal = payload;
        resp.status(200).json(payload);
        
    } catch (e) {
        resp.status(e.statusCode || 500).json(e);
    }

    resp.send();

});