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
    await this.setState({
      date: this.props.getCurrentDate(),
      currentDate: this.props.getCurrentDateNiceVersion(),
      rawCurrentDate: this.props.getCurrentDate(),
      userId: this.props.userId
    })
    this.findRelated()
    this.showDayEnt()
  }

  changeDate = async (e) => {
    console.log(e.currentTarget);
    await this.setState({
      [e.currentTarget.name]: e.currentTarget.value,
      formattedRelated: []
    })
    this.showDayEnt()
    this.findRelated()

  }

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
        console.log('parsed Response');
        console.log(parsedResponse);
        this.showDayEnt()
      } catch (err) {

      }
    }

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
      console.log('parsed Response');
      console.log(parsedResponse);
      const daysEnt = parsedResponse.data.entertainment.filter((ent) => {


        if (ent.date === this.state.date) {
          return ent
        } 
      })
      
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

    }
  }


    addEnt = async (e) => {
      e.preventDefault()
      console.log(e);
      const entDbEntry = {}
      entDbEntry.name = e.currentTarget.name.value
      entDbEntry.lat = e.currentTarget.lat.value
      entDbEntry.lng = e.currentTarget.lng.value
      entDbEntry.date = e.currentTarget.date.value
      entDbEntry.userId = e.currentTarget.userId.value
      entDbEntry.apiId = e.currentTarget.apiId.value
      entDbEntry.formatted_address = e.currentTarget.formatted_address.value
      console.log(entDbEntry);
      const index = e.currentTarget.id
      console.log(index);
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
        console.log('parsed Response from add');
        console.log(parsedResponse);
        console.log(e.currentTarget.id);
        this.deleteFoundEnt(e, index)
        this.showDayEnt()
      } catch (err) {
        console.log(err);
      }

    }

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
        console.log('parsed Response from search');
        console.log(parsedResponse);
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
        this.setState({
          related: parsedResponse.data,
          formattedRelated: formattedRelated,
          recommended: false,
          search: ''

        })

      } catch (err) {
        
      }

    }

    handleChange = (e) => {
    
    this.setState({
        [e.currentTarget.name]: e.currentTarget.value
      })
    }

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
        console.log('parsed Response from custom');
        console.log(parsedResponse);
        this.setState({
          customEnt: ''
        })
        this.showDayEnt()

      } catch (err) {

      }
    }

    deleteFoundEnt = (e, index) => {
      let stateCopy = this.state
      console.log(stateCopy);
      console.log('===================');
      console.log(e);

      if (index === undefined) {
        // stateCopy.formattedRelated.splice(e.currentTarget.id, 1)
        stateCopy.related.splice(e.currentTarget.id, 1)
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
        if (stateCopy.related.length !== 0) {
          this.setState({
            formattedRelated: formattedRelated,
            related: stateCopy.related
          })
          
        } else {
          console.log('hitting related 0');
          this.setState({
            formattedRelated: formattedRelated,
            related: stateCopy.related
          })
          this.findRelated()
        }
        
      } else {
        // stateCopy.formattedRelated.splice(index, 1)
        stateCopy.related.splice(index, 1)
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
        if (stateCopy.related.length !== 0) {
          this.setState({
            formattedRelated: formattedRelated,
            related: stateCopy.related
          })
          
        } else {
          console.log('hitting related 0');
          this.setState({
            formattedRelated: formattedRelated,
            related: stateCopy.related
          })
          this.findRelated()
        }
      }
    }

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
      console.log('parsed Response from related');
      console.log(parsedResponse);
      if (parsedResponse.status === 200) {
        const newResponse = this.shuffle(parsedResponse.data)
        console.log(newResponse);
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

    }
  }
  
  dateToNiceVersion = (date) => {
    const split = date.split('-')
    return split[1] + '.' + split[2] + '.' + split[0]
  }


  render() {
    console.log(this.state);
    let display = ''
    let date = ''

    if (this.state.date === this.state.rawCurrentDate) {
      date = <h2 className='header underlined'>Today</h2>
    } else {
      date = <h2 className='header underlined'>{this.dateToNiceVersion(this.state.date)}</h2>
    }


    if (this.state.formattedRelated.length === 0) {
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