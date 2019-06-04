import React, { Component } from 'react';


class Podcast extends Component {
  constructor() {
    super();
    this.state = {
      
    }

  }





  

  render() {

        

    return(
        <div>
          <h1>Podcast</h1>
          <p onClick={this.props.homePage}>Back</p>
         
        </div>
      )
    
  }
}

export default Podcast;