<template>
  <div class="wrapper auth">
    <div class="login" v-bind:class="{ active: actionType == 'login' }">
      <div class="row">
        <form class="col s12">
          <div class="row">
            <div class="col s12">
              <h1 class="auth-header">Login</h1>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input type="text" class="validate" name="username" id="username" v-model="input.username" />
              <label for="username">User name</label>
            </div>
            <div class="input-field col s12">
              <input type="password" class="validate" name="password" id="password" v-model="input.password" />
              <label for="password">Password</label>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <button class="waves-effect waves-light btn" type="button" @click="submitLogin">Login</button>
            </div>
            <div class="col s12">
              <p class="auth-text">
                Don't have an account? Please
                <a @click="handleActionType">register</a>.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="register" v-bind:class="{ active: actionType == 'register' }">
      <div class="row">
        <form class="col s12">
          <div class="row">
            <div class="col s12">
              <h1 class="auth-header">Register</h1>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input type="text" class="validate" name="username" id="username" v-model="input.username" placeholder />
              <label for="username">User name</label>
            </div>
            <div class="input-field col s12">
              <input type="password" class="validate" name="password" id="password" v-model="input.password" placeholder />
              <label for="password">Password</label>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <button class="waves-effect waves-light btn" type="button" @click="submitRegister">Register</button>
            </div>
            <div class="col s12">
              <p class="auth-text">
                Already have an account? Please
                <a @click="handleActionType">login</a>.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { getStorage } from '@/library/storage'
import AppConfig from 'AppConfig'
export default {
  data() {
    return {
      actionType: "login",
      database: "http://localhost:5984/_user",
      input: {
        username: "tomshaw",
        password: "password"
      }
    };
  },
  mounted() {
    getStorage("options").then(response => {
      const options = (response.options) ? response.options : {};
      if (options.general) {
        if (options.general.auth_database) {
          this.database = options.general.auth_database;
        }
      }
    });
    this.$nextTick(() => {
      M.AutoInit();
      M.updateTextFields();
    });
  },
  methods: {
    ...mapActions({
      authConnect: "session/AUTH_CONNECT_REMOTE",
      loadSession: "session/LOAD_SESSION",
      createUser: "session/CREATE_USER"
    }),
    handleActionType() {
      this.actionType = this.actionType === "login" ? "register" : "login";
    },
    submitLogin() {
      const $pouch = this.$pouch;
      const database = this.database;
      const username = this.input.username;
      const password = this.input.password;
      if (username && password) {
        this.authConnect({ $pouch, database, username, password }).then(resp => {
          if (resp.hasAccess) {
            this.$emit("session", resp);
            this.$router.replace({ name: "HomePage" });
          }
        }).catch(err => {});
      }
    },
    submitRegister() {
      // @todo check requires cookie
      const $pouch = this.$pouch;
      const database = this.database;
      const username = this.input.username;
      const password = this.input.password;
      if (username && password) {
        const params = { $pouch, database, username, password };
        try {
          this.createUser(params).then(resp => {
            this.$emit("session", resp);
            this.$router.replace({ name: "HomePage" });
          }).catch(err => {});
        } catch (err) {}
      }
    },
    handleLoadSession(params) {
      this.loadSession(params).then(resp => {}).catch(err => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper.auth {
  background-color: #8c1253;
  position: absolute;
  top: 0;
  left: 0;
  height: 540px;
  width: 340px;
  overflow: hidden;
  .auth-header {
    color: #fff;
    font-size: 48px;
    margin: 15px 0;
  }
  p.auth-text {
    color: #fff;
    margin: 20px 0;
    font-size: 15px;
    font-weight: 300;
    a {
      cursor: pointer;
    }
  }
  .login,
  .register {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translateY(-100%);
    transition: transform 0.6s ease-in-out, opacity 0.9s ease-in-out;
    .input-field {
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }
    > :first-child {
      padding: 15px;
    }
  }
  .login.active {
    background-color: #8c1253;
    opacity: 1;
    transform: translateY(0%);
  }
  .register.active {
    background-color: #890076;
    opacity: 1;
    transform: translateY(0%);
  }
}
</style>
