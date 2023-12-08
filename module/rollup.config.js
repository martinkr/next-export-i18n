import typescript from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";

import yaml from "@rollup/plugin-yaml";
import pkg from "./package.json";

export default {
  input: "./src/export.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: false,
      strict: false,
      exports: "named",
    },
  ],
  plugins: [
    yaml(),
    typescript({ objectHashIgnoreUnknownHack: true }),
    babel({ presets: ["next/babel"] }),
  ],
  external: [
    "react",
    "react-dom",
    "next",
    "next/router",
    "next/link",
    "./../../i18n/index",
    "mustache",
  ],
};
