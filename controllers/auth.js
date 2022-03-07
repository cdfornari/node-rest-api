const { request, response } = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {User} = require('../models');
const { genJWT } = require("../helpers/gen-jwt");
const { googleVerify } = require("../helpers/google-verify");



const login = async(req=request,res=response) =>{

    const {email,password} = req.body;

    try {

        const user = await User.findOne({email});
        if (!user || user.status === false){
            return res.status(400).json({
                msg: 'No existe usuario con ese correo'
            })
        }

        const validPassword = bcrypt.compareSync(password,user.password);
        if (!validPassword){
            return res.status(400).json({
                msg: 'Contraseña inválida'
            })
        }

        const token = await genJWT(user.id);

        res.json({
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salió mal'
        })
    }

}

const verifyJwt = async(req=request,res=response)=>{

    const {token} = req.body;

    if(!token){
        return res.status(401).json({
            msg: 'No hay token'
        })
    }

    try {

        const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);

        const authUser = await User.findById(uid); 

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

        res.json({
            authUser
        })
        
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

const googleSignIn = async(req=request,res=response)=>{

    const {id_token} = req.body;
    
    try {

        const {name,email,img} = await googleVerify(id_token);

        let user = await User.findOne({email});

        if (!user){
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true
            }

            user = new User(data);
            await user.save();
        }

        if (!user.status){
            return res.status(401).json({
                msg: 'Usuario bloqueado'
            })
        }

        const token = await genJWT(user.id);

        res.json({
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'El token  de Google no es válido'
        })
    }

    
}

module.exports = {
    login,
    verifyJwt,
    googleSignIn
}