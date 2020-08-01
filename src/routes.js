import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import ProviderController from './app/controllers/ProviderController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';
import Signature from './app/asaas/Signature';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/user', UserController.store);
routes.post('/verification', UserController.verification);
routes.post('/resendSecretTokenEmail', UserController.resendSecretTokenEmail);

routes.post('/sessions', SessionController.store);

routes.put('/updateStatus', UserController.updateStatus);

routes.use(authMiddleware);

routes.put('/user', UserController.update);
routes.get('/user', UserController.getUser);

routes.post('/files', upload.single('file'), FileController.store);

// routes.post('/appointments', AppointmentController.store);
// routes.get('/appointments', AppointmentController.index);
// routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/Available', AvailableController.index);

// routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

// routes.post('/signature', Signature.createSignature);


export default routes;
