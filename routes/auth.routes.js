//Роут авторизации
const {Router} = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');

const router = Router();

///api/auth/register
router.post(
    '/register',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'minimal length of pass is 6 char')
        .isLength({min: 6})
    ],
    async (req, res)=>{
        try{
            const errors = validationResult(req);
            
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'wrong registration data'
                })
            }
            
            const {email, password, isAdmin, name} = req.body;
            const condidate = await User.findOne({email});
            
            if(condidate) {
                return res.status(400).json({message: "Theese user is already exist"})
            }
            
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({name, email, isAdmin, password: hashedPassword});
            
            await user.save();
            res.status(201).json({message: 'user is created'});
        }catch(e){
            res.status(500).json({message:'something going wrong on api/auth/register'})
        }
    })

///api/auth/login
router.post(
    '/login',
    [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Enter pass').exists()

    ],
    async (req, res)=>{
        try {
            const errors = validationResult(req);
            
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'wrong registration data for login'
                })
            }
            
            const { email, password } = req.body;
            const user = await User.findOne({email})
            
            if(!user){
                return res.status(400).json({message: "Can't find the user"});
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            
            if(!isMatch){
                return res.status(400).json({message: "wrong password"});
            }
            
            const token = jwt.sign(
                { userId: user.id }, 
                config.get('jwtSecret'), 
                { expiresIn: '12h' }
            );
            
            res.json({ 
                token,
                email: user.email,
                userId: user.id,
                name: user.name, 
                isAdmin: user.isAdmin
            });

        } catch(e) {
            res.status(500).json({message:'something going wrong on api/auth/login'});
        }
})

module.exports = router;