import { Router } from 'express';
import CustomerController from './app/controllers/CustomerController';
import SessionController from './app/controllers/SessionController';
import middlewares from './app/middlewares/auth';
import multer from 'multer';
import multerConfig from './config/multer';
import FileController from './app/controllers/FileController';
const routes = new Router();


routes.post('/customers', CustomerController.store);
routes.post('/sessions', SessionController.store);
routes.use(middlewares);
const upload = multer(multerConfig);
routes.put('/update', CustomerController.update);
routes.post('/files', upload.single('file'), FileController.store);
export default routes;




















