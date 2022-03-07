const { request } = require("express");
const path = require('path')
const { v4: uuidv4 } = require('uuid');


const subirArchivo = (req=request,extensionesValidas=['png','jpg','jpeg','gif'],carpeta='') => {

    return new Promise( (resolve,reject) =>{

        const {archivo} = req.files;

        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length-1];

        if(!extensionesValidas.includes(extension)){
            return reject('Extensión de archivo no permitida')
        }

        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname,'../uploads',carpeta,nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err){
                return reject(err);
            }
            
            resolve(nombreTemp)
        })
    })

}

module.exports = {
    subirArchivo
}