import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
 

 
class CoolMap extends Component {
  constructor(){
    super()
      this.state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        userLat: '',
        userLng: '',
        zoom: 12
      };
  }
  


  // when the marker is clicked the info window shows with the name of the place
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  // when the map is clicked the info window closes if it is open
  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  render() {
    
    // generates markers based on the user's activities for the day
    const entMarkers = this.props.daysEnt.map((activity, i) => {
      return(

          <Marker 
            key={i} 
            name={activity.name} 
            position={{lat: activity.lat, lng: activity.lng}}
            formatted_address={activity.formatted_address}
            icon={{
              url: '/newblue.png',
              scaledSize: new this.props.google.maps.Size(40,70)
            }}
            style={{'z-index': '5'}}
            onClick={this.onMarkerClick}

          />
        )
        
      
    })

    // limits the markers displayed to five
    const fiveRelated = []
    if (this.props.related.length > 5) {
      for (let i = 0; i < 5; i++) {
        fiveRelated.push(this.props.related[i])
      }

      
    } else {
      for (let i = 0; i < this.props.related.length; i++) {
        fiveRelated.push(this.props.related[i])
      }
    }

    // generates markers based on the related activities
    const relatedMarkers = fiveRelated.map((activity, i) => {
      return(

          <Marker 
            key={i} 
            name={activity.name}
            formatted_address={activity.formatted_address}
            position={activity.geometry.location}
            icon={{
              url: '/newgreen.png',
              scaledSize: new this.props.google.maps.Size(40,70)
            }}
            style={{'z-index': '5'}}
            onClick={this.onMarkerClick}

          />
        )
        
      
    })
    // sets the user's position
    let position = ''
    if (this.props.isActivityPage) {
      position = this.props.activityLocations[0].location
    } else {
      position = this.props.position
    }
    

    

    return (
      <div>
        <div className='centerDiv mapDiv'>
          <Map
            bootstrapURLKeys={{ key: process.env.REACT_APP_API_KEY}}
            initialCenter={this.props.position}
            zoom={this.state.zoom}
            google={this.props.google}
            style={{width: '80%', height: "300px", left: '10%', 'borderRadius': '10px', 'boxShadow': '5px 5px black'}}
            
            onClick={this.onMapClicked}
          >
          <Marker 
            name='Your Location' 
            position={this.props.position}
            
            onClick={this.onMarkerClick}

          />

          {entMarkers}
          {relatedMarkers}


          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}>
              <div>
                <p>{this.state.selectedPlace.name}</p>
                <p>{this.state.selectedPlace.formatted_address}</p>
              </div>
          </InfoWindow>
          </Map>
        </div>


      </div>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey:(process.env.REACT_APP_API_KEY)
})(CoolMap);