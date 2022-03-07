const { Router } = require('express');
const { check } = require('express-validator');

const { validateInput,validateJWT,validateRole } = require('../middlewares');
const { getProductos,getProducto, crearProducto, updateProducto, deleteProducto } = require('../controllers/productos');
const { productoIdExists, categoriaIdExists } = require('../helpers/db-validators');

const router = Router();

router.get('/',getProductos);

router.get('/:id',[
    check('id').isMongoId(),
    check('id').custom(productoIdExists),
    validateInput
],getProducto);

router.post('/',[
   validateJWT,
   check('name').not().isEmpty(),
   check('categoria','Código de categoría inválido').isMongoId(),
   check('categoria').custom(categoriaIdExists),
   validateInput 
],crearProducto);

router.put('/:id',[
    validateJWT,
    check('id').isMongoId(),
    check('id').custom(productoIdExists),
    check('name').not().isEmpty(),
    check('categoria','Código de categoría inválido').isMongoId(),
    check('categoria').custom(categoriaIdExists),
    validateInput 
],updateProducto);

router.delete('/:id',[
    validateJWT,
    validateRole('ADMIN_ROLE'),
    check('id').isMongoId(),
    check('id').custom(productoIdExists),
    validateInput 
],deleteProducto);

module.exports = router;