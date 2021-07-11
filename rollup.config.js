import { defineConfig } from "rollup";
import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import { string } from "rollup-plugin-string";
import styles from "rollup-plugin-styles";

const production = !process.env.ROLLUP_WATCH;

export default defineConfig({
  input: "src/vconsole.js",
  output: {
    sourcemap: true,
    format: "umd",
    name: "VConsole",
    file: "dist/vconsole.min.js",
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        sourceMap: !production,
        typescript: {
          tsconfigFile: "./tsconfig.json",
          transpileOnly: true,
        },
      }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    // commonjs(),
    commonjs({
      include: "node_modules/**",
    }),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),
    json(),
    styles({ use: ["less"], minimize: true }),
    string({
      include: "src/**/*.html",
    }),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
});
