import React from "react";
import axios from "axios";

import Employee from "./Employee/Employee";
import Error from "./Error/Error";

import "bulma/css/bulma.min.css";
import "./App.css";

function App() {
  const [employee, setEmployee] = React.useState();
  const [error, setError] = React.useState();

  React.useEffect(() => {
    axios
      .get(
        "https://yqzgbw1s1g.execute-api.us-east-1.amazonaws.com/dev/employee"
      )
      .then(response => setEmployee(response.data))
      .catch(responseError => setError(responseError));
  }, []);

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-mobile is-two-thirds-tablet is-half-desktop">
              <div className="card has-background-grey-dark has-text-light">
                <div className="card-content">
                  <p className="title has-text-light is-size-6-mobile">
                    Help the Asheville Service Industry
                  </p>
                  <p className="subtitle has-text-light is-size-6-mobile">
                    Every time you have a drink at home during social
                    distancing, consider tipping a local service industry worker
                    through Venmo or Cash App. Refresh this page to get a new
                    person to support. Right now, service industry people are
                    severely impacted by social distancing and quarantine. Lower
                    amounts of patrons and restaurants closing will be tough on
                    everyone. Every little bit helps.
                  </p>
                  <p className="subtitle has-text-light"></p>
                  <p>
                    If you are a service industry worker impacted by this in
                    Asheville,{" "}
                    <a
                      target="_blank"
                      rel="noreferrer noopener"
                      href="https://docs.google.com/forms/d/e/1FAIpQLSeVXG4EkNvg4iyAeYzRz45yiiadNh_OYZ9MG9moS4acJm_OFA/viewform"
                    >
                      please fill out this form
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="columns is-centered">
            <div className="column is-mobile is-two-thirds-tablet is-half-desktop">
              {employee && <Employee {...employee} />}

              {error && <Error {...error} />}
            </div>
          </div>
        </div>
      </section>

      <footer className="support-footer has-text-white">
        <a
          href="https://www.flickr.com/photos/mogmismo/"
          className="has-text-white"
        >
          Image: mogmismo
        </a>{" "}
        |{" "}
        <a href="mailto:inquiries@avl.tips" className="has-text-white">
          Questions and Data Privacy Inquiries
        </a>
      </footer>
    </>
  );
}

export default App;
