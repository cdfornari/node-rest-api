const { request, response } = require("express")


const validateAdminRole = (req=request,res=response,next)=>{

    if(!req.authUser){
        return res.status(500).json({
            msg: 'Falló validación del token'
        })
    }

    const {role} = req.authUser;
    
    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: 'Debes ser administrador para ejecutar esta acción'
        })
    }

    next();
}

const validateRole = (...roles) => {
    return (req=request,res=response,next)=>{

        if(!req.authUser){
            return res.status(500).json({
                msg: 'Falló validación del token'
            })
        }

        const {role} = req.authUser;
    
        if(!roles.includes(role)){
            return res.status(401).json({
                msg: 'No tienes permiso para realizar esta acción'
            })
        }

        next();
    }
}

module.exports = {
    validateAdminRole,
    validateRole
}