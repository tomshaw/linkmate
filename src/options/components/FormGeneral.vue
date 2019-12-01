<template>
  <form ref="form">
    <div class="form-body">

      <div class="row">
        <div class="col s12">
          <h2>General Settings</h2>
          <p>When you use a button to submit a form, instead of using a input tag, use a button tag with a type submit.</p>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s6">
          <input type="text" class="validate" name="first_name" id="first_name" v-model="options.first_name" placeholder="First name" />
          <label for="first_name">First name</label>
        </div>
        <div class="input-field col s6">
          <input type="text" class="validate" name="last_name" id="last_name" v-model="options.last_name" placeholder="Last name" />
          <label for="last_name">Last name</label>
        </div>
      </div>
      
      <div class="row">
        <div class="input-field col s6">
          <input type="email" class="validate" name="email" id="email" v-model="options.email" placeholder="Email address" />
          <label for="full_name">Email address</label>
        </div>
        <div class="input-field col s6">
          <select name="language" id="language" v-model="options.language">
            <option v-for="(item, key, index) in languages" :key="index" :value="key">{{ item }}</option>
          </select>
          <label for="language">Default language</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s6">
          <select name="auth_enabled" id="auth_enabled" v-model="options.auth_enabled">
            <option v-for="(item, i) in authopts" :key="i" :value="item.value">{{ item.title }}</option>
          </select>
          <label for="language">Enable authentication</label>
        </div>
       <div class="input-field col s6">
          <input type="text" class="auth_database" name="auth_database" id="auth_database" v-model="options.auth_database" placeholder="Auth database" />
          <label for="full_name">Auth database</label>
          <span class="helper-text" data-error="wrong" data-success="right">Requires remote database.</span>
        </div>
      </div>

    </div>

    <div class="form-actions">
      <div class="form-actions__inner">
        <div class="form-actions__inner-button">
          <button class="btn waves-effect waves-light" type="button" name="action" @click="submit($event)">Submit</button>
        </div>
        <div class="form-actions__inner-button">
          <button class="btn waves-effect red" type="reset" name="action">Reset</button>
        </div>
      </div>
    </div>

  </form>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { setStorage, getStorage } from '../../library/storage'
import languages from '../../library/static/languages'
import authopts from '../../library/static/authopts'
export default {
  name: "FormGeneral",
  data() {
    return {
      languages,
      authopts,
      options: {
        first_name: '',
        last_name: '',
        email: '',
        language: 'en',
        auth_enabled: false,
        auth_database: 'http://localhost:5984/_user'
      }
    };
  },
  mounted() {
    getStorage("options").then(response => {
      const data = (response.options) ? response.options : {};
      if (data.general) {
        this.options = data.general;
      }
    });
  },
  methods: {
    submit(event) {
      const target = event.currentTarget;
      const general = this.options;
      getStorage("options").then(response => {
        let data = response.options;
        let options = {
          ...data,
          general
        };
        setStorage({ options });
      });
    }
  }
};
</script>
