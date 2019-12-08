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
import AppHeader from '@/popup/components/AppHeader'
import AppFeatured from '@/popup/components/AppFeatured'
import AppArticle from '@/popup/components/AppArticle'
import AppHistory from '@/popup/components/AppHistory'
import AppOptions from '@/popup/components/AppOptions'
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
