const { APP_WC_TAG_PREFIX } = process.env;

const tags = ["avl-tips", "avl-tips-card"];

/* Replace any instance of string 'avl' within class decorators with some env defined value */

// jscodeshift -t packages/codemod/lib/components/tags.js --parser=tsx packages/components/src/**/*.tsx

export default function transform(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  return root
    .find(j.ClassDeclaration)
    .filter(({ value }) => value.decorators.length > 0)
    .forEach(({ value }) => {
      j(value.decorators)
        .find(j.Node, {
          type: "StringLiteral"
        })
        .forEach(({ value }) => {
          if (tags.includes(value.value)) {
            value.value = value.value.replace("avl", APP_WC_TAG_PREFIX);
          }
        });
    })
    .toSource();
}
