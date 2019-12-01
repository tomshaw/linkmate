<template>
  <form ref="form">

    <div class="form-body">

      <div class="row">
        <div class="col s12">
          <h2>Theme Settings</h2>
          <p>Please note, custom themes will override selected colors. </p>
        </div>
      </div>

      <div class="row">
        <div class="input-field-color col s6">
          <label for="header_color">Header Color</label>
          <input type="color" class="input" id="header_color" name="header_color" v-model="options.headerColor" value="#60a3bc" />
        </div>
        <div class="input-field col s6">
          <select name="theme" id="theme" v-model="options.themeId">
            <option value="0" selected>Select Custom Theme</option>
            <option v-for="(item, i) in themes" :key="i" :value="item.id">{{ item.name }}</option>
          </select>
          <label for="theme">Custom Theme</label>
        </div>
      </div>
      
      <div class="row">
        <div class="input-field-color col s6">
          <label for="background_color">Background Color</label>
          <input type="color" class="input" id="background_color" name="background_color" v-model="options.backgroundColor" value="#ec22b0" />
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
      </div>
    </div>

  </form>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { setStorage, getStorage } from '../../library/storage'
import CustomThemes from '../../library/static/themes'
export default {
  name: 'FormTheme',
  data() {
    return {
      themes: CustomThemes,
      options: {
        themeId: 0,
        headerColor: '#60a3bc',
        backgroundColor: '#ec22b0'
      }
    };
  },
  mounted() {
    getStorage("options").then(response => {
      const data = (response.options) ? response.options : {};
      if (data.theme) {
        this.options = data.theme;
      }
    });
  },
  methods: {
    submit(event, action) {
      const target = event.currentTarget;
      const theme = this.options;
      getStorage("options").then(response => {
        let data = response.options;
        let options = {
          ...data,
          theme
        };
        setStorage({ options });
      });
    }
  }
};
</script>