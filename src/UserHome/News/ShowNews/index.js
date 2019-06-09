import React, { Component } from 'react';



const ShowNews = (props) => {
	

	




		
		return(
			<div>
				<img className='newsImage' src={props.articleToShow.image}/><br/>
				<button class='button newsBtn' onClick={props.returnToNewsHome}>Back</button><br/>
				<div className='center-column-flex-container'>
					<div className='newsShow'>
						{props.articleToShow.title}
						{props.articleToShow.author}<br/>
						{props.articleToShow.description}<br/>
					</div>
					<a className='readNow' href={props.articleToShow.url}>Read Now!</a>
				</div>
			</div>

			)
	


}

export default ShowNews;