
import React, { Component } from 'react';


class ShowPodcast extends Component {
	constructor() {
    super();
    this.state = {
      episodeToShow: '',
      nextEpisode: ''
    }

  }

		showEpisode = async (e) => {
			console.log(e.currentTarget);
			const audio = this.props.podcastToShow.episodes[e.currentTarget.id].audio
			console.log(audio);
			await this.setState({
				episodeToShow: ''
			})
			await this.setState({
				episodeToShow: <embed src={audio} type='audio/mpeg' height='100px' width='200px'/>
			})
			console.log(this.state);
		}

		// passPodcast = () => {
		// 	console.log('hit passPodcast');
		// 	this.props.returnToPodcastHome(this.state.episodeToShow)
		// }


		render() {
			const episodes = this.props.podcastToShow.episodes.map((episode, i) => {
				return(
					<div>
						<p id={i} onClick={this.showEpisode}>Episode {i + 1}</p>
					</div>
					)
			})
			return (
					<div>
						<img src={this.props.podcastToShow.image}/><br/>
						<p onClick={this.props.returnToPodcastHome}>Back</p>
						{this.props.podcastToShow.description}<br/>
						{this.state.episodeToShow}
						{episodes}

					</div>

				)

			
		}
			
	


}

export default ShowPodcast;