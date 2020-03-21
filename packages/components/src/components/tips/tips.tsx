import { Component, Host, State, h } from "@stencil/core";
import axios from "axios";

type Employee = {
  name: string;
  venmo: string;
  cash: string;
  employer: string;
};

@Component({
  tag: "avl-tips",
  styleUrl: "tips.css",
  shadow: true
})
export class Tips {
  @State() employee: Employee;
  @State() hasError: boolean;

  componentWillLoad() {
    axios
      .get(
        "https://yqzgbw1s1g.execute-api.us-east-1.amazonaws.com/dev/employee"
      )
      .then(response => (this.employee = response.data))
      .catch(() => (this.hasError = true));
  }

  render() {
    return (
      <Host>
        <avl-tips-card {...this.employee}></avl-tips-card>
      </Host>
    );
  }
}
