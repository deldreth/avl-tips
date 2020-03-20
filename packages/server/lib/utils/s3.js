const AWS = require("aws-sdk");

async function getCount() {
  return new Promise(resolve =>
    new AWS.S3({ apiVersion: "2006-03-01" })
      .selectObjectContent({
        Bucket: process.env.S3_BUCKET,
        Key: "current_sheet_copy.json",
        Expression: "select count(*) from s3object[*][*]",
        ExpressionType: "SQL",
        InputSerialization: {
          CompressionType: "NONE",
          JSON: {
            Type: "LINES"
          }
        },
        OutputSerialization: {
          JSON: {
            RecordDelimiter: " "
          }
        }
      })
      .promise()
      .then(response => {
        response.Payload.on("data", event => {
          if (event.Records) {
            resolve(JSON.parse(event.Records.Payload.toString()));
          }
        });
      })
  );
}

async function getItem(index) {
  return new Promise(resolve =>
    new AWS.S3({ apiVersion: "2006-03-01" })
      .selectObjectContent({
        Bucket: process.env.S3_BUCKET,
        Key: "current_sheet_copy.json",
        Expression: `select * from s3object[*][${index}]`,
        ExpressionType: "SQL",
        InputSerialization: {
          CompressionType: "NONE",
          JSON: {
            Type: "LINES"
          }
        },
        OutputSerialization: {
          JSON: {
            RecordDelimiter: " "
          }
        }
      })
      .promise()
      .then(response => {
        response.Payload.on("data", event => {
          if (event.Records) {
            resolve(JSON.parse(event.Records.Payload.toString()));
          }
        });
      })
  );
}

module.exports = {
  getCount,
  getItem
};
