import React from 'react';



const PopularContainer = (props) => {
	

	
	//
	const displayPopular = props.popular.map((podcast, i) => {
		return (
				<li key={i} className='liContainer'>
					<div className='center-column-flex-container podcastCol'>
					<img src={podcast.image}/><br/>
					{podcast.title}<br/>
					</div>
					<div className='buttonCol'>
					<button className='button' id={podcast.id} onClick={props.addPodcast}>Add</button>
					</div>
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