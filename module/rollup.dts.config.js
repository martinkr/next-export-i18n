import dts from "rollup-plugin-dts";

export default {
  input: "./src/export.tsx",
  output: [{ file: "dist/index.d.ts", format: "cjs" }],
  plugins: [dts()]
};
