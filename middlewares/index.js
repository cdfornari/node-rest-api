const userValidation  = require('../middlewares/user-validation');
const validateJWT = require('../middlewares/validate-jwt');
const rolesValidations = require('../middlewares/validate-role');
const validarArchivo = require('../middlewares/validar-archivo')

module.exports = {
    ...userValidation,
    ...validateJWT,
    ...rolesValidations,
    ...validarArchivo
}