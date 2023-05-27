import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js';
import userModel from '../model/userSchema.js';
import multer from 'multer'
import fs from 'fs'
import landmarkModel from '../model/landmarkSchema.js';

const Router = express.Router();
Router.get('/getAll', async (req, res) => {
    try {
        let users = await userModel.find()
        users = users.map((user) => {
            const { password, ...otherDetails } = user._doc
            return otherDetails
        })
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
})
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/profile")
    },
})
const upload = multer({ storage: storage })
Router.put('/:id', upload.any('avatar'), authMiddleware, async (req, res) => {
    const imageList = []
    req.files.forEach(async (image, index) => {
        let fileType = image.mimetype.split("/")[1];
        let imgName = req.body.name.trim() + Date.now() + "." + fileType;
        imageList.push(imgName)
        await fs.renameSync(
            `./public/images/profile/${image.filename}`,
            `./public/images/profile/${imgName}`,
        );
    })
    const id = req.params.id;
    const { _id } = req.body;
    console.log(req.body)
    console.log(id)
    console.log('_id', _id)
    if (id === _id) {
        try {

            const user = await userModel.findByIdAndUpdate(id, { ...req.body, avatar: imageList[0] }, { upsert: true, new: true });
            console.log(user)
            res.status(200).json({ user })
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("Access Denied! you can only update your own profile")
    }
})
Router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id)
        if (user) {
            const { password, ...otherDetails } = user._doc
            res.status(200).json(otherDetails)
        } else {
            res.status(404).json("No such user exists")
        }
    } catch (error) {
        res.status(500).json(error);
    }
})
Router.put('/follow/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;

    const { _id } = req.body;


    try {
        const followUser = await userModel.findById(id)
        const followingUser = await userModel.findById(_id)
        if (!followUser.follower.includes(_id)) {
            await followUser.updateOne({ $push: { follower: _id } })
            await followingUser.updateOne({ $push: { follow: id } })
            res.status(200).json("User followed")
        } else {
            res.status(403).json("User is Already followed by you")
        }

    } catch (error) {
        res.status(500).json(error)
    }

})
Router.put('/unfollow/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    const { _id } = req.body;

    try {
        const followUser = await userModel.findById(id)
        const followingUser = await userModel.findById(_id)
        if (!followUser.follower.includes(_id)) {
            await followUser.updateOne({ $pull: { follower: _id } })
            await followingUser.updateOne({ $pull: { follow: id } })
            res.status(200).json("User Unfollowed")
        } else {
            res.status(403).json("User is not followed by you")
        }

    } catch (error) {
        res.status(500).json(error)
    }

})
Router.put('/favourite/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;

    const { _id } = req.body;


    try {

        const user = await userModel.findById(_id)
        if (!user.favorite_landmark.includes(id)) {
            await user.updateOne({ $push: { favorite_landmark: id } })

            res.status(200).json("Landmark followed")
        } else {
            res.status(403).json("Landmark is Already followed by you")
        }

    } catch (error) {
        res.status(500).json(error)
    }

})
Router.put('/favourite/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    const { _id } = req.body;

    try {

        const user = await userModel.findById(_id)
        if (user.favorite_landmark.includes(id)) {
            await user.updateOne({ $pull: { favorite_landmark: id } })

            res.status(200).json("Landmark unfollowed")
        } else {
            res.status(403).json("Landmark is not Already followed by you")
        }

    } catch (error) {
        res.status(500).json(error)
    }

})
export default Router;