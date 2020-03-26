/**
 * Basic implementation of Amazon S3 REST API for Google Apps Script.
 * Wraps the generic AWS request object to simplify calls to S3.
 */
var S3 = (function() {
  return {
    /**
     * Initializes connection to AWS for upcoming S3 requests. Keys are not
     * externally once added.
     *
     * @param {string} accessKey - AWS access key.
     * @param {string} secretKey - AWS secret key.
     * @throw {Object} Error on missing parameters.
     */
    init: function S3(accessKey, secretKey) {
      AWS.init(accessKey, secretKey);
    },
    /**
     * Container for information related to the list of buckets.
     * @typedef {Object} BucketList
     * @property {Object} owner - Information about the account owner.
     * @property {string} owner.id - Bucket owner's canonical user ID.
     * @property {string} owner.displayName - Bucket owner's display name.
     * @property {Object[]} buckets - Collection of buckets.
     * @property {string} buckets[].name - Name of bucket.
     * @property {string} buckets[].creationDate - Date the bucket was created.
     *    Formatted as <YYYY>-<MM>-<DD>T<HH>:<MM>:<SS>.<sss>Z
     */
    /**
     * Returns a list of all buckets owned by the authenticated sender of the
     * request.
     * @see {@link https://docs.aws.amazon.com/AmazonS3/latest/API/RESTServiceGET.html}
     *
     * @throws {Object} AWS error on failure
     * @return {BucketList} Object listing bucket information.
     */
    listAllMyBuckets: function() {
      // hardcoding Virginia region for service-level requests
      var xml = execute("us-east-1", "ListAllMyBuckets", "GET");

      // construct object with result contents and return
      var result = {
        owner: {},
        buckets: []
      };
      var doc = XmlService.parse(xml);
      var root = doc.getRootElement();
      root.getChildren().forEach(function(child) {
        var tag = child.getName();
        switch (tag) {
          case "Owner":
            child.getChildren().forEach(function(ownerElement) {
              var key = ownerElement.getName();
              key = key == "ID" ? "id" : lowerFirstCharacter(key);
              result.owner[key] = ownerElement.getText();
            });
            break;
          case "Buckets":
            child.getChildren().forEach(function(bucket) {
              var tmp = {};
              bucket.getChildren().forEach(function(bucketElement) {
                var key = lowerFirstCharacter(bucketElement.getName());
                tmp[key] = bucketElement.getText();
              });
              result.buckets.push(tmp);
            });
            break;
          default:
            Logger.log("Unexpected tag [" + tag + "]");
        }
      });
      return result;
    },
    /**
     * Retrieves an object from an S3 bucket.
     * @see {@link https://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectGET.html}
     *
     * @param {string} bucketName - Name of bucket to access.
     * @param {string} objectName - Name of object to fetch (no leading slash).
     * @param {string} region - Region of the bucket.
     * @throws {Object} AWS error on failure
     * @return {Blob|Object} Contents of the accessed object, converted from
     *    JSON or as a Blob if it was somthing else.
     */
    getObject: function(bucketName, objectName, region) {
      return execute(region, "GetObject", "GET", bucketName, objectName);
    },
    /**
     * Adds an object to an S3 bucket.
     * See {@link https://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectPUT.html}
     *
     * @param {string} bucketName - Name of bucket to access.
     * @param {string} objectName - Name of object to create (no leading slash).
     * @param {string} object - Byte sequence to be the object's content.
     * @param {string} region - Region of the bucket.
     * @throws {Object} AWS error on failure
     * @return void
     */
    putObject: function(bucketName, objectName, object, region) {
      // if object is not a blob, wrap it in one
      var notBlob = !(
        typeof object.copyBlob == "function" &&
        typeof object.getDataAsString == "function" &&
        typeof object.getContentType == "function"
      );
      if (notBlob) {
        object = Utilities.newBlob(JSON.stringify(object), "application/json");
        object.setName(objectName);
      }

      var content = object.getDataAsString();
      var contentType = object.getContentType();
      var contentMD5 = getContentMD5(content);

      var headers = {
        "Content-Type": contentType,
        "Content-MD5": contentMD5
      };

      return execute(
        region,
        "PutObject",
        "PUT",
        bucketName,
        objectName,
        content,
        headers
      );
    },
    /**
     * Deletes an object from an S3 bucket.
     * @see {@link https://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectDELETE.html}
     *
     * @param {string} bucketName - Name of bucket to access.
     * @param {string} objectName - Name of object to delete (no leading slash).
     * @param {string} region - Region of the bucket.
     * @throws {Object} AWS error on failure
     * @return void
     */
    deleteObject: function(bucketName, objectName, region) {
      return execute(region, "DeleteObject", "DELETE", bucketName, objectName);
    }
  };

  /**
   * Generates an MD5 hash of the contents or returns the empty string if no
   * parameter value provided.
   *
   * @param {string} content - Content to be hashed.
   * @return {string} MD5 hash of the provided parameter.
   */
  function getContentMD5(content) {
    if (content && content.length > 0) {
      return Utilities.base64Encode(
        Utilities.computeDigest(
          Utilities.DigestAlgorithm.MD5,
          content,
          Utilities.Charset.UTF_8
        )
      );
    } else {
      return "";
    }
  }

  /**
   * Triggers the AWS request based on the parameters provided, transforming
   * values as needed.
   *
   * @param {string} region - Region of the bucket.
   * @param {string} action - API action to call
   * @param {string} method - HTTP method (e.g. GET, POST).
   * @param {string} bucketName - Name of bucket to access.
   * @param {string} objectName - Name of object to affect (no leading slash)
   * @param {(string|object)} payload - Payload to send. Defults to ''.
   * @param {Object} headers - Headers to attach to the request. Properties
   *        'Host' and 'X-Amz-Date' are populated in this method.
   * @throws {Object} AWS error on failure.
   * @return {string} AWS server response to the request.
   */
  function execute(
    region,
    action,
    method,
    bucketName,
    objectName,
    payload,
    headers
  ) {
    var uri = "/" + (objectName || "");
    var options = { Bucket: bucketName };
    return AWS.request(
      "s3",
      region,
      action,
      undefined,
      method,
      payload,
      headers,
      uri,
      options
    );
  }
})();
