import React, { Component } from 'react';
import ShowPodcast from '../ShowPodcast'



class UserPodcastContainer extends Component {
	constructor() {
    super();
    this.state = {
      episodeToShow: '',
      nextEpisode: '',
      audio: ''
    }

  }

	


		render() {
			const displayPodcasts = this.props.userPodcasts.map((podcast, i) => {
				return (
						<li key={i}>
							<img id={podcast._id} src={podcast.image} onClick={this.props.showPodcast}/><br/>
							{podcast.name}<br/>
							<button className='button userDelete' id={podcast._id} onClick={this.props.deletePodcast}>Delete</button>
						</li>

					)
			})

			return (


					<div className='center-column-flex-container'>
	            		<div className='yourPodcastOverallContainer'>
							<div>
								<ul className='yourPodcasts'>
								{displayPodcasts}
								</ul>

							</div>
	              
	            		</div>
          			</div>

				)
		}
			
	


}

export default UserPodcastContainer;