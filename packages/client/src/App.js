import React from "react";
import { Helmet } from 'react-helmet'

import { AvlTipsCard } from "@avl-tips/components-react";
import Error from "./Error/Error";
import api from "./utils/api/api";
import Config from "./Config"

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
    <>
    <Helmet>
      <title>{TITLE}</title>
      <meta name="description" content={TITLE} />
    </Helmet>
    <div className="background-container" style={{backgroundImage: `url("${Config.image.src}")`}}>
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-two-thirds-desktop">
              <div className="card has-background-grey-dark has-text-light">
                <div className="card-content">
                  <p className="title has-text-light is-size-6-mobile">
                    Help the {Config.city} Service Industry
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
                    If you are a service industry worker impacted by this in{" "}
                    {Config.city}, {Config.state ? `${Config.state},` : ``}{" "}
                    <a
                      target="_blank"
                      rel="noreferrer noopener"
                      href={Config.form.url}
                    >
                      please fill out this form
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="columns is-centered">
            <div className="column is-two-thirds-desktop">
              {employee && <AvlTipsCard {...employee} />}

              {error && <Error {...error} />}
            </div>
          </div>
        </div>
      </section>

      <footer className="support-footer has-text-white">
        <a
          href={Config.image.attr.url}
          className="has-text-white"
        >
          Image: {Config.image.attr.name}
        </a>{" "}
        |{" "}
        <a href={`mailto:${Config.mailto}`} className="has-text-white">
          Questions and Data Privacy Inquiries
        </a>
      </footer>
    </div>
    </>
  );
}

export default App;
