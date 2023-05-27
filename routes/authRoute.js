import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../model/userSchema.js';
const Router = express.Router();
Router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt);
    req.body.password = hashedPass
    const newUser = new userModel(req.body)

    try {
        const oldUser = await userModel.findOne({ email })
        if (oldUser) {
            return res.status(400).json({ message: "username is already registered" })
        }
        const user = await newUser.save()
        const token = jwt.sign({ email: user.email, id: user._id }, 'etwda2023', { expiresIn: '1h' })
        return res.status(200).json({ user, token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
Router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email })
        if (user) {
            const validity = await bcrypt.compare(password, user.password)
            if (!validity) {
                res.status(400).json({ message: "Wrong password" })
            } else {
                const token = jwt.sign({ email: user.email, id: user._id }, 'etwda2023', { expiresIn: '1h' })
                res.status(200).json({ user, token })
            }
        } else {
            res.status(404).json({ message: "User doesnot exists" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
export default Router;