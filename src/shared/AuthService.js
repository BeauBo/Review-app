// Stateless component to serve other components

import decode from 'jwt-decode'

export default class AuthService {

   constructor(){
       this.fetch = this.fetch.bind(this)
   }
    signUp(username, password, department){
       return this.fetch('/signup',{
            method: 'POST',
            body: JSON.stringify({
                username,
                password,
                department
            })
        }).then(res => {
            if(res.token){
                this.setToken(res.token)
            }
            return Promise.resolve(res)
        })
    }

    addEmployee(username, password, department){
        return this.fetch('/signup', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password,
                department
            })
        }).then(res => {
            return Promise.resolve(res)
        })
    }

    deleteEmployee(username){
        return this.fetch('/admin/delete', {
            method: 'POST',
            body: JSON.stringify({
                username
            })
        }).then( res => {
            return Promise.resolve(res)
        })
    }

    getReviews(username){
        return this.fetch('/admin/getreviews',{
            method: 'POST',
            body: JSON.stringify({
                username
            })
        }).then( res => {
            return Promise.resolve(res)
        })
    }

    addReview(username, content, byWhom){
        return this.fetch('/admin/addreview', {
            method: 'POST',
            body: JSON.stringify({
                username,
                content,
                byWhom
            })
        }).then( res => {
            return Promise.resolve(res)
        })
    }

    updateReview(reviewId, content, byWhom){
        return this.fetch('/admin/updatereview',{
            method:'POST',
            body: JSON.stringify({
                reviewId,
                content,
                byWhom
            })
        }).then( res => {
            return Promise.resolve(res)
        })
    }

    assign(reviewee, reviewers){
        return this.fetch('/admin/assign', {
            method: 'POST',
            body: JSON.stringify({
                reviewee,
                reviewers
            })
        }).then( res => {
            return Promise.resolve(res)
        })
    }
    login(username, password){
        return this.fetch('/login',{
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        }).then( res => {
            if(res.token){
                this.setToken(res.token)
            }
            return Promise.resolve(res)
        })
        
    }

    logout(){
        localStorage.removeItem('token')
    }

    setToken(token){
        localStorage.setItem('token', token)
    }

    getToken(){
        const token = localStorage.getItem('token')
        return token? token : false
    }

    getProfile(){
        return this.getToken()? decode(this.getToken()) : false
    }

    getEmployeeList(){
        return this.fetch('/admin/employees',{
            method: 'POST'
        }).then( res => {
            return Promise.resolve(res)
        })
    }

    getEmployeeInfo(username){
        return this.fetch('/admin/employeeinfo',{
            method: 'POST',
            body: JSON.stringify({
                username
            })
        }).then( res => {
            return Promise.resolve(res)
        })
    }

    updateEmployeeInfo(username, department, email, phone, address){
        return this.fetch('/admin/updateemployeeinfo',{
            method: 'POST',
            body: JSON.stringify({
                username,
                department,
                email,
                phone,
                address
            })
        }).then( res => {
            return Promise.resolve(res)
        })
    }

    setEmployeeInfo(username, email, phone, address, password){
        return this.fetch('/admin/set-employee-info',{
            method: 'POST',
            body: JSON.stringify({
                username,
                email,
                phone,
                address,
                password
            })
        }).then( res => {
            return Promise.resolve(res)
        })
    }

    deleteRevieweeList(reviewee, reviewer){
        return this.fetch('/admin/delete-reviewee-list',{
            method: 'POST',
            body: JSON.stringify({
                reviewee,
                reviewer
            })
        }).then( res => {
            return Promise.resolve(res)
        })
    }

    fetch(url, options){
        const headers = {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
        return fetch(url, {
            headers,
            ...options
        }).then(this._checkStatus)
            .then(res => res.json())
    }

    _checkStatus(response){
        if(response.status >= 200 && response.status < 300){
            return response
        }else{
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}
