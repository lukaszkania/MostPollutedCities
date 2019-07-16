import React, { Component } from 'react';
import axios from 'axios';
import { COUNTRIES_API_URL, MEASUREMENTS } from '../../constants/API_URLS';
import SingleCity from '../SingleCity/SingleCity';

class AutoComplete extends Component {
    state = {
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: '',
        inputedCountryIsoCode: '',
        inputedCountryCities: []
    };

    // Event fired when user input something
    onChange = event => {
        const userInput = event.target.value; // Getting input from the user
        // Filter our suggestions that don't contain the user's input
        const filteredSuggestions = this.props.suggestions.filter(
            suggestion =>
                suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );
        // Update the user input and filtered suggestions, reset the active
        // suggestion and make sure the suggestions are shown
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: true,
            userInput: event.target.value
        });
    };


    // Event fired when the user clicks on a suggestion
    onClick = event => {
        // Update the user input and reset the rest of the state
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: this.state.filteredSuggestions[event.target.value]
        });

        // Update local storage user input
        localStorage.setItem('userInput', this.state.filteredSuggestions[event.target.value])

    };


    // Getting and setting data from local storage when component mount
    componentDidMount() {
        const locStoUserInput = localStorage.getItem("userInput")
        if (locStoUserInput) {
            this.setState({
                userInput: locStoUserInput
            })
            this.getDataDependentFromUserInput()
        } else {
            this.setState({
                userInput: ""
            })
        }

    }


    // Event fired when the user presses a key down
    onKeyDown = event => {
        // User pressed the enter key, update the input and close the
        // suggestions
        if (event.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: this.state.filteredSuggestions[this.state.activeSuggestion]
            });
        }
        // User pressed the up arrow, decrement the index
        else if (event.keyCode === 38) {
            if (this.state.activeSuggestion === 0) {
                return;
            }
            this.setState({ activeSuggestion: this.state.activeSuggestion - 1 });
        }
        // User pressed the down arrow, increment the index
        else if (event.keyCode === 40) {
            if (this.state.activeSuggestion - 1 === this.state.filteredSuggestions.length) {
                return;
            }

            this.setState({ activeSuggestion: this.state.activeSuggestion + 1 });
        }

        // Update local storage user input
        localStorage.setItem('userInput', this.state.filteredSuggestions[this.state.activeSuggestion])
    };


    // Formating all cities name in objects of city
    formatCityNameString(cityName) {
        const words = cityName.split(" ")
        const result = []
        for (let i = 0; i < words.length; i++) {
            const firstLetter = words[i].charAt(0).toUpperCase()
            const restOfWord = words[i].slice(1).toLowerCase()
            result.push(firstLetter + restOfWord)
        }
        return result.join(" ")
    }


    // Filtering all measurements that have pm10 measurement
    filterMeasurements(latestData) {
        const results = []
        if (latestData) {
            latestData.map(object => {
                if (object.unit === "µg/m³") {
                    let pollutionValue = object.value
                    let cityName = object.city
                    let localDateUpdated = object.date.local
                    let utcDateUpdated = object.date.utc
                    let objectResult = {
                        city: cityName,
                        value: pollutionValue,
                        localDate: localDateUpdated,
                        utcDate: utcDateUpdated
                    }
                    results.push(objectResult)
                }
            })


            // Sorting results
            results.sort((a, b) => (a.value < b.value) ? 1 : -1)
            // Deleting repeated cities name
            const flags = []
            const output = []
            const l = results.length
            for (let i = 0; i < l; i++) {
                if (flags[results[i].city]) continue;
                flags[results[i].city] = true;
                output.push(results[i]);
            }
            console.log(output)
            return output
        }
    }


    // Getting ten most polluted cities
    getTenMostPollutedCities(citiesArray) {
        return citiesArray.slice(0, 10)
    }


    // Getting data based on user input value
    getDataDependentFromUserInput() {
        // Getting ISO code of inputed by user country
        axios.get(COUNTRIES_API_URL).then(response => {
            const allCountriesObjects = response.data.results
            allCountriesObjects.map(country => {
                if (country.name === this.state.userInput) {
                    this.setState({
                        inputedCountryIsoCode: country.code,
                    })
                    // Getting all citites of inputed code ISO country
                    if (this.state.inputedCountryIsoCode) {
                        axios.get(MEASUREMENTS + "?country=" + this.state.inputedCountryIsoCode + "&limit=10000&parameter=pm10").then(response => {
                            this.setState({
                                inputedCountryCities: this.getTenMostPollutedCities(this.filterMeasurements(response.data.results))
                            })
                        }).catch(error => {
                            console.log(error.message)
                        })
                    }
                }
            })
        }).catch(error => {
            console.log(error.message)
        })
    }


    // Event fired when user click on button
    handleClickButton = event => {
        this.getDataDependentFromUserInput()
    }


    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            state: {
                activeSuggestion,
                filteredSuggestions,
                showSuggestions,
                userInput
            }
        } = this;
        /*************************************************************SUGGESTIONS COMPONENT******************************************************************************** */
        let suggestionsListComponent;
        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                suggestionsListComponent = (
                    <ul className="suggestions">
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;

                            // Flag the active suggestion with a class
                            if (index === activeSuggestion) {
                                className = "suggestion-active";
                            }
                            return (
                                <li
                                    className={className}
                                    key={suggestion}
                                    onClick={onClick}
                                    value={index}
                                >
                                    {suggestion}
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                suggestionsListComponent = (
                    <div className="no-suggestions">
                        <em>No suggestions avaliable...</em>
                    </div>
                );
            }
        }
        /****************************************************************LIST OF CITIES COMPONENT*********************************************************************************** */
        let ListOfCitiesComponent;
        if (this.state.inputedCountryCities.length > 0) {
            ListOfCitiesComponent = (
                <table>
                    <tr>
                        <td>City</td>
                        <td>Value of pm10</td>
                        <td>Last measurement</td>
                    </tr>
                    {this.state.inputedCountryCities.map(cityObject => {
                        return (
                            <SingleCity key={cityObject.city} cityObject={cityObject} />
                        )
                    })}
                </table>
            )
        } else {
            ListOfCitiesComponent = (
                <div className="no-avaliable-cities">
                    There is a problem with API or You are inputing wrong country name...
                </div>
            )
        }

        return (
            <div className="autocomplete-container">
                <input
                    type="text"
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={userInput}
                    name="userInput"

                />

                <button onClick={this.handleClickButton} type="submit" value="submit" >
                    Submit
                </button>
                {suggestionsListComponent}
                {ListOfCitiesComponent}

            </div>
        );
    }
}

export default AutoComplete;