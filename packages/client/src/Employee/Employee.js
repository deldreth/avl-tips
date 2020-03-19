import React from "react";

function Employee(props) {
  return (
    <div className="card employee">
      <div className="card-content">
        Support
        <p className="title">{props.name}</p>
        <p className="subtitle">
          <b>Employer:</b> {props.employer}
        </p>
        <div className="columns">
          {props.venmo && (
            <p className="column">
              <a
                className="button is-info is-medium is-fullwidth"
                target="_blank"
                rel="noreferrer noopener"
                href={`https://venmo.com/${props.venmo.substr(1)}`}
              >
                Venmo {props.venmo}
              </a>
            </p>
          )}
          {props.cash && (
            <p className="column">
              <a
                className="button is-success is-medium is-fullwidth"
                href={`https://cash.app/${props.cash}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Cash {props.cash}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Employee;
