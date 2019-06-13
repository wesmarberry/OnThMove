import React, { Component } from 'react';
import CoolMap from './Map'
import Collapsible from 'react-collapsible';


class EntPlanner extends Component {
  constructor() {
    super();
    this.state = {
      date: '',
      currentDate: '',
      rawCurrentDate: '',
      userId: '',
      search: '',
      related: [],
      formattedRelated: [],
      daysEnt: [],
      customEnt: '',
      recommended: true
    }

  }


  componentDidMount = async () => {

    // the state is set with the current date
    await this.setState({
      date: this.props.getCurrentDate(), // sets the current date to the the date portion to be changed when the user changes teh date
      currentDate: this.props.getCurrentDateNiceVersion(), // sets a readable current date to be displayed on the page
      rawCurrentDate: this.props.getCurrentDate(),// sets the raw current date to be compared with the date that can be changed
      userId: this.props.userId
    })

    // on the page load the recommended acitivities are found and the user's activities that 
    // match the current date
    this.findRelated()
    this.showDayEnt()
  }

  // handles the change of the current date
  changeDate = async (e) => {

    await this.setState({
      [e.currentTarget.name]: e.currentTarget.value,
      formattedRelated: []
    })

    // resets the display for the user's entry for the new "date" stored in state
    this.showDayEnt()
    // finds new related tasks
    this.findRelated()

  }

  // function used to shuffle the recommended tasks
  shuffle = (array) => {
      let currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    // deletes a user's entertainment that has been added to the day
    deleteEnt = async (e) => {
      console.log(e.currentTarget);
      try {
        const response = await fetch(process.env.REACT_APP_API_CALL + 'entertainment/' + e.currentTarget.id, {
        method: 'DELETE',
        credentials: 'include', // on every request we have to send the cookie
        headers: {
          'Content-Type': 'application/json'
        }
        })
        const parsedResponse = await response.json();
        // updates the entertainment activities showing
        this.showDayEnt()
      } catch (err) {
        console.log(err);
      }
    }

    // finds the user's entertainment for the current "date" stored in state
    showDayEnt = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_CALL + 'user/' + this.props.userId, {
          method: 'GET',
          credentials: 'include', // on every request we have to send the cookie
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const parsedResponse = await response.json();
        
        // creates an array of a users entertainment activities that
        // match the current date displaying
        const daysEnt = parsedResponse.data.entertainment.filter((ent) => {


          if (ent.date === this.state.date) {
            return ent
          } 
        })
        
        // cretes an array of formatted days activities to display of the page
        // with a collasible portion that contains the activitie's location
        const formattedDaysEnt = daysEnt.map((ent, i) => {
          return (
            <li key={ent._id} id={ent._id} className='between-flex-container ent'>
                <div className='addedNameColumn'>
                  <Collapsible trigger={ent.name} className='entCollapse' openedClassName='entCollapse'>
                    {ent.formatted_address}
                  </Collapsible>
                </div>
                <div className='deleteCol'>
                <button className='button' id={ent._id} onClick={this.deleteEnt}>Delete</button>
                </div>

            </li>
            )
        })
        this.setState({
          daysEnt: daysEnt,
          formattedDaysEnt: formattedDaysEnt


        })

      } catch (err) {
        console.log(err);
      }
    }

    // adds a displaying activity to the user's database
    addEnt = async (e) => {
      e.preventDefault()
      
      // creates the entry to be put into the user's database
      const entDbEntry = {}
      entDbEntry.name = e.currentTarget.name.value
      entDbEntry.lat = e.currentTarget.lat.value
      entDbEntry.lng = e.currentTarget.lng.value
      entDbEntry.date = e.currentTarget.date.value
      entDbEntry.userId = e.currentTarget.userId.value
      entDbEntry.apiId = e.currentTarget.apiId.value
      entDbEntry.formatted_address = e.currentTarget.formatted_address.value

      // stores the index for the delete function on the displaying activities
      const index = e.currentTarget.id
      
      try {
        const response = await fetch(process.env.REACT_APP_API_CALL + 'entertainment/add', {
          method: 'POST',
          credentials: 'include', // on every request we have to send the cookie
          body: JSON.stringify(entDbEntry),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const parsedResponse = await response.json();
        
        // deletes the entertainment activity when it is added to the user's database
        this.deleteFoundEnt(e, index)
        // resets the user's entries that are showing to reflect the created activity
        this.showDayEnt()
      } catch (err) {
        console.log(err);
      }

    }

    // handles the search submission to search for entertainment activities
    searchEnt = async (e) => {
      e.preventDefault()
      try {
        const response = await fetch(process.env.REACT_APP_API_CALL + 'entertainment/find', {
          method: 'POST',
          credentials: 'include', // on every request we have to send the cookie
          body: JSON.stringify(this.state),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const parsedResponse = await response.json();
        
        // creates an array of formatted tasks based on the response from the database
        // each activity has hidden inputs in order to creates the activity when 
        // the user clicks "add"
        const formattedRelated = parsedResponse.data.map((place, i) => {
        return (
            <li key={i} id={i} className='between-flex-container ent'>
              <form id={i} onSubmit={this.addEnt} className='between-flex-container'>
                  <div className='nameColumn'>
                    <Collapsible trigger={place.name} className='entCollapse' openedClassName='entCollapse'>
                      {place.formatted_address}
                    </Collapsible>
                  </div>
                  <input type='hidden' name='name' value={place.name}/>
                  <input type='hidden' name='lat' value={place.geometry.location.lat}/>
                  <input type='hidden' name='lng' value={place.geometry.location.lng}/>
                  <input type='hidden' name='date' value={this.state.date}/>
                  <input type='hidden' name='userId' value={this.state.userId}/>
                  <input type='hidden' name='apiId' value={place.id}/>
                  <input type='hidden' name='formatted_address' value={place.formatted_address}/>
                  <div className='addCol'>
                    <button  className='button' type='submit'>Add</button>
                  </div>


              </form>
              <div className='deleteCol'>
                <button className='button' id={i} onClick={this.deleteFoundEnt}>Delete</button>
              </div>


            </li>


          )
        })
        // sets the state to display the search results
        this.setState({
          related: parsedResponse.data,
          formattedRelated: formattedRelated,
          recommended: false,
          search: ''

        })

      } catch (err) {
        console.log(err);
      }

    }

    // handles form changes
    handleChange = (e) => {
    
    this.setState({
        [e.currentTarget.name]: e.currentTarget.value
      })
    }

    // creates custom entertainment activities based on user submission
    createCustomEnt = async (e) => {
      e.preventDefault()
      try {
        const response = await fetch(process.env.REACT_APP_API_CALL + 'entertainment/custom', {
          method: 'POST',
          credentials: 'include', // on every request we have to send the cookie
          body: JSON.stringify(this.state),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const parsedResponse = await response.json();
        
        // resets the form field
        this.setState({
          customEnt: ''
        })
        // re-renders the user's activities after the custom entertainment activity is created
        this.showDayEnt()

      } catch (err) {

      }
    }

    // deletes the displaying activities from the state
    deleteFoundEnt = (e, index) => {
      let stateCopy = this.state
      
      // if the index is undefined, which occurrs when the user clicks the delete button instead of 
      // the add button the activity is removed from the state
      if (index === undefined) {
        
        stateCopy.related.splice(e.currentTarget.id, 1)
        // resets the formattedRelated to reflect the removed activity
        const formattedRelated = stateCopy.related.map((place, i) => {
        return (
            <li key={i} id={i} className='between-flex-container ent'>
              <form id={i} onSubmit={this.addEnt} className='between-flex-container'>
                <div className='nameColumn'>
                  <Collapsible trigger={place.name} className='entCollapse' openedClassName='entCollapse'>
                    {place.formatted_address}
                  </Collapsible>
                  </div>
                <input type='hidden' name='name' value={place.name}/>
                <input type='hidden' name='lat' value={place.geometry.location.lat}/>
                <input type='hidden' name='lng' value={place.geometry.location.lng}/>
                <input type='hidden' name='date' value={this.state.date}/>
                <input type='hidden' name='userId' value={this.state.userId}/>
                <input type='hidden' name='apiId' value={place.id}/>
                <input type='hidden' name='formatted_address' value={place.formatted_address}/>
                <div className='addCol'>
                  <button  className='button' type='submit'>Add</button>
                </div>


              </form>
              <div className='deleteCol'>
                <button className='button' id={i} onClick={this.deleteFoundEnt}>Delete</button>
              </div>


            </li>


          )
        })
        // if there are still activities in the list the state is reset
        if (stateCopy.related.length !== 0) {
          this.setState({
            formattedRelated: formattedRelated,
            related: stateCopy.related
          })
          
        } else {// if there are no related activities then more recommended search activities are geenrated
          
          this.setState({
            formattedRelated: formattedRelated,
            related: stateCopy.related
          })
          this.findRelated()
        }
        
      } else {
        
        stateCopy.related.splice(index, 1)
        // if the user adds the activity then the activity is removed from the display
        const formattedRelated = stateCopy.related.map((place, i) => {
        return (
            <li key={i} id={i} className='between-flex-container ent'>
              <form id={i} onSubmit={this.addEnt} className='between-flex-container'>
                <div className='nameColumn'>
                  <Collapsible trigger={place.name} className='entCollapse' openedClassName='entCollapse'>
                    {place.formatted_address}
                  </Collapsible>
                </div>
                <input type='hidden' name='name' value={place.name}/>
                <input type='hidden' name='lat' value={place.geometry.location.lat}/>
                <input type='hidden' name='lng' value={place.geometry.location.lng}/>
                <input type='hidden' name='date' value={this.state.date}/>
                <input type='hidden' name='userId' value={this.state.userId}/>
                <input type='hidden' name='apiId' value={place.id}/>
                <input type='hidden' name='formatted_address' value={place.formatted_address}/>
                <div className='addCol'>
                  <button  className='button' type='submit'>Add</button>
                </div>


              </form>
              <div className='deleteCol'>
                <button className='button' id={i} onClick={this.deleteFoundEnt}>Delete</button>
              </div>


            </li>


          )
        })
        // if there are no activities displaying then more recommended activities are generated
        if (stateCopy.related.length !== 0) {
          this.setState({
            formattedRelated: formattedRelated,
            related: stateCopy.related
          })
          
        } else {
          
          this.setState({
            formattedRelated: formattedRelated,
            related: stateCopy.related
          })
          this.findRelated()
        }
      }
    }

    // finds related activities based on the user's past searches
    findRelated = async () => {

      try {
        
        const response = await fetch(process.env.REACT_APP_API_CALL + 'entertainment/related', {
          method: 'POST',
          credentials: 'include', // on every request we have to send the cookie
          body: JSON.stringify(this.state),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const parsedResponse = await response.json();
        
        // if the response from the api call is successful then the results are displayed on the page
        if (parsedResponse.status === 200) {
          // shuffles the response
          const newResponse = this.shuffle(parsedResponse.data)
          
          const formattedRelated = newResponse.map((place, i) => {
          return (
              <li key={i} id={i} className='between-flex-container ent'>
                <form id={i} onSubmit={this.addEnt} className='between-flex-container'>
                  <div className='nameColumn'>
                    <Collapsible trigger={place.name} className='entCollapse' openedClassName='entCollapse'>
                      {place.formatted_address}
                    </Collapsible>
                  </div>
                  <input type='hidden' name='name' value={place.name}/>
                  <input type='hidden' name='lat' value={place.geometry.location.lat}/>
                  <input type='hidden' name='lng' value={place.geometry.location.lng}/>
                  <input type='hidden' name='date' value={this.state.date}/>
                  <input type='hidden' name='userId' value={this.state.userId}/>
                  <input type='hidden' name='apiId' value={place.id}/>
                  <input type='hidden' name='formatted_address' value={place.formatted_address}/>
                  <div className='addCol'>
                    <button  className='button' type='submit'>Add</button>
                  </div>


                </form>
                <div className='deleteCol'>
                  <button className='button' id={i} onClick={this.deleteFoundEnt}>Delete</button>
                </div>


              </li>


            )
          })
          this.setState({
            related: newResponse,
            formattedRelated: formattedRelated,
            recommended: true

          })
          
        }

      } catch (err) {
        console.log(err);
      }
    }
  
    // shows the date in a readable version
    dateToNiceVersion = (date) => {
      const split = date.split('-')
      return split[1] + '.' + split[2] + '.' + split[0]
    }


    render() {
      
      let display = ''
      let date = ''

      // displays the date that the user chooses based on form submission
      if (this.state.date === this.state.rawCurrentDate) {
        date = <h2 className='header underlined'>Today</h2>
      } else {
        date = <h2 className='header underlined'>{this.dateToNiceVersion(this.state.date)}</h2>
      }


      if (this.state.formattedRelated.length === 0) {// shows a loading screen while the database fetches recommended options
        display = (
          <div className='loading'>
            <p>......Finding Recommended Options......</p><br/>
            <img src='/loading.gif'/>
          </div>
          )
      } else {
        display = (
            <div>
              <div className='between-flex-container'>
                <img className='image-logo-small' src='image (7).png'/>
                <div className='buttonContainer center-column-flex-container'>
                  <h1 className='header'>Entert<span className='redLetter'>a</span>inment<br/>Pl<span className='redLetter'>a</span>nner</h1> 
                  <button class='button' onClick={this.props.homePage}>Back</button>
                  
                </div>

              </div>
            
              <div className='between-flex-container'>
                  <p className='currentDate'>Today is {this.state.currentDate}</p>
                  <form>
                    <input className='dateChanger' type='date' name='date' value={this.state.date} onChange={this.changeDate}/>
                  </form>
              </div>
              <div className='overallEntContainer'>
                <div className='center-column-flex-container entContainer'>
                 {date}
                  <ul>
                    {this.state.formattedDaysEnt}
                  </ul>
                  <form onSubmit={this.createCustomEnt} className='between-flex-container'>
                    <input type='text' name='customEnt' value={this.state.customEnt} onChange={this.handleChange} placeholder='Create Custom Activity'/>
                    <button className='button' type='submit'>Create Custom</button>
                  </form>
                </div>
                <div className='center-column-flex-container entContainer'>
                  {this.state.recommended ? <h2 className='header underlined'>Recommended For You</h2> : <h2 className='header underlined'>Search Results</h2>}
                  <ul>
                    {this.state.formattedRelated}
                  </ul>
                </div>
              </div>
              <form onSubmit={this.searchEnt} className='searchForm'>
                <input type='text' name='search' value={this.state.search} onChange={this.handleChange} placeholder='Search For Activities'/> 
                <button class='button' type='submit'>Search</button>
              </form>
              <div className='center-column-flex-container'>
                <div className='mapKey'>
                  <img src='/newblue.png'/>  : Today's Activities<br/>
                  <img src='/newgreen.png'/> : Recommended/Searched Activities<br/>
                </div>
              </div>
              <CoolMap related={this.state.related} daysEnt={this.state.daysEnt} position={this.props.position}/>
            </div>

          )
      }
          

      return(
          <div>
            <ul>
              {display}
            </ul>
          </div>
        )
      
    }
}

export default EntPlanner;