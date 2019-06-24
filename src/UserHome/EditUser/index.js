import React, { Component } from 'react';



const EditUser = (props) => {
	

	




		// edit form for the EditUser Component
		return(
			<div >
				<form onSubmit={props.closeAndEdit}className='.center-column-flex-container'>
					<label>
						<input type='text' name='username' onChange={props.handleFormChange} value={props.userToEdit.username}/>
					</label>
					<label>
						<input type='text' name='email' onChange={props.handleFormChange} value={props.userToEdit.email}/>
					</label>
					<label>
						<input type='text' name='password' onChange={props.handleFormChange} value={props.userToEdit.password} placeholder='Password'/>
					</label>
					<button className='button' type="submit">Update User</button>
				</form>
			</div>

			)
	


}

export default EditUser;