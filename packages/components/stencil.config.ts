import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";
import { reactOutputTarget } from "@stencil/react-output-target";

export const config: Config = {
  namespace: "components",
  outputTargets: [
    { type: "docs-readme" },
    {
      type: "dist",
      esmLoaderPath: "../loader"
    },
    {
      type: "docs-readme"
    },
    {
      type: "www",
      serviceWorker: null // disable service workers
    },
    reactOutputTarget({
      componentCorePackage: "@avl-tips/components",
      proxiesFile: "../components-react/src/components.ts"
    })
  ],
  plugins: [
    sass({
      includePaths: ["node_modules"]
    })
  ]
};
