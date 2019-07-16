import React, { Component } from 'react';

class SingleCity extends Component {
    state = {
        city: this.props.cityObject
    }
    render() {
        return (
            <tr key={this.state.city.city}>
                <td><a href={"https://en.wikipedia.org/wiki/" + this.state.city.city} >{this.state.city.city}</a></td>
                <td>{Math.round(this.state.city.value * 100) / 100}</td>
                <td>{this.state.city.localDate.slice(0, 10)}</td>
            </tr>
        );
    }
}

export default SingleCity;