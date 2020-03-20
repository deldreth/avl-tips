import axios from "axios";

export function getEmployee() {
  return axios.get(
    "https://yqzgbw1s1g.execute-api.us-east-1.amazonaws.com/dev/employee"
  );
}
