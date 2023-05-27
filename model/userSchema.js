import mongoose from 'mongoose';
const { Schema } = mongoose;

const User = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    socialID: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String
    },
    cover: {
        type: String
    },
    job: {
        type: String
    },
    dob: {
        type: String
    },
    gender: {
        type: String
    },
    address: {
        type: String
    },
    contact: {
        type: String
    },
    favorite_landmark: {
        type: [String]
    },
    follower: {
        type: [String]
    },
    follow: {
        type: [String]
    },
    role: {
        type: Number
    }
});
let userModel = mongoose.model('users', User, "users");
export default userModel