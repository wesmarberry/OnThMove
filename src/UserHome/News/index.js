import React, { Component } from 'react';
import ShowNews from './ShowNews'


class News extends Component {
  constructor() {
    super();
    this.state = {
      topHeadlines: [],
      formattedTopHeadlines: [],
      recommended: [],
      formattedRecommended: [],
      userArticles: [],
      formattedUserArticles: [],
      search: '',
      showNews: false,
      articleToShow: '',
      recommendedShowing: true
    }

  }


    componentDidMount() {
      this.getTopHeadlines()
      this.getRecommended()
      this.showUserArticles()
    }

    // shows all of a user's articles
    showUserArticles = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_CALL + 'user/' + this.props.userId, {
          method: 'GET',
          credentials: 'include', // on every request we have to send the cookie
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const parsedResponse = await response.json();
        
        // creates a formatted list to display on the page
        const formattedUserArticles = parsedResponse.data.news.map((article, i) => {
          return (
            <li key={article._id} >
              
                <img className='clickableImg' src={article.image} id={article._id} onClick={this.showArticle}/><br/>
                {article.title}<br/>
                <button className='button userDelete' id={article._id} onClick={this.deleteArticle}>Delete</button>

            </li>
            )
        })
        this.setState({
          userArticles: parsedResponse.data.news,
          formattedUserArticles: formattedUserArticles


        })

      } catch (err) {
        console.log(err);
      }
    }
    // deletes a user's articles
    deleteArticle = async (e) => {
      
      try {
        const response = await fetch(process.env.REACT_APP_API_CALL + 'news/' + e.currentTarget.id, {
          method: 'DELETE',
          credentials: 'include', // on every request we have to send the cookie
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const parsedResponse = await response.json();
        
        this.showUserArticles()
      } catch (err) {

      }
    }

    // makes api call to show top headliness
    getTopHeadlines = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_CALL + 'news/top', {
            method: 'GET',
            credentials: 'include', // on every request we have to send the cookie
            headers: {
              'Content-Type': 'application/json'
            }
          })
        const parsedResponse = await response.json();
        // creates formatted top headlines with hidden inputes to create articles
        // when add is clicked
        const formattedTopHeadlines = parsedResponse.data.map((article, i) => {
          return (
              <li key={i} >
                <form id={i} onSubmit={this.addArticle}>
                  <div className='center-column-flex-container podcastCol'>
                    <img className='newsImg' src={article.urlToImage}/><br/>
                    {article.title}
                    <input type='hidden' name='content' value={article.content}/>
                    <input type='hidden' name='description' value={article.description}/>
                    <input type='hidden' name='author' value={article.author}/>
                    <input type='hidden' name='publishedDate' value={article.publishedAt}/>
                    <input type='hidden' name='image' value={article.urlToImage}/>
                    <input type='hidden' name='title' value={article.title}/>
                    <input type='hidden' name='url' value={article.url}/>
                    <div className='buttonCol'>
                      <button className='button newsBtn' type='submit'>Add</button>
                    </div>
                  </div>
                </form>
                
              </li>
           )
        })
        this.setState({
          topHeadlines: parsedResponse.data,
          formattedTopHeadlines: formattedTopHeadlines
        })
      } catch (err) {
        console.log(err);
      }
    }
  // gets recommended articles based on users past searches
  getRecommended = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'news/' + this.props.userId + '/recommended', {
          method: 'GET',
          credentials: 'include', // on every request we have to send the cookie
          headers: {
            'Content-Type': 'application/json'
          }
        })
      const parsedResponse = await response.json();
      // creates formatted top headlines with hidden inputes to create articles
      // when add is clicked
      const formattedRecommended = parsedResponse.data.map((article, i) => {
        return (
            <li key={i} >
              <form id={i} onSubmit={this.addArticle}>
                <div className='center-column-flex-container podcastCol'>
                  <img className='newsImg' src={article.urlToImage}/><br/>
                  {article.title}
                  <input type='hidden' name='content' value={article.content}/>
                  <input type='hidden' name='description' value={article.description}/>
                  <input type='hidden' name='author' value={article.author}/>
                  <input type='hidden' name='publishedDate' value={article.publishedAt}/>
                  <input type='hidden' name='image' value={article.urlToImage}/>
                  <input type='hidden' name='title' value={article.title}/>
                  <input type='hidden' name='url' value={article.url}/>
                  <div className='buttonCol'>
                    <button className='button newsBtn' type='submit'>Add</button>
                  </div>
                </div>
              </form>
              
            </li>
         )
      })
      this.setState({
        recommended: parsedResponse.data,
        formattedRecommended: formattedRecommended
      })
    } catch (err) {
      console.log(err);
    }
  }
  

  // searches for news baseed on user search submission
  searchNews = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'news/' + this.state.search + '/' + this.props.userId + '/search', {
          method: 'GET',
          credentials: 'include', // on every request we have to send the cookie
          headers: {
            'Content-Type': 'application/json'
          }
        })
      const parsedResponse = await response.json();
      // creates formatted searched with hidden inputes to create articles
      // when add is clicked
      const formattedRecommended = parsedResponse.data.map((article, i) => {
        return (
            <li key={i} >
              <form id={i} onSubmit={this.addArticle}>
                <div className='center-column-flex-container podcastCol'>
                  <img className='newsImg' src={article.urlToImage}/><br/>
                  {article.title}
                  <input type='hidden' name='content' value={article.content}/>
                  <input type='hidden' name='description' value={article.description}/>
                  <input type='hidden' name='author' value={article.author}/>
                  <input type='hidden' name='publishedDate' value={article.publishedAt}/>
                  <input type='hidden' name='image' value={article.urlToImage}/>
                  <input type='hidden' name='title' value={article.title}/>
                  <input type='hidden' name='url' value={article.url}/>
                  <div className='buttonCol'>
                    <button className='button newsBtn' type='submit'>Add</button>
                  </div>
                </div>
              </form>
              
            </li>
         )
      })
      this.setState({
        recommended: parsedResponse.data,
        formattedRecommended: formattedRecommended,
        search: '',
        recommendedShowing: false
      })
    } catch (err) {
      console.log(err);
    }
  }

  addArticle = async (e) => {
      e.preventDefault()
      
      // creates the necessary parameters to create an article based on which article is clicked
      const articleDbEntry = {}
      articleDbEntry.content = e.currentTarget.content.value
      articleDbEntry.description = e.currentTarget.description.value
      articleDbEntry.author = e.currentTarget.author.value
      articleDbEntry.publishedDate = e.currentTarget.publishedDate.value
      articleDbEntry.userId = this.props.userId
      articleDbEntry.image = e.currentTarget.image.value
      articleDbEntry.title = e.currentTarget.title.value
      articleDbEntry.url = e.currentTarget.url.value
      // stores the index of the current target
      const index = e.currentTarget.id
      
      try {
        const response = await fetch(process.env.REACT_APP_API_CALL + 'news/add', {
          method: 'POST',
          credentials: 'include', // on every request we have to send the cookie
          body: JSON.stringify(articleDbEntry),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const parsedResponse = await response.json();
        

        this.showUserArticles()
      } catch (err) {
        console.log(err);
      }

    }
    // toggles to the users's article page when the user clicks an image
    showArticle = async (e) => {

      try {
        const response = await fetch(process.env.REACT_APP_API_CALL + 'news/' + e.currentTarget.id, {
          method: 'GET',
          credentials: 'include', // on every request we have to send the cookie
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const parsedResponse = await response.json();
        
        await this.setState({
          articleToShow: parsedResponse.data
        })
        this.toggleShowNews()
      } catch (err) {
        console.log(err);
      }
    }

    // renders the show news component when the user clicks an article
    toggleShowNews = () => {
      
      if (this.state.showNews === false) {
        this.setState({
          showNews: true
        })
      } else {
        this.setState({
          showNews: false
        })
      }
    }

    // handles form change
    handleChange = (e) => {
    
      this.setState({
        [e.currentTarget.name]: e.currentTarget.value
      })
    }

    // returns to the news home page and resets the component
    returnToNewsHome = () => {
      this.setState({
        showNews: false
      })
    }

    render() {

      let display = ''
      if (this.state.showNews === false) {// conditional rendering for the ShowNews component
        display = (
          <div>
            <div className='between-flex-container'>
                <img className='image-logo-small' src='image (7).png'/>
                <div className='buttonContainer center-column-flex-container'>
                  <h1 className='header'>N<span className='redLetter'>e</span>ws</h1> 
                  <button class='button' onClick={this.props.homePage}>Back</button>

                </div>

            </div>
            <div className='center-column-flex-container'>
              <div className='yourArticleOverallContainer'>
                <div>
                  <h2 className='header'>Your Articles</h2>
                  <ul className='between-flex-container articleUl'>
                    {this.state.formattedUserArticles}
                  </ul>
                </div>
              </div>
            </div>
            
            <form onSubmit={this.searchNews} className='searchForm'>
              <input type='text' name='search' value={this.state.search} onChange={this.handleChange} placeholder='Search For Articles'/>
              <button className='button' type='submit'>Search</button>
            </form><br/>
            <div className='between-flex-container'>
              <div className=' popularArticlesContainer'>
                {this.state.recommendedShowing ? <h2 className='header'>Recommended For You</h2> : <h2 className='header'>Search Results</h2>}
              
                <ul>
                  {this.state.formattedRecommended}
                </ul>
              </div>
                <div className=' popularArticlesContainer'>
                <h2 className='header'>Top Headlines</h2>
                <ul>
                  {this.state.formattedTopHeadlines}
                  
                </ul>
              </div>
            </div>


          </div>


          )
      } else {
        display = <ShowNews articleToShow={this.state.articleToShow} toggleShowNews={this.toggleShowNews} returnToNewsHome={this.returnToNewsHome}/>
      }
          

      return(
          <div>
            {display}
          </div>
        )
      
    }
}

export default News;