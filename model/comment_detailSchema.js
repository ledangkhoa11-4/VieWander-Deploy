import mongoose from 'mongoose';
const { Schema } = mongoose;

const Comments = new Schema({
    landmark_id:{
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
    },
    rating:{
        type: Number
    }
});
let commentModel = mongoose.model('comments_detail', Comments,"comments_detail");
export default commentModel