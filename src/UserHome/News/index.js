import React, { Component } from 'react';


class News extends Component {
  constructor() {
    super();
    this.state = {
      
    }

  }





  

  render() {

        

    return(
        <div>
          <h1>News</h1>
          <p onClick={this.props.homePage}>Back</p>
        </div>
      )
    
  }
}

export default News;