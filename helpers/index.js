const dbValidators = require('./db-validators');
const genJWT = require('./gen-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

module.exports = {
    ...dbValidators,
    ...genJWT,
    ...googleVerify,
    ...subirArchivo
}