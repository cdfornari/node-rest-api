const { Router } = require('express');
const path = require('path');

const router = Router();

router.get('/login', (req,res)=>{
    res.sendFile(path.join(__dirname,'../public/login.html'));
})
router.get('/signin', (req,res)=>{
    res.sendFile(path.join(__dirname,'../public/signin.html'));
})
router.get('/restore', (req,res)=>{
    res.sendFile(path.join(__dirname,'../public/restore.html'));
})
router.get('/home', (req,res)=>{
    res.sendFile(path.join(__dirname,'../public/home.html'));
})
router.get('/profile', (req,res)=>{
    res.sendFile(path.join(__dirname,'../public/profile.html'));
})
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'../public/404.html'));
})

module.exports = router;