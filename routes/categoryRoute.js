import express from 'express';
import CategoryController from '../controllers/categoryController.js';

const categoryRoute = express.Router();

categoryRoute.get('/', CategoryController.index);
categoryRoute.get('/:id', CategoryController.getOneCategory);
categoryRoute.post('/', CategoryController.createCategory);
categoryRoute.put('/', CategoryController.updateCategory);
categoryRoute.delete('/:id', CategoryController.deleteCategory);

export default categoryRoute;