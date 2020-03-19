"use strict";

const { google } = require("googleapis");
const AWS = require("aws-sdk");

const SHEETS_SPREADSHEET_ID = "1A72_fUadiS89y1oCFD8elBwIEAdN3ZwNFJszp4jgRUs";

let jwtClient;

async function authorize() {
  const response = await new AWS.S3({ apiVersion: "2006-03-01" })
    .getObject({
      Bucket: "avl-tips-employee",
      Key: "serviceAccount.json"
    })
    .promise();
  const privatekey = JSON.parse(response.Body.toString());

  if (!jwtClient) {
    // configure a JWT auth client
    jwtClient = new google.auth.JWT(
      privatekey.client_email,
      null,
      privatekey.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    //authenticate request
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        console.log(err);
        return;
      } else {
        //console.log("Successfully connected!");
      }
    });
  }
  return jwtClient;
}

async function getEmployee(event) {
  const auth = await authorize();

  const sheets = google.sheets("v4");

  const existing = await new AWS.S3({ apiVersion: "2006-03-01" })
    .getObject({
      Bucket: "avl-tips-employee",
      Key: "employee.json"
    })
    .promise();

  const lastModified = new Date() - new Date(existing.LastModified);

  if (lastModified > 5000) {
    const set = await sheets.spreadsheets.values.update({
      auth,
      spreadsheetId: SHEETS_SPREADSHEET_ID,
      range: "'Sheet1'!B1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[Math.random()]]
      }
    });

    const {
      data: {
        values: [[randomRowIndex]]
      }
    } = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: SHEETS_SPREADSHEET_ID,
      range: "'Sheet1'!B3"
    });

    if (randomRowIndex === "#NUM!") {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          message: "No results"
        })
      };
    }

    const {
      data: {
        values: [[timestamp, name, venmo, cash, employer]]
      }
    } = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: SHEETS_SPREADSHEET_ID,
      range: `'Form Responses 1'!A${randomRowIndex}:E${randomRowIndex}`
    });

    const selectedRow = {
      name,
      venmo,
      cash,
      employer
    };

    await new AWS.S3({ apiVersion: "2006-03-01" })
      .putObject({
        Bucket: "avl-tips-employee",
        Key: "employee.json",
        Body: JSON.stringify(selectedRow)
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(selectedRow, null, 2)
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: existing.Body.toString()
  };
}

getEmployee();

module.exports = {
  getEmployee
};
