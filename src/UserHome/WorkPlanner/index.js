import React, { Component } from 'react';


class WorkPlanner extends Component {
  constructor() {
    super();
    this.state = {
      date: '',
      currentDate: '',
      rawCurrentDate: '',
      tasks: [],
      newTask: {
        description: '',
        priority: 'default',
        time: 'default',
        userId: '',
        date: ''
      },
      editTask: {},
      taskIdToEdit: '',
      rawTasks: []
      }
    }

  


  // when the component loads the date is set and the user's tasks are shown
  componentDidMount() {
    this.setState({
      date: this.props.getCurrentDate(),
      currentDate: this.props.getCurrentDateNiceVersion(),
      rawCurrentDate: this.props.getCurrentDate(),
      userId: this.props.userId,
      newTask: {
        userId: this.props.userId,
        date: this.props.getCurrentDate()
      }
    })
    this.updateDateOnPastTasks()
    this.showDayTasks()
  }


  // if the user changes the date then the date is updated and the newtask is update with the 
  // changed date
  changeDate = (e) => {
    
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value,
      newTask: {
        ...this.state.newTask,
        [e.currentTarget.name]: e.currentTarget.value
      }
    })

    // re-renders the day's tasks if the date is changed
    this.showDayTasks()
  }

  // updates state to reflect the user creating a new task
  handleNewTaskChange = (e) => {
    console.log(e.currentTarget);
    this.setState({
      newTask: {
        ...this.state.newTask,
        [e.currentTarget.name]: e.currentTarget.value,
        userId: this.props.userId
      }
    })
  }
  

  // creates a new task for the user based on the form submission
  createNewTask = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'task', {
        method: 'POST',
        credentials: 'include', // on every request we have to send the cookie
        body: JSON.stringify(this.state.newTask),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const parsedResponse = await response.json();
      // resets the newtask fields  upon submission
      this.setState({
        newTask: {
          description: '',
          priority: 'default',
          time: 'default',
          userId: '',
          date: ''
      }
      })
      this.showDayTasks()
    } catch (err) {
      console.log(err);
    }
  }

  // updates the state when the user updates one of their tasks
  editTask = async (e) => {
    await this.setState({
      editTask: {
        [e.currentTarget.name]: e.currentTarget.value
      },
      taskIdToEdit: e.currentTarget.className

    })
    await this.handleEditTaskChange()
  }


  // updates the task in the database 
  handleEditTaskChange = async (e) => {
   
    try {
      
      const response = await fetch(process.env.REACT_APP_API_CALL + 'task/' + this.state.taskIdToEdit + '/edit', {
        method: 'PUT',
        credentials: 'include', // on every request we have to send the cookie
        body: JSON.stringify(this.state.editTask),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const parsedResponse = await response.json();
      // resets the edit task form in state
      this.setState({
        editTask: {}
      })

      // re-renders the day's tasks
      this.showDayTasks()

    } catch (err) {
      console.log(err);
    }

  }

  // function to convert the raw date to a number
  convertDateToNumber = (date) => {
    const newDate = date.split('-').join('')
    const numDate = Number(newDate)
    return numDate
  }

  // bubble sort method used to sort the user's tasks by time
  sortByTime = (array) => {
    let swapHappened = true
    let length = array.length
    

    while (swapHappened === true) {
        swapHappened = false
        for (let i = 0; i < (array.length-1); i++) {
            if (Number(array[i].time) > Number(array[i + 1].time)) {
                let current = array[i]
                array[i] = array[i + 1]

                array[i + 1] = current

                swapHappened = true
            }
        }
     
        
    }

    return array
  }

  // function to sort the user's tasks by priority then by time
  sortTasks = (array) => {
    const a = []
    const b = []
    const c = []
    for (let i = 0; i < array.length; i++) {
      if (array[i].priority == 1) {
        a.push(array[i])
      }
      if (array[i].priority == 2) {
        b.push(array[i])
      }
      if (array[i].priority == 3) {
        c.push(array[i])
      }

    }

    // sorts each of the task arrays by time
    const newA = this.sortByTime(a)
    const newB = this.sortByTime(b)
    const newC = this.sortByTime(c)

    // combines all of the sorted arrays
    const finalArr = a.concat(b.concat(c))
    return finalArr
  }


  // function called when the component mounts to update tasks that were originally on past dates
  // if the task was not marked completed it is updated to be shown on the current date
  updateDateOnPastTasks = async (id) => {

    
    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'task/updateall', {
        method: 'PUT',
        credentials: 'include', // on every request we have to send the cookie
        body: JSON.stringify(this.state),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const parsedResponse = await response.json();


    } catch (err) {
      console.log(err);
    }
  }

  // shows the user's tasks that match the current date
  showDayTasks = async () => {
    
    try {
      const response = await fetch(process.env.REACT_APP_API_CALL + 'user/' + this.props.userId, {
        method: 'GET',
        credentials: 'include', // on every request we have to send the cookie
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const parsedResponse = await response.json();
      
      // creates an array with all of the users tasks that are on the current date
      const daysTasks = await parsedResponse.data.tasks.filter((task) => {


        if (task.date === this.state.date) {
          return task
        }
        
      })
      
      // calls the sort task function
      const newDaysTasks = this.sortTasks(daysTasks)

      // creates an array of formatted tasks that can be edited with the edit function
      const formattedDaysTasks = newDaysTasks.map((task, i) => {
        return (
          <li key={task._id}>
            <form className='taskForm'>
              <div className='completedColumn'> 
                <select name="completed" className={task._id} value={task.completed} onChange={this.editTask}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className='priorityColumn'>
                <select name="priority" className={task._id} value={task.priority} onChange={this.editTask}>
                  
                  <option value="1">A</option>
                  <option value="2">B</option>
                  <option value="3">C</option>
                </select>
              </div>
              
              <div className='descriptionColumn'>
                {task.description}
              </div>
              <div className='timeColumn'>
                <select name="time" className={task._id} value={task.time} onChange={this.editTask}>
                
                <option value="18">N/A</option>
                <option value="7">7AM</option>
                <option value="8">8AM</option>
                <option value="9">9AM</option>
                <option value="10">10AM</option>
                <option value="11">11AM</option>
                <option value="12">12PM</option>
                <option value="13">1PM</option>
                <option value="14">2PM</option>
                <option value="15">3PM</option>
                <option value="16">4PM</option>
                <option value="17">5PM</option>
               </select>
              </div>
            </form>

          </li>
          )
      })
      this.setState({
        tasks: formattedDaysTasks,
        rawTasks: parsedResponse.data.tasks


      })

    } catch (err) {
      console.log(err);
    }
  }

  // function to convert the raw date to a readable version
  dateToNiceVersion = (date) => {
    const split = date.split('-')
    return split[1] + '.' + split[2] + '.' + split[0]
  }

  render() {
    
    let date = ''

    // conditional to display the current date or today's date
    if (this.state.date === this.state.rawCurrentDate) {
      date = <p className='header underlined currentDate'>Tasks For Today</p>
    } else {
      date = <p className='header underlined currentDate'>Tasks For {this.dateToNiceVersion(this.state.date)}</p>
    }
        
    
    return(
        <div>
          <div className='between-flex-container'>
              <img className='image-logo-small' src='image (7).png'/>
              <div className='buttonContainer center-column-flex-container'>
               <h1 className='header'>T<span className='redLetter'>a</span>sk Pl<span className='redLetter'>a</span>nner</h1> 
               <button class='button' onClick={this.props.homePage}>Back</button>
                
              </div>

          </div>

          <div className='between-flex-container'>
              {date}
              <form>
                <input className='dateChanger' type='date' name='date' value={this.state.date} onChange={this.changeDate}/>
              </form>
          </div>


        
         <div className='center-column-flex-container'>
           <ul className='taskContainer'>
            <li className='listHeader'>
              <div className='taskForm'>
                <div className='completedColumn'>
                  Completed
                </div>
                <div className='priorityColumn'>
                  Priority
                </div>
                
                <div className='descriptionColumn'>
                  Description
                </div>
                <div className='timeColumn'>
                  Time
                </div>
              </div>
            </li>
            {this.state.tasks}
           </ul>
           <form className='newTaskForm1' onSubmit={this.createNewTask}>
              <div className='newTaskForm'>
              <select className='select-css'name="priority" onChange={this.handleNewTaskChange} placeholder='Priority' value={this.state.newTask.priority}>
                <option value="default" disabled selected>Priority</option>
                <option value="1">A</option>
                <option value="2">B</option>
                <option value="3">C</option>
              </select>
              
              <input type='text' name='description' value={this.state.newTask.description} onChange={this.handleNewTaskChange} placeholder='description'/>
              <select name="time" onChange={this.handleNewTaskChange} placeholder='time' value={this.state.newTask.time}>
              <option value="default" disabled>Time</option>
                <option value="18">N/A</option>
                <option value="7">7AM</option>
                <option value="8">8AM</option>
                <option value="9">9AM</option>
                <option value="10">10AM</option>
                <option value="11">11AM</option>
                <option value="12">12PM</option>
                <option value="13">1PM</option>
                <option value="14">2PM</option>
                <option value="15">3PM</option>
                <option value="16">4PM</option>
                <option value="17">5PM</option>
               </select>
               </div>
               <button className='button' type='submit'>Create New Task</button>
           </form>
          </div>

        </div>
      )
    
  }
}

export default WorkPlanner;