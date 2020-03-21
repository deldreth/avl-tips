import React from "react";
import { Helmet } from "react-helmet";
import { Switch, BrowserRouter, Route } from "react-router-dom";

import Footer from "./components/Footer/Footer";
import Home from "./containers/Home/Home";
import Developers from "./containers/Developers/Developers";
import api from "./utils/api/api";
import Config from "./Config";

import "bulma/css/bulma.min.css";
import "./App.css";

const TITLE = `Help the ${Config.city} Service Industry`;

function App() {
  const [employee, setEmployee] = React.useState();
  const [error, setError] = React.useState();

  React.useEffect(() => {
    api
      .get("/employee")
      .then(response => setEmployee(response.data))
      .catch(responseError => setError(responseError));
  }, []);

  return (
    <BrowserRouter>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={TITLE} />
      </Helmet>
      <div
        className="background-container"
        style={{ backgroundImage: `url("${Config.image.src}")` }}
      >
        <Switch>
          <Route exact path="/">
            <Home employee={employee} error={error} />
          </Route>
          <Route path="/dev">
            <Developers />
          </Route>
        </Switch>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
