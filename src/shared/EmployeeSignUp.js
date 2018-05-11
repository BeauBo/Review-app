import React, { Component } from 'react'
import AuthService from './AuthService'

class EmployeeSignUp extends Component {
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
            passwordConfirm: ''
        }
        this.Auth = new AuthService()
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                    <input
                        type='text' 
                        name='username'
                        placeholder='Enter username'
                        onChange={this.handleChange}
                    />
                    <input
                        type='password' 
                        name='password'
                        placeholder='Enter password'
                        onChange={this.handleChange}
                    />
                    <input
                        type='password' 
                        name='passwordConfirm'
                        placeholder='Confirm password'
                        onChange={this.handleChange}
                    />
                    <input 
                        type='submit'
                        value='Save'
                        className='btn btn-success'
                        disabled={
                            !this.state.username  ||
                            !this.state.password  ||
                            !this.state.passwordConfirm
                        }
                    />
                </form>    
        )
    }
    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleSubmit(e){
        e.preventDefault()
        if(this.state.password !== this.state.passwordConfirm){
            return alert('Password mismatch!')
        }
        this.Auth.signUp(this.state.username, this.state.password,this.props.department).then((res) => {
            //this.props.history.replace(`/${this.state.username}`)
            this.props.history.push(`/${this.state.username}`)
            
        })
    }
    
}

export default EmployeeSignUp