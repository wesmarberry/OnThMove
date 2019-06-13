import React, { Component } from 'react';
import EditUser from './EditUser'
import EntPlanner from './EntPlanner'
import News from './News'
import Podcast from './Podcast'
import WorkPlanner from './WorkPlanner'


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
      entPlanner: false,
      podcast: false,
      news: false,
      activityToShow: '',
      session: '',
      currentDate: '',
      podcastPlaying: ''
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
      currentDate: this.getCurrentDateNiceVersion(),// sets the state to the current date
      // an alternate username display only to be re-rendered when the edit submit is clicked
      usernameDisplay: this.props.username

     })


  }


  // function to display the current date in a readable version
  getCurrentDateNiceVersion = () => {
    const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = months[today.getMonth()]; //January is 0!
    const yyyy = today.getFullYear();

    today = mm + ' ' + dd + ', ' + yyyy;
    return today
  }

  // function to get the current date in the raw version ie. 2019-06-12
  getCurrentDate = () => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
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





      
      // resets the login page and renders the login component when the user is deleted
      this.props.resetToLogin()



    } catch (err) {
      console.log(err);
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
      


      
      // resets the login page when the logout button is clicked
      this.props.resetToLogin()



    } catch (err) {
      console.log(err);
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

 
  // function to display whichever component the user clicks on 
  toggleComponent = (e) => {
    if (e.currentTarget.id === 'podcast') {
      this.setState({
        [e.currentTarget.id]: true
      })
    } else {
      this.setState({
        [e.currentTarget.id]: true
      })
    }
  }
  
  // function that is passed down to the child components that lifts resets the home page
  homePage = () => {
    this.setState({
      workPlanner: false,
      entPlanner: false,
      podcast: false,
      news: false
    })
  }

  // function to set the current podcast that is playing if the user changes the podcast or 
  // initially presses play on a podcast
  setPodcast = async (id) => {
    
    // if statement to tell if the user has clicked on a new podcast or if no podcast is playing
    if (this.state.podcastPlaying === '') {

      await this.setState({
        podcastPlaying: <audio id='podcastPlaying' className={id} autoPlay controls>
                  <source src={id} type="audio/mpeg"/>
                </audio>
      })

      // displays the podcast that is playing
      this.showPlaying()
    } 
  }


  // every time "play" is hit on a podcast this function is called
  // the podcast is either changed if it is different than the podcast currently playing
  // or plays/pauses the currently playing podcast
  resetPodcastState = async (e) => {
    
    
    const id = e.currentTarget.id

    if (this.state.podcastPlaying === '') {

      this.setPodcast(id)
    } else {

      // tests whether the currently playin podcast is the same as the one clicked
      if (id != this.state.podcastPlaying.props.className) {
        
        await this.setState({
          podcastPlaying: ''
        })


        await this.setPodcast(id)
      } else {

        this.setPodcast(id)
      }
      
    }
  }

  

 
  // shows the currently podcast playing on the podcast home page
  showPlaying = () => {
    if (document.getElementById('podcastPlayingHidden') !== null && this.state.podcastPlaying !== '') {

      document.getElementById('podcastPlayingHidden').setAttribute('id', 'podcastPlayingShowing');

    }
  }

  // hides the playing podcast when not on the podcast show page
  hidePlaying = () => {
    if (document.getElementById('podcastPlayingShowing') !== null) {
      document.getElementById('podcastPlayingShowing').setAttribute('id', 'podcastPlayingHidden');
    }
  }

  render() {
    
    let display = ''
    if (this.state.usernameDisplay === '') {// conditional statement to wait until ComponentDidMount is finished running
                                            // in order to render the page
      display = ''
    } else {// if everything has loaded the conditional render is started
      if (this.state.workPlanner) {
        display = <WorkPlanner homePage={this.homePage} getCurrentDate={this.getCurrentDate} getCurrentDateNiceVersion={this.getCurrentDateNiceVersion} userId={this.state.userId}/>
      } else if (this.state.entPlanner) {
        display = <EntPlanner homePage={this.homePage} getCurrentDate={this.getCurrentDate} getCurrentDateNiceVersion={this.getCurrentDateNiceVersion} userId={this.state.userId} position={this.props.position}/>
      } else if (this.state.podcast) {
        display = <Podcast homePage={this.homePage} userId={this.state.userId} setPodcast={this.setPodcast} pausePodcast={this.pausePodcast} unmutePodcast={this.unmutePodcast} resetPodcastState={this.resetPodcastState} showPlaying={this.showPlaying} hidePlaying={this.hidePlaying}/>
      } else if (this.state.news) {
        display = <News homePage={this.homePage} userId={this.state.userId}/>
      } else {//displays user home page on default
        display = (
          <div className='bodyDiv'>
          <div className='userHomeOverallDiv'>
            <br/>
            <div className='between-flex-container'>
              <img className='image-logo-small' src='image (7).png'/>
              <div className='buttonContainer center-column-flex-container'>
                <button className='button' type="submit" onClick={this.deleteUser}>Delete Account</button>
                {this.state.modalShowing ? <EditUser closeAndEdit={this.closeAndEdit} handleFormChange={this.handleFormChange} userToEdit={this.state.userToEdit}/> : <button className='button' type='submit' onClick={this.showModal}>Edit User</button>}
                <button className='button' type="submit" onClick={this.logout}>Log Out</button>
              </div>

            </div>
            <div className='between-flex-container'>
              <h2 className='username'>{this.state.usernameDisplay}</h2>
              <p className='currentDate'>{this.state.currentDate}</p>
            </div>
            <div className='center-column-flex-container tileRow'>
              <div className='between-flex-container'>
                <div id='entPlanner' className='tile center-flex' onClick={this.toggleComponent}>
                  <h7 className='header'>Entertainment Planner</h7>
                </div>
                <div id='workPlanner' className='tile center-flex' onClick={this.toggleComponent}>
                  <h7 className='header'>Task Planner</h7>
                </div>
              </div>

              <div className='between-flex-container tileRow'>
                <div id='podcast' className='tile center-flex' onClick={this.toggleComponent}>
                  <h7 className='header'>Podcasts</h7>
                </div>
                <div id='news' className='tile center-flex' onClick={this.toggleComponent}>
                  <h7 className='header'>News</h7>
                </div>
              </div>
            </div>
           
            
          </div>
          </div>
          )
      }
    }   

    
   


    return(
        <div>
          {display}
          <div id='podcastPlayingShowing'>
            {this.state.podcastPlaying}
          </div>



        </div>
      )
    
  }
}






export default UserHome;