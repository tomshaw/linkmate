<template>
  <div class="app">
    <router-view @session="setSession"></router-view>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { setStorage, getStorage } from '../library/storage'
import AppConfig from 'AppConfig'
export default {
  data() {
    return {
      session: false
    };
  },
  computed: {
    ...mapState({
      documents: state => state.database.documents,
    })
  },
  created() {
    const $pouch = this.$pouch;

    this.installDatabase({ $pouch });

    this.$eventHub.$on("sync:databases", () => {
      this.syncDatabases({ $pouch });
    });

    this.$eventHub.$on("push:databases", () => {
      this.pushDatabases({ $pouch });
    });

    this.$eventHub.$on("toggle:screen", (screen) => {
      this.toggleScreen(screen);
    });

    this.$on('pouchdb-sync-change', (data) => {
      console.log('pouchdb-sync-change', data);
    });

    this.loadDatabases({ $pouch }).then(resp => {
      if (resp.length) {
        const filtered = resp.filter((value, index, arr) => {
          return value.doc.selected === true;
        });
        if (filtered.length) {
          const doc = filtered[0].doc;
          this.setDatabase(doc);
          this.setCategories(doc.categories);
        }
      }
    }).then(() => {
      this.$eventHub.$emit("database:initialized", true);
    }).catch(err => {});

  },
  mounted() {

    getStorage(["options", "session"]).then(response => {
      const options = (response.options) ? response.options : {};
      const session = (response.session) ? response.session : {};
      if (options.general) {
        if (options.general.auth_enabled) {
          if (session.ok) {
            this.session = session;
          } else {
            this.session = false;
          }
        } else {
          this.session = options.general;
        }
      }
    }).then(() => {
      if (!this.session) {
        this.$router.replace({ name: "AuthPage" });
      }
    });

    this.$eventHub.$on("browser:tabs:create", (to) => {
      this.getBackgroundPage().then((backgroundPage) => {
        if (backgroundPage) {
          backgroundPage.createNewTab(to);
        }
      }).catch((err) => {});
    });

    this.getBackgroundPage().then((backgroundPage) => {
      if (backgroundPage) {
        const activePage = backgroundPage.getActivePage();
        this.setActivePage(activePage);
      }
    }).catch((err) => {});

  },
  methods: {
    ...mapActions({
      installDatabase: 'database/INSTALL_DATABASE',
      syncDatabases: 'database/SYNC_DATABASES',
      pushDatabases: 'database/PUSH_DATABASES',
      loadDatabases: 'database/LOAD_DATABASES',
    }),
    ...mapMutations({
      setActivePage: 'page/SET_ACTIVE_PAGE',
      setDatabase: 'database/SET_DATABASE',
      setCategories: 'database/SET_CATEGORIES',
    }),
    async getBackgroundPage() {
      try {
        return await this.$browser.extension.getBackgroundPage().backgroundProcess
      } catch (err) {
        return err;
      }
    },
    setSession(data) {
      this.session = (data.hasAccess && data.hasAccess === true && data.user) ? data.user : false
      if (this.session) {
        setStorage({session: data.user});
      }
    },
    toggleScreen(screen) {
      console.log('toggle-screen', screen);
      const wrapper = document.querySelector(".wrapper");
      wrapper.setAttribute("data-screen", screen);
    }
  }
};
</script>

<style lang="scss">
@import "../assets/styles/reset.scss";
@import "../assets/styles/popup.scss";
</style>
