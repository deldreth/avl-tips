/**
 * Google Apps Script wrapper for API requests to Amazon Web Services.
 *
 * Forked from https://github.com/smithy545/aws-apps-scripts which has no
 * express license listed.
 */
var AWS = (function() {
  // option constants
  var PARAM_BUCKET_NAME = "Bucket";

  // Keys cannot be retrieved once initialized but can be changed
  var accessKey;
  var secretKey;

  return {
    /**
     * Sets keys for authentication to make requests. Keys are not externally
     * once added.
     * @param {string} access_key - your aws access key
     * @param {string} secret_key - your aws secret key
     */
    init: function AWS(access_key, secret_key) {
      if (access_key == undefined) {
        throw "Error: No access key provided";
      }
      if (secret_key == undefined) {
        throw "Error: No secret key provided";
      }
      accessKey = access_key;
      secretKey = secret_key;
    },
    /**
     * Authenticates and sends the given parameters for an AWS api request.
     * @param {string} service - AWS service (e.g. ec2, iam, codecommit)
     * @param {string} region - AWS region (e.g. us-east-1)
     * @param {string} action - API action to call
     * @param {Object} params - Parameters to call on the action. Defaults to
     *        {}.
     * @param {string} method - HTTP method (e.g. GET, POST). Defaults to GET.
     * @param {(string|object)} payload - Payload to send. Defults to ''.
     * @param {Object} headers - Headers to attach to the request. Properties
     *        'Host' and 'X-Amz-Date' are populated in this method.
     * @param {string} uri - Path for the action. Defaults to '/'.
     * @param {Object} opts - Additional service specific values. Defaults to
     *        {}.
     * @throws {Object} AWS error on failure.
     * @return {string} AWS server response to the request.
     */
    request: function(
      service,
      region,
      action,
      params,
      method,
      payload,
      headers,
      uri,
      opts
    ) {
      if (service == undefined) {
        throw "Error: Service undefined";
      }
      if (region == undefined) {
        throw "Error: Region undefined";
      }
      if (action == undefined) {
        throw "Error: Action undefined";
      }

      opts = opts || {};
      var bucket = opts[PARAM_BUCKET_NAME];
      if (
        service == "s3" &&
        action != "ListAllMyBuckets" &&
        bucket == undefined
      ) {
        throw "Error: S3 Bucket undefined";
      }

      var Crypto = loadCrypto();

      var dateTimeString = Utilities.formatDate(
        new Date(),
        "GMT",
        "yyyyMMdd'T'HHmmss'Z'"
      );
      var dateString = dateTimeString.substring(0, 8);

      method = method || "GET";
      uri = uri || "/";
      host = getHost(service, region, bucket);
      headers = headers || {};

      if (payload == undefined) {
        payload = "";
      } else if (typeof payload !== "string") {
        payload = JSON.stringify(payload);
      }
      var hashedPayload = Crypto.SHA256(payload);

      var request;
      var query;
      if (method.toLowerCase() == "post") {
        request = "https://" + host + uri;
        query = "";
      } else {
        query = "Action=" + action;
        if (params) {
          Object.keys(params)
            .sort(function(a, b) {
              return a < b ? -1 : 1;
            })
            .forEach(function(name) {
              query += "&" + name + "=" + fixedEncodeURIComponent(params[name]);
            });
        }
        request = "https://" + host + uri + "?" + query;
      }

      var canonQuery = getCanonQuery(query);
      var canonHeaders = "";
      var signedHeaders = "";
      headers["Host"] = host;
      headers["X-Amz-Date"] = dateTimeString;
      headers["X-Amz-Target"] = action;
      headers["X-Amz-Content-SHA256"] = hashedPayload;
      Object.keys(headers)
        .sort(function(a, b) {
          return a < b ? -1 : 1;
        })
        .forEach(function(h, index, ordered) {
          canonHeaders += h.toLowerCase() + ":" + headers[h] + "\n";
          signedHeaders += h.toLowerCase() + ";";
        });
      signedHeaders = signedHeaders.substring(0, signedHeaders.length - 1);

      var canonicalString =
        method +
        "\n" +
        uri +
        "\n" +
        query +
        "\n" +
        canonHeaders +
        "\n" +
        signedHeaders +
        "\n" +
        hashedPayload;
      var canonHash = Crypto.SHA256(canonicalString);

      var algorithm = "AWS4-HMAC-SHA256";
      var scope = dateString + "/" + region + "/" + service + "/aws4_request";

      var stringToSign =
        algorithm + "\n" + dateTimeString + "\n" + scope + "\n" + canonHash;

      var key = getSignatureKey(Crypto, secretKey, dateString, region, service);
      var signature = Crypto.HMAC(Crypto.SHA256, stringToSign, key, {
        asBytes: false
      });

      var authHeader =
        algorithm +
        " Credential=" +
        accessKey +
        "/" +
        scope +
        ", SignedHeaders=" +
        signedHeaders +
        ", Signature=" +
        signature;

      headers["Authorization"] = authHeader;
      delete headers["Host"];
      var options = {
        method: method,
        headers: headers,
        muteHttpExceptions: true,
        payload: payload
      };

      return handleError(UrlFetchApp.fetch(request, options));
    },
    /**
     * Sets new authorization keys
     * @param {string} access_key - the new access_key
     * @param {string} secret_key - the new secret key
     */
    setNewKey: function(access_key, secret_key) {
      if (access_key == undefined) {
        throw "Error: No access key provided";
      } else if (secret_key == undefined) {
        throw "Error: No secret key provided";
      }
      accessKey = access_key;
      secretKey = secret_key;
    }
  };

  function getHost(service, region, bucket) {
    var is_s3 = service == "s3";
    return [bucket, service, is_s3 ? undefined : region, "amazonaws.com"]
      .filter(Boolean)
      .join(".");
  }

  function getCanonQuery(r) {
    var query = r
      .split("&")
      .sort()
      .join("&");

    var canon = "";
    for (var i = 0; i < query.length; i++) {
      var element = query.charAt(i);
      if (isCanon(element)) {
        canon += element;
      } else {
        canon += "%" + element.charCodeAt(0).toString(16);
      }
    }

    return canon;
  }

  // For characters only
  function isCanon(c) {
    return /[a-z0-9-_.~=&]/i.test(c);
  }

  /**
   * Source: http://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html#signature-v4-examples-jscript
   */
  function getSignatureKey(Crypto, key, dateStamp, regionName, serviceName) {
    var kDate = Crypto.HMAC(Crypto.SHA256, dateStamp, "AWS4" + key, {
      asBytes: true
    });
    var kRegion = Crypto.HMAC(Crypto.SHA256, regionName, kDate, {
      asBytes: true
    });
    var kService = Crypto.HMAC(Crypto.SHA256, serviceName, kRegion, {
      asBytes: true
    });
    var kSigning = Crypto.HMAC(Crypto.SHA256, "aws4_request", kService, {
      asBytes: true
    });
    return kSigning;
  }

  function loadCrypto() {
    var window = {};
    var Crypto = undefined;
    /*
     * Crypto-JS v2.5.3
     * http://code.google.com/p/crypto-js/
     * (c) 2009-2012 by Jeff Mott. All rights reserved.
     * http://code.google.com/p/crypto-js/wiki/License
     */
    // start sha256/CryptoJS
    (typeof Crypto == "undefined" || !Crypto.util) &&
      (function() {
        var d = (window.Crypto = {}),
          k = (d.util = {
            rotl: function(b, a) {
              return (b << a) | (b >>> (32 - a));
            },
            rotr: function(b, a) {
              return (b << (32 - a)) | (b >>> a);
            },
            endian: function(b) {
              if (b.constructor == Number)
                return (k.rotl(b, 8) & 16711935) | (k.rotl(b, 24) & 4278255360);
              for (var a = 0; a < b.length; a++) b[a] = k.endian(b[a]);
              return b;
            },
            randomBytes: function(b) {
              for (var a = []; b > 0; b--)
                a.push(Math.floor(Math.random() * 256));
              return a;
            },
            bytesToWords: function(b) {
              for (var a = [], c = 0, e = 0; c < b.length; c++, e += 8)
                a[e >>> 5] |= (b[c] & 255) << (24 - (e % 32));
              return a;
            },
            wordsToBytes: function(b) {
              for (var a = [], c = 0; c < b.length * 32; c += 8)
                a.push((b[c >>> 5] >>> (24 - (c % 32))) & 255);
              return a;
            },
            bytesToHex: function(b) {
              for (var a = [], c = 0; c < b.length; c++)
                a.push((b[c] >>> 4).toString(16)),
                  a.push((b[c] & 15).toString(16));
              return a.join("");
            },
            hexToBytes: function(b) {
              for (var a = [], c = 0; c < b.length; c += 2)
                a.push(parseInt(b.substr(c, 2), 16));
              return a;
            },
            bytesToBase64: function(b) {
              if (typeof btoa == "function") return btoa(g.bytesToString(b));
              for (var a = [], c = 0; c < b.length; c += 3)
                for (
                  var e = (b[c] << 16) | (b[c + 1] << 8) | b[c + 2], p = 0;
                  p < 4;
                  p++
                )
                  c * 8 + p * 6 <= b.length * 8
                    ? a.push(
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(
                          (e >>> (6 * (3 - p))) & 63
                        )
                      )
                    : a.push("=");
              return a.join("");
            },
            base64ToBytes: function(b) {
              if (typeof atob == "function") return g.stringToBytes(atob(b));
              for (
                var b = b.replace(/[^A-Z0-9+\/]/gi, ""), a = [], c = 0, e = 0;
                c < b.length;
                e = ++c % 4
              )
                e != 0 &&
                  a.push(
                    (("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(
                      b.charAt(c - 1)
                    ) &
                      (Math.pow(2, -2 * e + 8) - 1)) <<
                      (e * 2)) |
                      ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(
                        b.charAt(c)
                      ) >>>
                        (6 - e * 2))
                  );
              return a;
            }
          }),
          d = (d.charenc = {});
        d.UTF8 = {
          stringToBytes: function(b) {
            return g.stringToBytes(unescape(encodeURIComponent(b)));
          },
          bytesToString: function(b) {
            return decodeURIComponent(escape(g.bytesToString(b)));
          }
        };
        var g = (d.Binary = {
          stringToBytes: function(b) {
            for (var a = [], c = 0; c < b.length; c++)
              a.push(b.charCodeAt(c) & 255);
            return a;
          },
          bytesToString: function(b) {
            for (var a = [], c = 0; c < b.length; c++)
              a.push(String.fromCharCode(b[c]));
            return a.join("");
          }
        });
      })();
    Crypto = window.Crypto;
    (function() {
      var d = Crypto,
        k = d.util,
        g = d.charenc,
        b = g.UTF8,
        a = g.Binary,
        c = [
          1116352408,
          1899447441,
          3049323471,
          3921009573,
          961987163,
          1508970993,
          2453635748,
          2870763221,
          3624381080,
          310598401,
          607225278,
          1426881987,
          1925078388,
          2162078206,
          2614888103,
          3248222580,
          3835390401,
          4022224774,
          264347078,
          604807628,
          770255983,
          1249150122,
          1555081692,
          1996064986,
          2554220882,
          2821834349,
          2952996808,
          3210313671,
          3336571891,
          3584528711,
          113926993,
          338241895,
          666307205,
          773529912,
          1294757372,
          1396182291,
          1695183700,
          1986661051,
          2177026350,
          2456956037,
          2730485921,
          2820302411,
          3259730800,
          3345764771,
          3516065817,
          3600352804,
          4094571909,
          275423344,
          430227734,
          506948616,
          659060556,
          883997877,
          958139571,
          1322822218,
          1537002063,
          1747873779,
          1955562222,
          2024104815,
          2227730452,
          2361852424,
          2428436474,
          2756734187,
          3204031479,
          3329325298
        ],
        e = (d.SHA256 = function(b, c) {
          var f = k.wordsToBytes(e._sha256(b));
          return c && c.asBytes
            ? f
            : c && c.asString
            ? a.bytesToString(f)
            : k.bytesToHex(f);
        });
      e._sha256 = function(a) {
        a.constructor == String && (a = b.stringToBytes(a));
        var e = k.bytesToWords(a),
          f = a.length * 8,
          a = [
            1779033703,
            3144134277,
            1013904242,
            2773480762,
            1359893119,
            2600822924,
            528734635,
            1541459225
          ],
          d = [],
          g,
          m,
          r,
          i,
          n,
          o,
          s,
          t,
          h,
          l,
          j;
        e[f >> 5] |= 128 << (24 - (f % 32));
        e[(((f + 64) >> 9) << 4) + 15] = f;
        for (t = 0; t < e.length; t += 16) {
          f = a[0];
          g = a[1];
          m = a[2];
          r = a[3];
          i = a[4];
          n = a[5];
          o = a[6];
          s = a[7];
          for (h = 0; h < 64; h++) {
            h < 16
              ? (d[h] = e[h + t])
              : ((l = d[h - 15]),
                (j = d[h - 2]),
                (d[h] =
                  (((l << 25) | (l >>> 7)) ^
                    ((l << 14) | (l >>> 18)) ^
                    (l >>> 3)) +
                  (d[h - 7] >>> 0) +
                  (((j << 15) | (j >>> 17)) ^
                    ((j << 13) | (j >>> 19)) ^
                    (j >>> 10)) +
                  (d[h - 16] >>> 0)));
            j = (f & g) ^ (f & m) ^ (g & m);
            var u =
              ((f << 30) | (f >>> 2)) ^
              ((f << 19) | (f >>> 13)) ^
              ((f << 10) | (f >>> 22));
            l =
              (s >>> 0) +
              (((i << 26) | (i >>> 6)) ^
                ((i << 21) | (i >>> 11)) ^
                ((i << 7) | (i >>> 25))) +
              ((i & n) ^ (~i & o)) +
              c[h] +
              (d[h] >>> 0);
            j = u + j;
            s = o;
            o = n;
            n = i;
            i = (r + l) >>> 0;
            r = m;
            m = g;
            g = f;
            f = (l + j) >>> 0;
          }
          a[0] += f;
          a[1] += g;
          a[2] += m;
          a[3] += r;
          a[4] += i;
          a[5] += n;
          a[6] += o;
          a[7] += s;
        }
        return a;
      };
      e._blocksize = 16;
      e._digestsize = 32;
    })();
    (function() {
      var d = Crypto,
        k = d.util,
        g = d.charenc,
        b = g.UTF8,
        a = g.Binary;
      d.HMAC = function(c, e, d, g) {
        e.constructor == String && (e = b.stringToBytes(e));
        d.constructor == String && (d = b.stringToBytes(d));
        d.length > c._blocksize * 4 && (d = c(d, { asBytes: !0 }));
        for (
          var f = d.slice(0), d = d.slice(0), q = 0;
          q < c._blocksize * 4;
          q++
        )
          (f[q] ^= 92), (d[q] ^= 54);
        c = c(f.concat(c(d.concat(e), { asBytes: !0 })), { asBytes: !0 });
        return g && g.asBytes
          ? c
          : g && g.asString
          ? a.bytesToString(c)
          : k.bytesToHex(c);
      };
    })();
    // end sha256/CryptoJS

    return window.Crypto;
  }

  /**
   * Strictly adhere to RFC3986 for URI encoding
   *
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
   *
   * @param str
   * @returns {string}
   */
  function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return "%" + c.charCodeAt(0).toString(16);
    });
  }

  /**
   * Parses UrlFetchApp.fetch and throws an object based on the XML returned by
   * AWS. Based on code from project
   * https://github.com/eschultink/S3-for-Google-Apps-Script and used under the
   * following license.
   *
   * @license Copyright 2014-15 Eng Etc LLC - All Rights Reserved
   *
   * LICENSE (Modified BSD) - Redistribution and use in source and binary forms,
   * with or without modification, are permitted provided that the following
   * conditions are met:
   *   1) Redistributions of source code must retain the above copyright notice,
   *      this list of conditions and the following disclaimer.
   *   2) Redistributions in binary form must reproduce the above copyright
   *      notice, this list of conditions and the following disclaimer in the
   *      documentation and/or other materials provided with the distribution.
   *   3) Neither the name of the Eng Etc LLC, S3-for-Google-Apps-Script, nor
   *      the names of its contributors may be used to endorse or promote
   *      products derived from this software without specific prior written
   *      permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL ENG ETC LLC BE LIABLE FOR ANY DIRECT,
   * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
   * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
   * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
   * SUCH DAMAGE.
   *
   * @param {Object} response result of UrlFetchApp.fetch() call
   * @throws {Object} AWS error on failure
   * @return {Object} the original parameter, unchanged
   */
  function handleError(response) {
    if (response.getResponseCode() >= 300) {
      var error = {};
      error.name = "AwsError";

      try {
        // traverse XML document and add nodes to error object
        var elements = XmlService.parse(response.getContentText())
          .getRootElement()
          .getChildren();
        for (i in elements) {
          var name = elements[i].getName();
          name = name.charAt(0).toLowerCase() + name.slice(1);
          error[name] = elements[i].getText();
        }
        error.toString = function() {
          return "AWS Error - " + this.code + ": " + this.message;
        };
      } catch (e) {
        // failed to parse content as XML
        error.message =
          "AWS returned HTTP code " +
          response.getResponseCode() +
          ", but error content could not be parsed.";
        error.toString = function() {
          return this.message;
        };
      }

      throw error;
    }
    return response;
  }
})();
