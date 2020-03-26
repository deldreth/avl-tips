# Client

## Deployment to Netlify

[![Deploy to netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/changelabsio/avl-tips)

### Build Environment Variables

Configuration of the client can be overridden using Environment variables as described below:

- `REACT_APP_CITY` - Your city
- `REACT_APP_STATE` (optional) - Your state
- `REACT_APP_MAILTO` - Your email address for Questions and Data Privacy Inquiries
- `REACT_APP_FORM_URL` - URL for google form
- `REACT_APP_IMAGE_SRC` - URL for background image
- `REACT_APP_IMAGE_ATTR_NAME` - Image attribution name
- `REACT_APP_IMAGE_ATTR_URL` - Image attribution url for links
- `REACT_APP_API_DEV_URL` - Development api base url
- `REACT_APP_API_PROD_URL` - Production api base url
- `REACT_APP_WC_TAG` - Web Component tag ex: `avl-tips` will produce a web component with the tag `<avl-tips />`

# Local Development

1. Run `npm install` from the project root
2. Run `npm run build:all` from the project root
3. `cd packages/client`
4. `npm start`

## Update Area Specifics

Optionally, you can update the codebase to reflect your area.

`@avl-tips/codemod` supplies a few codemods that can be used to update source files relative to your area. This includes the web component tags in `@avl-tips/components` and named imports in `@avl-tips/client`. Run the codemods manually to update source files for your project.

Run `APP_WC_TAG_PREFIX=area npx lerna run codemod --stream` where `area` is the name of your area

(e.g., `APP_WC_TAG_PREFIX=philly npx lerna run codemod --stream`, would update all instances of `@avl-tips` to `@philly-tips`).

# AWS

## Prerequisites

- Setup AWS cli and have credentials capable of provisioning lamdas and S3 buckets through serverless

## Setup - Dev/Staging

1. Update server/serverless.yml references of `avl-tips` to a name relative to your deploy. Update `provider.profile` if your AWS credentials profile is something other than `default`.
2. Run `npx lerna run deploy:staging` from project root.
3. If deploying to Netlify, update the netlify.toml `REACT_APP_API_{STAGE}_URL` environment variable.

## Bucket Setup

1. Provision an IAM user within AWS that has AmazonS3FullAccess permissions and no console access. Download the credentials for later.
2. Upload the `server/etc/employee.json` file to the S3 bucket provisioned by serverless.

## Google Docs Setup

1. Make a copy of the [sheet template file](https://docs.google.com/spreadsheets/d/1AWbCE-U9xmaFtqeFLwXbPNwE42Fk_h3vc45ZthTQPXQ/copy)
2. Reload the sheet to let the script initialize its menu
3. Go to `Add-ons` -> `avl.tips scripts` -> `Configure...`
4. Continue through the authorization prompt
5. Click `Advanced` on the app not verified warning
6. Scroll down and select `Go to avl.tips (unsafe)` (don't worry, it's safe)
7. Allow the access necessary for the script to function
8. Back on the spreadsheet, again go to `Add-ons` -> `avl.tips scripts` -> `Configure...`
9. Fill out the `App Name` (this will be displayed at the top of your form) and the remaining information from the [bucket setup](#bucket-setup) above. This information will only be stored on the copy of the sheet that you have.
10. Save and wait for the script to generate your form and hook it up to the sheet and the S3 bucket.

When back on your sheet, you can edit or view your form via the `Form` menu and the `Edit form` and `Go to live form` selections respectively.

## Setup - Production

1. Run `npx lerna run deploy:production` from project root.
2. Follow [Bucket Setup](#bucket-setup) steps for production bucket.
