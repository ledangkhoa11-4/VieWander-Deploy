import mongoose from 'mongoose';
const { Schema } = mongoose;

const Route = new Schema({
    city_route: {
        type: [String],              
        required: true, 
    },
    distance: {
        type: Number
    },
    time_in_second:{
        type: Number
    },
});
let routeModel = mongoose.model('routes', Route,"routes");
export default routeModel