const { APP_WC_TAG_PREFIX } = process.env;

const identifiers = ["AvlTipsCard"];
/* Replace any identifiers in @avl-tips/client that include Avl with the ENV_TAG_PRESET */

// jscodeshift -t packages/codemod/lib/client/import-component.js packages/client/src

export default function transform(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  return root
    .find(j.Identifier)
    .filter(({ value }) => identifiers.includes(value.name))
    .forEach(({ value }) => {
      value.name = value.name.replace(
        "Avl",
        `${APP_WC_TAG_PREFIX.charAt(0).toUpperCase()}${APP_WC_TAG_PREFIX.slice(
          1
        )}`
      );
    })
    .toSource();
}
