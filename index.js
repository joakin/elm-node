#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const compile = require("node-elm-compiler").compile;

const dir = path.join(".", "elm-node-stuff");
const elmOutput = "elm.js";
const userJS = "user.js";
const indexJS = "index.js";

const exampleJS = `
module.exports = Elm => {
  const app = Elm.MainWithJs.init();
  app.ports.log && app.ports.log.subscribe(console.log);
};
`;

const exampleElm = `
port module Main exposing (log, main)

import Platform exposing (worker)


port log : String -> Cmd msg


main =
    worker
        { init = \\() -> ( 0, log "Main application initialized" )
        , subscriptions = \\_ -> Sub.none
        , update = \\msg model -> ( model, Cmd.none )
        }
`;

const usage = `elm-node [--js index.js] [--optimize] Main.elm [Main2.elm, ...]

If you need help or bootstrapping examples:

  elm-node [--help|--example-elm|--example-js]
`;

function exitUsage(code = 1) {
  console.log(usage);
  process.exit(code);
}

const argv = require("minimist")(process.argv.slice(2), {
  string: ["js"],
  boolean: ["optimize", "help", "example-elm", "example-js"]
});

if (argv.help) exitUsage(0);

if (argv["example-js"]) {
  console.log(exampleJS);
  process.exit(0);
}
if (argv["example-elm"]) {
  console.log(exampleElm);
  process.exit(0);
}

if (argv._.length < 1) exitUsage();
const elmFiles = argv._;

if (argv.js && !fs.existsSync(argv.js)) {
  console.log(`File '${argv.js}' doesn't seem to exist.\n`);
  exitUsage();
}

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

compile(elmFiles, {
  output: path.join(dir, elmOutput),
  optimize: argv.optimize
}).on("close", exitCode => {
  if (exitCode === 0) {
    const index = path.join(dir, indexJS);
    if (argv.js)
      fs.writeFileSync(path.join(dir, userJS), fs.readFileSync(argv.js));
    fs.writeFileSync(index, makeIndexJs(argv.js));
    console.log(`    node.js entrypoint ───> ${index}\n`);
    require(path.resolve(index));
  }
});

function makeIndexJs(jsFile) {
  return `
const { Elm } = require('./${elmOutput}');
${
  jsFile
    ? `
const js = require('./${userJS}');
js(Elm);
`
    : `
const app = Elm.Main.init();
global.app = app;
app.ports.log && app.ports.log.subscribe(console.log);
app.ports.eval && app.ports.eval.subscribe(code => eval(code));
`
}
`;
}

function filesNewerThanfile(files, file) {
  const mtime = fs.statSync(file).mtime;
  const mtimes = files.map(f => [f, fs.statSync(path).mtime]);
  return mtimes.any(([f, t]) => t > mtime);
}
