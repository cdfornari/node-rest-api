const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, verifyJwt } = require('../controllers/auth');
const { validateInput } = require('../middlewares');

const router = Router();

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateInput
],login);

router.post('/google',[
    check('id_token', 'El token de Google es obligatorio').not().isEmpty(),
    validateInput
],googleSignIn);

router.post('/verify',verifyJwt)


module.exports = router;