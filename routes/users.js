const { Router } = require('express');
const { check } = require('express-validator');

const { validRole, emailExists, userIdExists } = require('../helpers/db-validators');

const {
    validateInput,
    validateJWT,
    validateAdminRole,
    validateRole
} = require('../middlewares')

const { userGet,
        userPost,
        userPut,
        userDelete,
        userPatch 
} = require('../controllers/users');



const router = Router();

router.get('/', userGet)

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener mínimo 6 caracteres').isLength({min: 6}),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(emailExists),
    //check('role', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('role').custom(validRole), //= (role) => validRole(role)
    validateInput
], userPost)

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userIdExists),
    check('role').custom(validRole),
    validateInput
], userPut)

router.delete('/:id', [
    validateJWT,
    //validateAdminRole,
    validateRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userIdExists),
    validateInput
],
userDelete)

router.patch('/', userPatch)


module.exports = router;