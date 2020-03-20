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
        <div className="columns is-multiline">
          {props.venmo && (
            <div className="column">
              <a
                className="button is-info is-medium is-flex"
                target="_blank"
                rel="noreferrer noopener"
                href={`https://venmo.com/${props.venmo.substr(1)}`}
              >
                Venmo {props.venmo}
              </a>
            </div>
          )}
          {props.cash && (
            <p className="column">
              <a
                className="button is-success is-medium is-flex"
                href={`https://cash.app/${props.cash}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Cash {props.cash}
              </a>
            </p>
          )}
          {props.paypal && (
            <p className="column">
              <a
                className="button is-primary is-medium is-flex"
                href={`https://paypal.me/${props.paypal}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                PayPal.Me {props.paypal}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Employee;
