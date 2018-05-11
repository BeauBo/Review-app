import React, { Component } from 'react'
import EmployeeList from './EmployeeList'
import Reviews from './Reviews'
import Assign from './Assign'
import { Link } from 'react-router-dom'
import AuthService from './AuthService'

class AdminProfile extends Component {
    constructor(props){
        super(props)
        this.state = {
            employees: true, 
            reviews: false,
            assign: false,
            selected: 'employees'
        }
        this.Auth = new AuthService()
        this.handleClick = this.handleClick.bind(this)
        this.logout = this.logout.bind(this)
        this.isActive = this.isActive.bind(this)
    }

    // Switch components when click the navigation 
    selectedComponent(){
        if(this.state.employees){
            return (<EmployeeList />)
        }
        if(this.state.reviews){
            return (<Reviews />)
        }
        return (<Assign />)
    }
    render(){
        return(
            <div className='admin-profile d-flex flex-row'>
                <div className='sidebar'>
                    <img 
                        src='https://www.paytm.ca/wp-content/uploads/thegem-logos/logo_1c55b24df15390a4bc761ca8db08e4c4_1x.png' 
                    />
                    <div className='d-flex flex-row user-info'>
                        <p className='username'>{this.props.user.username}</p>
                        <p className='text-muted department'>{this.props.user.department}</p>
                    </div>
                    <div className='d-flex flex-column'>
                        
                        <p className={this.isActive('employees') ? 'admin-active' : ''} onClick={this.handleClick} data-selected='employees'>Employees</p>
                        <p className={this.isActive('reviews') ? 'admin-active' : ''} onClick={this.handleClick} data-selected='reviews'>Reviews</p>
                        <p className={this.isActive('assign') ? 'admin-active' : ''} onClick={this.handleClick} data-selected='assign'>Assign</p>
                        <Link className='admin-logout'to={'/login'} onClick={this.logout}>Log out</Link>
                        
                    </div>
                </div>
                {this.selectedComponent()}
            </div>    
        )
    }

    logout(){
        this.Auth.logout()
    }
    // determine which navigation is clicked
    isActive(selected){
        return selected === this.state.selected
    }

    handleClick(e){
        const selected = e.currentTarget.dataset.selected
       
        if(selected === 'reviews'){
            return this.setState({
                employees: false,
                reviews: true,
                assign: false,
                selected: 'reviews'
            })
        }
        if(selected === 'assign'){
            return this.setState({
                employees: false,
                reviews: false,
                assign: true,
                selected: 'assign'
            })
        }
        return this.setState({
            employees: true,
            reviews: false,
            assign: false,
            selected: 'employees'
        })
       
    }
}


export default AdminProfile