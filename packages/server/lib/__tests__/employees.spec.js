const AWS = require("aws-sdk-mock");

const { getEmployee } = require("../employees");

describe("getEmployee", () => {
  it("returns cached employee.json", async () => {
    AWS.mock("S3", "getObject", {
      Body: Buffer.from(JSON.stringify({ test: "value" })),
      LastModified: new Date()
    });

    const response = await getEmployee();

    expect(response.statusCode).toBe(200);
    expect(response.headers).toEqual({
      statusCode: 200,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    });
    expect(response.body).toBe('{"test":"value"}');
  });
});
