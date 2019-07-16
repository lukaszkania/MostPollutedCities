import React, { Component } from 'react';

class SingleCity extends Component {
    state = {
        city: this.props.cityObject
    }
    render() {
        return (
            <tr key={this.state.city.city}>
                <td>{this.state.city.city}</td>
                <td>{this.state.city.value}</td>
                <td>{this.state.city.lastUpdated}</td>
            </tr>
        );
    }
}

export default SingleCity;