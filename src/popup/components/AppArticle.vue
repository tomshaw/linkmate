<template>
  <div class="article">
    <div class="article__form">
      <div class="row">
        <div class="input-field col s12">
          <input
            type="text"
            class="active"
            name="title"
            id="title"
            v-model="page.title"
            autocomplete="off"
          />
          <label for="title">Title</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12">
          <select name="database" id="database" @change="onChange">
            <option
              v-for="(item, i) in databases"
              :key="i"
              :value="item.doc._id"
              :selected="item.doc.selected === true"
            >{{ item.doc.title }}</option>
          </select>
          <label for="database">Database</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12">
          <select name="category" id="category" v-model="category" multiple>
            <option value disabled selected>Select categories</option>
            <option v-for="(item, key, i) in categories" :key="i" :value="item">{{ item }}</option>
          </select>
          <label for="category">Categories</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12">
          <select name="expires" id="expires" v-model="expires">
            <option value="0">Select expiration</option>
            <option v-for="(item, key, i) in expiration" :key="i" :value="item.id">{{ item.title }}</option>
          </select>
          <label for="database">Article Expiration</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12">
          <input
            type="text"
            class="validate"
            name="description"
            id="description"
            v-model="page.description"
          />
          <label for="description">Description</label>
        </div>
      </div>
    </div>

    <AppButtons
      buttonStyle="blue"
      buttonIcon="attach_file"
      toggleScreen="screen-featured"
      activeScreen="screen-article"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import AppButtons from "./AppButtons.vue";
export default {
  components: {
    AppButtons
  },
  computed: {
    ...mapState({
      database: state => state.database.database,
      databases: state => state.database.databases,
      categories: state => state.database.categories, // database categories
      expiration: state => state.expires.values
    }),
    ...mapGetters({
      getActivePage: "page/getActivePage",
      getDatabase: "database/getDatabase",
      getCategory: "document/getCategory",
      getExpiration: "expires/getExpirationTime"
    }),
    page: {
      get() {
        return this.$store.state.page.page;
      },
      set(value) {
        this.$store.commit("page/SET_ACTIVE_PAGE", value);
      }
    },
    category: { // selected cats
      get() {
        return this.$store.state.document.category;
      },
      set(value) {
        this.$store.commit("document/SET_CATEGORY", value);
      }
    },
    expires: {
      get() {
        return this.$store.state.expires.time;
      },
      set(value) {
        this.$store.commit("expires/SET_EXPIRATION", value);
      }
    }
  },
  mounted() {

    this.$eventHub.$on("database:initialized", () => {
      M.AutoInit();
      M.updateTextFields();
    });

    this.$eventHub.$on("search:mode", $event => {
      this.page = {};
    });

    this.$eventHub.$on("submit:page", $event => {
      this.handleSubmitPage($event);
    });

    this.$eventHub.$on("submit:search", $event => {
      this.handleSubmitSearch($event);
    });
  },
  methods: {
    ...mapActions({
      loadDatabase: "database/LOAD_DATABASE",
      updateSelected: "database/UPDATE_SELECTED",
      loadDocuments: "document/LOAD_DOCUMENTS",
      submitDocument: "document/SUBMIT_DOCUMENT",
      searchDocuments: "document/SEARCH_DOCUMENTS"
    }),
    onChange(event) {
      const $pouch = this.$pouch;
      const docId = event.target.value;
      
      this.loadDatabase({ $pouch, docId }).then(doc => {
        this.loadDocuments({ $pouch, database: doc.local });
        this.updateSelected({ $pouch, docId }).then(result => {}).catch(err => {});
        this.$eventHub.$emit("database:initialized", true);
      }).then(() => {
        M.FormSelect.init(document.getElementById("category"));
      }).catch(err => {});
    },
    handleSubmitPage(event) {
      const $pouch = this.$pouch;
      const page = this.getActivePage;
      const database = this.getDatabase;
      const category = this.getCategory;
      const expires = this.getExpiration;
      const now = new Date().toISOString();

      let doc = { ...page, database: database.id, category, expires };

      if (doc._id && doc._ref) {
        doc.updated = now;
      } else {
        doc.created = now;
        doc.updated = now;
      }

      console.log("submit-page-document", doc);

      this.submitDocument({ $pouch, database: database.local, doc }).then((resp) => {
        this.$eventHub.$emit("push:databases");
        this.$eventHub.$emit("toggle:screen", "screen-history");
        this.$eventHub.$emit("database:initialized", true);
      }).catch((err) => {});
    },
    handleSubmitSearch(event) {
      const $pouch = this.$pouch;
      const page = this.getActivePage;
      const database = this.getDatabase.local;
      const category = this.getCategory;
      const expires = this.getExpiration;

      const searchParams = { title: page.title, database, category, expires };

      let options = {
        selector: {
          title: { $exists: true },
          expires: { $exists: true }
        },
        limit: 100,
      };

      if (searchParams.title) {
        options = {
          ...options,
          selector: {
            ...options.selector,
            title: { $regex: RegExp(searchParams.title, 'i') },
            $and: [
              { description: { $regex: RegExp(searchParams.title, 'i') } },
            ]
          }
        };
      }

      if (searchParams.category && searchParams.category.length) {
        options = {
          ...options,
          selector: {
            ...options.selector,
            category: { $in: searchParams.category }
          }
        };
      }

      if (searchParams.expires && searchParams.expires > 1) {
        options = {
          ...options,
          selector: {
            ...options.selector,
            expires: { $eq: searchParams.expires }
          }
        };
      }

      console.log("submit-search-params", searchParams);
      console.log('submit-search-options', options);

      this.searchDocuments({ $pouch, options, database }).then((result) => {
        if (result.length) {
          this.$eventHub.$emit("toggle:screen", "screen-history");
        }
      });
    },
    createIndexes() {
      this.$pouch.createIndex({
        index: {
          fields: ["title", "description", "category", "expires", "created"]
        }
      }, database).then((result) => {
        console.log(`create-index-${database}-result`, result);
      }).catch((err) => {
        console.log(`create-index-${database}-err`, err);
      });
    }
  }
};
</script>

<style lang="scss">
.article {
  &__form {
    background-color: inherit;
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 20px;
    .row {
      margin-bottom: 12px;
    }
    .input-field {
      position: relative;
      margin-top: 0.6rem;
      margin-bottom: 0.6rem;
    }
    input,
    textarea {
      color: #fff;
    }
  }
}
</style>
