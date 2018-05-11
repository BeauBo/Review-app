import React, { Component } from 'react'
import { Button, CardBody, Card, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import AuthService from './AuthService'

class Reviews extends Component {
    constructor(props){
        super(props)
        this.state = {
            user: {},
            employees: [],
            selectedEmployee: '',
            selectedReviews: [],
            employeeToAddReview:'',
            modalAdd: false,
            modalEdit: false,
            editedContent: '',
            reviewedBy: '',
            editFor:'',
            reviewId: ''
        }
        this.Auth = new AuthService()
        this.expandReviews = this.expandReviews.bind(this)
        this.isActive = this.isActive.bind(this)
        this.add = this.add.bind(this)
        this.addToggle = this.addToggle.bind(this)
        this.saveAdd = this.saveAdd.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.editToggle = this.editToggle.bind(this)
        this.edit = this.edit.bind(this)
        this.saveEdit = this.saveEdit.bind(this)
    }

    componentDidMount(){
        this.Auth.getEmployeeList().then(res => {
            this.setState({
                employees: res.employees
            })
        })
        const user = this.Auth.getProfile()
        this.setState({
            user
        })
    }

   

    addToggle(){
        this.setState({
            modalAdd: !this.state.modalAdd
        })
    }

    add(e){
        const selectedEmployee = e.currentTarget.dataset.selectedemployee
        this.setState({
            employeeToAddReview : selectedEmployee,
            modalAdd: !this.state.modalAdd
        })
    }
    saveAdd(){
        this.Auth.addReview(this.state.employeeToAddReview, this.state.reviewContent, this.state.user.user.username).then(() => {
            this.Auth.getReviews(this.state.employeeToAddReview).then(() => {
                this.setState({
                    modalAdd: !this.state.modalAdd
                })
            })
        })
    }

    editToggle(){
        this.setState({
            modalEdit: !this.state.modalEdit
        })
    }
    edit(e){
        const editFor = e.currentTarget.dataset.editfor
        const editedContent = e.currentTarget.dataset.editedcontent
        const reviewedBy = e.currentTarget.dataset.reviewedby
        const reviewId = e.currentTarget.dataset.reviewid

        this.setState({
            editFor,
            editedContent,
            reviewedBy,
            reviewId,
            modalEdit: !this.state.modalEdit
        })
    }

    saveEdit(){
        this.Auth.updateReview(
            this.state.reviewId, 
            this.state.editing, 
            this.state.user.user.username).then( () => {
                this.Auth.getReviews(this.state.editFor).then( res => {
                    this.setState({
                        selectedReviews: res.reviews,
                        modalEdit: !this.state.modalEdit
                    })
                })
            })
    }
    isActive(selectedEmployee){
        return selectedEmployee === this.state.selectedEmployee
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    expandReviews(e){
        const selectedEmployee = e.currentTarget.dataset.selectedemployee
        if(this.isActive(selectedEmployee)){
          return  this.setState({
                selectedEmployee: ''
            })
        }
        this.Auth.getReviews(selectedEmployee).then((res) => {
            this.setState({
                selectedEmployee,
                selectedReviews: res.reviews
            })
        })
        
    }

    

    addModal(){
        return(
            <Modal isOpen={this.state.modalAdd} toggle={this.addToggle}>
                   <ModalHeader toggle={this.addToggle}>
                       <h2>Add new review for {this.state.employeeToAddReview}</h2>
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

    editModal(){
        return(
            <Modal isOpen={this.state.modalEdit} toggle={this.editToggle}>
                <ModalHeader toggle={this.editToggle}>
                    <h2>Edit review for {this.state.editFor}</h2>
                    <small>Reviewed by {this.state.reviewedBy}</small>
                </ModalHeader>
                <ModalBody>
                    <textarea 
                    name='editing'
                    placeholder='Enter review here'
                    onChange={this.handleChange}
                    >
                    {this.state.editedContent}
                    </textarea>
                </ModalBody>
                <ModalFooter>
                    <Button 
                        color="primary" 
                        onClick={this.saveEdit}
                        disabled={!this.state.editing}
                    >
                    Save
                    </Button>
                    <Button color="secondary" onClick={this.editToggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
        
    }

    printReviews(employee){
        const expandReviews = this.isActive(employee)? 'expand-reviews' : ''
        if(this.state.selectedReviews.length === 0){
            return(
                <div className={`employee-reviews ${expandReviews}`}>
                    <div className='cards' >
                        <Card className='card'>
                            <CardBody>
                                <p>No reviews for {employee} yet!</p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            )
        }else{
            return(
                <div className={`employee-reviews ${expandReviews}`}>
                    <div className='cards' >
                        {this.state.selectedReviews.map((review) => {
                            return(
                                <Card className='card'>
                                    <CardBody>
                                        <div className='d-flex flex-row justify-content-between'>
                                            <p className='by-whom text-muted'>{review.byWhom}:</p>  
                                            <i 
                                                onClick={this.edit}
                                                data-editedcontent={review.content}
                                                data-editfor={review.username}
                                                data-reviewedby={review.byWhom}
                                                data-reviewid={review._id}
                                                className='fa fa-edit edit'
                                            ></i>
                                        </div>
                                        <p className='content'>{review.content}</p>
                                    </CardBody>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            )
        }
    }

    printEmployees(){
        return this.state.employees.map((employee) => {
            const reviewButton = this.isActive(employee.username) ? 'Collapse' : 'Open'
            return(
               <div className='d-flex flex-column employee'>
                    <div className='employee-dashboard d-flex flex-row justify-content-between'>
                        <div className='d-flex flex-row'>
                            <p className='name'>{employee.username}</p>
                            <p  className='text-muted department'>{employee.department}</p>
                        </div>
                        <div className='d-flex flex-row'>
                            <p className='see-reviews' data-selectedemployee={employee.username} onClick={this.expandReviews}>{reviewButton}</p>
                            <i className='fa fa-plus add' data-selectedemployee={employee.username} onClick={this.add}></i>
                        </div>

                    </div>
                    {this.printReviews(employee.username)}    
               </div>
            )
        })
    }
    render(){
        return(
            <div className='reviews'>
                <div className='header'>
                    <h1>Review list</h1>
                </div>    
                {this.printEmployees()}
                {this.addModal()}
                {this.editModal()}
            </div>
        )
    }
}


export default Reviews