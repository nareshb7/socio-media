import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'

export const register = async (req,res) => {
    try {
        const {
            firstName,
            lastName, 
            email,
            password,
            picturePath, 
            location,
            occupation,
            firends
        } = req.body
        console.log('BODY', req.body)
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt)
        const newUser = await UserModel({
            firstName,
            lastName, 
            email,
            password: hashPassword,
            picturePath, 
            location,
            occupation,
            firends,
            impressions: Math.floor(Math.random() * 1000),
            viewedProfile: Math.floor(Math.random() * 100)
        })
        const savedUser = await newUser.save()
        //201 for creation
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}


/* LOGGING IN */

export const login =async (req,res)=> {
    try {
        const {email, password} = req.body
        console.log('EMAILL', req.body)
        const user = await UserModel.findOne({email})
        if (!user) return res.status(400).json({message: 'User does not exist..!'})
        
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({message: 'Invalid credentials...!'})
        delete user.password
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET)
        res.status(200).json({user, token})
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}
