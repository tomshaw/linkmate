<template>
  <form ref="form">

    <div class="form-body">

      <div class="row">
        <div class="col s12">
          <h2>Voice Synthesizer</h2>
          <p>When you use a button to submit a form, instead of using a input tag, use a button tag with a type submit.</p>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s6">
          <select name="enabled" id="enabled" v-model="options.enabled">
            <option v-for="(item, i) in enabledArray" :key="i" :value="i" :selected="options.enabled === i">{{ item }}</option>
          </select>
          <label for="enabled">Synthesizer Enabled</label>
        </div>
        <div class="input-field col s6">
          <input type="text" class="input" name="text" id="text" v-model="options.text" x-webkit-speech />
          <label for="text">Test</label>
        </div>
      </div>
    
      <div class="row">
        <div class="input-field col s6">
          <select name="voice" id="voice" v-model="options.voice">
            <option v-for="(item, i) in voices" :key="i" :value="item.lang">{{ item.name }}</option>
          </select>
          <label for="voice">Language Voice</label>
        </div>
        <div class="input-field col s6"></div>
      </div>
      
      <div class="row">
        <div class="col s6">
          <label for="volume">Volume</label>
          <input type="range" class="input" name="volume" id="volume" min="0" max="1" step="0.1" v-model="options.volume" />
        </div>
        <div class="input-field col s6"></div>
      </div>

      <div class="row">
        <div class="col s6">
          <label for="rate">Rate</label>
          <input type="range" class="input" name="rate" id="rate" min="0.1" max="10" step="0.1" v-model="options.rate" />
        </div>
        <div class="input-field col s6"></div>
      </div>

      <div class="row">
        <div class="col s6">
          <label for="pitch">Pitch</label>
          <input type="range" class="input" name="pitch" id="pitch" min="0" max="2" step="0.1" v-model="options.pitch" />
        </div>
        <div class="input-field col s6"></div>
      </div>

    </div>

    <div class="form-actions">
      <div class="form-actions__inner">
        <div class="form-actions__inner-button">
          <button class="btn waves-effect waves-light" type="button" name="action" @click="submit($event)">Submit
            <i class="material-icons right">cloud</i>
          </button>
        </div>
        <div class="form-actions__inner-button">
          <button class="btn waves-effect red" type="reset" name="action">Reset
            <i class="material-icons right">autorenew</i>
          </button>
        </div>
        <div class="form-actions__inner-button">
          <button class="btn waves-effect blue" type="button" name="speak" id="speak" @click="submitSpeak($event)">Listen
            <i class="material-icons right">hearing</i>
          </button>
        </div>
      </div>
    </div>

  </form>
</template>

<script>
import SpeechSynthesizer from '../../library/synthesizer'
import { setStorage, getStorage } from '../../library/storage'
export default {
  name: 'FormSynthesizer',
  data() {
    return {
      voices: [],
      enabledArray: ['Disabled', 'Enabled'],
      options: {
        enabled: 1,
        text: 'The quick brown fox jumps over the lazy dog.',
        voice: 'en-US',
        volume: 1,
        rate: 1,
        pitch: 1
      }
    };
  },
  mounted() {
    this.speechSynthesizer = new SpeechSynthesizer();
    this.speechSynthesizer.getVoiceList().then((voices) => {
      this.voices = voices.map(voice => ({ name: voice.name, lang: voice.lang }));
    })
    getStorage("options").then(response => {
      const data = (response.options) ? response.options : {};
      if (data.synthesizer) {
        this.options = data.synthesizer;
      }
    });
  },
  methods: {
    submit(event) {
      const target = event.currentTarget;
      const synthesizer = this.options;
      getStorage("options").then(response => {
        let data = response.options;
        let options = {
          ...data,
          synthesizer
        };
        setStorage({ options });
      });
    },
    submitSpeak(event) {
      const options = this.options
      this.speechSynthesizer.speak(options);
    }
  }
};
</script>
