const { request, response } = require("express");
const { Producto } = require('../models');
const { findByIdAndUpdate } = require("../models/categoria");

const getProductos = async(req=request,res=response)=>{

    const {limit=5,from=0} = req.query;

    const [productosCount,productos] = await Promise.all([
        Producto.countDocuments({status: true}),
        Producto.find({status: true})
                    .limit(Number(limit))
                    .skip(Number(from))
                    .populate('user','-password -__v')
                    .populate({
                        path: 'categoria',
                        select: '-__v',
                        populate: {
                            path: 'user',
                            select: '-password -__v'
                        }
                    })
    ])

    res.json({
        productosCount,
        productos
    })
}

const getProducto = async(req=request,res=response)=>{
    
    const id = req.params.id;

    const producto = await Producto.findById(id)
                                    .populate('user','-password -__v')
                                    .populate({
                                        path: 'categoria',
                                        select: '-__v',
                                        populate: {
                                            path: 'user',
                                            select: '-password -__v'
                                        }
                                    })

    res.json(producto)

}

const crearProducto = async(req=request,res=response)=>{
    
    const {precio,categoria,descripcion} = req.body;

    const name = req.body.name.toUpperCase();

    const productoDB = await Producto.findOne({name})

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${name} ya existe`
        })
    }

    const user = req.authUser._id;

    const data = {
        name,
        precio,
        categoria,
        descripcion,
        user
    }

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json(producto)
}

const updateProducto = async(req=request,res=response)=>{

    const name = req.body.name.toUpperCase();

    const id = req.params.id;

    const productoDB = await Producto.findOne({name})
    if(productoDB && productoDB.id !== id){
        return res.status(400).json({
            msg: `El producto ${name} ya existe`
        })
    }

    const {precio,categoria,descripcion} = req.body;

    const user = req.authUser._id;

    const data = {
        name,
        precio,
        categoria,
        descripcion,
        user
    }

    const producto = await Producto.findByIdAndUpdate(id,data,{new:true})

    res.status(201).json(producto)
}

const deleteProducto = async(req=request,res=response)=>{

    const id = req.params.id;

    //const producto = await Producto.findByIdAndDelete(id); delete from db

    const producto = await Producto.findByIdAndUpdate(id,{status: false},{new:true})
                                    .populate('user','-password -__v')
                                    .populate({
                                        path: 'categoria',
                                        select: '-__v',
                                        populate: {
                                            path: 'user',
                                            select: '-password -__v'
                                        }
                                    })

    res.json(producto)
    
}

module.exports = {
    getProductos,
    getProducto,
    crearProducto,
    updateProducto,
    deleteProducto
}