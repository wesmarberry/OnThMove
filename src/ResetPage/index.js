import React, { Component } from 'react';



const ResetPage = (props) => {
	

	




		// resets a user's password
		return(
			<div className='login'>
				<br/>
				<img className='image-logo' src='image (7).png'/><br/>
				<form onSubmit={props.resetPassword} className='loginForm'>
					<div className='center-column-flex-container'>
						<label className='resetInput'>
							<input type='text' name='emailToSend' onChange={props.handleEmailChange} placeholder='Email'/>
						</label>
						
						<button className='button' type="submit">Reset Password</button>
					</div>
				</form>
				<button className='button resetBack' onClick={props.resetToLogin}>Back To Login</button><br/>
				{props.passwordResetMessage}
			</div>

			)
	


}

export default ResetPage;