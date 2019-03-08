# elm-node

A node.js CLI tool for easily running your elm applications.

```
elm init
elm-node --example-elm > src/Main.elm
elm-node src/Main.elm
```

## Usage

`npm install -g elm-node`, then make a directory to test it out.

```
mkdir my-node-project && cd my-node-project
elm init
```

See the following sections for usage instructions.

### Simple setup, no JS

You can just create a Main.elm. On the JS side there will be a JS port called
`log` that you can use to send `String` to output.

You can use `--example-elm` to get a very basic `Main.elm` to get started:

```
elm-node --example-elm > src/Main.elm
elm-node src/Main.elm
```

### Custom JS setup

Similar to the previous setup, but you can provide a custom JS file that will
get passed the Elm object so that you can init whatever app you want, or set up
any ports you need.

The JS file passed, needs to export a function that will get the Elm object from
the compiled output. You can do with it as you please.

You can use `--example-elm` and `--example-js` to get a very basic `Main.elm`
and custom JS to get started:

```
elm-node --example-elm > src/Main.elm
elm-node --example-js > src/index.js
elm-node --js src/index.js src/Main.elm
```

### Flags

You can pass `--optimize` for the compiler to do the optimized build, but it
probably won't get you much in Node.js, except for getting rid of the
development build warning output. The compile times are longer, so maybe just
use it when you are going to ship.
