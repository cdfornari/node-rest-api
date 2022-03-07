const {Role,User, Categoria, Producto} = require('../models');

const validRole = async (role='') =>{
    const RoleExists = await Role.findOne({role})
    if (!RoleExists){
        throw new Error(`El rol ${role} no es válido`);
    }
}

const emailExists = async (email='')=>{
    const emailExists = await User.findOne({email});
    if (emailExists){
        throw new Error(`el email ${email} ya está en uso`)
    }
}

const userIdExists = async (id)=>{
    const userExists = await User.findById(id);
    if (!userExists){
        throw new Error(`El ID del usuario no existe`)
    }
}

const categoriaIdExists = async(id)=>{
    const categoriaExists = await Categoria.findById(id);
    if(!categoriaExists){
        throw new Error('EL ID de la categoría no existe')
    }
}

const productoIdExists = async(id)=>{
    const productoExists = await Producto.findById(id);
    if(!productoExists){
        throw new Error('EL ID del producto no existe')
    }
}

const coleccionPermitida = (coleccion='',coleccionesPermitidas=[]) =>{

    if (!coleccionesPermitidas.includes(coleccion)){
        throw new Error(`La colección ${coleccion} no está permitida`)
    }
    return true;
}

module.exports = {
    validRole,
    emailExists,
    userIdExists,
    categoriaIdExists,
    productoIdExists,
    coleccionPermitida
}