import mongoose from 'mongoose';
const { Schema } = mongoose;

const Comments = new Schema({
    post_id:{
        type:String,
        required: true
    },
    author_id: {
        type:String,
        required: true
    },
    content: {
        type: String
    },
    date_post:{
        type: Number,
        default: Date.now()
    }
});
let CommentModel = mongoose.model('comments_post', Comments,"comments_post");
export default CommentModel