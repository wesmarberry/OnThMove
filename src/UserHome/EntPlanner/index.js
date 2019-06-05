import React, { Component } from 'react';


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
      customEnt: {
        name: ''
      }
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

  changeDate = (e) => {
    console.log(e.currentTarget);
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    })
    this.showDayEnt()
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
          <li key={ent._id}>
            <form>
              Name: {ent.name}
            </form>

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
      console.log(e.currentTarget);
      const entDbEntry = {}
      entDbEntry.name = e.currentTarget.name.value
      entDbEntry.lat = e.currentTarget.lat.value
      entDbEntry.lng = e.currentTarget.lng.value
      entDbEntry.date = e.currentTarget.date.value
      entDbEntry.userId = e.currentTarget.userId.value
      entDbEntry.apiId = e.currentTarget.apiId.value
      console.log(entDbEntry);
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
            <li key={i}>
              <form onSubmit={this.addEnt}>
                Name: {place.name} 
                <input type='hidden' name='name' value={place.name}/>
                <input type='hidden' name='lat' value={place.geometry.location.latitude}/>
                <input type='hidden' name='lng' value={place.geometry.location.longitude}/>
                <input type='hidden' name='date' value={this.state.date}/>
                <input type='hidden' name='userId' value={this.state.userId}/>
                <input type='hidden' name='apiId' value={place.id}/>
                <button type='submit'>Add</button>
              </form>
              <button onClick={this.deleteFoundEnt}>Delete</button>
            </li>


          )
        })
        this.setState({
          related: parsedResponse.data,
          formattedRelated: formattedRelated,
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

    createCustomEnt = (e) => {
      e.preventDefault()
      try {

      } catch (err) {

      }
    }

    deleteFoundEnt = (e) => {
      let stateCopy = this.state
      console.log(stateCopy);
      stateCopy.formattedRelated.splice(e.currentTarget.id, 1)
      stateCopy.related.splice(e.currentTarget.id, 1)
      this.setState({
        formattedRelated: stateCopy.formattedRelated,
        related: stateCopy.related
      })
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
      const newResponse = this.shuffle(parsedResponse.data)
      console.log(newResponse);
      const formattedRelated = newResponse.map((place, i) => {
      return (
          <li key={i} id={i}>
            <form onSubmit={this.addEnt}>
              Name: {place.name} 
              <input type='hidden' name='name' value={place.name}/>
              <input type='hidden' name='lat' value={place.geometry.location.lat}/>
              <input type='hidden' name='lng' value={place.geometry.location.lng}/>
              <input type='hidden' name='date' value={this.state.date}/>
              <input type='hidden' name='userId' value={this.state.userId}/>
              <input type='hidden' name='apiId' value={place.id}/>
              <button type='submit'>Add</button>
            </form>
            <button onClick={this.deleteFoundEnt}>Delete</button>
          </li>


        )
      })
      this.setState({
        related: newResponse,
        formattedRelated: formattedRelated

      })

    } catch (err) {

    }
  }
  



  render() {
    console.log(this.state);
    let display = ''
    if (this.state.formattedRelated.length === 0) {
      display = ''
    } else {
      display = (
          <div>
          <h1>Entertainment Planner</h1>
          <p onClick={this.props.homePage}>Back</p>
          <p>{this.state.currentDate}</p>
          <form>
          <input type='date' name='date' value={this.state.date} onChange={this.changeDate}/>
         </form>
         <h2>Todays Entertainment</h2>
          <ul>
          {this.state.formattedDaysEnt}
          </ul>
          <form onSubmit={this.createCustomEnt}>
            <input type='text' name='name' value={this.state.customEnt}/>
            <button type='submit'>Create Custom</button>
          </form>
          <form onSubmit={this.searchEnt}>
          <input type='text' name='search' value={this.state.search} onChange={this.handleChange}/> 
          <button type='submit'>Search</button>
          </form>
          <ul>
          {this.state.formattedRelated}
          </ul>
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