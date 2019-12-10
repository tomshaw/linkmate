import { sendNotification } from './library/utils'
import { setStorage, getStorage } from './library/storage'
import actions from './library/actions'
import AppConfig from 'AppConfig'

const browser = require('webextension-polyfill')

class BackgroundProcess {

  constructor() {
    this._page = {
      images: [{
        src: '/assets/images/transparent.png',
        width: 340,
        height: 540,
        alt: "Welcome To LinkMate"
      }]
    }
    this._boundMessageHandler = null
    this._boundTabUpdatedHandler = null
    this._boundTabActivatedHandler = null
    this._boundInstalledListener = null
  }

  boot() {
    this.createHandlers()
    this.enableListeners()
  }

  createHandlers() {
    this._boundMessageHandler = this.handleRuntimeMessage.bind(this)
    this._boundTabUpdatedHandler = this.handleTabUpdated.bind(this)
    this._boundTabActivatedHandler = this.handleTabActivated.bind(this)
    this._boundInstalledListener = this.handleInstalled.bind(this)
  }

  enableListeners() {
    browser.runtime.onMessage.addListener(this._boundMessageHandler)
    browser.tabs.onUpdated.addListener(this._boundTabUpdatedHandler)
    browser.tabs.onActivated.addListener(this._boundTabActivatedHandler)
    browser.runtime.onInstalled.addListener(this._boundInstalledListener)
  }

  handleRuntimeMessage(msg, sender, sendResponse) {
    if (msg.action && msg.action === actions.UPDATE_PROPS) return this.setActivePage(msg)
  }

  handleTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.url) {
      browser.tabs.sendMessage(tabId, {
        message: actions.TAB_UPDATED
      }).catch((err) => { });
    }
  }

  // @todo Create an array of pages indexed by tab id, use the onActivated handler to find/set active page.
  // _pages = []
  // _page = {}
  handleTabActivated(info) {
    try {
      browser.tabs.sendMessage(info.tabId, {
        message: actions.TAB_UPDATED
      }).catch((err) => { });
    } catch (e) { }
  }

  handleInstalled(details) {

    const isInstall = (details.reason === "install") ? true : false;
    const isUpdate = (details.reason === "update") ? true : false;

    if (AppConfig.devMode === 'production') {
      if (details.reason == "install") {
        sendNotification({
          type: 'basic',
          title: "Welcome!",
          message: `Thank you for installing ${AppConfig.appName}. To get started please visit the options page by clicking here.`,
          priority: 2
        }, 5e3, true);
      } else if (details.reason == "update") {
        sendNotification({
          type: 'basic',
          title: "Update Installed!",
          message: `${AppConfig.appName} has just been updated, please click here to review new settings in the options page.`,
          priority: 2
        }, 5e3, true);
      }
    }

    const manifest = browser.runtime.getManifest();
    const currentVersion = manifest.version;
    const now = new Date().getTime();

    if (isInstall) {
      setStorage({
        extension: {
          created: now,
          updated: now,
          version: {
            current: currentVersion,
            previous: currentVersion
          }
        }
      });
    }

    if (isUpdate) {
      getStorage(['extension']).then(item => {
        let created = item.extension.created;
        let previousVersion = item.extension.version.current;
        setStorage({
          extension: {
            created: created,
            updated: now,
            version: {
              current: currentVersion,
              previous: previousVersion
            }
          }
        });
      });
    }

    return true;
  }

  getActivePage() {
    return this._page;
  }

  setActivePage(msg) {
    this._page = msg;
  }

  createNewTab(url) {
    browser.tabs.create({ 'url': url }).then((tab) => {});
  }

}

window.backgroundProcess = new BackgroundProcess()
window.backgroundProcess.boot()
