import React, { Component } from 'react';


class WorkPlanner extends Component {
  constructor() {
    super();
    this.state = {
      date: '',
      currentDate: '',
      tasks: [],
      newTask: {
        title: '',
        description: '',
        priority: 'default',
        time: 'default',
        userId: '',
        date: ''
      },
      editTask: {},
      taskIdToEdit: ''
      }
    }

  



  componentDidMount() {
    this.setState({
      date: this.props.getCurrentDate(),
      currentDate: this.props.getCurrentDateNiceVersion(),
      userId: this.props.userId,
      newTask: {
        userId: this.props.userId,
        date: this.props.getCurrentDate()
      }
    })
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
          title: '',
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
    const newDate = date.replace(/-/g, '')
    const numDate = Number(newDate)
    return numDate
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
      const daysTasks = parsedResponse.data.tasks.filter((task) => {


        if (task.date === this.state.date) {
          return task
        } else if (this.convertDateToNumber(task.date) < this.convertDateToNumber(this.state.date) && task.completed === 'false') {
          task.date = this.state.date
          return task
        }
      })
      const formattedDaysTasks = daysTasks.map((task, i) => {
        return (
          <li key={task._id}>
            <form>
              Completed: 
              <select name="completed" className={task._id} value={task.completed} onChange={this.editTask}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              Priority: 
              <select name="priority" className={task._id} value={task.priority} onChange={this.editTask}>
                <option value="default" disabled>Priority</option>
                <option value="1">A</option>
                <option value="2">B</option>
                <option value="3">C</option>
              </select>
              Title: {task.title}
              Description: {task.description}
              Time: 
              <select name="time" className={task._id} value={task.time} onChange={this.editTask}>
              <option value="default" disabled>Time</option>
              <option value="N/A">N/A</option>
              <option value="7AM">7AM</option>
              <option value="8AM">8AM</option>
              <option value="9AM">9AM</option>
              <option value="10AM">10AM</option>
              <option value="11AM">11AM</option>
              <option value="12PM">12PM</option>
              <option value="1PM">1PM</option>
              <option value="2PM">2PM</option>
              <option value="3PM">3PM</option>
              <option value="4PM">4PM</option>
              <option value="5PM">5PM</option>
             </select>
            </form>

          </li>
          )
      })
      this.setState({
        tasks: formattedDaysTasks,


      })

    } catch (err) {

    }
  }


  render() {

        
    console.log(this.state);
    return(
        <div>
         <h1>Work Planner</h1> 
         <p onClick={this.props.homePage}>Back</p>
         <p>{this.state.currentDate}</p>
         <form>
          <input type='date' name='date' value={this.state.date} onChange={this.changeDate}/>
         </form>
         <ul>
          {this.state.tasks}
         </ul>
         <form onSubmit={this.createNewTask}>
            <select name="priority" onChange={this.handleNewTaskChange} placeholder='Priority' value={this.state.newTask.priority}>
              <option value="default" disabled selected>Priority</option>
              <option value="1">A</option>
              <option value="2">B</option>
              <option value="3">C</option>
            </select>
            <input type='text' name='title' value={this.state.newTask.title} onChange={this.handleNewTaskChange} placeholder='title'/>
            <input type='text' name='description' value={this.state.newTask.description} onChange={this.handleNewTaskChange} placeholder='description'/>
            <select name="time" onChange={this.handleNewTaskChange} placeholder='time' value={this.state.newTask.time}>
            <option value="default" disabled>Time</option>
              <option value="N/A">N/A</option>
              <option value="7AM">7AM</option>
              <option value="8AM">8AM</option>
              <option value="9AM">9AM</option>
              <option value="10AM">10AM</option>
              <option value="11AM">11AM</option>
              <option value="12PM">12PM</option>
              <option value="1PM">1PM</option>
              <option value="2PM">2PM</option>
              <option value="3PM">3PM</option>
              <option value="4PM">4PM</option>
              <option value="5PM">5PM</option>
             </select>
             <button type='submit'>Create New Task</button>
         </form>

        </div>
      )
    
  }
}

export default WorkPlanner;