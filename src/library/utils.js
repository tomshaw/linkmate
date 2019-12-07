const browser = require('webextension-polyfill')

export function sendNotification(options, autoCloseMessage = false, isClickOptions = false) {

  let config = {
    iconUrl: browser.extension.getURL("/icons/icon48.png"),
    ...options
  };

  browser.notifications.create(config).then((notificationId) => {
    if (isClickOptions) {
      browser.notifications.onClicked.addListener(() => {
        loadOptionsPage();
      });
    }
    if (autoCloseMessage && Number.isInteger(autoCloseMessage)) {
      setTimeout(() => {
        browser.notifications.clear(notificationId);
      }, autoCloseMessage);
    }
  }).catch(() => { });
}

export function loadOptionsPage() {
  const options = browser.extension.getURL("options/options.html");
  window.open(options, '_newtab');
}

export function parseRemote(href) {
  const match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
  return match && {
    href: href,
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    pathname: match[5],
    search: match[6],
    hash: match[7]
  }
}

export function buildConnectionString(url, username, password) {
  const { protocol, host, pathname } = parseRemote(url);
  return `${protocol}//${username}:${password}@${host}${pathname}`;
}

export function normalizeFormArray(data) {
  return data.reduce((obj, item) => {
    obj[item.name] = item.value;
    return obj;
  }, {});
}

export function sortArray(dataArray) {
  return dataArray.sort((a, b) => {
    if (a < b) { return -1; }
    if (a > b) { return 1; }
    return 0;
  });
}

export function sortByDocumentTitle(dataArray) {
  return dataArray.sort((a, b) => {
    if (a.doc.title < b.doc.title) { return -1; }
    if (a.doc.title > b.doc.title) { return 1; }
    return 0;
  });
}

export function sortByCreation(dataArray) {
  return dataArray.sort((a, b) => {
    return new Date(b.created) - new Date(a.created);
  });
}

export function isEmtpyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function accumulateProperties(obj1, obj2) {
  return Object.keys(obj1).reduce((accumulator, key) => {
    accumulator[key] = obj2[key];
    return accumulator
  }, {});
}
