
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
			// await this.setState({
			// 	episodeToShow: <embed src={audio} type='audio/mpeg' height='100px' width='200px'/>
			// })
			console.log(this.state);
		}

		// passPodcast = () => {
		// 	console.log('hit passPodcast');
		// 	this.props.returnToPodcastHome(this.state.episodeToShow)
		// }

		// setPodcastHere = (e) => {
		// 	console.log(e.currentTarget);
		// 	this.setState({
		// 		podcastPlaying: <audio  controls>
		// 					  <source src={e.currentTarget.id} type="audio/mpeg"/>
		// 					</audio>
		// 	})
		// 	this.props.setPodcast(this.state.podcastPlaying)
		// }


		render() {
			// <embed src={this.state.audio} type='audio/mpeg' auto_play="false" height='100px' width='200px'/>
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
							      this.props.unmutePodcast();
							  	}}>Back</button>
  						<Collapsible trigger='Show Episodes' className='epTrigger' openedClassName='epTrigger' triggerWhenOpen='Hide Episodes'>
							{episodes}
							
      					</Collapsible>

					</div>

				)

			
		}
			
	


}

export default ShowPodcast;