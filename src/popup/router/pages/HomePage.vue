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
  }
};
</script>
