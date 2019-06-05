import React from 'react';



const UserPodcastContainer = (props) => {
	

	

		const displayPodcasts = props.userPodcasts.map((podcast, i) => {
			return (
					<li key={i}>
						<img src={podcast.image}/><br/>
						Title: {podcast.title}<br/>
						
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