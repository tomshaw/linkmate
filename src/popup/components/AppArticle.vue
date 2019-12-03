<template>
  <div class="article">
    <div class="article__form">
 
      <div class="row">
        <div class="input-field col s12">
          <input type="text" class="active" name="title" id="title" v-model="page.title" />
          <label for="title">Title</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12">
          <select name="database" id="database" @change="onChange">
            <option v-for="(item, i) in databases" :key="i" :value="item.doc._id" :selected="item.doc.selected === true">{{ item.doc.title }}</option>
          </select>
          <label for="database">Select Database</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12">
          <select name="category" id="category" v-model="category" multiple>
            <option v-for="(item, key, i) in categories" :key="i" :value="item">{{ item }}</option>
          </select>
          <label for="category">Categories</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12">
          <select name="expires" id="expires" v-model="expires">
            <option v-for="(item, key, i) in expiration" :key="i" :value="key">{{ item.title }}</option>
          </select>
          <label for="database">Article Expiration</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12">
          <input type="text" class="validate" name="description" id="description" v-model="page.description" />
          <label for="description">Description</label>
        </div>
      </div>

    </div>

    <AppButtons buttonStyle="green" buttonIcon="mode_edit" toggleScreen="screen-featured" activeScreen="screen-article" />

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import AppButtons from './AppButtons.vue'
export default {
  components: {
    AppButtons
  },
  computed: {
    ...mapState({
      page: state => state.page.page,
      database: state => state.database.database,
      databases: state => state.database.databases,
      categories: state => state.database.categories, // database categories
      expiration: state => state.expires.values
    }),
    ...mapGetters({
      getActivePage: 'page/getActivePage',
      getDatabase: 'database/getDatabase', 
      getCategory: 'document/getCategory', 
      getExpiration: 'expires/getExpirationTime'
    }),
    category: { // chosen categories
      get () { return this.$store.state.document.category },
      set (value) { this.$store.commit('document/SET_CATEGORY', value) }
    },
    expires: {
      get () { return this.$store.state.expires.time },
      set (value) { this.$store.commit('expires/SET_EXPIRATION', value) }
    }
  },
  mounted() {
    this.$eventHub.$on("database:initialized", () => {
      M.AutoInit();
      M.updateTextFields(); 
    });
    this.$eventHub.$on("submit:page", ($event) => {
      this.handleSubmitPage($event);
    });
    this.$nextTick(() => {
      M.AutoInit();
      M.updateTextFields();
    });
  },
  methods: {
    ...mapActions({
      loadDatabase: 'database/LOAD_DATABASE',
      updateSelected: 'database/UPDATE_SELECTED',
      loadDocuments: 'document/LOAD_DOCUMENTS',
      submitDocument: 'document/SUBMIT_DOCUMENT'
    }),
    onChange(event) {
      const $pouch = this.$pouch;
      const docId = event.target.value;
      this.loadDatabase({ $pouch, docId }).then((doc) => {
        this.loadDocuments({ $pouch, database: doc.local }); 
        this.updateSelected({ $pouch, docId }).then((result) => {}).catch(err => {});
        this.$eventHub.$emit("database:initialized", true);
      }).then(() => {
        M.FormSelect.init(document.getElementById('category'));
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

      doc.created = now; // @todo only updated
      doc.updated = now;

      if (doc.action) delete doc.action;

      console.log('submit-doc', doc);

      this.submitDocument({ $pouch, database: database.local, doc }).then((resp) => {
        this.$eventHub.$emit("push:databases");
        this.$eventHub.$emit("toggle:screen", "screen-history");
        this.$eventHub.$emit("database:initialized", true);
      }).catch((err) => {});
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
      margin-top: .6rem;
      margin-bottom: .6rem;
    }
    input,
    textarea {
      color: #fff;
    }
  }
}
</style>
