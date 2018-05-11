import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import routes from './routes/api'


// Create a db connection
const db = process.env.MONGODB_URI || 'mongodb://localhost:27017/paytm-labs'

//Create port 
const port = process.env.PORT || 4000

//Instatiate express app
const app = express()

//set up express middlewares

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(routes)

//Connect to mongodb
mongoose.connect(db, (err) => {
    if(err) {
        console.log(err)
    }
})

mongoose.connection.on('connected', () => {
    console.log('Successfully opened a connection to ' + db)
})

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from ' + db)
})

mongoose.connection.on('error', () => {
    console.log('An error has occured connecting to ' + db)
})


app.listen(port, () => {
    console.log('Server is listening requests on ' + port)
})