import React from "react";

function Error(props) {
  return (
    <article class="message is-warning">
      <div class="message-header">
        <p>Something went wrong</p>
      </div>
      <div class="message-body">
        Either there are no participants yet or something is wrong.
      </div>
    </article>
  );
}

export default Error;
