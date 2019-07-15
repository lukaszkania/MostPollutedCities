import React, { Component } from 'react';
import AutoComplete from '../AutoComplete/AutoComplete';
import ListOfCities from '../ListOfCitiesComponent/ListOfCitiesComponent';

class Home extends Component {
    state = {}
    render() {
        return (
            <div className="home-container">
                Home component
                <AutoComplete />
                <ListOfCities />
            </div>
        );
    }
}

export default Home;