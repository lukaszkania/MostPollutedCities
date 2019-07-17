import React, { Component } from 'react';
import axios from 'axios';
import { CITY_DESCRIPTION } from '../../constants/API_URLS';
import './SingleCity.scss';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

class SingleCity extends Component {
    state = {
        city: this.props.cityObject,
        cityDescription: ''
    }

    componentDidMount() {
        axios.get(CITY_DESCRIPTION + this.state.city.city).then(response => {
            this.setState({
                cityDescription: response.data.extract
            })
        }).catch(error => {
            console.log(error.message)
        })

    }

    render() {
        return (
            <Accordion defaultActiveKey="0">
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            {this.state.city.city}
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <em>{this.state.cityDescription}</em>
                            <br />
                            Value of pm10: <strong>{Math.round(this.state.city.value)}µg/m³.</strong>
                            <br />
                            Last measurement: <strong>{this.state.city.utcDate.slice(0, 10)}</strong>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

            </Accordion >

        );
    }
}

export default SingleCity;