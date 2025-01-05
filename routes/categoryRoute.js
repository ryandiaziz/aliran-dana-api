import express from 'express';
import CategoryController from '../controllers/categoryController.js';
import authJWTMiddleware from '../middlewares/authMiddleware.js';

const categoryRoute = express.Router();

categoryRoute.get('/', authJWTMiddleware, CategoryController.index);
categoryRoute.get('/:id', authJWTMiddleware, CategoryController.getOneCategory);
categoryRoute.post('/', authJWTMiddleware, CategoryController.createCategory);
categoryRoute.put('/', authJWTMiddleware, CategoryController.updateCategory);
categoryRoute.delete('/:id', authJWTMiddleware, CategoryController.deleteCategory);

export default categoryRoute;