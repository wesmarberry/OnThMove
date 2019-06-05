import React from 'react';



const UserPodcastContainer = (props) => {
	

	

		const displayPodcasts = props.userPodcasts.map((podcast, i) => {
			return (
					<li key={i}>
						<img id={podcast._id} src={podcast.image} onClick={props.showPodcast}/><br/>
						Title: {podcast.name}<br/>
						
					</li>

				)
		})


		return (
				<div>
					<ul>
					{displayPodcasts}
					</ul>

				</div>

			)
			
	


}

export default UserPodcastContainer;