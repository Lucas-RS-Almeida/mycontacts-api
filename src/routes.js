const { Router } = require('express');

const AuthController = require('./app/controllers/AuthController');
const UserController = require('./app/controllers/UserController');
const CategoryController = require('./app/controllers/CategoryController');
const ContactController = require('./app/controllers/ContactController');

const auth = require('./middlewares/auth');
const isAdmin = require('./middlewares/isAdmin');

const routes = Router();

// Routes to authenticate
routes.post('/auth/sign-up', AuthController.signUp);
routes.post('/auth/log-in', AuthController.logIn);

// Routes to user
routes.put('/users/change-email/:id', auth, UserController.changeEmail);
routes.put('/users/change-password/:id', auth, UserController.changePassword);
routes.post('/users/forgot-password', UserController.forgotPassword);
routes.post('/users/reset-password', UserController.resetPassword);
routes.delete('/users/:id', auth, UserController.delete);

// Routes to category
routes.post('/categories', auth, isAdmin, CategoryController.store);
routes.get('/categories', auth, isAdmin, CategoryController.index);
routes.get('/categories/:id', auth, isAdmin, CategoryController.show);
routes.put('/categories/:id', auth, isAdmin, CategoryController.update);
routes.delete('/categories/:id', auth, isAdmin, CategoryController.delete);

// Routes to contacts
routes.get('/contacts', auth, ContactController.index);
routes.get('/contacts/:id', auth, ContactController.show);
routes.put('/contacts/:id', auth, ContactController.update);
routes.post('/contacts', auth, ContactController.store);
routes.delete('/contacts/:id', auth, ContactController.delete);

module.exports = routes;
