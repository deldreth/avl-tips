import React from "react";
import PropTypes from "prop-types";

import { AvlTipsCard } from "@avl-tips/components-react";
import Error from "../../components/Error/Error";
import Config from "../../Config";

Home.propTypes = {
  employee: PropTypes.shape({}),
  error: PropTypes.shape({})
};

function Home({ employee, error }) {
  return (
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
                  Every time you have a drink at home during social distancing,
                  consider tipping a local service industry worker through Venmo
                  or Cash App. Refresh this page to get a new person to support.
                  Right now, service industry people are severely impacted by
                  social distancing and quarantine. Lower amounts of patrons and
                  restaurants closing will be tough on everyone. Every little
                  bit helps.
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
  );
}

export default Home;
