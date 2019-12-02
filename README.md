<h1><img src="https://github.com/tomshaw/linkmate/blob/master/docs/screenshots/logo.png" alt="LinkMate" title="LinkMate"></h1>

[![Tag](https://img.shields.io/github/tag/tomshaw/linkmate.svg)](https://github.com/tomshaw/linkmate/tags)
[![GitHub (pre-)release](https://img.shields.io/github/release/tomshaw/linkmate/all.svg)](https://github.com/tomshaw/linkmate/releases)
[![Version npm](https://img.shields.io/npm/v/linkmate.svg)](https://www.npmjs.com/package/linkmate)
[![Downloads npm](https://img.shields.io/npm/dt/linkmate.svg)](https://www.npmjs.com/package/linkmate)
[![MIT license](https://img.shields.io/npm/l/linkmate.svg)](https://github.com/tomshaw/linkmate/blob/master/LICENSE)

## Overview

> LinkMate is the swiss army knife of web page bookmarking. Powered by PouchDB, users can create private databases of bookmarks or choose to share their data with multiple geographically spread out users in real time no matter where they are. Data replication is the foundation of LinkMate. Perfect for students, researchers or anybody who needs to save, and or share and synchronize their data instantly. LinkMate is a work in progress. If you would like to contribute or share any ideas please feel free to create a pull request or submit an issue. 

## Features

Functionality you'll find in this application:

- Completely private web page bookmarking management.
- Supports both master-master and master-slave replication
- Intuitive customizable interace that makes bookmarking a breeze.
- Access controlled remote database authentication and authorization.  
- Save web page banners and images with the click of a button.
- Listen to document titles utilizing the SpeechSynthesis Web Speech API.

## Application Directions
Once the application is loaded head on over to the options page and start by filling in your general information and hitting the submit button. Next create a some databases to organize your bookmarks such as sports or cooking. Once done click the category tab and create some categories for your databases. If you like check out some of the themes and hit apply. Now your ready to start booking marking some web pages.

## Libraries Used

+ [Vue Extension](https://github.com/Kocal/vue-web-extension) - A boilerplate for quickly starting a web extension with Vue, webpack 4, ESLint and more!
+ [Vue](https://vuejs.org) - A progressive, JavaScript framework for building UI on the web.
+ [Vuex](https://vuex.vuejs.org/en) - Vuex is a state management library for Vue.js.
+ [PouchDB](https://github.com/pouchdb/pouchdb) - PouchDB is a pocket-sized database.
+ [PouchVue](https://github.com/MDSLKTR/pouch-vue) - Pouchdb bindings for Vue.js
+ [Materialize](https://github.com/Dogfalo/materialize) - Materialize, a CSS Framework based on Material Design

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

### `npm run build-zip`

Build a zip file following this format `<name>-v<version>.zip`, by reading `name` and `version` from `manifest.json` file.
Zip file is located in `dist-zip` folder.

## License

See the bundled LICENSE file for details.

## Author

Tom Shaw (@urlrider)
