# LinkMate

LinkMate is a web page bookmarking application browser extension developed using Vue.js and powered by Pouch/CouchDb.

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
