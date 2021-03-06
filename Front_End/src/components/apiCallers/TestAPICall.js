//
// This component is unused and probably safe to delete.
// In fact, it may even rely on deprecated/removed api calls
// However, it does make for a good example component. to see the 
// overall structure the apiCaller components are built on
//

import React, {Component} from "react";
import { url } from "./_apiRootAddress";

class TestAPICall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: "",
            isLoading: true,
            hasError: false,
            error: null
        };
    }

    componentDidMount() {
        this.setState({isLoading: true});
        const baseURL = url

        fetch(baseURL+"/testAPI")
            .then(res => res.text())
            .then(res => this.setState({apiResponse: res, isLoading: false}))
            .catch(err => this.setState({hasError:true, error:err}));
    }

    render() {
        const { apiResponse, isLoading, hasError, error } = this.state;

        if (hasError) {
            return <p>Error: <p>{error}</p></p>;
        }

        if (isLoading) {
            return <p>Loading Test...</p>;
        }

        return (
            <div id="TestAPICall">
                Test Results: {apiResponse}
            </div>
        );
    }
}

export default TestAPICall;
