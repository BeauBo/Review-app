import React, { Component } from 'react'
import AuthService from './AuthService'
import AdminProfile from './AdminProfile'
import EmployeeProfile from './EmployeeProfile'


class Profile extends Component {
    constructor(props){
        super(props)
        this.state = {
            user: {}
        }
        this.Auth = new AuthService 
    }


    componentDidMount(){
        const usernamePath = location.pathname.replace(/%20/g,' ').slice(1)
        const user = this.Auth.getProfile()
        
        if(!this.Auth.getToken()){
            return  this.props.history.replace('/login')
        }
        if(usernamePath !== user.user.username){
            return this.props.history.replace(`/login`)
        }
        this.setState({
            user: user.user
        })
        
        
    }

    render(){
        if(this.state.user.department === 'Admin'){
            return(
                <AdminProfile user={this.state.user}/>
            )
        }else{
            return(
                <EmployeeProfile user={this.state.user}/>
            )
        }
        
    }
}


export default Profile