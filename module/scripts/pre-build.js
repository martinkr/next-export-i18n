const rimraf = require("rimraf");
const fs = require("fs");

async function preBuild() {
  console.log("pre build: delete ./build/* ");
  rimraf("./build/*", (err) => {
    console.log(err);
  });
  console.log("pre build: delete ./dist/* ");
  rimraf("./dist/*", (err) => {
    console.log(err);
    console.log("pre build: done ");
  });
  console.log(
    "post build: copy './package.dist.json' to './dist/package.json'"
  );
  fs.copyFile("./package.dist.json", "./dist/package.json", (err) => {
    if (err) throw err;
  });
}

preBuild();
