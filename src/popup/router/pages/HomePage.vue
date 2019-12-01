<template>
  <div class="wrapper" data-screen="screen-featured">
    <AppHeader />
    <div class="content">
      <AppFeatured />
      <AppArticle />
      <AppHistory />
      <AppOptions />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import AppHeader from '../../components/AppHeader'
import AppFeatured from '../../components/AppFeatured'
import AppArticle from '../../components/AppArticle'
import AppHistory from '../../components/AppHistory'
import AppOptions from '../../components/AppOptions'
export default {
  components: {
    AppHeader,
    AppFeatured,
    AppArticle,
    AppHistory,
    AppOptions
  },
  mounted() {

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
    ...mapMutations({
      setActivePage: 'page/SET_ACTIVE_PAGE',
    }),
    async getBackgroundPage() {
      try {
        return await this.$browser.extension.getBackgroundPage().backgroundProcess
      } catch (err) {
        return err;
      }
    }
  }
};
</script>
