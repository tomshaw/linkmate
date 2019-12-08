<template>
  <div class="options">
    <div class="options__inner">
      <div class="row">
        <ul class="tabs options__tabs">
          <li v-for="(item, i) in items" :key="i" class="tab col s1"><a :href="item.tabRef" v-bind:class="{ active: item.checked }">{{item.name}}</a></li>
        </ul>
        <div class="col s12 options__content" v-for="(item, i) in items" :key="i" :id="item.divId">
          <div :is="item.component"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { setStorage, getStorage } from '@/library/storage'
import { STORAGE_DBNAME_DATABASES } from '@/library/static/constants'
import { defaultDatabases, databaseFields } from '@/library/static/schemas'
import OptionsTabs from '@/library/static/options'
import FormGeneral from '@/options/components/FormGeneral'
import FormDatabase from '@/options/components/FormDatabase'
import FormCategory from '@/options/components/FormCategory'
import FormReplication from '@/options/components/FormReplication'
import FormTheme from '@/options/components/FormTheme'
import FormSynthesizer from '@/options/components/FormSynthesizer'
import FormPrivacy from '@/options/components/FormPrivacy'
import FormAbout from '@/options/components/FormAbout'
import AppConfig from 'AppConfig'
export default {
  name: 'App',
  components: {
    FormGeneral,
    FormDatabase,
    FormCategory,
    FormReplication,
    FormTheme,
    FormSynthesizer,
    FormPrivacy,
    FormAbout
  },
  data() {
    return {
      tabs: OptionsTabs
    };
  },
  computed: {
    ...mapState({
      documents: state => state.database.documents,
    }),
    items: function () {
      return this.tabs.filter((item) => {
        return item.enabled;
      })
    }
  },
  created () {
    const $pouch = this.$pouch;
    
    // If production mode remove development database.
    if (AppConfig.devMode) {
      defaultDatabases.pop();
    }

    // Begin initial database installation.
    this.loadDatabases({ $pouch }).then((results) => {
      if (!results.length) {
        this.bulkDocuments({ $pouch, documents: defaultDatabases }).then(() => {
          this.createIndexes({ $pouch, fields: databaseFields, database: STORAGE_DBNAME_DATABASES }).then((result) => {}).catch((err) => {});
        });
      }
    });
  },
  mounted() {
    M.AutoInit();
    setTimeout(() => {
      M.FormSelect.init(document.querySelectorAll('select'));
      M.Tabs.init(document.querySelector('.tabs'), {});
    }, 1e3);
  },
  methods: {
    ...mapActions({
      loadDatabases: 'database/LOAD_DATABASES',
      bulkDocuments: 'database/BULK_DOCUMENTS',
      createIndexes: 'database/CREATE_INDEXES'
    })
  }
};
</script>

<style lang="scss">
@import "../assets/styles/options.scss";
</style>
