import React, { Component } from 'react';
import EditUser from './EditUser'


class UserHome extends Component {
  // initialized the state so that just the UserContainer displays
  constructor() {
    super();
    this.state = {
      userToEdit: {
        email: '',
        username: ''
      },
      userId: '',
      usernameDisplay: '',
      modalShowing: false,
      dayPlanner: false,
      workPlanner: false,
      entPalnner: false,
      podcast: false,
      news: false,
      activityToShow: '',
      session: ''
    }

  }
  // when the page loads, all of the user's activities are found and stored in the state
  componentDidMount = async () => {

     // sets the state to take the edit user properties
     this.setState({
      userToEdit: {
        email: this.props.email,
        username: this.props.username
      },
      userId: this.props.id,
      // an alternate username display only to be re-rendered when the edit submit is clicked
      usernameDisplay: this.props.username

     })


  }


  // deletes a user's account
  deleteUser = async () => {
    try {

      const response = await fetch(process.env.REACT_APP_API_CALL + 'user/' + this.state.userId, {
        method: 'DELETE',
        credentials: 'include', // on every request we have to send the cookie
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const parsedResponse = await response.json();
      console.log(parsedResponse);




      
      // resets the login page and renders the login component when the user is deleted
      this.props.resetToLogin()



    } catch (err) {

    }
}
  // logs the user out and resets the login page and renders the login component
  logout = async () => {
    try {

      const response = await fetch(process.env.REACT_APP_API_CALL + 'user/logout', {
        method: 'GET',
        credentials: 'include', // on every request we have to send the cookie
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const parsedResponse = await response.json();
      console.log(parsedResponse);


      
      // resets the login page when the logout button is clicked
      this.props.resetToLogin()



    } catch (err) {

    }
  }
  // renders the EditUser component
  // shows the form to edit the user's information
  showModal = () => {
    this.setState({
      modalShowing: true
    })
  }
  // tracks the edit form change
  // this function is passed to the EditUser component and when called state is lifted up from the 
  // EditUser component
  handleFormChange = (e) => {
    this.setState({
      userToEdit: {
        ...this.state.userToEdit,
        [e.currentTarget.name]: e.currentTarget.value
      }
    })
  }
  // closes the modal and updates the user's information
  closeAndEdit = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = await fetch(process.env.REACT_APP_API_CALL + 'user/' + this.state.userId + '/edit', {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(this.state.userToEdit),
        headers: {
          'Content-Type': 'application/json'
        }


      })

      const parsedResponse = await updatedUser.json();
      console.log(parsedResponse);
      
      // hides the modal and resets the state
      this.setState({
        userToEdit: parsedResponse.data,
        modalShowing: false,
        usernameDisplay: parsedResponse.data.username
      })


    } catch (err) {
      console.log(err);
    }
  }

  // function that is passed down to NewNightForm component and the ActivityContainer component
  // this function is used to lift up state when the home "buttons" are clicked
  // It resets the component (UserActivityContainer)
  resetPage = () => {
    
  }
  

  


  render() {
    console.log('===================');
    console.log(this.props);
    console.log('===================');
    console.log(this.state);
    let display = ''
    if (this.state.usernameDisplay === '') {// conditional statement to wait until ComponentDidMount is finished running
                                            // in order to render the page
      display = ''
    } else {// if newActivity is true then render the NewNightForm component
      if (this.state.dayPlanner) {
        display = ''
      } else if (this.state.dayPlanner === false) {//displays user home page on default
        display = (
          <div>
            <h2>{this.state.usernameDisplay}</h2>
            <div className='buttonContainer'>
              <button className='largeButton' type="submit" onClick={this.deleteUser}>Delete Account</button>
              {this.state.modalShowing ? <EditUser closeAndEdit={this.closeAndEdit} handleFormChange={this.handleFormChange} userToEdit={this.state.userToEdit}/> : <button className='largeButton' type='submit' onClick={this.showModal}>Edit User</button>}
              <button className='largeButton' type="submit" onClick={this.logout}>Log Out</button>
            </div>
           
            
          </div>
          )
      }
    }   

    
   


    return(
        <div>
          {display}



        </div>
      )
    
  }
}






export default UserHome;