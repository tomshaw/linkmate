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
import OptionsTabs from '@/library/static/options'
import FormGeneral from '@/options/components/FormGeneral'
import FormDatabase from '@/options/components/FormDatabase'
import FormCategory from '@/options/components/FormCategory'
import FormReplication from '@/options/components/FormReplication'
import FormTheme from '@/options/components/FormTheme'
import FormSynthesizer from '@/options/components/FormSynthesizer'
import FormPrivacy from '@/options/components/FormPrivacy'
import FormAbout from '@/options/components/FormAbout'
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
    this.installDatabase({ $pouch }).then((docs) => {});
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
