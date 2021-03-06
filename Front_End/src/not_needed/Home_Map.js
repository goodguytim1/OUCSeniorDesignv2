import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import Marker from './Marker';
import { useHistory } from "react-router-dom";

class Map extends Component {
  static defaultProps = {
    center: {
      lat: 28.2389,
      lng: -81.2312
    },
    zoom: 13,
    options: {
      streetViewControl: true,
      mapTypeControl: true,
    }
  }

  handleClick(key) {
    const history = useHistory();
    console.log(key);
    let path = "/";
    if(key === 'sub-28') {
      path = "/Sub_28_Livestream";
      history.push(path);
    }
    else if(key === 'sub-27') {
      path = "/Sub_27_Livestream";
      history.push(path);
    }
    else if(key === 'sub-29') {
      path = "/Sub_29_Livestream";
      history.push(path);
    }
    else if(key === 'sub-33') {
      path = "/Sub_33_Livestream";
      history.push(path);
    }
  }

  render () {
    return (
      //Always explicitly set container height.
      <div id="Map" style= {{ height: '92.5vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCn55lIh6mJ4GnR00jjgGeWUEii5R183xA" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          options={this.props.options}
        >
        <Marker
            key={"sub-28"}
            text={"txt"}
            lat={28.29172}
            lng={-81.19373}
            onClick={() => this.handleClick("sub-28")}
          />
        <Marker
            key={"sub-27"}
            text={"txt"}
            lat={28.24917}
            lng={-81.28942}
            onClick={() => this.handleClick("sub-27")}
          />
        <Marker
            key={"sub-29"}
            text={"txt"}
            lat={28.22465}
            lng={-81.17819}
            onClick={() => this.handleClick("sub-29")}
          />
        <Marker
            key={"sub-33"}
            text={"txt"}
            lat={28.18127}
            lng={-81.27366}
            onClick={() => this.handleClick("sub-33")}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
