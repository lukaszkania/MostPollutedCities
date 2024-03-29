import React, { Component } from 'react';
import AutoComplete from '../AutoComplete/AutoComplete';
import { COUNTRIES_API_URL } from '../../constants/API_URLS';
import DESIRABLE_COUNTRIES from '../../constants/DESIRABLE_COUNTRY';
import axios from 'axios';
import './Home.scss';

class Home extends Component {
    state = {
        suggestions: [],
        countriesObjects: []
    }

    // Getting all desirable countries objects and returning them stored in array
    filterCountries(desirableCountries, allCountriesName) {
        const result = [] // Final array

        // Looping to check if names of desirable country is equal to object name
        for (let i = 0; i < desirableCountries.length; i++) {
            for (let j = 0; j < allCountriesName.length; j++) {
                if (desirableCountries[i] === allCountriesName[j].name) {
                    result.push(allCountriesName[j])
                }
            }
        }
        return result
    }

    componentDidMount() {
        axios.get(COUNTRIES_API_URL).then(response => {
            // Getting from every country object name of it and updating state suggestions
            this.setState({
                countriesObjects: this.filterCountries(DESIRABLE_COUNTRIES, response.data.results),
                suggestions: DESIRABLE_COUNTRIES

            })
        }).catch(error => {
            console.log(error.message)
        })
    }

    render() {
        return (
            <div className="home-container">
                <h1>Pollution pm10 checker</h1>
                <AutoComplete suggestions={this.state.suggestions} />
            </div>
        );
    }
}

export default Home;