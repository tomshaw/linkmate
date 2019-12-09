<h1><img src="https://github.com/tomshaw/linkmate/blob/master/docs/screenshots/logo.png" alt="LinkMate" title="LinkMate"></h1>

[![Tag](https://img.shields.io/github/tag/tomshaw/linkmate.svg)](https://github.com/tomshaw/linkmate/tags)
[![GitHub (pre-)release](https://img.shields.io/github/release/tomshaw/linkmate/all.svg)](https://github.com/tomshaw/linkmate/releases)
[![Version npm](https://img.shields.io/npm/v/linkmate.svg)](https://www.npmjs.com/package/linkmate)
[![Downloads npm](https://img.shields.io/npm/dt/linkmate.svg)](https://www.npmjs.com/package/linkmate)
[![MIT license](https://img.shields.io/npm/l/linkmate.svg)](https://github.com/tomshaw/linkmate/blob/master/LICENSE)

## Overview

> LinkMate is the swiss army knife of web page bookmarking. Powered by PouchDB, users can create private databases of bookmarks or choose to share their data with geographically spread out users in real time no matter where they are. Data replication is the foundation of LinkMate. Perfect for students, researchers or anybody who needs to save or share and synchronize their data instantly. LinkMate is a work in progress. If you would like to contribute or share any ideas please feel free to create a pull request or submit an issue.

## Features

Functionality you'll find in this application:

- Completely private web page bookmarking management.
- Supports both master-master and master-slave replication
- Intuitive customizable interace that makes bookmarking a breeze.
- Access controlled remote database authentication and authorization.  
- Save web page banners and images with the click of a button.
- Listen to document titles utilizing the SpeechSynthesis Web Speech API.

## Application Directions

Once the application is loaded head on over to the options page and start by filling in your general information and hitting the submit button. Next create a some databases to organize your bookmarks such as sports or cooking. Once done click the category tab and create some categories for your databases. If you like check, out some of the themes and hit apply. Now your ready to start booking marking some web pages. If you must backup your bookmarks while the application is in development, install a local copy of [CouchDb](https://couchdb.apache.org/), disable Admin Party in [Fauxton](https://couchdb.apache.org/fauxton-visual-guide/) by creating a username and password. On the LinkMate options page, create a new local and remote database specifying your credentials and finally on the replication tab, push the database to back it up or pull the database to restore. Note you can also create a user and give them permissions to the database or assign the user to a group with database permissions. To create a new user, on the options general tab, enable remote authentication and click the register link on the login screen. 

## Libraries Used

+ [Vue Extension](https://github.com/Kocal/vue-web-extension) - A boilerplate for quickly starting a web extension with Vue, webpack 4, ESLint and more!
+ [Vue](https://vuejs.org) - A progressive, JavaScript framework for building UI on the web.
+ [Vuex](https://vuex.vuejs.org/en) - Vuex is a state management library for Vue.js.
+ [PouchDB](https://github.com/pouchdb/pouchdb) - PouchDB is a pocket-sized database.
+ [PouchVue](https://github.com/MDSLKTR/pouch-vue) - Pouchdb bindings for Vue.js
+ [Materialize](https://github.com/Dogfalo/materialize) - Materialize, a CSS Framework based on Material Design

## Further Reading

+ [PouchDB Find](https://github.com/nolanlawson/pouchdb-find) - Provides a simple, MongoDB-inspired query language that accomplishes the same thing as the map/reduce API, but with far less code. Eventually this will replace PouchDB's map/reduce API entirely. You'll still be able to use map/reduce, but it will be distributed as a separate plugin.
+ [PouchDB LiveFind](https://pouchdb.com/api.html) - Live PouchDB queries that update automatically as changes come in!
+ [PouchDB Authentication](https://github.com/pouchdb-community/pouchdb-authentication) - Easy user authentication for PouchDB/CouchDB.
+ [Relational Pouch](https://github.com/pouchdb-community/relational-pouch) - Relational Pouch is a plugin for PouchDB that allows you to interact with PouchDB/CouchDB like a relational data store, with types and relations.
+ [Mango Queries](https://pouchdb.com/guides/mango-queries.html) - Mango queries, also known as pouchdb-find or the find() API, are a structured query API that allows you to build secondary indexes beyond the built-in allDocs() and changes() indexes.
+ [Map/Reduce Queries](https://pouchdb.com/api.html) - Map/reduce queries, also known as the query() API, are one of the most powerful features in PouchDB.
+ [PouchDB Quick Search](https://github.com/pouchdb-community/pouchdb-quick-search) - Full-text search engine on top of PouchDB

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
