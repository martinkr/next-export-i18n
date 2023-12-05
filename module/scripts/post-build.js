const rimraf = require("rimraf");
const fs = require("fs");
const replaceInFiles = require("replace-in-files");

const options = {
  files: "./dist/index.js",

  from: `invalid`,
  to: `valid`,
  saveOldFile: false, // default
  encoding: "utf8", // default
  shouldSkipBinaryFiles: true, // default
  onlyFindPathsWithoutReplace: false, // default
  returnPaths: true, // default
  returnCountOfMatchesByPaths: true, // default
};

async function postBuild() {
  try {
    console.log("post build: copy './../README.md' to './dist/README.md'");
    fs.copyFile("./../README.md", "./dist/README.md", (err) => {
      if (err) throw err;
    });
    console.log(
      "post build: copy './../next-export-i18n.png' to './dist/next-export-i18n.png'"
    );
    fs.copyFile(
      "./../next-export-i18n.png",
      "./dist/next-export-i18n.png",
      (err) => {
        if (err) throw err;
      }
    );
    console.log("post build: copy './../LICENSE' to './dist/LICENSE'");
    fs.copyFile("./LICENSE", "./dist/LICENSE", (err) => {
      if (err) throw err;
    });
    console.log(
      "post build: copy './package.dist.json' to './dist/package.json'"
    );
    fs.copyFile("./package.dist.json", "./dist/package.json", (err) => {
      if (err) throw err;
    });
    console.log(
      "post build: copy './build/module/src/export.d.ts' to './dist/index.d.ts'"
    );
    fs.copyFile(
      "./build/module/src/export.d.ts",
      "./dist/index.d.ts",
      (err) => {
        if (err) throw err;
      }
    );
    console.log("post build: replace strings in './dist/index.js'");
    const { changedFiles, countOfMatchesByPaths, replaceInFilesOptions } =
      await replaceInFiles(options)
        .pipe({
          from: `var index = require('../../i18n/index');`,
          to: `var I18N = require('./../../i18n/index.js');`,
        })
        .pipe({
          from: `const userI18n = index.i18n;`,
          to: `const userI18n = I18N;`,
        });

    console.log("post build: delete ./dist/i18n* ");
    rimraf("./dist/i18n", (err) => {
      if (err) throw err;
      console.log("post build: delete ./dist/module* ");
      rimraf("./dist/module", (err) => {
        if (err) throw err;
        console.log("post build: done");
      });
    });
  } catch (error) {
    console.log("Error occurred:", error);
  }
}
postBuild();
