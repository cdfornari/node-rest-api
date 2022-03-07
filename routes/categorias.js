const { Router } = require('express');
const { check } = require('express-validator');

const { validateInput,validateJWT,validateRole } = require('../middlewares');
const { crearCategoria,updateCategoria, deleteCategoria, getCategoria, getCategorias } = require('../controllers/categorias');
const { categoriaIdExists } = require('../helpers/db-validators');

const router = Router();
//obtener todas
router.get('/',getCategorias)
//obtener una 
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoriaIdExists),
    validateInput
],
getCategoria)
//crear - priv
router.post('/',[
    validateJWT,
    check('name','El nombre es obligatorio').not().isEmpty(),
    validateInput
],crearCategoria)
//modificar - priv
router.put('/:id',[
    validateJWT,
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoriaIdExists),
    validateInput
],
updateCategoria)
//borrar - admin priv
router.delete('/:id',[
    validateJWT,
    validateRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoriaIdExists),
    validateInput,
],
deleteCategoria)

module.exports = router;