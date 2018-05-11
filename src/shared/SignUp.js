import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AuthService from './AuthService'
const adminCode = 'admin1234'

class SignUp extends Component {
    constructor(props){
        super(props)
        this.state = {
            user:{},
            username: '',
            password: '',
            passwordConfirm: '',
            adminCode: ''
        }
        this.Auth = new AuthService()
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount(){
        const user = this.Auth.getProfile()
        this.setState({
            user
        }, () => {
            console.log(this.state.user)
        })
    }

    render(){
       
       
            return(
                <div className='d-flex flex-column signup'>
                    <img 
                        src='https://www.paytm.ca/wp-content/uploads/thegem-logos/logo_1c55b24df15390a4bc761ca8db08e4c4_1x.png' 
                    />
                    <form onSubmit={this.handleSubmit}>
                            <input
                                type='text' 
                                name='username'
                                placeholder='Enter username'
                                onChange={this.handleChange}
                                className='form-control'
                            />
                            <input
                                type='password' 
                                name='password'
                                placeholder='Enter password'
                                onChange={this.handleChange}
                                className='form-control'
                            />
                            <input
                                type='password' 
                                name='passwordConfirm'
                                placeholder='Confirm password'
                                onChange={this.handleChange}
                                className='form-control'
                            />
                            <input
                                type='password' 
                                name='adminCode'
                                placeholder='Enter admin code'
                                onChange={this.handleChange}
                                className='form-control'
                            />
                            <input 
                                type='submit'
                                value='Save'
                                className='btn btn-success form-control'
                                disabled={
                                    !this.state.username  ||
                                    !this.state.password  ||
                                    !this.state.passwordConfirm ||
                                    !this.state.adminCode
                                }
                            />
                        </form>
                        <p>Have an account ? <Link to='/login' >Log In</Link></p>
                    </div>    
            )
        
        
    }
    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleSubmit(e){
        e.preventDefault()
        if(this.state.adminCode !== adminCode){
            return alert('Invalid admin code!')
        }
        if(this.state.password !== this.state.passwordConfirm){
            return alert('Passwords mismatch!')
        }
        this.Auth.signUp(this.state.username, this.state.password,'Admin').then((res) => {
            //this.props.history.replace(`/${this.state.username}`)
            this.props.history.replace(`/${this.state.username}`)
        })
    }
}

export default SignUp



