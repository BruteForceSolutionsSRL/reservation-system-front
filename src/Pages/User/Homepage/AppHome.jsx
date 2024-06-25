import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import PageUs from "./PageUs";

function AppHome() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/nosotros" component={PageUs} />
      </Switch>
    </Router>
  );
}

export default AppHome;
