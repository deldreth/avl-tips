import React from "react";

function Developers() {
  return (
    <>
      <section className="section">
        <div className="container">
          {/* <div className="columns is-centered">
            <div className="column is-two-thirds-desktop">
              <div className="card">
                <div className="card-content">
                  <h1 className="title">Forking and Source Code</h1>
                  <h2 className="subtitle">
                    Create an Instance for Your Community
                  </h2>
                  <p>
                    This project was created by a handful of developers native
                    to Asheville, NC. The source code is freely available at{" "}
                    <a href="https://github.com/deldreth/avl-tips">
                      https://github.com/deldreth/avl-tips
                    </a>
                    .
                  </p>

                  <p>
                    Included are instructions on how to create your own instance
                    to help support your community.
                  </p>
                </div>
              </div>
            </div>
          </div> */}

          <div className="columns is-centered">
            <div className="column is-two-thirds-desktop">
              <div className="card">
                <div className="card-content">
                  <h1 className="title">Embedding the Tip Card</h1>

                  <p>
                    The tip card is publicly accessible via CDN as a web
                    component and can be used on any site. Simply include the
                    following script tags in the head of your page and use the
                    web component <code>{"<avl-tips></avl-tips>"}</code>.
                  </p>
                  <br />
                  <pre>
                    {`<script type="module" src="https://avl.tips/wc/components/components.esm.js"></script>
<script nomodule="" src="https://avl.tips/wc/components/components.js"></script>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Developers;
