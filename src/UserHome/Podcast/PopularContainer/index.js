import React from 'react';



const PopularContainer = (props) => {
	

	

		const displayPopular = props.popular.map((podcast, i) => {
			return (
					<li key={i}>
						<img src={podcast.image}/><br/>
						Title: {podcast.title}<br/>
						<button id={podcast.id} onClick={props.addPodcast}>Add</button>
					</li>

				)
		})


		return (
				<div>
					<ul>
					{displayPopular}
					</ul>

				</div>

			)
			
	


}

export default PopularContainer;