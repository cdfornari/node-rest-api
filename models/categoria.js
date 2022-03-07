const {Schema,model} = require('mongoose');


const CategoriaSchema = Schema({
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
    }
})

CategoriaSchema.methods.toJSON = function(){ //normal func to use this 
    const {__v,status,...categoria} = this.toObject();
    return categoria;
}

module.exports = model('Categoria',CategoriaSchema) //nombre de la coleccion