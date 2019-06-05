import React, { Component } from 'react';
import PopularContainer from './PopularContainer'
import UserPodcastContainer from './UserPodcastContainer'
import ShowPodcast from './ShowPodcast'

class Podcast extends Component {
  constructor() {
    super();
    this.state = {
      popular: [],
      userPodcasts: [],
      showPodcast: false,
      podcastToShow: '',
      playingPodcast: '',
      search: '',
      recommended: [],
      searchedPodcasts: [],
      userId: ''
    }

  }

  componentDidMount() {
    this.setState({
      userId: this.props.userId
    })
    this.findPopular()
    this.showUsersPodcasts()
    this.findRecommendedPodcasts()
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

  showPodcast = async (e) => {
    console.log(e.currentTarget);
    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'podcast/' + e.currentTarget.id, {
        method: 'GET',
        credentials: 'include', // on every request we have to send the cookie
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const parsedResponse = await response.json();
      console.log('parsed Response from show');
      console.log(parsedResponse);
      this.setState({
        podcastToShow: parsedResponse.data,
        showPodcast: true
      })
    } catch (err) {

    }
  }

  searchPodcasts = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'podcast/find/' + this.state.search + '/' + this.props.userId, {
        method: 'GET',
        credentials: 'include', // on every request we have to send the cookie
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const parsedResponse = await response.json();
      console.log('parsed Response from search');
      console.log(parsedResponse);
      const displaySearch = parsedResponse.data.body.results.map((podcast, i) => {
      return (
          <li key={i}>
            <img src={podcast.image}/><br/>
            Title: {podcast.title_original}<br/>
            <button id={podcast.id} onClick={this.addPodcast}>Add</button>
          </li>

        )
    })
      console.log(displaySearch);
      this.setState({
        searchedPodcasts: displaySearch
      })
    } catch (err) {

    }
  }

  findRecommendedPodcasts = async () => {

    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'podcast/recommended/' + this.props.userId, {
        method: 'GET',
        credentials: 'include', // on every request we have to send the cookie
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const parsedResponse = await response.json();
      console.log('parsed Response from recommended');
      console.log(parsedResponse);
      const displaySearch = parsedResponse.data.body.recommendations.map((podcast, i) => {
      return (
          <li key={i}>
            <img src={podcast.image}/><br/>
            Title: {podcast.title}<br/>
            <button id={podcast.id} onClick={this.addPodcast}>Add</button>
          </li>

        )
    })
      console.log(displaySearch);
      this.setState({
        recommended: displaySearch
      })
    } catch (err) {

    }
  }

  returnToPodcastHome = () => {
    this.setState({
      showPodcast: false,
      searchedPodcasts: []
    })
  }

  handleChange = (e) => {
    
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    })
  }

  render() {
    
    console.log('================');
    console.log(this.state);


    let display = ''
    let searchDisplay = ''
    if (this.state.showPodcast) {
      display = <ShowPodcast podcastToShow={this.state.podcastToShow} returnToPodcastHome={this.returnToPodcastHome}/>
    } else if (this.state.searchedPodcasts.length === 0) {
      display = (
        <div>
          <h1>Podcast</h1>
          
          <p onClick={this.props.homePage}>Back</p>
          <h2>Your Podcasts</h2>
          <UserPodcastContainer userPodcasts={this.state.userPodcasts} showPodcast={this.showPodcast}/>
          <h2>Popular Podcasts</h2>
          <PopularContainer popular={this.state.popular} addPodcast={this.addPodcast}/>
          <h2>Search</h2>
          <form onSubmit={this.searchPodcasts}>
            <input type='text' name='search' value={this.state.search} onChange={this.handleChange}/>
            <button type='submit'>Search</button>
          </form><br/>
          <h2>Recommended For You</h2>
          {this.state.recommended}



         
        </div>
        )
    } else {
      display = (
        <div>
          <h1>Podcast</h1>
          
          <p onClick={this.props.homePage}>Back</p>
          <h2>Your Podcasts</h2>
          <UserPodcastContainer userPodcasts={this.state.userPodcasts} showPodcast={this.showPodcast}/>
          <h2>Popular Podcasts</h2>
          <PopularContainer popular={this.state.popular} addPodcast={this.addPodcast}/>
          <h2>Search</h2>
          <form onSubmit={this.searchPodcasts}>
            <input type='text' name='search' value={this.state.search} onChange={this.handleChange}/>
            <button type='submit'>Search</button>
          </form>
          {this.state.searchedPodcasts}



         
        </div>
        )
    }
    return(
        <div>
          {display}

         
        </div>
      )
    
  }
}

export default Podcast;