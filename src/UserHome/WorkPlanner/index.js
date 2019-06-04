import React, { Component } from 'react';


class WorkPlanner extends Component {
  constructor() {
    super();
    this.state = {
      
    }

  }





  

  render() {

        

    return(
        <div>
         <h1>Work Planner</h1> 
         <p onClick={this.props.homePage}>Back</p>
        </div>
      )
    
  }
}

export default WorkPlanner;