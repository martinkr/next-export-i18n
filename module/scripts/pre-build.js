const rimraf = require('rimraf');

async function preBuild() {
    console.log("pre build: delete ./build/* ");
    rimraf('./build/*', (err) => { console.log(err); });
    console.log("pre build: delete ./dist/* ");
    rimraf('./dist/*', (err) => {
        console.log(err);
        console.log("pre build: done ");
    });
}

preBuild();
