/**
 * Adds add-on menu to Sheets UI.
 */
function createMenu() {
  SpreadsheetApp.getUi()
    .createAddonMenu() // when used as an Add-on
    // .createMenu("S3 JSON Publisher") // when directly added to Sheet
    .addItem("Configure...", "showConfig")
    .addItem("Publish Now", "publish")
    .addToUi();
}

/**
 * Adds menu on install.
 */
function onInstall() {
  createMenu();
}

/**
 * Adds menu on open.
 */
function onOpen() {
  createMenu();
}

/**
 * Publish updated JSON to S3
 *
 * @param {Object} event - event that triggered the function call
 */
function publish(event) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetId = sheet.getId();
  var props = PropertiesService.getDocumentProperties().getProperties();

  // do nothing if required configuration settings are not present
  if (!hasRequiredProps()) {
    Logger.log(
      "Did not publish. Spreadsheet [" +
        sheetId +
        "] does not have required props set"
    );
    return;
  }

  // get cell values from the range that contains data (2D array)
  var rows = sheet.getDataRange().getValues();

  // filter out empty rows and then exclude columns that don't have a header
  // (i.e. text in row 1)
  rows = rows
    .filter(function(row, index) {
      return row.some(function(value) {
        return typeof value !== "string" || value.length;
      });
    })
    .map(function(row) {
      return row.filter(function(value, index) {
        return rows[0][index].length;
      });
    });

  // create an array of objects keyed by header
  var objs = rows.slice(1).map(function(row) {
    var obj = {};
    row.forEach(function(value, index) {
      var prop = rows[0][index];
      // represent blank cell values as `null`
      // blank cells always appear as an empty string regardless of the data
      // type of other values in the column. neutralizing everything to `null`
      // lets us avoid mixing empty strings with other data types for a prop.
      obj[prop] = typeof value === "string" && !value.length ? null : value;
    });
    return obj;
  });

  // upload to S3
  // https://github.com/viuinsight/google-apps-script-for-aws
  try {
    // build object key based on whether changes should be tracked or not
    var objectKey =
      (props.path ? props.path + "/" : "") + props.filename + ".json";
    S3.init(props.awsAccessKeyId, props.awsSecretKey);
    S3.putObject(props.bucketName, objectKey, objs, props.region);
    Logger.log("Published Spreadsheet to [" + objectKey + "]");
  } catch (e) {
    Logger.log(
      "Did not publish. Spreadsheet [" +
        sheetId +
        "] generated following AWS error.\n" +
        e.toString()
    );
  }
}

/**
 * Displays the configuration modal dialog.
 */
function showConfig() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getDocumentProperties().getProperties();
  var template = HtmlService.createTemplateFromFile("config");
  template.sheetId = sheet.getId();
  template.appName = props.appName || "";
  template.bucketName = props.bucketName || "";
  template.region = props.region || "";
  template.path = props.path || "";
  template.filename = props.filename || "";
  template.awsAccessKeyId = props.awsAccessKeyId || "";
  template.awsSecretKey = props.awsSecretKey || "";
  ui.showModalDialog(template.evaluate(), "Amazon S3 Publish Configuration");
}

/**
 * Submit action for the configuration modal dialog.
 *
 * @param {form} form - Web form that triggered the submit.
 */
function updateConfig(form) {
  Logger.log(form);
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetId = sheet.getId();
  var newProps = {
    appName: form.appName,
    bucketName: form.bucketName,
    region: form.region,
    path: form.path || "",
    filename: form.filename || "employees",
    awsAccessKeyId: form.awsAccessKeyId,
    awsSecretKey: form.awsSecretKey
  };

  PropertiesService.getDocumentProperties().setProperties(newProps);

  // Assume update will fail
  var title = "Configuration failed to update";
  var message;
  if (hasRequiredProps()) {
    title = "✓ Configuration updated";
    message =
      "Published spreadsheet will be accessible at: \nhttps://" +
      form.bucketName +
      ".s3.amazonaws.com/" +
      (form.path ? form.path + "/" : "") +
      newProps.filename +
      ".json";

    generateForm();
    sheet.setActiveSheet(sheet.getSheets()[0]);
    publish();
    // Create an onFormSubmit trigger programatically instead of manually because
    // manual triggers disappear for no reason. See:
    // https://code.google.com/p/google-apps-script-issues/issues/detail?id=4854
    // https://code.google.com/p/google-apps-script-issues/issues/detail?id=5831
    // Deleting previous copies with the same name for this spreadsheet first.
    try {
      var fnName = "publish";

      var triggers = ScriptApp.getProjectTriggers();
      for (var i = 0; i < triggers.length; i++) {
        var triggerFunction = triggers[i].getHandlerFunction();
        var triggerSource = triggers[i].getTriggerSourceId();
        if (triggerSource === sheetId && triggerFunction === fnName) {
          ScriptApp.deleteTrigger(triggers[i]);
        }
      }

      ScriptApp.newTrigger(fnName)
        .forSpreadsheet(sheet)
        .onFormSubmit()
        .create();
    } catch (e) {
      message = "Could not register event listener.\n" + e.toString();
      Logger.log(
        "Could not register onChange event for Spreadsheet [" +
          sheetId +
          "]\n" +
          e.toString()
      );
    }
  } else {
    message =
      "You will need to fill out all configuration options for your " +
      "spreadsheet to be published to S3.";
  }
  var ui = SpreadsheetApp.getUi();
  ui.alert(title, message, ui.ButtonSet.OK);
}

/**
 * Checks if the Sheet has the required configuration settings to publish to S3.
 * Does not validate the values, only ensures they are not empty.
 *
 * @return {boolean} true if all required properties are set, false otherwise.
 */
function hasRequiredProps() {
  var props = PropertiesService.getDocumentProperties().getProperties();
  return (
    props.bucketName &&
    props.region &&
    props.awsAccessKeyId &&
    props.awsSecretKey &&
    // props.filename &&
    props.appName
  );
}

/**
 * Generates the form and sets it's destination to the current sheet
 */
function generateForm() {
  // do nothing if required configuration settings are not present
  if (!hasRequiredProps()) {
    Logger.log("Did not generate form.");
    return;
  }
  var props = PropertiesService.getDocumentProperties().getProperties();

  var form = FormApp.create(props.appName);
  form
    .setDescription(
      "Fill out this form to be included in the application and potentially receive support from tippers at home.\n\nIMPORTANT: be sure to include a Venmo or CashApp handle so that patrons can potentially support you."
    )
    .setAllowResponseEdits(true)
    .setCollectEmail(false)
    .setAcceptingResponses(true)
    .setLimitOneResponsePerUser(true);

  // Name
  form
    .addTextItem()
    .setTitle("Your Name")
    .setRequired(true);

  // Venmo
  var venmoValidation = FormApp.createTextValidation()
    .requireTextMatchesPattern("@[A-z0-9-_]*")
    .setHelpText("Must start with @")
    .build();
  form
    .addTextItem()
    .setTitle("Venmo Handle")
    .setHelpText("Must start with @")
    .setValidation(venmoValidation);

  // CashApp
  var cashAppValidation = FormApp.createTextValidation()
    .requireTextMatchesPattern("$[A-z0-9]*")
    .setHelpText("Must start with $")
    .build();
  form
    .addTextItem()
    .setTitle("CashApp Handle")
    .setHelpText("Must start with $")
    .setValidation(cashAppValidation);

  // PayPal.Me
  var payPalMeValidation = FormApp.createTextValidation()
    .requireTextDoesNotContainPattern(
      "((https?://)?([dA-z.-]+).([A-z.]{2,6})([/w .-]*)*/?)|(([A-z0-9_.-]+)@([dA-z.-]+).([A-z.]{2,6}))|(([A-z0-9_.-]*)/([A-z0-9_.-]*))"
    )
    .setHelpText(
      "This should not be an email address, a URL, or contain slashes"
    )
    .build();
  form
    .addTextItem()
    .setTitle("PayPal.Me Handle")
    .setHelpText(
      "This should not be an email address, a URL, or contain slashes"
    )
    .setValidation(payPalMeValidation);

  // Work
  form
    .addTextItem()
    .setTitle("Where do you work?")
    .setRequired(true);

  Logger.log("Published URL: " + form.getPublishedUrl());
  Logger.log("Editor URL: " + form.getEditUrl());

  var ssId = SpreadsheetApp.getActiveSpreadsheet().getId();

  // Update the form's response destination.
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ssId);
}
