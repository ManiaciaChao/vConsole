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
import license from "rollup-plugin-license";
import pkg from "./package.json";
import copy from "rollup-plugin-copy";

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
      compilerOptions: { dev: !production },
    }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
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
    license({
      sourcemap: !production,
      banner: [
        "vConsole v" + pkg.version + " (" + pkg.homepage + ")",
        "",
        "Tencent is pleased to support the open source community by making vConsole available.",
        "Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.",
        'Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at',
        "http://opensource.org/licenses/MIT",
        'Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.',
      ].join("\n"),
    }),
    copy({
      targets: [
        {
          src: Path.resolve(__dirname, "./src/vconsole.d.ts"),
          dest: Path.resolve(__dirname, "./dist/vconsole.min.d.ts"),
        },
      ],
    }),
  ],
  watch: {
    clearScreen: false,
  },
});
