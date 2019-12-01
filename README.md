<h1><img src="https://raw.github.com/tomshaw/linkmate/master/docs/logo.png" alt="LinkMate" title="LinkMate"></h1>

[![Tag](https://img.shields.io/github/tag/tomshaw/linkmate.svg)](https://github.com/tomshaw/linkmate/tags)
[![GitHub (pre-)release](https://img.shields.io/github/release/tomshaw/linkmate/all.svg)](https://github.com/tomshaw/linkmate/releases)
[![Version npm](https://img.shields.io/npm/v/linkmate.svg)](https://www.npmjs.com/package/linkmate)
[![Downloads npm](https://img.shields.io/npm/dt/linkmate.svg)](https://www.npmjs.com/package/linkmate)
[![MIT license](https://img.shields.io/npm/l/linkmate.svg)](https://opensource.org/licenses/MIT)

## Overview

> LinkMate is a web page bookmarking application powered by Vue.js and Pouch/CouchDb. With LinkMate users can bookmark web pages and replicate their data effortlessly .

<img src="docs/screenshots/logo.png" alt="LinkMate" title="LinkMate">

## Features

Functionality you'll find in this application include:

- Completely private web page bookmarking management and data replication.
- Intuitive customizable interace that makes bookmarking a breeze.
- Access controlled remote database authentication and authorization.  
- Save web page banners and images with the click of a button.
- Listen to document titles utilizing the SpeechSynthesis Web Speech API.

## Application Directions
Once the application is loaded head on over to the options page and start by filling in your general information and hitting the submit button. Next create a some databases to organize your bookmarks such as sports or cooking. Once done click the category tab and create some categories for your databases. If you like check out some of the themes and hit apply. Now your ready to start booking marking some web pages.

## Libraries Used

+ [Vue Web Extension](https://github.com/Kocal/vue-web-extension) - A boilerplate for quickly starting a web extension with Vue, webpack 4, ESLint and more!
+ [Vue](https://vuejs.org) - A progressive, JavaScript framework for building UI on the web.
+ [Vuex](https://vuex.vuejs.org/en) - Vuex is a state management library for Vue.js.
+ [PouchDB](https://github.com/pouchdb/pouchdb) - PouchDB is a pocket-sized database.
+ [PouchVue](https://github.com/MDSLKTR/pouch-vue) - Pouchdb bindings for Vue.js

## Quick Setup

```bash
$ glt clone https://github.com/tomshaw/linkmate
$ cd linkmate
$ npm install
$ npm run build
```

### `npm run build`

Build the extension into `dist` folder for **production**.

### `npm run build:dev`

Build the extension into `dist` folder for **development**.

### `npm run watch`

Watch for modifications then run `npm run build`.

### `npm run watch:dev`

Watch for modifications then run `npm run build:dev`.

It also enable [Hot Module Reloading](https://webpack.js.org/concepts/hot-module-replacement), thanks to [webpack-chrome-extension-reloader](https://github.com/rubenspgcavalcante/webpack-chrome-extension-reloader) plugin.

:warning: Keep in mind that HMR only works for your **background** entry.

### `npm run build-zip`

Build a zip file following this format `<name>-v<version>.zip`, by reading `name` and `version` from `manifest.json` file.
Zip file is located in `dist-zip` folder.

## License

See the bundled LICENSE file for details.

## Author

Tom Shaw (@urlrider)
