import React, { Component } from 'react'
import AuthService from './AuthService'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
class Assign extends Component {
    constructor(props){
        super(props)
        this.state={
            employees:[],
            reviewee: '',
            reviewers: [],
            message:'',
            modal: false
        }
        this.Auth = new AuthService()
        this.selectedReviewee = this.selectedReviewee.bind(this)
        this.selectedReviewer = this.selectedReviewer.bind(this)
        this.delete = this.delete.bind(this)
        this.assign = this.assign.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    componentDidMount(){

        // get all the employees for user to select
        this.Auth.getEmployeeList().then( res => {
            this.setState({
                employees: res.employees,
                reviewee: res.employees[0]['username']
            })
        })
    }

    printEmployees(){
        return this.state.employees.map((employee) => {
            return(
                <option value={employee.username}>{employee.username}</option>
            )
        })
    }

    printReviewers(){
        return this.state.reviewers.map((reviewer) => {
            return (
                <div className='reviewer d-flex flex-row'>
                    <p>{reviewer}</p><span data-reviewer={reviewer} onClick={this.delete}> x</span>
                </div>    
                
            )
        })
    }

    selectedReviewee(e){
        this.setState({
            reviewee: e.target.value
        })
    }

    selectedReviewer(e){
        const reviewers =  this.state.reviewers
        if( reviewers.includes(e.target.value)){ //check if the reviewer is already selected
            return alert('The reviewer is already selected!')
        }
        reviewers.push(e.target.value)
        this.setState({
            reviewers
        })
    }

    // delete already selected reviewer
    delete(e){
        const toDelete = e.currentTarget.dataset.reviewer
        const reviewers = this.state.reviewers
        const newReviewers = reviewers.filter(reviewer => toDelete !== reviewer)
        this.setState({
            reviewers: newReviewers
        })
    }
    assign(){
        if (this.state.reviewers.includes(this.state.reviewee)){ // check if selected reviewer and reviewee are the same person
            return alert('Reviewer and reviewee can not be the same person!')
        }

        this.Auth.assign(this.state.reviewee, this.state.reviewers).then((res) => {
            this.setState({
                message: res.message,
                modal: !this.state.modal
            })
        })

    }

    toggle(){
        this.setState({
            modal: !this.state.modal
        })
    }

    modal(){
        return(
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalBody>
                    <h3>{this.state.message}</h3>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
    render(){
        return(
            <div className='assign'>
                <div className='header'>
                    <h1>Assign reviews</h1>
                </div>
                <div className='selecting'>
                    <div className='select-reviewee'>
                        <h5>Select Reviewee</h5>
                        <div className='d-flex flex-row'>
                            <select
                                value={this.state.reviewee} 
                                onChange={this.selectedReviewee} 
                            >
                                {this.printEmployees()}
                            </select>
                            <h6>Reviewee: <span>{this.state.reviewee}</span></h6>
                        </div>
                    </div>
                    <div className='select-reviewers'>
                        <h5>Select Reviewers</h5>
                        <div className='d-flex flex-row'>
                            <select
                                value={this.state.selectedReviewer}
                                onChange={this.selectedReviewer}
                            >
                                {this.printEmployees()}
                            </select>
                            <div>
                                <h6>Reviewers:</h6>
                                <div className='d-flex flex-row reviewer-list'>{this.printReviewers()}</div>
                            </div>    
                        </div>
                    </div>
                    <button 
                        className='btn btn-success'
                        disabled={!this.state.reviewee || this.state.reviewers.length === 0 }
                        onClick={this.assign}
                    >
                    Assign
                    </button>
                </div>    
                
                {this.modal()}        
            </div>    
        )
    }
}


export default Assign