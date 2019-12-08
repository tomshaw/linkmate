<template>
  <div class="app">
    <router-view @session="setSession"></router-view>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { setStorage, getStorage } from '@/library/storage'
import { defaultDatabases, databaseFields } from '@/library/static/schemas'
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

    if (AppConfig.devMode) {
      defaultDatabases.pop();
    }

    // Begin initial database installation else load selected database.
    this.loadDatabases({ $pouch }).then((results) => {
      if (!results.length) {
        this.bulkDocuments({ $pouch, documents: defaultDatabases }).then(() => {
          this.createIndexes({ $pouch, fields: databaseFields, database: STORAGE_DBNAME_DATABASES }).then((result) => {}).catch((err) => {});
        });
      } else {
        const filtered = results.filter((value, index, arr) => {
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

    this.$eventHub.$on("sync:databases", () => {
      this.syncDatabases({ $pouch });
    });

    this.$eventHub.$on("push:databases", () => {
      this.pushDatabases({ $pouch });
    });

    this.$eventHub.$on("toggle:screen", (screen, options = {}) => {
      if (options.event) {
        this.$eventHub.$emit(options.event, options);
      }
      this.toggleScreen(screen);
    });

    this.$eventHub.$on("browser:tabs:create", (to) => {
      this.getBackgroundPage().then((backgroundPage) => {
        if (backgroundPage) {
          backgroundPage.createNewTab(to);
        }
      }).catch((err) => {});
    });

    this.$on('pouchdb-sync-change', (data) => {
      console.log('pouchdb-sync-change', data);
    });

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

    this.getBackgroundPage().then((backgroundPage) => {
      if (backgroundPage) {
        this.setActivePage(backgroundPage.getActivePage());
      }
    }).catch((err) => {});

  },
  methods: {
    ...mapActions({
      bulkDocuments: 'database/BULK_DOCUMENTS',
      syncDatabases: 'database/SYNC_DATABASES',
      pushDatabases: 'database/PUSH_DATABASES',
      loadDatabases: 'database/LOAD_DATABASES',
      createIndexes: 'database/CREATE_INDEXES'
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
      const wrapper = document.querySelector(".wrapper");
      if (wrapper) {
        wrapper.setAttribute("data-screen", screen);
      }
    }
  }
};
</script>

<style lang="scss">
@import "../assets/styles/reset.scss";
@import "../assets/styles/popup.scss";
</style>
