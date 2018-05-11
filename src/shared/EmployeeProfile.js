import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import AuthService from './AuthService'
import { Link } from 'react-router-dom'

class EmployeeProfile extends Component {
    constructor(props){
        super(props)
        this.state = {
          user: {},
          revieweeList: [],
          modalAdd: false,
          reviewee:''
        }
        this.Auth = new AuthService()
        this.add = this.add.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addToggle = this.addToggle.bind(this)
        this.saveAdd = this.saveAdd.bind(this)
        this.logout = this.logout.bind(this)
    }

    componentDidMount(){
        const user = this.Auth.getProfile()
        if(user){
            this.Auth.getEmployeeInfo(user.user.username).then( res => {
                this.setState({
                    user: res.employeeInfo,
                    revieweeList: res.employeeInfo.list
                })
            })
        }
        
    }
   
    

    add(e){
        const reviewee = e.currentTarget.dataset.reviewee
        this.setState({
            reviewee,
            modalAdd: !this.state.modalAdd
        })
    }

    saveAdd(){
        // Add review content to reviews model
        this.Auth.addReview(this.state.reviewee, this.state.reviewContent, this.state.user.username)

        // Delete reviewed employee from the list in the employee model
        this.Auth.deleteRevieweeList(this.state.reviewee, this.state.user.username).then(() =>{
            const newRevieweeList = this.state.revieweeList.filter(item => {
                return item.name !== this.state.reviewee
            })
            this.setState({
                revieweeList: newRevieweeList,
                modalAdd: !this.state.modalAdd
            }) 
        })
    }

    addToggle(){
        this.setState({
            modalAdd: !this.state.modalAdd
        })
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    addModal(){
        return(
            
                <Modal isOpen={this.state.modalAdd} toggle={this.addToggle}>
                        <ModalHeader toggle={this.addToggle}>
                            <h2>Add new review for {this.state.reviewee}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <textarea 
                            name='reviewContent'
                            placeholder='Enter review here'
                            onChange={this.handleChange}
                            >
                            </textarea>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                color="primary" 
                                onClick={this.saveAdd}
                                disabled={!this.state.reviewContent}
                            >
                            Save
                            </Button>
                            <Button color="secondary" onClick={this.addToggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                )
           
    }

    logout(){
        this.Auth.logout()
    }

    messagesList(){
        
        return this.state.revieweeList.map( (reviewee) => {
            return (
                <div className='dashboard d-flex flex-row justify-content-between'>
                    <div className='d-flex flex-row'>
                        <p className='reviewee'>{reviewee.name}</p>
                        <p className='department text-muted'>{this.state.user.department}</p>
                    </div>    
                    <i 
                        data-reviewee={reviewee.name}
                        onClick={this.add}
                        className='fa fa-plus'
                    >
                    </i>
                </div>
            )
        })
    }

    render(){
            if(this.state.revieweeList.length === 0){
                return (
                    <div className='employee-profile d-flex flex-row'>
                        <div className='sidebar'>
                            <img 
                                src='https://www.paytm.ca/wp-content/uploads/thegem-logos/logo_1c55b24df15390a4bc761ca8db08e4c4_1x.png' 
                            />
                            <div className=' d-flex flex-row user-info'>
                                <p className='username'>{this.state.user.username}</p>
                                <p className='text-muted department'>{this.state.user.department}</p>
                            </div>
                            <div className='d-flex flex-column'>
                                <p className='messages'>Messages<span>{this.state.revieweeList.length}</span></p>
                                <Link className='setting' to={`/${this.state.user.username}/setting`}>Setting</Link>
                                <Link className='employee-logout' to={'/login'} onClick={this.logout}>Log out</Link>
                            </div>    
                        </div>
                        <div className='list'>
                            <div className='header'>
                                <h1>Required feedback list</h1>
                            </div>
                            <div className='d-flex flex-column feedbacks'>
                                <h2>No required feedbacks!</h2>
                            </div>         
                        </div>       
                    </div>
                )
            }
        
            return(
                <div className='employee-profile d-flex flex-row'>
                    <div className='sidebar'>
                        <img 
                            src='https://www.paytm.ca/wp-content/uploads/thegem-logos/logo_1c55b24df15390a4bc761ca8db08e4c4_1x.png' 
                        />
                        <div className='d-flex flex-row user-info'>
                            <p className='username'>{this.state.user.username}</p>
                            <p className='text-muted department'>{this.state.user.department}</p>
                        </div>
                        <div className='d-flex flex-column'>
                            <p className='messages'>Messages<span>{this.state.revieweeList.length}</span></p>
                            <Link className='setting' to={`/${this.state.user.username}/setting`}>Setting</Link>
                            <Link className='employee-logout' to={'/login'} onClick={this.logout}>Log out</Link>
                        </div>    
                    </div>    
                    <div className='list'>
                        <div className='header'>
                            <h1>Required feedback list</h1>
                        </div>
                        <div className='d-flex flex-column feedbacks'>
                            {this.messagesList()}
                        </div>
                        {this.addModal()}          
                    </div>  
                </div> 
            )
    }
}

export default EmployeeProfile