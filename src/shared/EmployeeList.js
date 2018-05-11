import React, { Component } from 'react'
import AuthService from './AuthService'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

class EmployeeList extends Component {
    constructor(props){
        super(props)
        this.state = {
            employees: [],
            modalInfo: false,
            modalEdit: false,
            modalAdd: false,
            modalDelete: false,
            employeeInfo:{},
            department:'Front-end'
        }
        this.Auth = new AuthService()
        this.info = this.info.bind(this)
        this.edit = this.edit.bind(this)
        this.delete = this.delete.bind(this)
        this.infoToggle = this.infoToggle.bind(this)
        this.editToggle = this.editToggle.bind(this)
        this.addToggle = this.addToggle.bind(this)
        this.deleteToggle = this.deleteToggle.bind(this)
        this.deleteConfirm = this.deleteConfirm.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSelectChange = this.handleSelectChange.bind(this)
        this.saveEdit = this.saveEdit.bind(this)
        this.saveAdd = this.saveAdd.bind(this)

    }

    componentDidMount(){
        
        this.Auth.getEmployeeList().then(res => {
            this.setState({
                employees: res.employees
            })
        })
    }

    
    infoToggle(){
        this.setState({
            modalInfo: !this.state.modalInfo
        })
    }

    editToggle(){
        this.setState({
            modalEdit: !this.state.modalEdit
        })
    }

    addToggle(){
        this.setState({
            modalAdd: !this.state.modalAdd
        })
    }

    deleteToggle(){
        this.setState({
            modalDelete: !this.state.modalDelete
        })
    }

    saveAdd(){
        if(this.state.password !== this.state.passwordConfirm){
            return alert('Passwords mismatch!')
        }
        this.Auth.addEmployee(
            this.state.username, 
            this.state.password, 
            this.state.department
        ).then(() => {
            this.Auth.getEmployeeList().then(res => {
                this.setState({
                    employees: res.employees,
                    modalAdd: !this.state.modalAdd
                })
            })
        })
    }

    info(e){

        const username = e.currentTarget.dataset.username
        this.Auth.getEmployeeInfo(username).then( res => {
            this.setState({
                employeeInfo: res.employeeInfo,
                modalInfo: !this.state.modalInfo
                
            }, () => {
                console.log(this.state.employeeInfo.info)
            })
        })
    }

    edit(e){
        
        const username = e.currentTarget.dataset.username
        console.log(username)
        this.Auth.getEmployeeInfo(username).then( res => {
            this.setState({
                employeeInfo: res.employeeInfo,
                modalEdit: !this.state.modalEdit
            })
        })
    }

    saveEdit(){
        this.Auth.updateEmployeeInfo(
            this.state.employeeInfo.username,
            this.state.department,
            this.state.email,
            this.state.phone,
            this.state.address
        ).then( res=> {
            this.setState({
                employeeInfo: res.employeeInfo,
            }, () => {
                this.Auth.getEmployeeList().then(res => {
                    this.setState({
                        employees: res.employees,
                        modalEdit: !this.state.modalEdit
                    })
                })
            })
        })
    }

    delete(e){
        const username = e.currentTarget.dataset.username
        console.log(username)
        this.setState({
            modalDelete: !this.state.modalDelete,
            deleteEmployee: username
        })
    }

    deleteConfirm(){
        this.Auth.deleteEmployee(this.state.deleteEmployee).then( () => {
            this.Auth.getEmployeeList().then(res => {
                this.setState({
                    employees: res.employees,
                    modalDelete: !this.state.modalDelete
                })
            })
        })
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSelectChange(e){
        this.setState({
            department: e.target.value
        })
    }
    infoModal(){
        if(!this.state.employeeInfo.info){
            return(
                <Modal isOpen={this.state.modalInfo} toggle={this.infoToggle}>
                    <ModalHeader toggle={this.infoToggle}>
                       <h2>{this.state.employeeInfo.username}</h2>
                       <small>{this.state.employeeInfo.department}</small>
                   </ModalHeader>
                    <ModalBody>
                        Oops! No Info available for {this.state.employeeInfo.username}    
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.infoToggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            )
            
        }else{
            return(
             
                <Modal isOpen={this.state.modalInfo} toggle={this.infoToggle}>
                   <ModalHeader toggle={this.infoToggle}>
                       <h2>{this.state.employeeInfo.username}</h2>
                       <small>{this.state.employeeInfo.department}</small>
                   </ModalHeader>
                   <ModalBody>
                       <p>Email: {this.state.employeeInfo.info.email}</p>
                       <p>Phone: {this.state.employeeInfo.info.phone}</p>
                       <p>Address: {this.state.employeeInfo.info.address}</p>    
                   </ModalBody>
                   <ModalFooter>
                       <Button color="secondary" onClick={this.infoToggle}>Cancel</Button>
                   </ModalFooter>
               </Modal>
           )
        }
    }

    editModal(){
        const email = this.state.employeeInfo.info? this.state.employeeInfo.info.email : ''
        const phone = this.state.employeeInfo.info? this.state.employeeInfo.info.phone : ''
        const address = this.state.employeeInfo.info? this.state.employeeInfo.info.address : ''
       
        return(
            <Modal isOpen={this.state.modalEdit} toggle={this.editToggle}>
                <ModalHeader toggle={this.editToggle}>
                    <h2>{this.state.employeeInfo.username}</h2>
                    <small>{this.state.employeeInfo.department}</small>
                </ModalHeader>
                <ModalBody>
                    <select className='form-control'
                        value={this.state.department} 
                        onChange={this.handleSelectChange} 
                    >
                        <option value="Admin">Admin</option>
                        <option value="Front-end">Front-end</option>
                        <option value="Back-end">Back-end</option>
                        <option value="Full-stack">Full-stack</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="HR">HR</option>
                    </select>
                    <form>
                        <input 
                            type='email'
                            name='email'
                            placeholder='Enter email'
                            onChange={this.handleChange}
                            className='form-control'
                            defaultValue={email}
                        />
                        <input 
                            type='text'
                            name='phone'
                            placeholder='Enter phone number'
                            onChange={this.handleChange}
                            className='form-control'
                            defaultValue={phone}
                        />
                        <input 
                            type='text'
                            name='address'
                            placeholder='Enter address'
                            onChange={this.handleChange}
                            className='form-control'
                            defaultValue={address}
                        />
                    </form>           
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.saveEdit}>Save</Button>
                    <Button color="secondary" onClick={this.editToggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
        
    }

    addModal(){
        return(
            <Modal className='add-modal' isOpen={this.state.modalAdd} toggle={this.addToggle}>
                   <ModalHeader className='header' toggle={this.addToggle}>
                       <h2>Add new employee</h2>
                   </ModalHeader>
                   <ModalBody className='body'>
                       <select className=' select form-control'
                            value={this.state.department} 
                            onChange={this.handleSelectChange} 
                        >
                            <option value="Admin">Admin</option>
                            <option value="Front-end">Front-end</option>
                            <option value="Back-end">Back-end</option>
                            <option value="Full-stack">Full-stack</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Finance">Finance</option>
                            <option value="HR">HR</option>
                       </select>
                       <form>
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
                       </form>           
                   </ModalBody>
                   <ModalFooter>
                        <Button 
                            color="primary" 
                            onClick={this.saveAdd}
                            disabled={
                                !this.state.username ||
                                !this.state.password ||
                                !this.state.passwordConfirm 
                            }
                        >
                        Save
                        </Button>
                        <Button color="secondary" onClick={this.addToggle}>Cancel</Button>
                   </ModalFooter>
               </Modal>
        )
    }

    deleteModal(){
        return (
            <Modal isOpen={this.state.modalDelete} toggle={this.deleteToggle}>
                <ModalBody>
                    <p>Are you sure to delete employee: {this.state.deleteEmployee}</p>         
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={this.deleteConfirm}>Delete</Button>
                    <Button color="secondary" onClick={this.deleteToggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }

    printEmployees(){
        return this.state.employees.map((employee) => {
            return(
                <div className='employee d-flex flex-row justify-content-between'>
                    <div className='d-flex flex-row align-items-center'>
                        <p className='name'>{employee.username}</p>
                        <p className='text-muted department '>{employee.department}</p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <i className='info fa fa-info' onClick={this.info} data-username={employee.username}></i>
                        <i className='edit fa fa-edit' onClick={this.edit} data-username={employee.username}></i>
                        <i className='delete fa fa-trash'onClick={this.delete} data-username={employee.username}></i>
                    </div>
                 
                     
                </div>    
            )
        })
    }
    render(){
        return(
            <div className='employees'>
                <div className='header d-flex flex-row justify-content-between'>
                    <h2 className='title'>Employee List</h2>
                    <i className='fa fa-plus add'onClick={this.addToggle}></i>
                </div>
                <div className='list'>
                    {this.printEmployees()}
                </div>
                {this.infoModal()}
                {this.editModal()}
                {this.addModal()}
                {this.deleteModal()}
            </div> 
        )   
    }
}

export default EmployeeList