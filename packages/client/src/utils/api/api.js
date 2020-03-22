import axios from "axios";
import Config from "../../Config"

let baseURL = Config.api.prod.url;
if (process.env.NODE_ENV !== "production") {
  baseURL = Config.api.dev.url;
}

export default axios.create({
  baseURL
});
