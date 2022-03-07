const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const {User} = require('../models');

const validateJWT = async(req=request, res=response,next)=> {

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token'
        })
    }

    try {

        const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);

        const authUser = await User.findById(uid); 
        req.authUser = authUser; //accessed in req controller and other middlewares

        if(!authUser){
            return res.status(401).json({
                msg: 'Token no válido'
            })
        }

        if (!authUser.status){
            return res.status(401).json({
                msg: 'Token no válido'
            })
        }

        next();
        
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}

module.exports = {
    validateJWT
}