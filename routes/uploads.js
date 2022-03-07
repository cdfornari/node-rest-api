const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivo, updateImg, getImg, updateImgCloudinary} = require('../controllers/uploads');
const { coleccionPermitida } = require('../helpers');
const { validateInput, validarArchivo } = require('../middlewares');

const router = Router();

router.post('/', validarArchivo, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id','ID incorrecto').isMongoId(),
    check('coleccion').custom( c => coleccionPermitida(c,['users','productos'])),
    validateInput
], updateImgCloudinary)

router.get('/:coleccion/:id',[
    check('id','ID incorrecto').isMongoId(),
    check('coleccion').custom( c => coleccionPermitida(c,['users','productos'])),
    validateInput
],getImg)
module.exports = router;