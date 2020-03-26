"use strict";

const AWS = require("aws-sdk");

const { getCount, getItem } = require("./utils/s3");
const { getRandomInt } = require("./utils/rand");

async function getEmployee(event) {
  try {
    let selectedRow = await new AWS.S3({ apiVersion: "2006-03-01" })
      .getObject({
        Bucket: process.env.S3_BUCKET,
        Key: "employee.json"
      })
      .promise();

    const lastModified = new Date() - new Date(selectedRow.LastModified);
    selectedRow = selectedRow.Body.toString();

    if (lastModified > 5000) {
      const { _1: count } = await getCount();
      const fetchIndex = getRandomInt(count);
      const {
        "Your Name": name,
        "Venmo Handle": venmo,
        "CashApp Handle": cash,
        "PayPal.Me Handle": paypal,
        "Where do you work?": employer
      } = await getItem(fetchIndex);

      selectedRow = JSON.stringify({
        name,
        venmo,
        cash,
        paypal,
        employer
      });

      await new AWS.S3({ apiVersion: "2006-03-01" })
        .putObject({
          Bucket: process.env.S3_BUCKET,
          Key: "employee.json",
          Body: selectedRow
        })
        .promise();
    }

    return {
      statusCode: 200,
      headers: {
        statusCode: 200,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: selectedRow
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: 404,
      headers: {
        statusCode: 404,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        message: "None found"
      })
    };
  }
}

module.exports = {
  getEmployee
};
