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
      this.props.showPlaying()
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
          <li key={i} className='liContainer'>
            <div className='center-column-flex-container podcastCol'>
            <img className='podcastImg' src={podcast.image}/><br/>
            {podcast.title_original}<br/>
            </div>
            <div className='buttonCol'>
            <button className='button addRec' id={podcast.id} onClick={this.addPodcast}>Add</button>
            </div>
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
      let displaySearch = ''
      if (parsedResponse.data.body.recommendations === undefined) {
        if (parsedResponse.data.body.results === undefined) {
          this.setState({
            recommended: []
          })
        } else {
          displaySearch = parsedResponse.data.body.results.map((podcast, i) => {
              return (
                <li key={i} className='liContainer'>
            <div className='center-column-flex-container podcastCol'>
            <img src={podcast.image}/><br/>
            {podcast.title}<br/>
            </div>
            <div className='buttonCol'>
            <button className='button addRec' id={podcast.id} onClick={this.addPodcast}>Add</button>
            </div>
          </li>

              )
          })
          
        }
      } else {
        displaySearch = parsedResponse.data.body.recommendations.map((podcast, i) => {
        return (
            <li key={i} className='liContainer'>
            <div className='center-column-flex-container podcastCol'>
            <img src={podcast.image}/><br/>
            {podcast.title}<br/>
            </div>
            <div className='buttonCol'>
            <button className='button addRec' id={podcast.id} onClick={this.addPodcast}>Add</button>
            </div>
          </li>

          )
      })
        
      }
      console.log(displaySearch);
      this.setState({
        recommended: displaySearch
      })
    } catch (err) {

    }
  }

  deletePodcast = async (e) => {
    console.log(e.currentTarget.id);
    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'podcast/' + e.currentTarget.id, {
        method: 'DELETE',
        credentials: 'include', // on every request we have to send the cookie
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const parsedResponse = await response.json();
      console.log('parsed Response from recommended');
      console.log(parsedResponse);
      this.showUsersPodcasts()
    } catch (err) {

    }
  }

  returnToPodcastHome = () => {
    this.setState({
      showPodcast: false,
      searchedPodcasts: []
    })
    this.props.hidePlaying()
  }

  handleChange = (e) => {
    
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    })
  }

  render() {
    
    console.log('================');
    console.log(this.props);


    let display = ''
    let searchDisplay = ''
    if (this.state.showPodcast) {
      display = <ShowPodcast podcastToShow={this.state.podcastToShow} returnToPodcastHome={this.returnToPodcastHome} setPodcast={this.props.setPodcast} pausePodcast={this.props.pausePodcast} unmutePodcast={this.props.unmutePodcast} resetPodcastState={this.props.resetPodcastState} showPlaying={this.props.showPlaying}/>
    } else if (this.state.searchedPodcasts.length === 0) {
      display = (
        <div>
          <div className='between-flex-container'>
              <img className='image-logo-small' src='image (7).png'/>
              <div className='buttonContainer center-column-flex-container'>
               <h1 className='header'>Podc<span className='redLetter'>a</span>sts</h1> 
               <button class='button' onClick={this.props.homePage}>Back</button>
                
              </div>

          </div>
          <div className='center-column-flex-container'>
            <div className='yourPodcastOverallContainer'>
              <h2 className='header'>Your Podcasts</h2>
              <UserPodcastContainer userPodcasts={this.state.userPodcasts} showPodcast={this.showPodcast} deletePodcast={this.deletePodcast}/>
            </div>
          </div>
          <form onSubmit={this.searchPodcasts} className='searchForm'>
            <input type='text' name='search' value={this.state.search} onChange={this.handleChange} placeholder='Search For Podcasts'/>
            <button className='button' type='submit'>Search</button>
          </form><br/>
          <div className='between-flex-container'>
            <div className='popularPodcastsContainer'>
              <h2 className='header'>Popular Podcasts</h2>
              <PopularContainer popular={this.state.popular} addPodcast={this.addPodcast}/>
            </div>
            <div className='popularPodcastsContainer'>
              <h2 className='header recHeader'>Recommended For You</h2>
              <div>
              <ul className='center-column-flex-container'>
              {this.state.recommended}
              </ul>
              </div>
              
            </div>
          </div>



         
        </div>
        )
    } else {
      display = (
        <div>
          <div className='between-flex-container'>
              <img className='image-logo-small' src='image (7).png'/>
              <div className='buttonContainer center-column-flex-container'>
               <h1 className='header'>Podc<span className='redLetter'>a</span>sts</h1> 
               <button class='button' onClick={this.props.homePage}>Back</button>
                
              </div>

          </div>
          <div>
          <h2 className='header'>Your Podcasts</h2>
          <UserPodcastContainer userPodcasts={this.state.userPodcasts} showPodcast={this.showPodcast} deletePodcast={this.deletePodcast}/>
          </div>
          <form onSubmit={this.searchPodcasts} className='searchForm'>
            <input type='text' name='search' value={this.state.search} onChange={this.handleChange} placeholder='Search For Podcasts'/>
            <button className='button' type='submit'>Search</button>
          </form><br/>
          <div className='between-flex-container'>
            <div className='popularPodcastsContainer'>
              <h2 className='header'>Popular Podcasts</h2>
              <PopularContainer popular={this.state.popular} addPodcast={this.addPodcast}/>
            </div>
            <div className='popularPodcastsContainer1'>
              <h2 className='header'>Search Results</h2>
              <div>
              <ul className='center-column-flex-container'>
              {this.state.searchedPodcasts}
              </ul>
              </div>
            </div>
          </div>



         
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