import React, { Component } from 'react';
import SingleCity from '../SingleCity/SingleCity';

class ListOfCities extends Component {
    state = {}
    render() {
        return (
            <div className="listofcities-container">
                ListOfCities component
                <SingleCity />
            </div>
        );
    }
}

export default ListOfCities;