
import React, { Component } from 'react';
import Collapsible from 'react-collapsible';

class ShowPodcast extends Component {
	constructor() {
    super();
    this.state = {
      episodeToShow: '',
      nextEpisode: '',
      audio: '',
      podcastPlaying: ''
    }

  }

		showEpisode = async (e) => {
			console.log(e.currentTarget);
			const audio = this.props.podcastToShow.episodes[e.currentTarget.id].audio
			console.log(audio);
			await this.setState({
				audio: audio
			})
			
			console.log(this.state);
		}



		render() {
			// renders the podcasts episodes
			const episodes = this.props.podcastToShow.episodes.map((episode, i) => {
				const ep = 'Episode ' + (i + 1)
				return(
					<div className='eps'>
						<Collapsible trigger={ep}>
							<div className='between-flex-container'>
							<p>{episode.title}</p><br/>
							<button onClick={this.props.resetPodcastState} id={episode.audio} className='button'>Play</button>
							
							</div>
        
      					</Collapsible>
					</div>
					)
			})
			return (
					<div className='showingPodcast'>
						<div className='between-flex-container headerPodcast'>
						<img className='podcastImg' src={this.props.podcastToShow.image}/><br/>
						<p className='podcastDescription'>{this.props.podcastToShow.description}</p><br/>
						</div>
						<button className='button' onClick={() => {
							      this.props.returnToPodcastHome();
							      
							  	}}>Back</button>
  						<Collapsible trigger='Show Episodes' className='epTrigger' openedClassName='epTrigger' triggerWhenOpen='Hide Episodes'>
							{episodes}
							
      					</Collapsible>

					</div>

				)

			
		}
			
	


}

export default ShowPodcast;