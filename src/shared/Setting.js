import React, { Component } from 'react'
import AuthService from './AuthService'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'


class Setting extends Component {
    constructor(props){
        super(props)
        this.state = {
            user: {},
            modal: false
        }
        this.Auth = new AuthService()
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.toggle = this.toggle.bind(this)
    }
    componentDidMount(){
        const user = this.Auth.getProfile()
        this.Auth.getEmployeeInfo(user.user.username).then((res) => {
            this.setState({
                user: res.employeeInfo
            }, () => {
                console.log(this.state)
            })
        })
        
    }

    toggle(){
        this.setState({
            modal:!this.state.modal
        })
    }

    modal(){
        return(
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalBody>
                    <h3>Saved!</h3>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }

    render(){
        const email = this.state.user.info? this.state.user.info.email : ''
        const phone = this.state.user.info? this.state.user.info.phone : ''
        const address = this.state.user.info? this.state.user.info.address : ''
        return(
            <div className='setting-employee'>
                <div className='header d-flex flex-row'>
                    <h3>{this.state.user.username}</h3>
                    <p className='text-muted'>{this.state.user.department}</p>
                 </div>   
                <form onSubmit={this.handleSubmit}>
                    <input
                        type='text' 
                        name='email'
                        placeholder='Enter email'
                        defaultValue={email}
                        onChange={this.handleChange}
                        className='form-control'
                    />
                    <input
                        type='text' 
                        name='phone'
                        placeholder='Enter phone NO.'
                        defaultValue={phone}
                        onChange={this.handleChange}
                        className='form-control'
                    />
                    <input
                        type='text' 
                        name='address'
                        placeholder='Enter address'
                        defaultValue={address}
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
                        type='submit' 
                        value='Save'
                        className='btn btn-success form-control'
                        disabled={
                            !this.state.email ||
                            !this.state.phone ||
                            !this.state.address ||
                            !this.state.password ||
                            !this.state.passwordConfirm
                        }
                    />
                </form>
                {this.modal()}    
            </div>    
        )
    }

    handleSubmit(e){
        e.preventDefault()
        if(this.state.password !== this.state.passwordConfirm){
            return alert('Passwords mismatch')
        }
        this.Auth.setEmployeeInfo(
            this.state.user.username,
            this.state.email,
            this.state.phone,
            this.state.address,
            this.state.password
        ).then( res => {
            this.setState({
                modal: !this.state.modal
            })
        })

    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
}

export default Setting