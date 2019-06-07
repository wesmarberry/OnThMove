import React from 'react';



const PopularContainer = (props) => {
	

	

		const displayPopular = props.popular.map((podcast, i) => {
			return (
					<li key={i}>
						<img src={podcast.image}/><br/>
						{podcast.title}<br/>
						<button className='button' id={podcast.id} onClick={props.addPodcast}>Add</button>
					</li>

				)
		})


		return (
				<div>
					<ul className='center-column-flex-container'>
					{displayPopular}
					</ul>

				</div>

			)
			
	


}

export default PopularContainer;