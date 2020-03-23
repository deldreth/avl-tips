const { APP_WC_TAG_PREFIX } = process.env;

const glob = require("glob");
const fs = require("fs");
const path = require("path");

appRoot = path.resolve(__dirname, "..", "..", "..");

console.log(appRoot);

glob(`${appRoot}/*/package.json`, (err, files) => {
  files.forEach(file => {
    const packageJson = fs.readFileSync(file).toString();

    fs.writeFileSync(
      file,
      packageJson.replace(/@avl-tips/g, `@${APP_WC_TAG_PREFIX}-tips`)
    );
  });
});
