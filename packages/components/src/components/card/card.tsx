import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "avl-tips-card",
  styleUrl: "card.sass",
  shadow: true
})
export class Card {
  @Prop() name: string;
  @Prop() venmo: string;
  @Prop() cash: string;
  @Prop() paypal: string;
  @Prop() employer: string;

  render() {
    return (
      <div class="card employee">
        <div class="card-content">
          Support
          <p class="title">{this.name}</p>
          <p class="subtitle">
            <b>Employer:</b> {this.employer}
          </p>
          <div class="columns is-multiline">
            {this.venmo && (
              <p class="column">
                <a
                  class="button is-info is-medium is-flex"
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://venmo.com/${this.venmo.substr(1)}`}
                >
                  Venmo {this.venmo}
                </a>
              </p>
            )}
            {this.cash && (
              <p class="column">
                <a
                  class="button is-success is-medium is-flex"
                  href={`https://cash.app/${this.cash}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Cash {this.cash}
                </a>
              </p>
            )}
            {this.paypal && (
              <p class="column">
                <a
                  class="button is-primary is-medium is-flex"
                  href={`https://paypal.me/${this.paypal}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  PayPal.Me {this.paypal}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
