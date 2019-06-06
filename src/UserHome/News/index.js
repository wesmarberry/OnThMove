import React, { Component } from 'react';


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
      search: ''
    }

  }


  componentDidMount() {
    this.getTopHeadlines()
    this.getRecommended()
    this.showUserArticles()
  }

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
      console.log('parsed Response');
      console.log(parsedResponse);
      
      const formattedUserArticles = parsedResponse.data.news.map((article, i) => {
        return (
          <li key={article._id} id={article._id}>
            
              <img src={article.image} onClick={this.showArticle}/><br/>
              {article.title}<br/>
              <button id={article._id} onClick={this.deleteArticle}>Delete</button>

          </li>
          )
      })
      this.setState({
        userArticles: parsedResponse.data.news,
        formattedUserArticles: formattedUserArticles


      })

    } catch (err) {

    }
  }

  deleteArticle = async (e) => {
    console.log(e.currentTarget.id);
    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'news/' + e.currentTarget.id, {
        method: 'DELETE',
        credentials: 'include', // on every request we have to send the cookie
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const parsedResponse = await response.json();
      console.log('parsed Response from deleted');
      console.log(parsedResponse);
      this.showUserArticles()
    } catch (err) {

    }
  }

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
      console.log('parsed Response from Top');
      console.log(parsedResponse);
      const formattedTopHeadlines = parsedResponse.data.map((article, i) => {
        return (
            <li key={i}>
              <form id={i} onSubmit={this.addArticle}>
                <img src={article.urlToImage}/><br/>
                {article.title}
                <input type='hidden' name='content' value={article.content}/>
                <input type='hidden' name='description' value={article.description}/>
                <input type='hidden' name='author' value={article.author}/>
                <input type='hidden' name='publishedDate' value={article.publishedAt}/>
                <input type='hidden' name='image' value={article.urlToImage}/>
                <input type='hidden' name='title' value={article.title}/>
                <button type='submit'>Add</button>
              </form>
              
            </li>
         )
      })
      this.setState({
        topHeadlines: parsedResponse.data,
        formattedTopHeadlines: formattedTopHeadlines
      })
    } catch (err) {

    }
  }

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
      console.log('parsed Response from recommended');
      console.log(parsedResponse);
      const formattedRecommended = parsedResponse.data.map((article, i) => {
        return (
            <li key={i}>
              <form id={i} onSubmit={this.addArticle}>
                <img src={article.urlToImage}/><br/>
                {article.title}
                <input type='hidden' name='content' value={article.content}/>
                <input type='hidden' name='description' value={article.description}/>
                <input type='hidden' name='author' value={article.author}/>
                <input type='hidden' name='publishedDate' value={article.publishedAt}/>
                <input type='hidden' name='image' value={article.urlToImage}/>
                <input type='hidden' name='title' value={article.title}/>
                <button type='submit'>Add</button>
              </form>
              
            </li>
         )
      })
      this.setState({
        recommended: parsedResponse.data,
        formattedRecommended: formattedRecommended
      })
    } catch (err) {

    }
  }
  
  searchNews = async (e) => {
    e.preventDefault()
    console.log('hitting searchNews');
    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'news/' + this.state.search + '/' + this.props.userId + '/search', {
          method: 'GET',
          credentials: 'include', // on every request we have to send the cookie
          headers: {
            'Content-Type': 'application/json'
          }
        })
      const parsedResponse = await response.json();
      console.log('parsed Response from search');
      console.log(parsedResponse);
      const formattedRecommended = parsedResponse.data.map((article, i) => {
        return (
            <li key={i}>
              <form id={i} onSubmit={this.addArticle}>
                <img src={article.urlToImage}/><br/>
                {article.title}
                <input type='hidden' name='content' value={article.content}/>
                <input type='hidden' name='description' value={article.description}/>
                <input type='hidden' name='author' value={article.author}/>
                <input type='hidden' name='publishedDate' value={article.publishedAt}/>
                <input type='hidden' name='image' value={article.urlToImage}/>
                <input type='hidden' name='title' value={article.title}/>
                <button type='submit'>Add</button>
              </form>
              
            </li>
         )
      })
      this.setState({
        recommended: parsedResponse.data,
        formattedRecommended: formattedRecommended,
        search: ''
      })
    } catch (err) {

    }
  }

  addArticle = async (e) => {
      e.preventDefault()
      console.log(e);
      const articleDbEntry = {}
      articleDbEntry.content = e.currentTarget.content.value
      articleDbEntry.description = e.currentTarget.description.value
      articleDbEntry.author = e.currentTarget.author.value
      articleDbEntry.publishedDate = e.currentTarget.publishedDate.value
      articleDbEntry.userId = this.props.userId
      articleDbEntry.image = e.currentTarget.image.value
      articleDbEntry.title = e.currentTarget.title.value
      console.log(articleDbEntry);
      const index = e.currentTarget.id
      console.log(index);
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
        console.log('parsed Response from add');
        console.log(parsedResponse);

        this.showUserArticles()
      } catch (err) {
        console.log(err);
      }

    }

    handleChange = (e) => {
    
    this.setState({
        [e.currentTarget.name]: e.currentTarget.value
      })
    }

  render() {

        

    return(
        <div>
          <h1>News</h1>
          <p onClick={this.props.homePage}>Back</p>
          <h2>
            Your Articles
          </h2>
            {this.state.formattedUserArticles}
          <form onSubmit={this.searchNews}>
            <input type='text' name='search' value={this.state.search} onChange={this.handleChange}/>
            <button type='submit'>Search</button>
          </form>
          <h2>
            Recommended For You
          </h2>
            {this.state.formattedRecommended}
          <h2>
            Top Headlines
          </h2>
            {this.state.formattedTopHeadlines}
        </div>
      )
    
  }
}

export default News;