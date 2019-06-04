import React, { Component } from 'react';


class EntPlanner extends Component {
  constructor() {
    super();
    this.state = {
      
    }

  }





  

  render() {

        

    return(
        <div>
          <h1>Entertainment Planner</h1>
          <p onClick={this.props.homePage}>Back</p>
        </div>
      )
    
  }
}

export default EntPlanner;