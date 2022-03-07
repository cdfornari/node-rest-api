const { request, response } = require("express");
const { Categoria } = require('../models');


const getCategorias = async(req=request,res=response)=>{

    const {limit=5,from=0} = req.query;

    const [categoriasCount,categorias] = await Promise.all([
        Categoria.countDocuments({status: true}),
        Categoria.find({status:true})
                .skip(Number(from))
                .limit(Number(limit))
                .populate('user')
    ])

    res.json(
        {
            categoriasCount,
            categorias
        }
    )
}

const getCategoria = async(req=request,res=response)=>{
    
    const id = req.params.id;

    const categoria = await Categoria.findById(id).populate('user')

    res.json(categoria)
}


const crearCategoria = async(req=request,res=response) =>{

    const name = req.body.name.toUpperCase();

    const categoriaDB = await Categoria.findOne({name})

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoría ${name} ya existe`
        })
    }

    const data = {
        name,
        user: req.authUser._id
    }

    const categoria = new Categoria(data)

    await categoria.save();

    res.status(201).json(categoria);
}

const updateCategoria = async(req=request,res=response)=>{
    
    const name = req.body.name.toUpperCase();

    const id = req.params.id;

    const categoriaDB = await Categoria.findOne({name})
    if(categoriaDB && categoriaDB.id !== id){
        return res.status(400).json({
            msg: `La categoría ${name} ya existe`
        })
    }

    const user = req.authUser._id;

    const data = {
        name,
        user
    }

    const categoria = await Categoria.findByIdAndUpdate(id,data,{new:true})

    res.json(categoria)
}

const deleteCategoria = async(req=request,res=response)=>{
    
    const id = req.params.id;

    //const categoria = await Categoria.findByIdAndDelete(id); delete from db

    const categoria = await Categoria.findByIdAndUpdate(id,{status: false},{new: true})

    res.json({categoria})
}

module.exports = {
    crearCategoria,
    updateCategoria,
    getCategoria,
    getCategorias,
    deleteCategoria
}