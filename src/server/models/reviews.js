import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ReviewsSchema = new Schema ({
    username: {
        type: String,
        require: true
    },
    content: {
        type: String
    },
    byWhom: {
        type: String
    }
})


const Model = mongoose.model('Reviews', ReviewsSchema)

export default Model