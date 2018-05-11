import express from 'express'
import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import App from '../../shared/App'
import Admin from '../models/admin'
import Employee from '../models/employee'
import Reviews from '../models/reviews'



const jwtSecrect = 'jwt-secrect'



//Instatiate express router
const router = express.Router({caseSensitive: true})

//server rendering html file
router.get('*', (req, res, next) => {
    const markup = renderToString(
        < StaticRouter location={req.url} context={{}}>
            <App />
        </StaticRouter>    
    )

    res.send(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Paytm Labs</title>
            <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
            <script src="https://use.fontawesome.com/b2bddaf3ba.js"></script>
            <script type="text/javascript" src='/bundle.js' defer></script>
        </head>
    <body>
        <div id='app'>${markup}</div>
    </body>
    </html>
    `)
})


router.post('/signup', (req, res, next) => {
    const { username, password, department } = req.body
    const user = {  // create an instance to save into models 
        username,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        department
    }
    const Collection = department === 'Admin'? Admin : Employee // determine which model to use
    Collection.create(user).then((user) => {
        const token = jwt.sign({user}, jwtSecrect, {expiresIn: 3600})
        res.json({
            success: true,
            error: null,
            token
        })
    }, (err) => {
        if(err.name === 'BulkWriteError' && err.code === 11000){
            res.json({
                success: false,
                error: 'User already exists!',
                token: null
            })
        }
    })
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    
    Admin.findOne({username}).then((user) => { //First check Admin model to see if user is admin
        if(user === null){                     
            Employee.findOne({username}).then((user) =>{  // if user is not in Admin then check Employee model
                if(user === null){   // if user is not in Employee neither, then user does not exist
                    res.json({
                        success: false,
                        error: 'User does not exist!',
                        token: null
                    })
                }else{
                    if(user.username === username && bcrypt.compareSync(password, user.password)){ // if user is in Employee, check password
                        const token = jwt.sign({user}, jwtSecrect, {expiresIn: 3600})
                        res.json({
                            success: true,
                            error: null,
                            token
                        })
                    }else{
                        res.json({
                            success: false,
                            error: 'Password incorrect!',
                            token: null
                        })
                    }
                }
            }, (err) => {  // handle error for Employee model
                res.json({
                    success: false,
                    error: err,
                    token: null
                })
            })
        }else{
            if(user.username === username && bcrypt.compareSync(password, user.password)){ // if user is in Admin, then check password
                const token = jwt.sign({user}, jwtSecrect, {expiresIn: 3600})
                res.json({
                    success: true,
                    error: null,
                    token
                })
            }else{
                res.json({
                    success: false,
                    error: 'Password incorrect!',
                    token: null
                })
            }
        }
    }, (err) => {  //handle error for Admin model
        res.json({
            success: false,
            error: err,
            token: null
        })
    })
})

router.post('/admin/:action', (req, res, next) => {
    const action = req.params.action
    if(action === 'employees'){
        Employee.find({}).then((employees) => {
            res.json({
                employees
            })
        })
    }else if(action === 'employeeinfo'){
        const { username } = req.body
        Employee.findOne({username}).then((employeeInfo) => {
            res.json({
                employeeInfo
            })
        })
    }else if(action === 'updateemployeeinfo'){
        const { username, department, email, phone, address} = req.body
        Employee.findOneAndUpdate({username}, {
            department,
            info:{
                email,
                phone,
                address
            }
        }, { new: true}, (err,employeeInfo) => {
            if(err) throw err
            res.json({
                employeeInfo
            })
        })
    }else if(action === 'delete'){
        const { username } = req.body
        Employee.findOneAndRemove({username}, (err, deletedEmployee)=>{
            if (err) throw err
            res.json({
                deletedEmployee
            })
        })
    }else if(action === 'getreviews'){
        const { username } = req.body
        Reviews.find({username}, (err, reviews) => {
            if(err) throw err
            res.json({
                reviews
            })
        })
    }else if(action === 'addreview'){
        const { username, content, byWhom } = req.body
        const review = {
            username,
            content,
            byWhom
        }
        Reviews.create(review, (err, review) => {
            if (err) throw err
            res.json({
                review
            })
        })
    }else if( action === 'updatereview'){
        const { reviewId, content, byWhom } = req.body
       Reviews.findByIdAndUpdate(reviewId, 
            {
                content,
                byWhom
            },{ new: true}, (err, updatedReview) => {
                if (err) throw err
                res.json({
                    updatedReview
                })
            }
        )
    }else if( action === 'assign'){
        const { reviewee, reviewers } = req.body
        reviewers.map((reviewer)=> {    //map through reviewers to insert the reviewee in their reviewee list
            Employee.findOne({username:reviewer}).then((reviewer) => {
             const newList = reviewer.list.filter( listItem => {  // filter off the existing reviewee in the array list
                    return listItem.name !== reviewee            // avoid duplicates      
                })
                newList.push({name: reviewee})
                Employee.findOneAndUpdate({username: reviewer.username}, {list: newList}, {new: true}, (err)=>{
                    if (err) throw err
                })
             })
        })
        res.json({
            message: 'Successfully Assigned reviews!'
        })
    }else if(action === 'delete-reviewee-list'){
        const { reviewee, reviewer } = req.body
        Employee.findOne({username: reviewer}).then((reviewer) => {
            const newList = reviewer.list.filter(item => {
                return item.name !== reviewee
            })
            Employee.findOneAndUpdate({username: reviewer.username}, {list: newList}, {new: true}, (err, reviewer) =>{
                if(err) throw err
                res.json({
                    reviewer
                })
            })
        })
        
    }else if(action === 'set-employee-info'){
        const {username, email, phone, address, password} = req.body
        Employee.findOneAndUpdate({username},{
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
            'info.email': email,
            'info.phone': phone,
            'info.address': address
        }, {new: true, upsert: true}, (err, updatedInfo) => {
            if (err) throw err
            res.json({
                updatedInfo
            })
        })
    }
})



export default router