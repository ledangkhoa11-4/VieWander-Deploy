import mongoose from 'mongoose';
const { Schema } = mongoose;

const Comments = new Schema({
    province_id:{
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
let commentModel = mongoose.model('comments_province', Comments,"comments_province");
export default commentModel