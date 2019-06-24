import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login'
import Register from './Register'
import UserHome from './UserHome'
import ResetPage from './ResetPage'


class App extends Component {
  // sets initial conditions for log in
  constructor() {
    super()
    this.state = {
      username: '',
      userId: '',
      email: '',
      logged: false,
      needToRegister: false,
      forgotPassword: false,
      position: '',
      emailToSend: '',
      passwordResetMessage: ''
    }
  }
  // function for setting the state with the user that just logged in or registered
  setUser = (username, userId, email, logged, lat, lng) => {
    console.log('ran setUser with' + username + ' ' + userId);
    this.setState({
      username: username,
      userId: userId,
      email: email,
      logged: logged,
      position: {
        lat: lat,
        lng: lng
      }
    })
  }
  // when the user clicks on the register button the register component is rendered
  showRegister = () => {
    this.setState({
      needToRegister: true
    })
  }

  showReset = () => {
    this.setState({
      forgotPassword: true
    })
  }
  // function to handle log out and reset to login conditions
  resetToLogin = () => {
    this.setState({
      username: '',
      userId: '',
      email: '',
      logged: false,
      needToRegister: false,
      forgotPassword: false,
      passwordResetMessage: '',
      emailToSend: ''
    })
  }

  handleEmailChange = (e) => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    })
  }
  
  resetPassword = async (e) => {
    e.preventDefault()
    console.log('hit reset password');
    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'user/reset', {
        method: 'POST',
        credentials: 'include', // on every request we have to send the cookie
        body: JSON.stringify(this.state),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('got past call');
      const parsedResponse = await response.json();
      console.log(parsedResponse);

      this.setState({
        passwordResetMessage: parsedResponse.data
      })
    } catch (err) {
      console.log(err);
    }
  }


  render(){

    console.log(this.state);
    let display = '' 
    // if login successful render the user home page ie. "UserContainer" component
    if (this.state.logged) {
      display = <UserHome username={this.state.username} email={this.state.email} id={this.state.userId} resetToLogin={this.resetToLogin} position={this.state.position}/>
    } else if (this.state.needToRegister) { // if the user needs to register, render the register component
      display = <Register setUser={this.setUser} resetToLogin={this.resetToLogin}/>
    } else if (this.state.forgotPassword) { 
      display = <ResetPage resetToLogin={this.resetToLogin} handleEmailChange={this.handleEmailChange} passwordResetMessage={this.state.passwordResetMessage} resetPassword={this.resetPassword}/>
    } else {// if the user if not logged in or needs to register, display the log in component
      display = <Login setUser={this.setUser} showRegister={this.showRegister} showReset={this.showReset}/>
    }



    return (
      <div className="App">
          {display}
          
          
        
      
      </div>
    );
    
  }
}

export default App;
