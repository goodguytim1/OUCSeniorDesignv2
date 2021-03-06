// 
// This component is the main page for all substations.
// Renders its components to display data specific to a
// single substation.
//

// Import
import React, {Component} from "react";
import "../stylesheets/SubstationHomepage.css";
import Map from './Map';

import RetrieveTargetedWeatherData from "./apiCallers/RetrieveTargetedWeatherData"
import SubstationLivestream from "./SubstationLivestream"
import PowerPredictionsDashboard from "./PowerPredictionsDashboard.js";
import { heroku } from "./apiCallers/_apiRootAddress"

const IS_HEROKU_BUILD = heroku;

class SubstationHomepage extends Component {
    // constructor auto set to test mode
    constructor(props) {
        // recieves stationID as a prop
        super(props);

        // this component will render all children components in a test mode if
        // the passed in substation ID is -1
        this.state = {
            testMode: (this.props.stationID == "-1")
        };
    }
    // Render the following HTML
    render() {

        return (
        <div className="SubstationHomepage" key={this.props.stationID}>
            {/* Divide the local page into left and right display */}
            <div className="topdisplay">
                {/* Left display has the livestream component at the top and the map component at the bottom */}
                <div className="leftdisplay">
                    <div className="LivestreamWrapper">

                        <SubstationLivestream stationID={this.props.stationID}/>
                    </div>

                    <div className="subMap" style= {{ height: '40vh', width: '640px' }} >
                        <Map stationID={this.state.testMode? "1" : this.props.stationID}/>
                    </div>
                </div>
                {/* Right display has the power prediction graph component at the top and the weather statistics component at the bottom */}
                <div className="rightdisplay">
                    <PowerPredictionsDashboard stationID={this.state.testMode? "1" : this.props.stationID}/>
                    <div>
                        <h1>Weather Statistics</h1>
                        <RetrieveTargetedWeatherData friendlyDisplay={true} stationID={this.state.testMode? "1" : this.props.stationID} onlyMostRecent={1} skipForm={true}/>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default SubstationHomepage;
