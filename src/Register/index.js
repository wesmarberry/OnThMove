import React, { Component } from 'react';


class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      username: '',
      password: '',
      lat: 0,
      lng: 0,
      message: ''
    }

  }
  // when the component loads the location is retreived from the browser and the state is set with 
  // the users current location
  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition((data) => {
      const latLong = data
      console.log(latLong);
      
      this.setState({
        lat: latLong.coords.latitude,
        lng: latLong.coords.longitude
      })
      

    })
    
  }
  // handles change in the register form
  handleChange = (e) => {
    
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    })
  }

  
  // on submitting registration a user is created with the specified parameters including location
  handleSubmit = async (e) => {
    e.preventDefault()

    console.log(this.state);
    try {

      const loginResponse = await fetch(process.env.REACT_APP_API_CALL + 'user/register', {
        method: 'POST',
        credentials: 'include', // on every request we have to send the cookie
        body: JSON.stringify(this.state),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const parsedResponse = await loginResponse.json();
      console.log(parsedResponse);



      // if all of the fields arent filled out then the error message is displayed on the page
      if (parsedResponse.data === 'Please fill out all required fields') {
        this.setState({
          message: parsedResponse.data
        })


      } else { // sets the state to logged in so the user home page renders and runs the setUser property which lifts up the state
        this.setState({
          username: parsedResponse.session.username,
          email: parsedResponse.session.email,
          userId: parsedResponse.session.userDbId,
          logged: true
        })
        this.props.setUser(this.state.username, this.state.userId, this.state.email, true, this.state.lat, this.state.lng)
        
      }
      



    } catch (err) {

    }
  }




  

  render() {

        let display = ''
        let message = ''
        if (this.state.lat !== 0) {// if the users location is not found then registration is not available
                                  // users must have location services enabled to register
          display = <button className='button' type="submit">Register</button>
          message = ''
        } else {
          message = <p className='redMessage'>...Getting Your Location...<br/>*Location Services Must be Enabled to Enable Registration</p>
          display = ''
        }

    return(
        <div className='login'>
          <br/>
          <img className='image-logo' src='image (7).png'/><br/>
          <form className='loginForm' onSubmit={this.handleSubmit}>
            <input type="text" name="email" placeholder="email" value={this.state.email} onChange={this.handleChange}/><br/>
            <input type="text" name="username" placeholder="username" value={this.state.username} onChange={this.handleChange}/><br/>
            <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange}/><br/>
            <div className='loginButtonContainer'>
              {display}
              <button className='button' onClick={this.props.resetToLogin}>Return To Login</button>
            </div>
          </form>
          <p className='redMessage'>{this.state.message}</p><br/>
          {message}
        </div>
      )
    
  }
}

export default Register;