phantom-curator-nw
==================

A desktop application for managing [PhantomCSS](https://github.com/Huddle/PhantomCSS) visual diffs.

This builds on the original web app [phantom-curator](https://git.niniansolutions.com/John-hunter/phantom-curator) but turns it into a desktop app.

## Get the app

*zip / dmg files are too big to be hosted in github* - for the moment you need to checkout the repo and build

## Development

- based on [Node-Webkit](https://github.com/rogerwang/node-webkit)
- using [gruntjs](http://gruntjs.com) for builds
- using [Reactjs](http://facebook.github.io/react/index.html) and [Browserify](http://browserify.org/) for the js app
- using [Pure](https://github.com/yui/pure) for css

### Getting started

tl;dr on windows and in a hurry? - just `go`

*otherwise:*

```shell
npm install
```
then to build
```shell
grunt
```

## Dev working

There are 3 builds (default runs all of them):

- `grunt prepare` - preprocess lib files etc
- `grunt build` - builds the reactjs and makes the node-webkit app (use this to see code changes)
- `grunt package` - creates the distribution zips / installers

To work on code run `grunt build` and then open the app exe in `webkitbuilds/releases/phantom-curator/<os>/phantom-curator`

Once running you can use *Ctrl-Shift-i* to open the debugging console.
