import React, { Component } from 'react';



const ShowNews = (props) => {
	

	




		// edit form for the EditUser Component
		return(
			<div>
				<img src={props.articleToShow.image}/>
				{props.articleToShow.title}
				{props.articleToShow.author}<br/>
				{props.articleToShow.description}<br/>

				<a href={props.articleToShow.url}>Read Now!</a>
			</div>

			)
	


}

export default ShowNews;