import React, { Component } from 'react';
import PopularContainer from './PopularContainer'
import UserPodcastContainer from './UserPodcastContainer'

class Podcast extends Component {
  constructor() {
    super();
    this.state = {
      popular: [],
      userPodcasts: []
    }

  }

  componentDidMount() {
    this.findPopular()
    this.showUsersPodcasts()
  }


  findPopular = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'podcast/popular', {
        method: 'GET',
        credentials: 'include', // on every request we have to send the cookie
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const parsedResponse = await response.json();
      console.log('parsed Response from popular');
      console.log(parsedResponse);

      this.setState({
        popular: parsedResponse.data
      })

    } catch (err) {

    }
  }

  addPodcast = async (e) => {
    console.log(e.currentTarget);
    const body = e.currentTarget.id

    try { 
      
      const response = await fetch(process.env.REACT_APP_API_CALL + 'podcast/' + body + '/' + this.props.userId + '/create', {
        method: 'GET',
        credentials: 'include', // on every request we have to send the cookie
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('got past apicall');
      const parsedResponse = await response.json();
      console.log('parsed Response from add');
      console.log(parsedResponse);
      this.showUsersPodcasts()

    } catch (err) {

    }

  }
  
  showUsersPodcasts = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'user/' + this.props.userId, {
        method: 'GET',
        credentials: 'include', // on every request we have to send the cookie
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const parsedResponse = await response.json();
      console.log('parsed Response');
      console.log(parsedResponse);
      
      this.setState({
        userPodcasts: parsedResponse.data.podcasts


      })

    } catch (err) {

    }
  }


  render() {

        

    return(
        <div>
          <h1>Podcast</h1>
          <p onClick={this.props.homePage}>Back</p>
          <h2>Your Podcasts</h2>
          <UserPodcastContainer userPodcasts={this.state.userPodcasts}/>
          <h2>Popular Podcasts</h2>
          <PopularContainer popular={this.state.popular} addPodcast={this.addPodcast}/>

         
        </div>
      )
    
  }
}

export default Podcast;