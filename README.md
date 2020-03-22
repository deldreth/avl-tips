# Client

## Deployment to Netlify

[![Deploy to netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/changelabsio/avl-tips)

### Build Environment Variables

Configuration of the client can be overridden using Environment variables as described below:

* `REACT_APP_CITY` - Your city
* `REACT_APP_STATE` (optional) - Your state
* `REACT_APP_MAILTO` - Your email address for Questions and Data Privacy Inquiries
* `REACT_APP_FORM_URL` - URL for google form
* `REACT_APP_IMAGE_SRC` - URL for background image
* `REACT_APP_IMAGE_ATTR_NAME` - Image attribution name
* `REACT_APP_IMAGE_ATTR_URL` - Image attribution url for links
* `REACT_APP_API_DEV_URL` - Development api base url
* `REACT_APP_API_PROD_URL` - Production api base url
* `REACT_APP_WC_TAG` - Web Component tag ex: `avl-tips` will produce a web component with the tag `<avl-tips />`

# Local Development

1. Run `npm install` from the project root
2. Run `npm run build:all` from the project root
2. `cd packages/client`
3. `npm start`
