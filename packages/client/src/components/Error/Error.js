import React from "react";

function Error(props) {
  return (
    <article className="message is-warning">
      <div className="message-header">
        <p>Something went wrong</p>
      </div>
      <div className="message-body">
        Either there are no participants yet or something is wrong.
      </div>
    </article>
  );
}

export default Error;
