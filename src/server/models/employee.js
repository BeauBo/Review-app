import mongoose from 'mongoose'

const Schema = mongoose.Schema

const InfoSchema = new Schema ({
    email: {
        type: String
    },
    phone:{
        type: String
    },
    address:{
        type: String
    }
})

const ListSchema = new Schema ({
    name: {
        type: String
    }
})

const EmployeeSchema = new Schema ({
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
        require: true
    },
    info: InfoSchema,
    list: [ListSchema]
    
})



const Model = mongoose.model('Employee', EmployeeSchema)

export default Model