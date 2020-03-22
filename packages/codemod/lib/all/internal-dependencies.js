const { APP_WC_TAG_PREFIX } = process.env;

const sourceIncludes = "@avl-tips";

/* Replace any import declarations that include @avl-tips with `@${APP_WC_TAG_PREFIX}-tips` */

export default function transform(fileInfo, api) {
  const j = api.jscodeshift;

  return j(fileInfo.source)
    .find(j.ImportDeclaration)
    .filter(({ value }) => value.source.value.includes(sourceIncludes))
    .forEach(({ value }) => {
      value.source.value = value.source.value.replace(
        "@avl-tips",
        `@${APP_WC_TAG_PREFIX}-tips`
      );
    })
    .toSource();
}
