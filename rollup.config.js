import path from "path";

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import del from "rollup-plugin-delete";
import typescript from "rollup-plugin-typescript2";
import externals from "rollup-plugin-node-externals";
import copy from "rollup-plugin-copy";

import versionInjector from "./rollup-plugins/version-injector/index";

const isProduction = process.env.PRODUCTION === "true";
const isTest = process.env.TEST_BUILD === "true";

let outputDir;
if (isProduction) {
  outputDir = "dist/package";
} else if (isTest) {
  outputDir = "dist/test";
} else {
  outputDir = "dist/debug";
}

export default {
  input: isTest ? "./src/tests/app.ts" : "./src/app.ts",
  plugins: [
    del({ targets: "dist/*" }),
    externals({ deps: true, devDeps: true }),
    resolve(),
    typescript(),
    commonjs(),
    json(),
    versionInjector(),
    copy({
      targets: [
        { src: "src/static/*", dest: path.join(outputDir, "static") },
      ]
    })
  ],
  output: [
    {
      strict: false,
      file: path.join(outputDir, isProduction ? "index.ts" : "app.js"),
      format: "cjs",
      sourcemap: !isProduction
    }
  ]
};
