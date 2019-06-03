import React, { Component } from 'react';



class EditUser extends Component {
	constructor() {
		super()
		this.state = {

		}
	}

	



	render() {
		// edit form for the EditUser Component
		return(
			<div>
				<form onSubmit={this.props.closeAndEdit}>
					<label>
					Username:
					<input type='text' name='username' onChange={this.props.handleFormChange} value={this.props.userToEdit.username}/>
					</label>
					<label>
					Email:
					<input type='text' name='email' onChange={this.props.handleFormChange} value={this.props.userToEdit.email}/>
					</label>
					<button className='largeButton' type="submit">Update User</button>
				</form>
			</div>

			)
	}


}

export default EditUser;