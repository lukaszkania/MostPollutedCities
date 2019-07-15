import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { SPECIFIC_COUNTRY_ALL_CITITES, COUNTRIES_API_URL, MEASUREMENTS } from '../../constants/API_URLS';



class AutoComplete extends Component {
    state = {
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: '',
        inputedCountryObject: [],
        citiesOfInputedCountry: [],
        latestMeasurements: [],
        topTenPollutedCities: []
    };


    onChange = event => {
        const { suggestions } = this.props; // Getting suggestions list from props
        const userInput = event.target.value; // Getting input from the user

        // Filter our suggestions that don't contain the user's input
        const filteredSuggestions = suggestions.filter(
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
            userInput: event.target.value
        });
    };

    // Event fired when the user presses a key down
    onKeyDown = event => {
        const { activeSuggestion, filteredSuggestions } = this.state;

        // User pressed the enter key, update the input and close the
        // suggestions
        if (event.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion]
            });
        }
        // User pressed the up arrow, decrement the index
        else if (event.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion - 1 });
        }
        // User pressed the down arrow, increment the index
        else if (event.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
    };


    handleClickButton = event => {
        axios.get(COUNTRIES_API_URL).then(response => {
            response.data.results.map(countryObject => {
                if (countryObject.name === this.state.userInput) {
                    const properCountryObject = countryObject
                    this.setState({
                        inputedCountryObject: properCountryObject
                    })
                }
                axios.get(SPECIFIC_COUNTRY_ALL_CITITES + "?country=" + this.state.inputedCountryObject.code + "&limit=10000/").then(response => {
                    this.setState({
                        citiesOfInputedCountry: response.data.results
                    })

                    axios.get(MEASUREMENTS + "?country=" + this.state.inputedCountryObject.code + "&limit=10000/").then(response => {
                        this.setState({
                            latestMeasurements: response.data.results
                        })

                    }).catch(error => {
                        console.log(error.message)
                    })
                }).catch(error => {
                    console.log(error.message)
                })


            })
            this.setState({
                topTenPollutedCities: this.getMostPollutedCities(this.state.latestMeasurements)
            })
        }
        )
    }

    getMostPollutedCities(citiesMeasurements) {
        const results = []

        citiesMeasurements.map(city => {
            let cityName = city.city
            city.measurements.map(measurement => {
                if (measurement.parameter === "pm10") {
                    let measurementValue = measurement.value
                    let resultObject = {
                        "cityName": cityName,
                        "value": measurementValue
                    }
                    results.push(resultObject)
                }
            })
        })

        // Sorting
        results.sort((a, b) => (a.value < b.value) ? 1 : -1)
        const topTenPollutedCities = [results[0]]
        const cities = [results[0].cityName]
        let i = 0
        while (topTenPollutedCities.length < 10) {
            for (let j = 0; j < cities.length; j++) {
                if (results[i].cityName === cities[j]) {
                    break
                } else {
                    cities.push(results[i].cityName)
                    topTenPollutedCities.push(results[i])
                    break

                }

            }
            i++
        }

        return topTenPollutedCities
    }

    capitalizeFirstLetter(string) {
        const arrayOfString = string.split(" ")
        const results = []
        for (let i = 0; i < arrayOfString.length; i++) {
            let firstLetter = arrayOfString[i].charAt(0).toUpperCase()
            let restOfLetters = arrayOfString[i].slice(1).toLowerCase()
            const wholeString = firstLetter + restOfLetters
            results.push(wholeString)
        }
        return results.join(" ")
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

        return (
            <div className="autocomplete-container">
                AutoComplete component
            </div>
        );
    }
}

export default AutoComplete;