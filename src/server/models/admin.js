import mongoose from 'mongoose'

const Schema = mongoose.Schema


const AdminSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    }
})



const Model = mongoose.model('Admin', AdminSchema)

export default Model