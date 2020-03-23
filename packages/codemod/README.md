# `@avl-tips/codemod`

Codemods to update source for other area deployments. Currently focused on modifying web component tags and named imports in @avl-client/tips.

## Usage

```bash
jscodeshift -t packages/codemod/lib/components/tags.js --parser=tsx packages/components/src/**/*.tsx
```

```bash
jscodeshift -t packages/codemod/lib/client/import-component.js packages/client/src
```
