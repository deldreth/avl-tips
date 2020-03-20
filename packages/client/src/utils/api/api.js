import axios from "axios";

let baseURL = "https://yqzgbw1s1g.execute-api.us-east-1.amazonaws.com/dev";
if (process.env.NODE_ENV !== "production") {
  baseURL = "https://65y0v85nve.execute-api.us-east-1.amazonaws.com/qa";
}

export default axios.create({
  baseURL
});
