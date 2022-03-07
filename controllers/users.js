const { response,request } = require('express');
const bcrypt = require('bcryptjs');


const {User} = require('../models');

const userGet = async(req = request, res = response) => {

    //const {name = 'No Name', apikey, id, edad, page = 1, limit} = req.query;
    //const users = await User.find(); get all users

    const {limit = 5,from = 0} = req.query;

    //const users = await User.find({status: true})
    //                    .limit(Number(limit))
    //                    .skip(Number(from));
    //const usersCount = await User.countDocuments({status: true});

    const [usersCount,users] = await Promise.all([  //ejecutar ambas promesas al mismo tiempo
        User.countDocuments({status: true}),
        User.find({status: true})
            .limit(Number(limit))
            .skip(Number(from))
    ])

    res.json(
        {
            usersCount,
            users
        }
    );
}

const userPost = async(req, res) => {

    const {name,email,password,role} = req.body;

    const user = new User({name,email,password,role});

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password,salt);

    await user.save();

    res.json(user);
}

const userPut = async(req, res) => {

    const id = req.params.id;
    const {_id,password,google,email,...rest} = req.body;

    if (password){
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password,salt);
    }

    const user = await User.findByIdAndUpdate(id,rest,{new:true});

    res.status(201).json(user);
}

const userDelete = async(req, res) => {

    const {id} = req.params;

    //const user = await User.findByIdAndDelete(id); delete from db

    const user = await User.findByIdAndUpdate(id,{status:false})

    res.json({
        user
    })
}

userPatch = (req,res) =>{
    res.json({
        msg: 'patch API'
    })
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete,
    userPatch
}