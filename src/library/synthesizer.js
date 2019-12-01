import { getStorage } from './storage'
import { isEmtpyObject } from './utils'

class SpeechSynthesizer {

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this._enabled = true;
    this._volume = 1; // 0 to 1
    this._rate = 1; // 0.1 to 10
    this._pitch = 2; // 0 to 2
    this._voice = 'en-US';
    this._text = 'The quick brown fox jumps over the lazy dog.';
    this._voices = [];
    this.resolvePromises()
  }

  set enabled(enabled) {
    this._enabled = enabled;
  }

  get enabled() {
    return this._enabled;
  }

  set volume(volume) {
    this._volume = volume;
  }

  get volume() {
    return this._volume;
  }

  set rate(rate) {
    this._rate = rate;
  }

  get rate() {
    return this._rate;
  }

  set pitch(pitch) {
    this._pitch = pitch;
  }

  get pitch() {
    return this._pitch;
  }

  set voice(voice) {
    this._voice = voice;
  }

  get voice() {
    return this._voice;
  }

  set text(text) {
    this._text = text;
  }

  get text() {
    return this._text;
  }

  resolvePromises() {
    Promise.all([
      this.optsReady
    ]).then(this.boot.bind(this));
  }

  get optsReady() {
    return getStorage("options").then(item => {
      if (item.options && item.options.synthesizer) {
        const options = item.options.synthesizer;
        this.enabled = options.enabled;
        this.volume = parseFloat(options.volume);
        this.rate = parseFloat(options.rate);
        this.pitch = parseFloat(options.pitch);
        this.voice = options.voice;
        this.text = options.text;
      }
    });
  }

  boot() {
    this._voices = this.getVoiceList();
  }

  async getVoiceList() {
    if ('onvoiceschanged' in speechSynthesis) {
      await new Promise((resolve, reject) => {
        speechSynthesis.addEventListener('voiceschanged', resolve);
      });
    }
    return speechSynthesis.getVoices();
  }

  speak(data = {}) {
    if (isEmtpyObject(data)) {
      this.speechSynthesis.speak(this.withProps());
    } else {
      this.speechSynthesis.speak(this.withParams(data));
    }
  }

  withProps() {
    const utterance = this.createUtterance(this.text);
    utterance.volume = parseFloat(this.volume);
    utterance.rate = parseFloat(this.rate);
    utterance.pitch = parseFloat(this.pitch);
    utterance.voice = this.findVoice(this.voice);
    return utterance;
  }

  withParams(data) {
    const utterance = this.createUtterance(data.text);
    utterance.volume = parseFloat(data.volume);
    utterance.rate = parseFloat(data.rate);
    utterance.pitch = parseFloat(data.pitch);
    utterance.voice = this.findVoice(data.voice ? data.voice : this.voice);
    return utterance;
  }

  createUtterance(text) {
    return new SpeechSynthesisUtterance(text);
  }

  findVoice(voice) {
    return speechSynthesis.getVoices().filter(item => {
      return item.lang == voice;
    })[0];
  }

  hasSpeechSynthesis() {
    return (!'speechSynthesis' in window) ? true : false;
  }

}

export default SpeechSynthesizer
