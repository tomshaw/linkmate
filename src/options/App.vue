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
import { setStorage, getStorage } from '../library/storage'
import OptionsTabs from '../library/static/options'
import FormGeneral from './components/FormGeneral'
import FormDatabase from './components/FormDatabase'
import FormCategory from './components/FormCategory'
import FormReplication from './components/FormReplication'
import FormTheme from './components/FormTheme'
import FormSynthesizer from './components/FormSynthesizer'
import FormPrivacy from './components/FormPrivacy'
import FormAbout from './components/FormAbout'
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
    this.installDatabase({ $pouch });
  },
  mounted() {
    M.AutoInit();
    setTimeout(() => {
      let elems = document.querySelectorAll('select');
      let instances = M.FormSelect.init(elems);
    }, 1e3/2);
    setTimeout(() => {
      let el = document.querySelector('.tabs');
      let instance = M.Tabs.init(el, {});
    }, 1e3);
  },
  methods: {
    ...mapActions({
      installDatabase: 'database/INSTALL_DATABASE'
    })
  }
};
</script>

<style lang="scss">
@import "../assets/styles/options.scss";
</style>
