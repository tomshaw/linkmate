let browser = require("webextension-polyfill");

const getStorage = key => {
  return new Promise((resolve, reject) => 
    browser.storage.sync.get(key).then(result =>
      browser.runtime.lastError
        ? reject(Error(browser.runtime.lastError.message))
        : resolve(result)
    )
  )
}

const setStorage = data => {
  return new Promise((resolve, reject) =>
    browser.storage.sync.set(data).then(() =>
      browser.runtime.lastError ? reject(Error(browser.runtime.lastError.message)) : resolve(data)
    )
  )
}

const removeStorage = key => {
  return new Promise((resolve, reject) =>
    browser.storage.sync.remove(key).then(result =>
      browser.runtime.lastError ? reject(Error(browser.runtime.lastError.message)) : resolve(result)
    )
  )
}

const clearStorage = () => {
  return new Promise((resolve, reject) =>
    browser.storage.sync.clear().then(result =>
      browser.runtime.lastError ? reject(Error(browser.runtime.lastError.message)) : resolve(result)
    )
  )
}

const getBytesInUse = key => {
  return new Promise((resolve, reject) =>
    browser.storage.sync.getBytesInUse(key).then(result =>
      browser.runtime.lastError ? reject(Error(browser.runtime.lastError.message)) : resolve(result)
    )
  )
}

export {
  getStorage,
  setStorage,
  removeStorage,
  clearStorage,
  getBytesInUse
}
