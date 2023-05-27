import mongoose from 'mongoose';
const { Schema } = mongoose;

const Post = new Schema({
    author_id: {
        type: String,
        required: true,
    },
    content: {
        type: String
    },
    image: {
        type: String
    },
    date_post: {
        type: Number,
        default: Date.now()
    },
    likes: {
        type: [String]
    },
    view_mode: {
        type: String
    }
});
let postModel = mongoose.model('posts', Post, "posts");
export default postModel