const {Schema,model} = require('mongoose');


const ProductoSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true
    },
    descripcion: {type: String},
    disponible: {type: Boolean, default: true},
    img: {type: String}
})

ProductoSchema.methods.toJSON = function(){ //normal func to use this 
    const {__v,status,...producto} = this.toObject();
    return producto;
}

module.exports = model('Producto',ProductoSchema) //nombre de la coleccion