const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;

const {User,Categoria,Producto} = require('../models')

const coleccionesPermitidas = [
    'users',
    'categorias',
    'productos',
    'roles'
]

const searchUsers = async(termino='',res=response)=>{

    if (ObjectId.isValid(termino)){
        const user = await User.findById(termino);
        return res.json({
            results: (user) ? [user] : []
        })
    }

    const regexp = new RegExp(termino,'i')

    const count = await User.count({
        $or: [{name: regexp},{email: regexp}],
        $and: [{status: true}]
    })

    const users = await User.find({
        $or: [{name: regexp},{email: regexp}],
        $and: [{status: true}]
    })

    return res.json({
        count,
        results: users
    })
}

const searchCategorias = async(termino='',res=response)=>{

    if(ObjectId.isValid(termino)){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regexp = new RegExp(termino,'i')

    const count = await Categoria.count({status: true,name: regexp})

    const categorias = await Categoria.find({status: true,name: regexp})

    return res.json({
        count,
        results: categorias
    })
}

const searchProductos = async(termino='',res=response)=>{

    if(ObjectId.isValid(termino)){
        const producto = await Producto.findById(termino).populate('categoria','name');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    if (termino.startsWith('ByCAT')){

        const categoria = ObjectId(termino.substring(5,termino.length))
        console.log(categoria)

        const count = await Producto.count({status: true,categoria})
    
        const productos = await Producto.find({status: true,categoria}).populate('categoria','name')

        return res.json({
            count,
            results: productos
        })
    }

    if (termino[0] === '$'){

        precio = termino.substring(1,termino.length)

        const count = await Producto.count({status: true,precio})
    
        const productos = await Producto.find({status: true,precio}).populate('categoria','name')

        return res.json({
            count,
            results: productos
        })
    }

    const regexp = new RegExp(termino,'i')

    const count = await Producto.count({
        $or: [{name: regexp},{descripcion: regexp}],
        $and: [{status: true}]
    })

    const productos = await Producto.find({
        $or: [{name: regexp},{descripcion: regexp}],
        $and: [{status: true}]
    })

    return res.json({
        count,
        results: productos
    })
}


const search = (req=request,res=response)=>{

    const {coleccion,termino} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)){
        res.status(400).json({
            msg: `La colección ${coleccion} no existe`
        })
    }

    switch (coleccion) {
        case 'users':
            searchUsers(termino,res)
        break;

        case 'categorias':
            searchCategorias(termino,res)
        break;

        case 'productos':
            searchProductos(termino,res)
        break;

        default:
            res.status(500).json({
                msg: 'Error en controlador de la búsqueda'
            })
    }
}

module.exports = {
    search
}