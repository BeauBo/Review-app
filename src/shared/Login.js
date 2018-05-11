import React, { Component } from 'react'
import AuthService from './AuthService'
import { Link } from 'react-router-dom'





class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: ''
        }
        this.Auth = new AuthService()
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    render(){
        return(
            <div className='d-flex flex-column login'>
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
                        type='submit'
                        value='Log In'
                        className='btn btn-success form-control'
                        disabled={ !this.state.username || !this.state.password }    
                    />
                </form>
                <p>Don't have an account ? <Link to='/'>Sign up</Link></p>    
            </div>
        )
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e){
        e.preventDefault()
        this.Auth.login(this.state.username, this.state.password).then((res) => {
            if(!res.success){
                return alert(res.error)
            }
            this.props.history.replace(`/${this.state.username}`)
        })
    }
}


export default Login