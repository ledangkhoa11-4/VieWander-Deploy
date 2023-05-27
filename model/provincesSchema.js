import mongoose from 'mongoose';
const { Schema } = mongoose;

const Province = new Schema({
    name: {type: String,              
        required: true, 
    },
    overview: {
        type: String,
    },
    funfact: {
        type: String
    },
    images: {
        type: [String]
    },
    rating: {
        type: Number
    },
    area:{
        type: String
    },
    num_traveler:{
        type: Number
    },
});
let provinceModel = mongoose.model('provinces', Province,"provinces");
export default provinceModel