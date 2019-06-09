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



  changeDate = (e) => {
    console.log(e.currentTarget);
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value,
      newTask: {
        ...this.state.newTask,
        [e.currentTarget.name]: e.currentTarget.value
      }
    })
    this.showDayTasks()
  }

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
  
  createNewTask = async (e) => {
    e.preventDefault()
    console.log('state when creating');
    console.log(this.state);
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
      console.log('parsed Response from create');
      console.log(parsedResponse);
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

    }
  }

  editTask = async (e) => {
    await this.setState({
      editTask: {
        [e.currentTarget.name]: e.currentTarget.value
      },
      taskIdToEdit: e.currentTarget.className

    })
    await this.handleEditTaskChange()
  }

  handleEditTaskChange = async (e) => {
    // console.log(e.currentTarget);
    // console.log(e.currentTarget.name);
    // console.log(e.currentTarget.value);
    // this.setState({
    //   editTask: {
    //     ...this.state.editTask,
    //     [e.currentTarget.name]: e.currentTarget.value
    //   }

    // })
    // console.log('================');
    console.log(this.state.editTask);
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
      console.log('parsed Response from edit');
      console.log(parsedResponse);
      this.setState({
        editTask: {}
      })
      this.showDayTasks()

    } catch (err) {

    }

  }

  convertDateToNumber = (date) => {
    const newDate = date.split('-').join('')
    const numDate = Number(newDate)
    return numDate
  }

  
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
   const newA = this.sortByTime(a)
   const newB = this.sortByTime(b)
   const newC = this.sortByTime(c)

    const finalArr = a.concat(b.concat(c))
    return finalArr
  }

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
      console.log('parsed Response on update date');
      console.log(parsedResponse);
      

    } catch (err) {

    }
  }

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
      console.log('parsed Response');
      console.log(parsedResponse);
      const daysTasks = await parsedResponse.data.tasks.filter((task) => {


        if (task.date === this.state.date) {
          return task
        }
        if ((this.convertDateToNumber(task.date) < this.convertDateToNumber(this.state.rawCurrentDate)) && (task.completed === 'false')) {
          task.date = this.state.rawCurrentDate

          return task
          
        }
      })
      console.log(daysTasks);
      const newDaysTasks = this.sortTasks(daysTasks)

      console.log('this is new days tasks');
      console.log(newDaysTasks);
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

    }
  }


  render() {

        
    console.log(this.state);
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
              <p className='currentDate'>Today is {this.state.currentDate}</p>
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
           <form className='newTaskForm' onSubmit={this.createNewTask}>
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
               <button className='button' type='submit'>Create New Task</button>
           </form>
          </div>

        </div>
      )
    
  }
}

export default WorkPlanner;