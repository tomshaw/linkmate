const browser = require('webextension-polyfill')

import PageDecorator from './library/page'
import DefaultHandler from './library/page/component/default'
import YouTubeHandler from './library/page/component/youtube'

import actions from './library/actions'

const defaultTimeout = 10;

function handleContent() {

  let defaultAction = {
    action: actions.UPDATE_PROPS // update descriptors
  }

  let locationData = {
    url: window.location.href,
    host: window.location.host,
    domain: window.location.host.replace(/^www\./,''),
    origin: document.location.origin,
    hostname: window.location.hostname
  }

  const handlerArray = [{
    match: '*',
    handler: DefaultHandler,
    location: locationData
  }, {
    match: 'www.youtube.com',
    handler: YouTubeHandler,
    location: locationData
  }];

  const match = handlerArray.map(item => item.match).indexOf(locationData.hostname);

  if (match === -1) {
    return new PageDecorator(new DefaultHandler(), handlerArray[0]).then(result => {
      return { ...defaultAction, ...result }
    });
  } else {
    if (handlerArray[match]) {
      const handler = handlerArray[match];
      return new PageDecorator(new handler.handler(), handler).then(result => {
        return { ...defaultAction, ...result }
      });
    }
  }
}

function processContent() {
  setTimeout(() => {
    handleContent().then((data) => {
      browser.runtime.sendMessage(data).catch((err) => {});
      return data;
    });
  }, defaultTimeout);
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === actions.TAB_UPDATED) {
    processContent();
  }
});

processContent();
