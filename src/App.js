import React, { Component } from 'react';
import Home from './components/Home/Home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PageNotFound from './components/PageNotFound/PageNotFound';

class App extends Component {
  state = {}
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route component={PageNotFound} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;

